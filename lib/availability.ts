import { getDb, initDb } from "./db";

// Monday–Saturday per the site footer ("Monday – Saturday" / "Closed Sunday").
// Placeholder open/close — confirm Margie's exact hours and adjust.
const OPEN_HOUR = 10; // 10:00 AM
const CLOSE_HOUR = 18; // 6:00 PM last slot start considered below
const SLOT_MINUTES = 30;
const CLOSED_WEEKDAY = 0; // Sunday

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${minute.toString().padStart(2, "0")} ${period}`;
}

// All possible slot strings for a business day, independent of bookings.
export function allDaySlots(): string[] {
  const slots: string[] = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      slots.push(formatTime(h, m));
    }
  }
  return slots;
}

export function isClosedDate(isoDate: string): boolean {
  // Parse as local date to avoid UTC off-by-one
  const [y, mo, d] = isoDate.split("-").map(Number);
  const date = new Date(y, mo - 1, d);
  return date.getDay() === CLOSED_WEEKDAY;
}

// Returns open slots for a given ISO date, minus anything already paid-booked.
export async function availableSlots(isoDate: string): Promise<string[]> {
  if (isClosedDate(isoDate)) return [];

  await initDb();
  const db = getDb();
  const rows = (
    await db.execute({
      sql: `SELECT event_time FROM bookings WHERE event_date = ? AND status = 'paid'`,
      args: [isoDate],
    })
  ).rows as any[];

  const taken = new Set(rows.map((r) => r.event_time as string));

  // Don't allow booking a slot in the past for today's date
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;
  const isToday = isoDate === todayIso;

  return allDaySlots().filter((slot) => {
    if (taken.has(slot)) return false;
    if (!isToday) return true;
    return slotIsAfterNow(slot);
  });
}

function slotIsAfterNow(slot: string): boolean {
  const now = new Date();
  const match = slot.match(/(\d+):(\d+) (AM|PM)/);
  if (!match) return true;
  let hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3];
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return hour > now.getHours() || (hour === now.getHours() && minute > now.getMinutes());
}
