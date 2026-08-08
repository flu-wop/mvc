import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

type CartItem = { name: string; qty: number; unit_amount_cents: number };

export async function POST(req: Request) {
  const ok = await rateLimit(`checkout:${clientIp(req)}`, 10, 600); // 10 per 10 min
  if (!ok) return new NextResponse("Too many requests", { status: 429 });

  const body = await req.json();
  const { email, items } = body as { email: string; items: CartItem[] };

  if (!email || !/^\S+@\S+\.\S+$/.test(email) || !items || !items.length) {
    return NextResponse.json({ error: "Missing or invalid email/items" }, { status: 400 });
  }

  // TODO: once the real product catalog + prices are defined, replace this with
  // server-side price lookup by product ID (see site-security skill, rule #1).
  // Right now unit_amount_cents is client-supplied, which is NOT safe for launch —
  // do not go live with real payment collection until this is locked down.
  const amount_cents = items.reduce((sum, i) => sum + i.unit_amount_cents * i.qty, 0);

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: items.map((i) => ({
      quantity: i.qty,
      price_data: {
        currency: "usd",
        unit_amount: i.unit_amount_cents,
        product_data: { name: i.name },
      },
    })),
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop?canceled=1`,
    customer_email: email,
    metadata: {
      email,
      items_json: JSON.stringify(items),
      amount_cents: String(amount_cents),
    },
  });

  return NextResponse.json({ url: session.url });
}
