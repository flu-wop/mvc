import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getDb, initDb } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature")!;
  const raw = await req.text(); // RAW body — must read before parsing to verify signature

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature failed: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as any;
    const m = s.metadata || {};
    await initDb();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO orders (email, items_json, amount_cents, stripe_session_id, status)
            VALUES (?, ?, ?, ?, 'paid')`,
      args: [m.email, m.items_json, Number(m.amount_cents), s.id],
    });
    // TODO: send order confirmation email via Resend once RESEND_API_KEY is set up
  }

  return NextResponse.json({ received: true });
}
