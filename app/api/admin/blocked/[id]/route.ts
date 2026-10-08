import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { bad } from "@/lib/admin-api";
import { getDb, initDb } from "@/lib/db";

export const runtime = "nodejs";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id)) return bad("Bad id");
  await initDb();
  await getDb().execute({ sql: `DELETE FROM blocked_time WHERE id = ?`, args: [id] });
  return NextResponse.json({ ok: true });
}
