// Lazy init — never construct the Resend client at module top-level (see
// booking-system skill: crashes the Vercel build if RESEND_API_KEY is
// missing at build time).

type BookingMeta = {
  name: string;
  email: string;
  phone: string;
  service: string;
  event_date: string;
  event_time: string;
  message?: string;
  deposit_cents: string;
};

async function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  const { Resend } = await import("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendBookingEmails(m: BookingMeta) {
  const resend = await getResend();
  if (!resend) {
    console.log("RESEND_API_KEY not set — skipping booking confirmation email for", m.email);
    return;
  }

  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const ownerTo = process.env.RESEND_TO_EMAIL;
  const deposit = (Number(m.deposit_cents) / 100).toFixed(2);

  const { buildBookingIcs } = await import("./ical");
  const ics = buildBookingIcs(m);

  const clientHtml = `
    <p>Hi ${m.name},</p>
    <p>Your appointment is confirmed:</p>
    <p><strong>${m.service}</strong><br/>${m.event_date} at ${m.event_time}</p>
    <p>Deposit paid: $${deposit} (applied toward your service total).</p>
    <p>See you soon!<br/>MVC Creations</p>
  `;

  await resend.emails.send({
    from,
    to: m.email,
    subject: `Appointment Confirmed — ${m.event_date} at ${m.event_time}`,
    html: clientHtml,
    attachments: [{ filename: "appointment.ics", content: ics }],
  });

  if (ownerTo) {
    await resend.emails.send({
      from,
      to: ownerTo,
      subject: `New Booking — ${m.name} · ${m.event_date} ${m.event_time}`,
      html: `
        <p>New paid booking:</p>
        <p><strong>${m.service}</strong> — ${m.event_date} at ${m.event_time}</p>
        <p>${m.name} · ${m.email} · ${m.phone}</p>
        ${m.message ? `<p>Note: ${m.message}</p>` : ""}
        <p>Deposit: $${deposit}</p>
      `,
      attachments: [{ filename: "appointment.ics", content: ics }],
    });
  }
}
