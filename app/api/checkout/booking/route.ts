import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { getService } from "@/lib/services";
import { availableSlots } from "@/lib/availability";
import { isIsoDate } from "@/lib/time";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ok = await rateLimit(`booking-checkout:${clientIp(req)}`, 10, 600); // 10 per 10 min
  if (!ok) return new NextResponse("Too many requests", { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const { name, email, phone, serviceSlug, eventDate, eventTime, message } = body;

  if (typeof name !== "string" || !name.trim() || name.length > 200) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email) || email.length > 200) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (typeof phone !== "string" || !phone.trim() || phone.length > 40) {
    return NextResponse.json({ error: "A valid phone number is required" }, { status: 400 });
  }
  if (!isIsoDate(eventDate)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  if (typeof eventTime !== "string" || !eventTime.trim()) {
    return NextResponse.json({ error: "Invalid time" }, { status: 400 });
  }
  if (message && (typeof message !== "string" || message.length > 1000)) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  // Price, duration and deposit always come from the services table, never from
  // anything the browser sent.
  const service = await getService(serviceSlug);
  if (!service) {
    return NextResponse.json({ error: "Invalid service" }, { status: 400 });
  }

  // Re-check server-side: the client's earlier availability fetch may be stale,
  // and this also enforces hours, blocked time, duration and minimum notice.
  const { slots, closed } = await availableSlots(eventDate, service.slug);
  if (closed) {
    return NextResponse.json({ error: "We're closed that day. Please pick another date." }, { status: 409 });
  }
  if (!slots.includes(eventTime)) {
    return NextResponse.json(
      { error: "That time was just taken. Please choose another slot." },
      { status: 409 }
    );
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: service.depositCents,
          product_data: {
            name: `Deposit — ${service.title} (${eventDate} ${eventTime})`,
            description: "Non-refundable deposit, applied toward your service total.",
          },
        },
      },
    ],
    success_url: `${SITE_URL}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/book?canceled=1`,
    customer_email: email,
    metadata: {
      type: "booking",
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      service: service.title,
      service_slug: service.slug,
      service_from_cents: String(service.fromCents),
      duration_minutes: String(service.durationMinutes),
      event_date: eventDate,
      event_time: eventTime,
      message: message?.trim() || "",
      deposit_cents: String(service.depositCents),
    },
  });

  return NextResponse.json({ url: session.url });
}
