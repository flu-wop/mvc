import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ok = await rateLimit(`newsletter:${clientIp(req)}`, 5, 600); // 5 per 10 min
  if (!ok) return new NextResponse("Too many requests", { status: 429 });

  const { email } = await req.json();

  if (!email || typeof email !== "string" || email.length > 200 || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    await initDb();
    const db = getDb();
    await db.execute({
      sql: `INSERT INTO newsletter (email) VALUES (?) ON CONFLICT(email) DO NOTHING`,
      args: [email],
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("newsletter signup failed", err);
    return NextResponse.json({ error: "Could not save signup" }, { status: 500 });
  }
}
