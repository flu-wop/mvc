import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { bad, getAppointment, isUniqueViolation, readJson, str } from "@/lib/admin-api";
import { getDb, initDb } from "@/lib/db";
import { findConflicts } from "@/lib/availability";
import { upsertClient } from "@/lib/clients";
import { getService } from "@/lib/services";
import { formatTime, isIsoDate, parseTime } from "@/lib/time";
import { sendBookingEmails } from "@/lib/email";

export const runtime = "nodejs";

// Margie adds an appointment by hand (walk-in, DM, phone call).
export async function POST(req: Request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await readJson(req);
  if (!body) return bad("Invalid request body");

  const service = await getService(body.serviceSlug, { includeInactive: true });
  if (!service) return bad("Choose a service");
  if (!isIsoDate(body.date)) return bad("Choose a date");
  const startMin = typeof body.time === "string" ? parseTime(body.time) : null;
  if (startMin == null) return bad("Choose a time");
  const duration = Number(body.durationMinutes) || service.durationMinutes;
  if (!Number.isInteger(duration) || duration < 5 || duration > 720) return bad("Duration looks wrong");

  const name = str(body.name, 200);
  if (!name) return bad("Client name is required");
  const email = str(body.email ?? "", 200) ?? "";
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return bad("That email doesn't look right");
  const phone = str(body.phone ?? "", 40) ?? "";
  const notes = str(body.notes ?? "", 2000);

  if (!body.force) {
    const conflicts = await findConflicts(body.date, startMin, duration);
    if (conflicts.length) return bad("That time has conflicts", 409, { conflicts });
  }

  await initDb();
  const db = getDb();
  const time = formatTime(startMin);
  const paid = body.depositPaid === true;

  let clientId: number;
  if (Number.isInteger(body.clientId)) {
    const found = (await db.execute({ sql: `SELECT id FROM clients WHERE id = ?`, args: [body.clientId] })).rows[0];
    if (!found) return bad("Client not found", 404);
    clientId = Number(found.id);
  } else {
    clientId = await upsertClient({ name, email, phone });
  }

  let id: number;
  try {
    const r = await db.execute({
      sql: `INSERT INTO bookings
            (name, email, phone, service, service_slug, service_from_cents, event_date, event_time, message,
             deposit_cents, duration_minutes, client_id, notes, source, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, 'manual', ?) RETURNING id`,
      args: [name, email, phone, service.title, service.slug, service.fromCents, body.date, time,
             service.depositCents, duration, clientId, notes, paid ? "paid" : "pending"],
    });
    id = Number(r.rows[0].id);
  } catch (err) {
    if (isUniqueViolation(err)) return bad("Another paid appointment already starts at exactly that time.", 409);
    throw err;
  }

  if (body.sendEmail && email) {
    try {
      await sendBookingEmails(
        { name, email, phone, service: service.title, event_date: body.date, event_time: time,
          deposit_cents: String(service.depositCents), duration_minutes: duration },
        { notifyOwner: false }
      );
    } catch (e) {
      console.error("manual booking email failed", e);
    }
  }

  return NextResponse.json({ appointment: await getAppointment(id) }, { status: 201 });
}
