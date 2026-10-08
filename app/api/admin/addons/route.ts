import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { bad, readJson } from "@/lib/admin-api";
import { parseAddonFields } from "@/lib/admin-services";
import { getDb, initDb } from "@/lib/db";
import { getAddons } from "@/lib/services";

export const runtime = "nodejs";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  return NextResponse.json({ addons: await getAddons({ includeInactive: true }) });
}

// New add-on is offered with every service; Margie can tune that later.
export async function POST(req: Request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await readJson(req);
  if (!body) return bad("Invalid request body");
  const parsed = parseAddonFields(body, false);
  if (parsed.error) return bad(parsed.error);
  const f = parsed.fields!;
  await initDb();
  const db = getDb();
  const max = (await db.execute(`SELECT COALESCE(MAX(sort),0) AS m FROM addons`)).rows[0] as any;
  const r = await db.execute({
    sql: `INSERT INTO addons (name, price_cents, duration_minutes, active, sort) VALUES (?, ?, ?, ?, ?) RETURNING id`,
    args: [f.name, f.price_cents, f.duration_minutes, f.active ?? 1, Number(max.m) + 1],
  });
  const id = Number(r.rows[0].id);
  await db.execute({
    sql: `INSERT OR IGNORE INTO service_addons (service_slug, addon_id) SELECT slug, ? FROM services`,
    args: [id],
  });
  return NextResponse.json({ id }, { status: 201 });
}
