import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { getService, DEPOSIT_CENTS } from "@/lib/services";
import { availableSlots, isClosedDate } from "@/lib/availability";

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
  if (typeof eventDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  if (typeof eventTime !== "string" || !eventTime.trim()) {
    return NextResponse.json({ error: "Invalid time" }, { status: 400 });
  }
  if (message && (typeof message !== "string" || message.length > 1000)) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const service = getService(serviceSlug);
  if (!service) {
    return NextResponse.json({ error: "Invalid service" }, { status: 400 });
  }

  if (isClosedDate(eventDate)) {
    return NextResponse.json({ error: "We're closed that day. Please pick another date." }, { status: 409 });
  }

  // Re-check the slot is still open server-side — never trust the client's
  // earlier availability fetch, it may be stale by the time they check out.
  const openSlots = await availableSlots(eventDate);
  if (!openSlots.includes(eventTime)) {
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
          unit_amount: DEPOSIT_CENTS,
          product_data: {
            name: `Deposit — ${service.title} (${eventDate} ${eventTime})`,
            description: "Non-refundable deposit, applied toward your service total.",
          },
        },
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/book?canceled=1`,
    customer_email: email,
    metadata: {
      type: "booking",
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      service: service.title,
      service_from_cents: String(service.fromCents),
      event_date: eventDate,
      event_time: eventTime,
      message: message?.trim() || "",
      deposit_cents: String(DEPOSIT_CENTS),
    },
  });

  return NextResponse.json({ url: session.url });
}
