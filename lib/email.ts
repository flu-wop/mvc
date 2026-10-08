// Lazy init — never construct the Resend client at module top-level: it crashes
// the Vercel build if RESEND_API_KEY is missing at build time.

import { SITE_URL, BUSINESS } from "./site";
import { formatDateLong } from "./time";

type BookingMeta = {
  name: string;
  email: string;
  phone: string;
  service: string;
  event_date: string;
  event_time: string;
  message?: string;
  deposit_cents: string;
  duration_minutes?: string | number;
  addons_summary?: string;
  travel_address?: string;
  travel_fee_cents?: string | number;
};

// Extra lines (add-ons, mobile address) shown under the service name.
function extras(m: BookingMeta): string {
  const fee = Number(m.travel_fee_cents) || 0;
  return [
    m.addons_summary ? `Add-ons: ${esc(m.addons_summary)}` : "",
    m.travel_address
      ? `Mobile appointment at ${esc(m.travel_address)}${fee ? ` (travel fee $${(fee / 100).toFixed(2)} paid)` : ""}`
      : "",
  ]
    .filter(Boolean)
    .map((l) => `<br/>${l}`)
    .join("");
}

async function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  const { Resend } = await import("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

function from() {
  return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
}

// Client-supplied names and notes are interpolated into HTML below, so every
// value goes through esc() first.
function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function shell(inner: string) {
  return `
  <div style="background:#0B0B0C;padding:32px 16px;font-family:Helvetica,Arial,sans-serif">
    <div style="max-width:520px;margin:0 auto;background:#141415;border:1px solid #2A2A2A;border-radius:16px;padding:32px;color:#F2EDE4">
      <p style="margin:0 0 20px;color:#C9A96E;letter-spacing:.2em;font-size:11px;text-transform:uppercase">${esc(BUSINESS.name)}</p>
      ${inner}
      <p style="margin:28px 0 0;color:#8a8a8a;font-size:12px;line-height:1.6">
        ${esc(BUSINESS.city)} · <a href="${esc(SITE_URL)}" style="color:#C9A96E">${esc(SITE_URL.replace(/^https?:\/\//, ""))}</a>
      </p>
    </div>
  </div>`;
}

function when(date: string, time: string) {
  return `${esc(formatDateLong(date))} at ${esc(time)}`;
}

const POLICY_LINE =
  "Need to change something? Please give 24 hours' notice. Late cancellations are charged 50% and no-shows 100%.";

// Stripe already charged the customer by the time the webhook fires, so a
// failed DB write means real money moved with no record of it. Best-effort: if
// this alert itself fails to send, that's only logged, never re-thrown.
export async function sendWebhookFailureAlert(details: {
  sessionId: string;
  kind: "booking" | "order";
  error: string;
}) {
  try {
    const resend = await getResend();
    const ownerTo = process.env.RESEND_TO_EMAIL;
    if (!resend || !ownerTo) {
      console.error("[webhook-failure-alert] email not configured — cannot alert:", details);
      return;
    }
    await resend.emails.send({
      from: from(),
      to: ownerTo,
      subject: `⚠️ Payment received but ${details.kind} record failed — session ${details.sessionId}`,
      html: `
        <p><strong>Manual reconciliation needed.</strong></p>
        <p>Stripe confirmed payment for session <code>${esc(details.sessionId)}</code>, but the
        database write to record this ${esc(details.kind)} failed.</p>
        <p>The customer was charged. Check the calendar and add the record manually if it's missing.</p>
        <p style="color:#888;font-size:13px">Error: ${esc(details.error)}</p>
      `,
    });
  } catch (err) {
    console.error("[webhook-failure-alert] Failed to send alert:", err);
  }
}

// A client paid for a slot that was taken between checkout and payment.
export async function sendDoubleBookingAlert(m: BookingMeta, sessionId: string) {
  try {
    const resend = await getResend();
    const ownerTo = process.env.RESEND_TO_EMAIL;
    if (!resend || !ownerTo) {
      console.error("[double-booking-alert] email not configured:", m, sessionId);
      return;
    }
    await resend.emails.send({
      from: from(),
      to: ownerTo,
      subject: `⚠️ Double booking needs you — ${m.name}, ${m.event_date} ${m.event_time}`,
      html: shell(`
        <p style="font-size:16px;margin:0 0 12px"><strong>${esc(m.name)}</strong> paid a deposit for a time that was just taken.</p>
        <p style="margin:0 0 12px">${esc(m.service)} · ${when(m.event_date, m.event_time)}${extras(m)}</p>
        <p style="margin:0 0 12px">${esc(m.email)} · ${esc(m.phone)}</p>
        <p style="margin:0;color:#B8BBC0;font-size:14px;line-height:1.6">
          It is on your calendar flagged <strong>needs review</strong>. Reschedule her to an open time, or cancel and refund the deposit in Stripe (session ${esc(sessionId)}).
        </p>`),
    });
  } catch (err) {
    console.error("[double-booking-alert] failed:", err);
  }
}

// The client paid but their confirmation email didn't go out. Margie needs to
// know so she can text them; logging alone would leave it unnoticed.
export async function sendEmailFailureAlert(m: BookingMeta, error: string) {
  try {
    const resend = await getResend();
    const ownerTo = process.env.RESEND_TO_EMAIL;
    if (!resend || !ownerTo) {
      console.error("[email-failure-alert] email not configured:", m.email, error);
      return;
    }
    await resend.emails.send({
      from: from(),
      to: ownerTo,
      subject: `Confirmation email failed — ${m.name}, ${m.event_date} ${m.event_time}`,
      html: shell(`
        <p style="font-size:16px;margin:0 0 12px"><strong>${esc(m.name)}</strong> is booked and paid, but their confirmation email did not send.</p>
        <p style="margin:0 0 12px">${esc(m.service)} · ${when(m.event_date, m.event_time)}${extras(m)}</p>
        <p style="margin:0 0 12px">${esc(m.email)} · ${esc(m.phone)}</p>
        <p style="margin:0;color:#B8BBC0;font-size:14px">The appointment is on your calendar. Please text them the details. Error: ${esc(error)}</p>`),
    });
  } catch (err) {
    console.error("[email-failure-alert] failed:", err);
  }
}

export async function sendBookingEmails(m: BookingMeta, opts: { notifyOwner?: boolean } = {}) {
  const resend = await getResend();
  if (!resend) {
    console.log("RESEND_API_KEY not set — skipping booking confirmation email for", m.email);
    return;
  }

  const ownerTo = process.env.RESEND_TO_EMAIL;
  const deposit = (Number(m.deposit_cents) / 100).toFixed(2);
  const { buildBookingIcs } = await import("./ical");
  const ics = buildBookingIcs(m);

  await resend.emails.send({
    from: from(),
    to: m.email,
    subject: `Appointment Confirmed — ${m.event_date} at ${m.event_time}`,
    html: shell(`
      <p style="font-size:18px;margin:0 0 6px">You're booked, ${esc(m.name.split(" ")[0])}.</p>
      <p style="margin:0 0 20px;color:#B8BBC0">${esc(m.service)}${extras(m)}<br/>${when(m.event_date, m.event_time)}</p>
      <p style="margin:0 0 12px;color:#B8BBC0;font-size:14px;line-height:1.6">
        Your $${esc(deposit)} deposit is paid and applies toward your service total. Please arrive 10 minutes early.
      </p>
      <p style="margin:0;color:#8a8a8a;font-size:13px;line-height:1.6">${esc(POLICY_LINE)}</p>`),
    attachments: ics ? [{ filename: "appointment.ics", content: ics }] : undefined,
  });

  if (ownerTo && opts.notifyOwner !== false) {
    await resend.emails.send({
      from: from(),
      to: ownerTo,
      subject: `New Booking — ${m.name} · ${m.event_date} ${m.event_time}`,
      html: shell(`
        <p style="font-size:16px;margin:0 0 12px"><strong>New paid booking</strong></p>
        <p style="margin:0 0 6px">${esc(m.service)} — ${when(m.event_date, m.event_time)}${extras(m)}</p>
        <p style="margin:0 0 6px">${esc(m.name)} · ${esc(m.email)} · ${esc(m.phone)}</p>
        ${m.message ? `<p style="margin:0 0 6px;color:#B8BBC0">Note: ${esc(m.message)}</p>` : ""}
        <p style="margin:0;color:#B8BBC0">Deposit: $${esc(deposit)}</p>`),
      attachments: ics ? [{ filename: "appointment.ics", content: ics }] : undefined,
    });
  }
}

export async function sendRescheduleEmail(m: BookingMeta, previous: { date: string; time: string }) {
  const resend = await getResend();
  if (!resend || !m.email) return;
  const { buildBookingIcs } = await import("./ical");
  const ics = buildBookingIcs(m);
  await resend.emails.send({
    from: from(),
    to: m.email,
    subject: `Your appointment moved — now ${m.event_date} at ${m.event_time}`,
    html: shell(`
      <p style="font-size:18px;margin:0 0 6px">Your appointment has been rescheduled.</p>
      <p style="margin:0 0 4px;color:#8a8a8a;text-decoration:line-through">${when(previous.date, previous.time)}</p>
      <p style="margin:0 0 20px;color:#B8BBC0">${esc(m.service)}<br/><strong style="color:#F2EDE4">${when(m.event_date, m.event_time)}</strong></p>
      <p style="margin:0;color:#8a8a8a;font-size:13px;line-height:1.6">Your deposit carries over. ${esc(POLICY_LINE)}</p>`),
    attachments: ics ? [{ filename: "appointment.ics", content: ics }] : undefined,
  });
}

export async function sendCancellationEmail(m: BookingMeta) {
  const resend = await getResend();
  if (!resend || !m.email) return;
  await resend.emails.send({
    from: from(),
    to: m.email,
    subject: `Appointment cancelled — ${m.event_date} at ${m.event_time}`,
    html: shell(`
      <p style="font-size:18px;margin:0 0 6px">Your appointment has been cancelled.</p>
      <p style="margin:0 0 20px;color:#B8BBC0">${esc(m.service)}${extras(m)}<br/>${when(m.event_date, m.event_time)}</p>
      <p style="margin:0;color:#B8BBC0;font-size:14px;line-height:1.6">
        If you'd like to rebook, you can pick a new time any time at
        <a href="${esc(SITE_URL)}/book" style="color:#C9A96E">${esc(SITE_URL.replace(/^https?:\/\//, ""))}/book</a>.
      </p>`),
  });
}

export async function sendReminderEmail(m: BookingMeta) {
  const resend = await getResend();
  if (!resend || !m.email) return false;
  const { buildBookingIcs } = await import("./ical");
  const ics = buildBookingIcs(m);
  await resend.emails.send({
    from: from(),
    to: m.email,
    subject: `Reminder — tomorrow at ${m.event_time}`,
    html: shell(`
      <p style="font-size:18px;margin:0 0 6px">See you tomorrow, ${esc(m.name.split(" ")[0])}.</p>
      <p style="margin:0 0 20px;color:#B8BBC0">${esc(m.service)}${extras(m)}<br/>${when(m.event_date, m.event_time)}</p>
      <p style="margin:0 0 12px;color:#B8BBC0;font-size:14px;line-height:1.6">
        Please arrive 10 minutes early with clean nails. Questions or running late? Call or text ${esc(BUSINESS.phone)}.
      </p>
      <p style="margin:0;color:#8a8a8a;font-size:13px;line-height:1.6">${esc(POLICY_LINE)}</p>`),
    attachments: ics ? [{ filename: "appointment.ics", content: ics }] : undefined,
  });
  return true;
}

export async function sendInquiryNotification(i: {
  contactName: string;
  businessName: string;
  email: string;
  phone?: string | null;
  projectTypes: string[];
  details?: string | null;
}) {
  try {
    const resend = await getResend();
    const ownerTo = process.env.RESEND_TO_EMAIL;
    if (!resend || !ownerTo) return;
    await resend.emails.send({
      from: from(),
      to: ownerTo,
      replyTo: i.email,
      subject: `Brand / content inquiry — ${i.businessName || i.contactName}`,
      html: shell(`
        <p style="font-size:16px;margin:0 0 12px"><strong>New inquiry</strong></p>
        <p style="margin:0 0 6px">${esc(i.contactName)}${i.businessName && i.businessName !== i.contactName ? ` · ${esc(i.businessName)}` : ""}</p>
        <p style="margin:0 0 6px">${esc(i.email)}${i.phone ? ` · ${esc(i.phone)}` : ""}</p>
        <p style="margin:0 0 12px;color:#B8BBC0">${esc(i.projectTypes.join(", "))}</p>
        ${i.details ? `<p style="margin:0;color:#B8BBC0;white-space:pre-wrap">${esc(i.details)}</p>` : ""}`),
    });
  } catch (err) {
    console.error("[inquiry-email] failed:", err);
  }
}
