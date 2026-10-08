import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { bad, getAppointment, isUniqueViolation, readJson, str } from "@/lib/admin-api";
import { getDb, initDb } from "@/lib/db";
import { findConflicts } from "@/lib/availability";
import { formatTime, isIsoDate, parseTime } from "@/lib/time";
import { getStripe } from "@/lib/stripe";
import { sendCancellationEmail, sendRescheduleEmail } from "@/lib/email";
import type { Appointment } from "@/lib/admin-types";

export const runtime = "nodejs";

function meta(a: Appointment) {
  return {
    name: a.name,
    email: a.email,
    phone: a.phone,
    service: a.service,
    event_date: a.date,
    event_time: a.time,
    deposit_cents: String(a.depositCents),
    duration_minutes: a.durationMinutes,
  };
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id)) return bad("Bad id");
  const a = await getAppointment(id);
  return a ? NextResponse.json({ appointment: a }) : bad("Not found", 404);
}

// One endpoint, one `action`: reschedule | cancel | mark_paid | complete |
// no_show | restore | update
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id)) return bad("Bad id");
  const body = await readJson(req);
  if (!body) return bad("Invalid request body");

  const current = await getAppointment(id);
  if (!current) return bad("Not found", 404);
  await initDb();
  const db = getDb();

  const setStatus = async (status: string, extraSql = "", extraArgs: any[] = []) => {
    try {
      await db.execute({
        sql: `UPDATE bookings SET status = ?${extraSql} WHERE id = ?`,
        args: [status, ...extraArgs, id],
      });
    } catch (err) {
      if (isUniqueViolation(err)) throw new Error("SLOT_TAKEN");
      throw err;
    }
  };

  try {
    switch (body.action) {
      case "reschedule": {
        if (!isIsoDate(body.date)) return bad("Choose a date");
        const startMin = typeof body.time === "string" ? parseTime(body.time) : null;
        if (startMin == null) return bad("Choose a time");
        const duration = Number(body.durationMinutes) || current.durationMinutes;
        if (!Number.isInteger(duration) || duration < 5 || duration > 720) return bad("Duration looks wrong");
        if (!body.force) {
          const conflicts = await findConflicts(body.date, startMin, duration, { excludeBookingId: id });
          if (conflicts.length) return bad("That time has conflicts", 409, { conflicts });
        }
        const time = formatTime(startMin);
        const wasReview = current.status === "needs_review";
        await db.execute({
          sql: `UPDATE bookings SET event_date = ?, event_time = ?, duration_minutes = ?, reminder_sent_at = NULL,
                status = CASE WHEN status = 'needs_review' THEN 'paid' ELSE status END WHERE id = ?`,
          args: [body.date, time, duration, id],
        });
        const next = (await getAppointment(id))!;
        if (body.sendEmail && next.email) {
          try {
            await sendRescheduleEmail(meta(next), { date: current.date, time: current.time });
          } catch (e) {
            console.error("reschedule email failed", e);
          }
        }
        return NextResponse.json({ appointment: next, resolvedReview: wasReview });
      }

      case "cancel": {
        if (current.status === "cancelled") return NextResponse.json({ appointment: current });
        await setStatus("cancelled", ", cancelled_at = ?", [new Date().toISOString()]);
        const next = (await getAppointment(id))!;
        if (body.sendEmail && next.email) {
          try {
            await sendCancellationEmail(meta(next));
          } catch (e) {
            console.error("cancellation email failed", e);
          }
        }
        return NextResponse.json({ appointment: next });
      }

      case "mark_paid": {
        if (current.status !== "pending") return bad("Only pending appointments can be marked paid");
        await setStatus("paid");
        return NextResponse.json({ appointment: await getAppointment(id) });
      }

      case "complete": {
        if (!["paid", "pending", "needs_review"].includes(current.status)) return bad("Can't complete from here");
        await setStatus("completed");
        return NextResponse.json({ appointment: await getAppointment(id) });
      }

      case "no_show": {
        if (!["paid", "pending", "needs_review"].includes(current.status)) return bad("Can't mark no-show from here");
        await setStatus("no_show");
        return NextResponse.json({ appointment: await getAppointment(id) });
      }

      case "restore": {
        if (!["cancelled", "no_show", "completed"].includes(current.status)) return bad("Nothing to restore");
        if (current.status === "cancelled" && !body.force) {
          const sm = parseTime(current.time) ?? 0;
          const conflicts = await findConflicts(current.date, sm, current.durationMinutes, { excludeBookingId: id });
          if (conflicts.length) return bad("That time is no longer free", 409, { conflicts });
        }
        // A deposit that was never collected goes back to pending, not paid.
        const back = current.depositCents > 0 && current.source === "manual" && !current.depositPaid ? "pending" : "paid";
        await setStatus(back, ", cancelled_at = NULL");
        return NextResponse.json({ appointment: await getAppointment(id) });
      }

      case "refund": {
        // Refunds the Stripe deposit in full. Whether she is owed one is Margie's call
        // (the policy keeps deposits on late cancels), so this never happens automatically.
        if (current.refundedAt) return bad("Already refunded");
        const row = (await db.execute({ sql: `SELECT stripe_session_id FROM bookings WHERE id = ?`, args: [id] })).rows[0] as any;
        if (!row?.stripe_session_id) return bad("This deposit wasn't paid through Stripe, so there's nothing to refund here.");
        try {
          const stripe = getStripe();
          const session = await stripe.checkout.sessions.retrieve(String(row.stripe_session_id));
          const pi = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
          if (!pi) return bad("Stripe has no payment on file for this booking.", 409);
          await stripe.refunds.create({ payment_intent: pi, metadata: { booking_id: String(id) } }, { idempotencyKey: `refund-booking-${id}` });
        } catch (err) {
          console.error("[admin refund] failed", err);
          return bad(`Stripe couldn't refund this: ${(err as Error).message}`, 502);
        }
        await db.execute({ sql: `UPDATE bookings SET refunded_at = ? WHERE id = ?`, args: [new Date().toISOString(), id] });
        return NextResponse.json({ appointment: await getAppointment(id) });
      }

      case "update": {
        const sets: string[] = [];
        const args: any[] = [];
        if ("notes" in body) {
          const n = str(body.notes ?? "", 2000);
          if (n === null) return bad("Notes are too long");
          sets.push("notes = ?");
          args.push(n || null);
        }
        if ("totalCents" in body) {
          if (body.totalCents === null || body.totalCents === "") {
            sets.push("total_cents = NULL");
          } else {
            const t = Number(body.totalCents);
            if (!Number.isInteger(t) || t < 0 || t > 10_000_00) return bad("Total looks wrong");
            sets.push("total_cents = ?");
            args.push(t);
          }
        }
        if (!sets.length) return bad("Nothing to update");
        await db.execute({ sql: `UPDATE bookings SET ${sets.join(", ")} WHERE id = ?`, args: [...args, id] });
        return NextResponse.json({ appointment: await getAppointment(id) });
      }

      default:
        return bad("Unknown action");
    }
  } catch (err) {
    if ((err as Error).message === "SLOT_TAKEN" || isUniqueViolation(err)) {
      return bad("Another paid appointment already starts at exactly that time.", 409);
    }
    console.error("[admin appointment patch]", err);
    return bad("Something went wrong", 500);
  }
}

