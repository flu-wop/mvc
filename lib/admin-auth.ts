import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "mvc_admin_session";

export function safeEq(a: string, b: string): boolean {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}

// The cookie holds a keyed hash of the admin password, never the password
// itself, so a leaked cookie can't be replayed as a password elsewhere.
// (Changing ADMIN_PASSWORD invalidates every session.)
export function sessionToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHmac("sha256", pw).update("mvc-admin-session-v1").digest("hex");
}

// Server-only: checks the admin session cookie.
export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  const expected = sessionToken();
  if (!token || !expected) return false;
  return safeEq(token, expected);
}

// For /api/admin/* handlers: returns a 401 response when not signed in, else null.
export async function adminGuard(): Promise<NextResponse | null> {
  if (await isAdminAuthed()) return null;
  return NextResponse.json({ error: "Not signed in" }, { status: 401 });
}
