import { getDb, initDb, OCCUPYING_STATUSES } from "@/lib/db";
import { buildFeed, toEvent } from "@/lib/ical";
import { safeEq } from "@/lib/admin-auth";
import { addDays, nowInShop } from "@/lib/time";

function addonLine(raw: unknown): string {
  try {
    const v = JSON.parse(String(raw || "[]"));
    return Array.isArray(v) && v.length ? `\n\nAdd-ons: ${v.map((a: any) => a.name).join(", ")}` : "";
  } catch {
    return "";
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Live feed Margie subscribes to in Google/Apple Calendar. It contains client
// names, phones and emails, so once CALENDAR_FEED_TOKEN is set in Vercel the
// URL must carry ?token=<that value>. Until then it stays open so the existing
// subscription keeps working; /admin shows a warning while it's unprotected.
export async function GET(req: Request) {
  const secret = process.env.CALENDAR_FEED_TOKEN;
  if (secret) {
    const given = new URL(req.url).searchParams.get("token") || "";
    if (!safeEq(given, secret)) return new Response("Not found", { status: 404 });
  }

  await initDb();
  const db = getDb();
  const since = addDays(nowInShop().date, -60); // keep the feed small; older history lives in admin
  const placeholders = OCCUPYING_STATUSES.map(() => "?").join(",");
  const rows = (
    await db.execute({
      sql: `SELECT * FROM bookings WHERE status IN (${placeholders}, 'needs_review') AND event_date >= ? ORDER BY event_date, event_time`,
      args: [...OCCUPYING_STATUSES, since],
    })
  ).rows as any[];

  const events = rows
    .map((r) =>
      toEvent(
        { name: r.name, service: r.service, event_date: r.event_date, event_time: r.event_time, duration_minutes: r.duration_minutes, travel_address: r.travel_address },
        {
          uid: `booking-${r.id}@mvc-creations`,
          title: `${r.status === "needs_review" ? "⚠ NEEDS REVIEW · " : ""}${r.service} — ${r.name}`,
          description: `${r.phone || ""} · ${r.email || ""}${addonLine(r.addons_json)}${r.message ? `\n\n${r.message}` : ""}${r.notes ? `\n\nNotes: ${r.notes}` : ""}${
            r.status === "pending" ? "\n\nDeposit not yet received." : ""
          }`,
          status: r.status === "pending" || r.status === "needs_review" ? "TENTATIVE" : "CONFIRMED",
        }
      )
    )
    .filter((e): e is NonNullable<typeof e> => e !== null);

  const value = buildFeed(events);
  if (!value) return new Response("Could not build calendar feed", { status: 500 });

  return new Response(value, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="mvc-bookings.ics"',
      "Cache-Control": "no-store",
    },
  });
}
