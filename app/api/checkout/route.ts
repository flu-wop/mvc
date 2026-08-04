import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

type CartItem = { name: string; qty: number; unit_amount_cents: number };

export async function POST(req: Request) {
  const body = await req.json();
  const { email, items } = body as { email: string; items: CartItem[] };

  if (!email || !items || !items.length) {
    return NextResponse.json({ error: "Missing email or items" }, { status: 400 });
  }

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
