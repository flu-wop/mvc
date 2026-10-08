import { createEvent, createEvents, type EventAttributes } from "ics";
import { FALLBACK_DURATION_MINUTES } from "./service-defaults";
import { SITE_URL } from "./site";
import { parseTime, shopLocalToUtc } from "./time";

type BookingMeta = {
  name: string;
  service: string;
  event_date: string; // yyyy-mm-dd, shop-local
  event_time: string; // "2:00 PM", shop-local
  duration_minutes?: string | number | null;
};

// Real UTC instants so the event lands at the right wall-clock time in every
// calendar app, whatever timezone the server runs in.
export function toEvent(
  m: BookingMeta,
  extra: Partial<EventAttributes> = {}
): EventAttributes | null {
  const startMin = parseTime(m.event_time);
  if (startMin == null) return null;
  const start = shopLocalToUtc(m.event_date, startMin);
  const duration = Number(m.duration_minutes) || FALLBACK_DURATION_MINUTES;
  return {
    start: [
      start.getUTCFullYear(),
      start.getUTCMonth() + 1,
      start.getUTCDate(),
      start.getUTCHours(),
      start.getUTCMinutes(),
    ],
    startInputType: "utc",
    startOutputType: "utc",
    duration: { hours: Math.floor(duration / 60), minutes: duration % 60 },
    title: `MVC Creations — ${m.service}`,
    description: `Appointment for ${m.name}`,
    location: "MVC Creations",
    status: "CONFIRMED",
    url: SITE_URL,
    ...extra,
  } as EventAttributes;
}

export function buildBookingIcs(m: BookingMeta): string {
  const ev = toEvent(m, {
    organizer: { name: "MVC Creations", email: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev" },
  });
  if (!ev) return "";
  const { error, value } = createEvent(ev);
  if (error || !value) {
    console.error("ics build failed", error);
    return "";
  }
  return value;
}

export function buildFeed(events: EventAttributes[]): string | null {
  if (events.length === 0) {
    // createEvents errors on an empty list; return a valid empty calendar.
    return "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//MVC Creations//Bookings//EN\r\nEND:VCALENDAR\r\n";
  }
  const { error, value } = createEvents(events);
  if (error || !value) {
    console.error("calendar feed build failed", error);
    return null;
  }
  return value;
}
