import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { getSettings } from "@/lib/availability";
import { sendReminderEmail } from "@/lib/email";
import { safeEq } from "@/lib/admin-auth";
import { addDays, nowInShop } from "@/lib/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Vercel Cron calls this once a day with `Authorization: Bearer $CRON_SECRET`.
// It emails tomorrow's (shop-local) paid appointments once each.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") || "";
  if (!secret || !safeEq(auth, `Bearer ${secret}`)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSettings();
  if (!settings.remindersEnabled) return NextResponse.json({ skipped: "reminders off" });

  await initDb();
  const db = getDb();
  const tomorrow = addDays(nowInShop().date, 1);
  const rows = (
    await db.execute({
      sql: `SELECT * FROM bookings WHERE event_date = ? AND status = 'paid' AND reminder_sent_at IS NULL AND email != ''`,
      args: [tomorrow],
    })
  ).rows as any[];

  let sent = 0;
  let failed = 0;
  for (const r of rows) {
    try {
      const ok = await sendReminderEmail({
        name: String(r.name),
        email: String(r.email),
        phone: String(r.phone ?? ""),
        service: String(r.service),
        event_date: String(r.event_date),
        event_time: String(r.event_time),
        deposit_cents: String(r.deposit_cents),
        duration_minutes: r.duration_minutes ?? undefined,
        travel_address: r.travel_address ? String(r.travel_address) : undefined,
      });
      if (ok) {
        await db.execute({ sql: `UPDATE bookings SET reminder_sent_at = ? WHERE id = ?`, args: [new Date().toISOString(), r.id] });
        sent++;
      }
    } catch (err) {
      failed++;
      console.error("[reminders] failed for booking", r.id, err);
    }
  }
  return NextResponse.json({ date: tomorrow, due: rows.length, sent, failed });
}
