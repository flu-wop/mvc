import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { safeEq, ADMIN_COOKIE } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ok = await rateLimit(`admin-login:${clientIp(req)}`, 5, 900); // 5 per 15 min
  if (!ok) return new NextResponse("Too many attempts", { status: 429 });

  const { password } = await req.json();
  if (
    !password ||
    typeof password !== "string" ||
    !process.env.ADMIN_PASSWORD ||
    !safeEq(password, process.env.ADMIN_PASSWORD)
  ) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, process.env.ADMIN_PASSWORD, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
