// Shop-local time helpers. Vercel functions run in UTC, but every appointment
// is a wall-clock time in Margie's timezone, so "today", "now" and "tomorrow"
// must always be computed in SHOP_TZ — never with the server's local clock.

export const SHOP_TZ = "America/Chicago";

export type ShopNow = {
  date: string; // yyyy-mm-dd in SHOP_TZ
  minutes: number; // minutes since local midnight
  weekday: number; // 0 = Sunday
};

export function nowInShop(at: Date = new Date()): ShopNow {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SHOP_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hourCycle: "h23",
  }).formatToParts(at);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const hour = Number(get("hour")) % 24;
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: hour * 60 + Number(get("minute")),
    weekday: weekdays.indexOf(get("weekday")),
  };
}

export function isIsoDate(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s + "T00:00:00Z"));
}

export function weekdayOf(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

export function daysBetween(a: string, b: string): number {
  const [ya, ma, da] = a.split("-").map(Number);
  const [yb, mb, db] = b.split("-").map(Number);
  return Math.round((Date.UTC(yb, mb - 1, db) - Date.UTC(ya, ma - 1, da)) / 86400000);
}

// "2:00 PM" -> 840. Returns null if it doesn't parse.
export function parseTime(s: string | null | undefined): number | null {
  const m = (s || "").trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h < 1 || h > 12 || min > 59) return null;
  const pm = m[3].toUpperCase() === "PM";
  if (pm && h !== 12) h += 12;
  if (!pm && h === 12) h = 0;
  return h * 60 + min;
}

// 840 -> "2:00 PM"
export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// The UTC instant for a shop-local date and minutes-since-midnight, DST-safe.
// Calendar files need a real instant: emitting "2:00 PM" as if it were UTC
// puts the event 5 to 6 hours early for anyone subscribed from Louisiana.
export function shopLocalToUtc(iso: string, minutes: number): Date {
  const [y, m, d] = iso.split("-").map(Number);
  const target = Date.UTC(y, m - 1, d, 0, minutes);
  let guess = target;
  for (let i = 0; i < 3; i++) {
    const w = nowInShop(new Date(guess));
    const [wy, wm, wd] = w.date.split("-").map(Number);
    const wallAsUtc = Date.UTC(wy, wm - 1, wd, 0, w.minutes);
    const diff = target - wallAsUtc;
    if (diff === 0) break;
    guess += diff;
  }
  return new Date(guess);
}
