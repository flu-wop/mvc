import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "mvc_admin_session";

export function safeEq(a: string, b: string): boolean {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}

// Server-only: checks the admin session cookie against ADMIN_PASSWORD.
export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  return safeEq(token, process.env.ADMIN_PASSWORD);
}
