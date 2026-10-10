import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { SHOP_ENABLED } from "@/lib/features";
import { SHOP_CATALOG, MAX_QTY_PER_ITEM, MAX_LINE_ITEMS } from "@/lib/shop-catalog";

export const runtime = "nodejs";

// The browser sends only product ids and quantities. Every name and price
// comes from lib/shop-catalog.ts, so a tampered request can't change what is
// charged. Booking deposits use their own route (/api/checkout/booking),
// which prices from the database.
type CartLine = { id: string; qty: number };

export async function POST(req: Request) {
  if (!SHOP_ENABLED) return new NextResponse("Not found", { status: 404 });
  const ok = await rateLimit(`checkout:${clientIp(req)}`, 10, 600); // 10 per 10 min
  if (!ok) return new NextResponse("Too many requests", { status: 429 });

  const body = await req.json().catch(() => null);
  const email = body?.email;
  const lines = body?.items as CartLine[] | undefined;

  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email) || email.length > 200) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_LINE_ITEMS) {
    return NextResponse.json({ error: "Your cart is empty or too large" }, { status: 400 });
  }

  const priced: { id: string; name: string; qty: number; unitCents: number }[] = [];
  for (const line of lines) {
    const product = typeof line?.id === "string" && Object.hasOwn(SHOP_CATALOG, line.id)
      ? SHOP_CATALOG[line.id]
      : undefined;
    if (!product) {
      return NextResponse.json({ error: "Unknown product" }, { status: 400 });
    }
    if (!Number.isInteger(line.qty) || line.qty < 1 || line.qty > MAX_QTY_PER_ITEM) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }
    priced.push({ id: line.id, name: product.name, qty: line.qty, unitCents: product.priceCents });
  }

  const amount_cents = priced.reduce((sum, p) => sum + p.unitCents * p.qty, 0);

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: priced.map((p) => ({
      quantity: p.qty,
      price_data: {
        currency: "usd",
        unit_amount: p.unitCents,
        product_data: { name: p.name },
      },
    })),
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop?canceled=1`,
    customer_email: email,
    metadata: {
      email,
      items_json: JSON.stringify(priced.map((p) => ({ id: p.id, name: p.name, qty: p.qty, unit_amount_cents: p.unitCents }))),
      amount_cents: String(amount_cents),
    },
  });

  return NextResponse.json({ url: session.url });
}
