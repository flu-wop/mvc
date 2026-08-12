import { createEvent, type DateArray } from "ics";

type BookingMeta = {
  name: string;
  service: string;
  event_date: string; // yyyy-mm-dd
  event_time: string; // "2:00 PM"
};

function parseDateTime(dateStr: string, timeStr: string): DateArray {
  const [y, mo, d] = dateStr.split("-").map(Number);
  const match = timeStr.match(/(\d+):(\d+) (AM|PM)/);
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

export function buildBookingIcs(m: BookingMeta): string {
  const start = parseDateTime(m.event_date, m.event_time);
  const { error, value } = createEvent({
    start,
    duration: { hours: 1, minutes: 30 },
    title: `MVC Creations — ${m.service}`,
    description: `Appointment for ${m.name}`,
    location: "MVC Creations",
    status: "CONFIRMED",
    organizer: { name: "MVC Creations", email: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev" },
  });
  if (error || !value) {
    console.error("ics build failed", error);
    return "";
  }
  return value;
}
