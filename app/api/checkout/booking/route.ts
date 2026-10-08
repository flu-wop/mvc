import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { calcBooking, isCalcError } from "@/lib/booking-calc";
import { availableSlots } from "@/lib/availability";
import { isIsoDate } from "@/lib/time";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ok = await rateLimit(`booking-checkout:${clientIp(req)}`, 10, 600); // 10 per 10 min
  if (!ok) return new NextResponse("Too many requests", { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });

  const { name, email, phone, serviceSlug, eventDate, eventTime, message, addonIds, travel } = body;

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

  // Price, duration, padding, add-ons and travel fee always come from the database,
  // never from anything the browser sent.
  const mobile = travel && typeof travel === "object" && travel.tier;
  const calc = await calcBooking({ serviceSlug, addonIds, travelTier: mobile ? travel.tier : null });
  if (isCalcError(calc)) return NextResponse.json({ error: calc.error }, { status: 400 });
  const { service, addons, timing } = calc;

  let travelAddress = "";
  if (mobile) {
    travelAddress = typeof travel.address === "string" ? travel.address.trim() : "";
    if (travelAddress.length < 8 || travelAddress.length > 300) {
      return NextResponse.json({ error: "Please enter the full address where Margie should travel." }, { status: 400 });
    }
  }

  // Re-check server-side: the client's earlier availability fetch may be stale,
  // and this also enforces hours, blocked time, duration, padding and minimum notice.
  const { slots, closed } = await availableSlots(eventDate, timing);
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
      ...(calc.travel
        ? [
            {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: calc.travel.feeCents,
                product_data: {
                  name: `Mobile travel fee (${calc.travel.label})`,
                  description: "Charged now and non-refundable. Separate from your service total.",
                },
              },
            },
          ]
        : []),
    ],
    success_url: `${SITE_URL}/book/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/book?canceled=1`,
    customer_email: email,
    // A deposit can only be paid within 30 minutes of starting checkout, so a
    // stale tab can't pay for a slot that has long since been given away.
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    payment_intent_data: {
      description: `${service.title} deposit — ${eventDate} ${eventTime} — ${name.trim()}`,
      metadata: { type: "booking", service_slug: service.slug, event_date: eventDate, event_time: eventTime },
    },
    metadata: {
      type: "booking",
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      service: service.title,
      service_slug: service.slug,
      service_from_cents: String(service.fromCents),
      duration_minutes: String(timing.duration),
      padding_minutes: String(timing.padding),
      addon_ids: addons.map((a) => a.id).join(","),
      travel_tier: calc.travel?.tier ?? "",
      travel_fee_cents: String(calc.travel?.feeCents ?? 0),
      travel_address: travelAddress,
      addons_from_cents: String(addons.reduce((n, a) => n + a.priceCents, 0)),
      event_date: eventDate,
      event_time: eventTime,
      message: message?.trim() || "",
      deposit_cents: String(service.depositCents),
    },
  });

  return NextResponse.json({ url: session.url });
}
