import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { bad, readJson } from "@/lib/admin-api";
import { getDb, initDb } from "@/lib/db";
import { getHours, getSettings } from "@/lib/availability";

export const runtime = "nodejs";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  return NextResponse.json({ hours: await getHours(), settings: await getSettings() });
}

export async function PUT(req: Request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await readJson(req);
  if (!body) return bad("Invalid request body");
  await initDb();
  const stmts: { sql: string; args: any[] }[] = [];

  if (body.hours !== undefined) {
    if (!Array.isArray(body.hours) || body.hours.length !== 7) return bad("Hours need all seven days");
    for (const h of body.hours) {
      const wd = Number(h?.weekday), o = Number(h?.openMin), c = Number(h?.closeMin);
      if (!Number.isInteger(wd) || wd < 0 || wd > 6) return bad("Bad weekday");
      const closed = h.closed ? 1 : 0;
      if (!closed && (!Number.isInteger(o) || !Number.isInteger(c) || o < 0 || c > 1440 || o >= c))
        return bad("Opening time must be before closing time");
      stmts.push({
        sql: `INSERT INTO business_hours (weekday, closed, open_min, close_min) VALUES (?, ?, ?, ?)
              ON CONFLICT(weekday) DO UPDATE SET closed = excluded.closed, open_min = excluded.open_min, close_min = excluded.close_min`,
        args: [wd, closed, closed ? 600 : o, closed ? 1080 : c],
      });
    }
  }

  const s = body.settings;
  if (s !== undefined) {
    const put = (k: string, v: string) =>
      stmts.push({
        sql: `INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        args: [k, v],
      });
    const int = (v: unknown, min: number, max: number) =>
      Number.isInteger(Number(v)) && Number(v) >= min && Number(v) <= max ? String(Number(v)) : null;
    if ("slotMinutes" in s) {
      const v = int(s.slotMinutes, 5, 120);
      if (!v) return bad("Slot spacing must be 5 to 120 minutes");
      put("slot_minutes", v);
    }
    if ("bufferMinutes" in s) {
      const v = int(s.bufferMinutes, 0, 120);
      if (!v) return bad("Buffer must be 0 to 120 minutes");
      put("buffer_minutes", v);
    }
    if ("minNoticeHours" in s) {
      const v = int(s.minNoticeHours, 0, 720);
      if (!v) return bad("Minimum notice looks wrong");
      put("min_notice_hours", v);
    }
    if ("remindersEnabled" in s) put("reminders_enabled", s.remindersEnabled ? "1" : "0");
  }

  if (!stmts.length) return bad("Nothing to save");
  await getDb().batch(stmts, "write");
  return NextResponse.json({ hours: await getHours(), settings: await getSettings() });
}
