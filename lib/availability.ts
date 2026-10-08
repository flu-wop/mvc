import { getDb, initDb, OCCUPYING_STATUSES } from "./db";
import { FALLBACK_DURATION_MINUTES } from "./service-defaults";
import { getService } from "./services";
import { addDays, daysBetween, formatTime, nowInShop, parseTime, weekdayOf, type ShopNow } from "./time";

// Availability is computed from three things Margie controls in admin:
// weekly business hours, blocked time, and the appointments already on the
// calendar (each with its own duration). All times are shop-local.

export type Settings = {
  slotMinutes: number;
  bufferMinutes: number;
  minNoticeHours: number;
  remindersEnabled: boolean;
};

export type DayHours = { weekday: number; closed: boolean; openMin: number; closeMin: number };

export type Blocked = {
  id: number;
  startDate: string;
  endDate: string;
  startMin: number | null;
  endMin: number | null;
  reason: string | null;
};

export type Interval = { id: number; startMin: number; endMin: number; name: string; service: string; status: string };

export type Conflict = {
  kind: "closed" | "outside_hours" | "blocked" | "booking" | "past";
  message: string;
};

const DEFAULT_SETTINGS: Settings = { slotMinutes: 30, bufferMinutes: 0, minNoticeHours: 2, remindersEnabled: true };

export async function getSettings(): Promise<Settings> {
  await initDb();
  const rows = (await getDb().execute(`SELECT key, value FROM settings`)).rows as any[];
  const m = new Map(rows.map((r) => [String(r.key), String(r.value)]));
  const num = (k: string, d: number) => {
    const v = Number(m.get(k));
    return Number.isFinite(v) && m.has(k) ? v : d;
  };
  return {
    slotMinutes: Math.max(5, num("slot_minutes", DEFAULT_SETTINGS.slotMinutes)),
    bufferMinutes: Math.max(0, num("buffer_minutes", DEFAULT_SETTINGS.bufferMinutes)),
    minNoticeHours: Math.max(0, num("min_notice_hours", DEFAULT_SETTINGS.minNoticeHours)),
    remindersEnabled: m.get("reminders_enabled") !== "0",
  };
}

export async function getHours(): Promise<DayHours[]> {
  await initDb();
  const rows = (await getDb().execute(`SELECT * FROM business_hours ORDER BY weekday`)).rows as any[];
  return rows.map((r) => ({
    weekday: Number(r.weekday),
    closed: Number(r.closed) === 1,
    openMin: Number(r.open_min),
    closeMin: Number(r.close_min),
  }));
}

function rowToBlocked(r: any): Blocked {
  return {
    id: Number(r.id),
    startDate: String(r.start_date),
    endDate: String(r.end_date),
    startMin: r.start_min == null ? null : Number(r.start_min),
    endMin: r.end_min == null ? null : Number(r.end_min),
    reason: r.reason == null ? null : String(r.reason),
  };
}

export async function getBlockedBetween(from: string, to: string): Promise<Blocked[]> {
  await initDb();
  const rows = (
    await getDb().execute({
      sql: `SELECT * FROM blocked_time WHERE start_date <= ? AND end_date >= ? ORDER BY start_date`,
      args: [to, from],
    })
  ).rows;
  return rows.map(rowToBlocked);
}

export async function bookedOnDate(isoDate: string, excludeId?: number): Promise<Interval[]> {
  await initDb();
  const placeholders = OCCUPYING_STATUSES.map(() => "?").join(",");
  const rows = (
    await getDb().execute({
      sql: `SELECT id, name, service, status, event_time, duration_minutes
            FROM bookings
            WHERE event_date = ? AND status IN (${placeholders}) ${excludeId ? "AND id != ?" : ""}`,
      args: excludeId ? [isoDate, ...OCCUPYING_STATUSES, excludeId] : [isoDate, ...OCCUPYING_STATUSES],
    })
  ).rows as any[];
  const out: Interval[] = [];
  for (const r of rows) {
    const start = parseTime(String(r.event_time));
    if (start == null) continue;
    const dur = Number(r.duration_minutes) || FALLBACK_DURATION_MINUTES;
    out.push({
      id: Number(r.id),
      startMin: start,
      endMin: start + dur,
      name: String(r.name),
      service: String(r.service),
      status: String(r.status),
    });
  }
  return out;
}

export type DayStatus = { closed: boolean; reason?: "hours" | "blocked"; hours: DayHours | null };

// A day is closed if the weekly hours say so, or an all-day block covers it.
export async function getDayStatus(isoDate: string): Promise<DayStatus> {
  const [hours, blocked] = await Promise.all([getHours(), getBlockedBetween(isoDate, isoDate)]);
  const h = hours.find((x) => x.weekday === weekdayOf(isoDate)) ?? null;
  if (!h || h.closed) return { closed: true, reason: "hours", hours: h };
  if (blocked.some((b) => b.startMin == null)) return { closed: true, reason: "blocked", hours: h };
  return { closed: false, hours: h };
}

