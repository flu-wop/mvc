import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getDb, initDb } from "@/lib/db";
import { sendBookingEmails, sendDoubleBookingAlert, sendEmailFailureAlert, sendWebhookFailureAlert } from "@/lib/email";
import { findConflicts } from "@/lib/availability";
import { upsertClient } from "@/lib/clients";
import { getService, getServiceByTitle, getAddons, FALLBACK_DURATION_MINUTES } from "@/lib/services";
import { parseTime } from "@/lib/time";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature")!;
  const raw = await req.text(); // RAW body — must read before parsing to verify signature

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature failed: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as any;
    const m = s.metadata || {};
    await initDb();
    const db = getDb();

    if (m.type === "booking") {
      const svc = (await getService(m.service_slug, { includeInactive: true })) ?? (await getServiceByTitle(m.service || ""));
      const duration = Number(m.duration_minutes) || svc?.durationMinutes || FALLBACK_DURATION_MINUTES;
      const padding = m.padding_minutes != null && m.padding_minutes !== "" ? Number(m.padding_minutes) || 0 : svc?.paddingMinutes ?? 0;

      // Snapshot add-ons (name/price/minutes) so later catalog edits don't rewrite history.
      let addonsJson: string | null = null;
      let addonsSummary = "";
      const addonIds = String(m.addon_ids || "").split(",").map(Number).filter((n) => Number.isInteger(n) && n > 0);
      if (addonIds.length) {
        const all = await getAddons({ includeInactive: true });
        const picked = addonIds
          .map((id) => all.find((a) => a.id === id))
          .filter((a): a is NonNullable<typeof a> => !!a)
          .map((a) => ({ id: a.id, name: a.name, priceCents: a.priceCents, durationMinutes: a.durationMinutes }));
        if (picked.length) {
          addonsJson = JSON.stringify(picked);
          addonsSummary = picked.map((a) => a.name).join(", ");
        }
      }
      const travelFee = Number(m.travel_fee_cents) || 0;

      // The slot was open when checkout started, but the client may have paid
      // after someone else took it (or after Margie blocked it). We still hold
      // their money, so record it flagged for review instead of dropping it.
      let status = "paid";
      try {
        const startMin = parseTime(m.event_time);
        if (startMin != null) {
          const conflicts = await findConflicts(m.event_date, startMin, duration, { paddingMin: padding });
          if (conflicts.length > 0) status = "needs_review";
        }
      } catch (err) {
        console.error("[stripe-webhook] conflict check failed, recording as paid:", err);
      }

      let clientId: number | null = null;
      try {
        clientId = await upsertClient({ name: m.name, email: m.email, phone: m.phone });
      } catch (err) {
        console.error("[stripe-webhook] client upsert failed (non-fatal):", err);
      }

      const insert = (st: string) =>
        db.execute({
          sql: `INSERT OR IGNORE INTO bookings
                (name, email, phone, service, service_slug, service_from_cents, event_date, event_time, message,
                 deposit_cents, duration_minutes, padding_minutes, addons_json, travel_tier, travel_fee_cents, travel_address,
                 client_id, source, stripe_session_id, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'online', ?, ?)`,
          args: [
            m.name,
            m.email,
            m.phone,
            m.service,
            svc?.slug ?? m.service_slug ?? null,
            Number(m.service_from_cents),
            m.event_date,
            m.event_time,
            m.message || null,
            Number(m.deposit_cents),
            duration,
            padding,
            addonsJson,
            m.travel_tier || null,
            travelFee || null,
            m.travel_address || null,
            clientId,
            s.id,
            st,
          ],
        });

      let r;
      try {
        r = await insert(status);
        if (r.rowsAffected === 0) {
          // INSERT OR IGNORE also swallows the unique-slot index. Tell a true
          // Stripe retry (row exists) apart from a swallowed same-minute
          // double booking (no row): the latter must still be recorded.
          const exists = (
            await db.execute({ sql: `SELECT 1 FROM bookings WHERE stripe_session_id = ?`, args: [s.id] })
          ).rows.length;
          if (exists) return NextResponse.json({ received: true, duplicate: true });
          status = "needs_review";
          r = await insert(status);
        }
      } catch (err: any) {
        console.error("[stripe-webhook] Booking DB write failed:", err);
        await sendWebhookFailureAlert({ sessionId: s.id, kind: "booking", error: err?.message || String(err) });
        return NextResponse.json({ received: true, error: "DB write failed, will retry" }, { status: 500 });
      }
      if (r.rowsAffected === 0) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      const meta = { ...m, duration_minutes: String(duration), addons_summary: addonsSummary };
      try {
        if (status === "needs_review") {
          await sendDoubleBookingAlert(meta, s.id);
        } else {
          await sendBookingEmails(meta);
        }
      } catch (e) {
        console.error("booking email failed", e); // never fail the webhook on email error
        if (status !== "needs_review") await sendEmailFailureAlert(meta, (e as Error)?.message || String(e));
      }
      return NextResponse.json({ received: true, status });
    }

    // Default: shop order
    let r;
    try {
      r = await db.execute({
        sql: `INSERT OR IGNORE INTO orders (email, items_json, amount_cents, stripe_session_id, status)
              VALUES (?, ?, ?, ?, 'paid')`,
        args: [m.email, m.items_json, Number(m.amount_cents), s.id],
      });
    } catch (err: any) {
      console.error("[stripe-webhook] Order DB write failed:", err);
      await sendWebhookFailureAlert({ sessionId: s.id, kind: "order", error: err?.message || String(err) });
      return NextResponse.json({ received: true, error: "DB write failed, will retry" }, { status: 500 });
    }
    if (r.rowsAffected === 0) {
      return NextResponse.json({ received: true, duplicate: true });
    }
    // TODO: send order confirmation email via Resend once RESEND_API_KEY is set up
    // (pre-existing gap, unrelated to this fix — flagged separately)
  }

  return NextResponse.json({ received: true });
}
