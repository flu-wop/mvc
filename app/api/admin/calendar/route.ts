import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { bad, mapAppointments } from "@/lib/admin-api";
import { getDb, initDb } from "@/lib/db";
import { getBlockedBetween, getHours, getSettings } from "@/lib/availability";
import { getServices } from "@/lib/services";
import { daysBetween, isIsoDate, nowInShop } from "@/lib/time";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Everything the calendar needs for a date range, in one round trip.
export async function GET(req: NextRequest) {
  const denied = await adminGuard();
  if (denied) return denied;

  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");
  if (!isIsoDate(from) || !isIsoDate(to) || daysBetween(from, to) < 0 || daysBetween(from, to) > 62) {
    return bad("Invalid date range");
  }

  await initDb();
  const rows = (
    await getDb().execute({
      sql: `SELECT * FROM bookings WHERE event_date >= ? AND event_date <= ? AND status != 'cancelled'
            ORDER BY event_date, event_time`,
      args: [from, to],
    })
  ).rows;

  const [appointments, blocked, hours, services, settings] = await Promise.all([
    mapAppointments(rows),
    getBlockedBetween(from, to),
    getHours(),
    getServices({ includeInactive: true }),
    getSettings(),
  ]);

  const now = nowInShop();
  return NextResponse.json({ appointments, blocked, hours, services, settings, now });
}
