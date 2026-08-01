import { NextRequest, NextResponse } from "next/server";

// TODO: wire this up to Resend (audience/contact list) or Turso, same pattern
// as the booking-system stack on Epoch Skin / Jade the Gem / MCS. Right now
// this just validates the email and returns success — no email is actually
// stored or sent yet.
export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Placeholder — real persistence not yet wired up.
  return NextResponse.json({ ok: true });
}
