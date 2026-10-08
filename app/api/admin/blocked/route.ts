import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { bad, readJson, str } from "@/lib/admin-api";
import { getDb, initDb, OCCUPYING_STATUSES } from "@/lib/db";
import { isIsoDate, nowInShop } from "@/lib/time";

export const runtime = "nodejs";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  await initDb();
  const rows = (
    await getDb().execute({
      sql: `SELECT * FROM blocked_time WHERE end_date >= ? ORDER BY start_date`,
      args: [nowInShop().date],
    })
  ).rows as any[];
  return NextResponse.json({
    blocked: rows.map((r) => ({
      id: Number(r.id),
      startDate: String(r.start_date),
      endDate: String(r.end_date),
      startMin: r.start_min == null ? null : Number(r.start_min),
      endMin: r.end_min == null ? null : Number(r.end_min),
      reason: r.reason == null ? null : String(r.reason),
    })),
  });
}

export async function POST(req: Request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await readJson(req);
  if (!body) return bad("Invalid request body");
  if (!isIsoDate(body.startDate)) return bad("Choose a start date");
  const endDate = body.endDate ? body.endDate : body.startDate;
  if (!isIsoDate(endDate) || endDate < body.startDate) return bad("End date can't be before the start");
  let startMin: number | null = null;
  let endMin: number | null = null;
  if (!body.allDay) {
    startMin = Number(body.startMin);
    endMin = Number(body.endMin);
    if (!Number.isInteger(startMin) || !Number.isInteger(endMin) || startMin < 0 || endMin > 1440 || startMin >= endMin)
      return bad("Start time must be before end time");
  }
  const reason = str(body.reason ?? "", 200);
  if (reason === null) return bad("Reason is too long");
  await initDb();
  const db = getDb();
  const r = await db.execute({
    sql: `INSERT INTO blocked_time (start_date, end_date, start_min, end_min, reason) VALUES (?, ?, ?, ?, ?) RETURNING id`,
    args: [body.startDate, endDate, startMin, endMin, reason || null],
  });

  // Don't cancel anyone automatically; tell Margie who is now affected.
  const ph = OCCUPYING_STATUSES.map(() => "?").join(",");
  const hit = (
    await db.execute({
      sql: `SELECT id, name, event_date, event_time FROM bookings WHERE event_date BETWEEN ? AND ? AND status IN (${ph}) ORDER BY event_date`,
      args: [body.startDate, endDate, ...OCCUPYING_STATUSES],
    })
  ).rows as any[];
  const { parseTime } = await import("@/lib/time");
  const affected = hit
    .filter((b) => {
      if (startMin == null) return true;
      const s = parseTime(String(b.event_time));
      return s != null && s < endMin! && startMin < s + 60;
    })
    .map((b) => ({ id: Number(b.id), name: String(b.name), date: String(b.event_date), time: String(b.event_time) }));
  return NextResponse.json({ id: Number(r.rows[0].id), affected }, { status: 201 });
}
