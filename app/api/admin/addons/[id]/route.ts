import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { bad, readJson } from "@/lib/admin-api";
import { getDb, initDb } from "@/lib/db";
import { parseAddonFields } from "@/lib/admin-services";

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id)) return bad("Bad id");
  const body = await readJson(req);
  if (!body) return bad("Invalid request body");
  const parsed = parseAddonFields(body, true);
  if (parsed.error) return bad(parsed.error);
  const f = parsed.fields!;
  const keys = Object.keys(f);
  if (!keys.length) return bad("Nothing to update");
  await initDb();
  const r = await getDb().execute({
    sql: `UPDATE addons SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`,
    args: [...keys.map((k) => f[k]), id],
  });
  if (!r.rowsAffected) return bad("Not found", 404);
  return NextResponse.json({ ok: true });
}