// Everything that would stop an appointment of `durationMin` starting at
// `startMin` on `isoDate`. Empty array = free. Public booking treats any
// conflict as unavailable; admin shows them and lets Margie book anyway.
export async function findConflicts(
  isoDate: string,
  startMin: number,
  durationMin: number,
  opts: { excludeBookingId?: number } = {}
): Promise<Conflict[]> {
  const conflicts: Conflict[] = [];
  const settings = await getSettings();
  const endMin = startMin + durationMin;
  const [hours, blocked, booked] = await Promise.all([
    getHours(),
    getBlockedBetween(isoDate, isoDate),
    bookedOnDate(isoDate, opts.excludeBookingId),
  ]);
  const h = hours.find((x) => x.weekday === weekdayOf(isoDate));

  if (!h || h.closed) {
    conflicts.push({ kind: "closed", message: "That day is marked closed in your weekly hours." });
  } else if (startMin < h.openMin || endMin > h.closeMin) {
    conflicts.push({
      kind: "outside_hours",
      message: `Outside your hours (${formatTime(h.openMin)} to ${formatTime(h.closeMin)}).`,
    });
  }

  for (const b of blocked) {
    const bs = b.startMin ?? 0;
    const be = b.endMin ?? 24 * 60;
    if (startMin < be && bs < endMin) {
      conflicts.push({ kind: "blocked", message: `Blocked time${b.reason ? `: ${b.reason}` : ""}.` });
    }
  }

  const pad = settings.bufferMinutes;
  for (const x of booked) {
    if (startMin < x.endMin + pad && x.startMin < endMin + pad) {
      conflicts.push({
        kind: "booking",
        message: `Overlaps ${x.name} (${x.service}) at ${formatTime(x.startMin)}.`,
      });
    }
  }
  return conflicts;
}

// How far ahead clients can book.
export const MAX_ADVANCE_DAYS = 90;

type DayInputs = { hours: DayHours[]; settings: Settings; blocked: Blocked[]; booked: Interval[]; now: ShopNow };

// One place that decides which start times exist for a day, so the day view,
// the month calendar and checkout can never disagree.
function computeSlots(
  iso: string,
  duration: number,
  d: DayInputs
): { slots: string[]; closed: boolean; reason?: "hours" | "blocked" } {
  const h = d.hours.find((x) => x.weekday === weekdayOf(iso));
  if (!h || h.closed) return { slots: [], closed: true, reason: "hours" };
  const dayBlocked = d.blocked.filter((b) => b.startDate <= iso && b.endDate >= iso);
  if (dayBlocked.some((b) => b.startMin == null)) return { slots: [], closed: true, reason: "blocked" };
  if (iso < d.now.date || daysBetween(d.now.date, iso) > MAX_ADVANCE_DAYS) return { slots: [], closed: false };

  const pad = d.settings.bufferMinutes;
  const earliest = iso === d.now.date ? d.now.minutes + d.settings.minNoticeHours * 60 : 0;
  const dayBooked = d.booked;
  const slots: string[] = [];
  for (let start = h.openMin; start + duration <= h.closeMin; start += d.settings.slotMinutes) {
    if (start < earliest) continue;
    const end = start + duration;
    if (dayBlocked.some((b) => start < (b.endMin ?? 24 * 60) && (b.startMin ?? 0) < end)) continue;
    if (dayBooked.some((x) => start < x.endMin + pad && x.startMin < end + pad)) continue;
    slots.push(formatTime(start));
  }
  return { slots, closed: false };
}

async function durationFor(service: string | number): Promise<number> {
  if (typeof service === "number") return service;
  const svc = await getService(service);
  return svc?.durationMinutes ?? FALLBACK_DURATION_MINUTES;
}

// Start times a client can pick for a given service on a given date.
export async function availableSlots(
  isoDate: string,
  service: string | number
): Promise<{ slots: string[]; closed: boolean; reason?: "hours" | "blocked" }> {
  const duration = await durationFor(service);
  const [hours, settings, blocked, booked] = await Promise.all([
    getHours(),
    getSettings(),
    getBlockedBetween(isoDate, isoDate),
    bookedOnDate(isoDate),
  ]);
  return computeSlots(isoDate, duration, { hours, settings, blocked, booked, now: nowInShop() });
}

async function bookedBetween(from: string, to: string): Promise<Map<string, Interval[]>> {
  await initDb();
  const ph = OCCUPYING_STATUSES.map(() => "?").join(",");
  const rows = (
    await getDb().execute({
      sql: `SELECT id, name, service, status, event_date, event_time, duration_minutes
            FROM bookings WHERE event_date BETWEEN ? AND ? AND status IN (${ph})`,
      args: [from, to, ...OCCUPYING_STATUSES],
    })
  ).rows as any[];
  const out = new Map<string, Interval[]>();
  for (const r of rows) {
    const start = parseTime(String(r.event_time));
    if (start == null) continue;
    const list = out.get(String(r.event_date)) ?? [];
    list.push({
      id: Number(r.id),
      startMin: start,
      endMin: start + (Number(r.duration_minutes) || FALLBACK_DURATION_MINUTES),
      name: String(r.name),
      service: String(r.service),
      status: String(r.status),
    });
    out.set(String(r.event_date), list);
  }
  return out;
}

// Number of open start times per day for a whole month ("2026-10"), in four
// queries total. 0 means closed, blocked, past or fully booked.
export async function monthAvailability(month: string, service: string | number): Promise<Record<string, number>> {
  const [y, m] = month.split("-").map(Number);
  const first = `${month}-01`;
  const last = addDays(first, new Date(Date.UTC(y, m, 0)).getUTCDate() - 1);
  const duration = await durationFor(service);
  const [hours, settings, blocked, booked] = await Promise.all([
    getHours(),
    getSettings(),
    getBlockedBetween(first, last),
    bookedBetween(first, last),
  ]);
  const now = nowInShop();
  const out: Record<string, number> = {};
  for (let iso = first; iso <= last; iso = addDays(iso, 1)) {
    out[iso] = computeSlots(iso, duration, { hours, settings, blocked, booked: booked.get(iso) ?? [], now }).slots.length;
  }
  return out;
}
