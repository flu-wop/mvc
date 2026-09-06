import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getDb, initDb } from "@/lib/db";
import { sendBookingEmails, sendWebhookFailureAlert } from "@/lib/email";

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

    if (m.type === "booking") {
      let r;
      try {
        r = await db.execute({
          sql: `INSERT OR IGNORE INTO bookings
                (name, email, phone, service, service_from_cents, event_date, event_time, message, deposit_cents, stripe_session_id, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid')`,
          args: [
            m.name,
            m.email,
            m.phone,
            m.service,
            Number(m.service_from_cents),
            m.event_date,
            m.event_time,
            m.message || null,
            Number(m.deposit_cents),
            s.id,
          ],
        });
      } catch (err: any) {
        console.error("[stripe-webhook] Booking DB write failed:", err);
        await sendWebhookFailureAlert({ sessionId: s.id, kind: "booking", error: err?.message || String(err) });
        return NextResponse.json({ received: true, error: "DB write failed, will retry" }, { status: 500 });
      }
      if (r.rowsAffected === 0) {
        return NextResponse.json({ received: true, duplicate: true });
      }
      try {
        await sendBookingEmails(m);
      } catch (e) {
        console.error("booking email failed", e); // never fail the webhook on email error
      }
      return NextResponse.json({ received: true });
    }

    // Default: shop order
    let r;
    try {
      r = await db.execute({
        sql: `INSERT OR IGNORE INTO orders (email, items_json, amount_cents, stripe_session_id, status)
              VALUES (?, ?, ?, ?, 'paid')`,
        args: [m.email, m.items_json, Number(m.amount_cents), s.id],
      });
    } catch (err: any) {
      console.error("[stripe-webhook] Order DB write failed:", err);
      await sendWebhookFailureAlert({ sessionId: s.id, kind: "order", error: err?.message || String(err) });
      return NextResponse.json({ received: true, error: "DB write failed, will retry" }, { status: 500 });
    }
    if (r.rowsAffected === 0) {
      return NextResponse.json({ received: true, duplicate: true });
    }
    // TODO: send order confirmation email via Resend once RESEND_API_KEY is set up
    // (pre-existing gap, unrelated to this fix — flagged separately)
  }

  return NextResponse.json({ received: true });
}
