import { getDb, initDb } from "@/lib/db";
import { createEvents, type DateArray } from "ics";

export const runtime = "nodejs";

function parseDateTime(dateStr: string, timeStr: string): DateArray {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const match = (timeStr || "").match(/(\d+):(\d+) (AM|PM)/);
  let hour = 10;
  let minute = 0;
  if (match) {
    hour = parseInt(match[1], 10);
    minute = parseInt(match[2], 10);
    if (match[3] === "PM" && hour !== 12) hour += 12;
    if (match[3] === "AM" && hour === 12) hour = 0;
  }
  return [y, mo, d, hour, minute];
}

export async function GET() {
  await initDb();
  const db = getDb();
  const rows = (await db.execute("SELECT * FROM bookings WHERE status = 'paid' ORDER BY event_date")).rows as any[];

  const { error, value } = createEvents(
    rows.map((r) => ({
      start: parseDateTime(r.event_date, r.event_time),
      duration: { hours: 1, minutes: 30 },
      title: `${r.service} — ${r.name}`,
      description: `${r.phone} · ${r.email}${r.message ? `\n\n${r.message}` : ""}`,
      location: "MVC Creations",
      status: "CONFIRMED" as const,
    }))
  );

  if (error || !value) {
    console.error("calendar feed build failed", error);
    return new Response("Could not build calendar feed", { status: 500 });
  }

  return new Response(value, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="mvc-bookings.ics"',
    },
  });
}
