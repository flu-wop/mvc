import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { bad, readJson } from "@/lib/admin-api";
import { getDb, initDb } from "@/lib/db";
import { parseServiceFields } from "@/lib/admin-services";

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const { slug } = await ctx.params;
  if (!/^[a-z0-9-]{1,60}$/.test(slug)) return bad("Bad service");
  const body = await readJson(req);
  if (!body) return bad("Invalid request body");
  const parsed = parseServiceFields(body, true);
  if (parsed.error) return bad(parsed.error);
  const f = parsed.fields!;
  const keys = Object.keys(f);
  if (!keys.length) return bad("Nothing to update");
  await initDb();
  const r = await getDb().execute({
    sql: `UPDATE services SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE slug = ?`,
    args: [...keys.map((k) => f[k]), slug],
  });
  if (!r.rowsAffected) return bad("Not found", 404);
  return NextResponse.json({ ok: true });
}
