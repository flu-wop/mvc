import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { bad, isUniqueViolation, readJson, str } from "@/lib/admin-api";
import { parseServiceFields } from "@/lib/admin-services";
import { getDb, initDb } from "@/lib/db";
import { getServices } from "@/lib/services";

export const runtime = "nodejs";

export async function GET() {
  const denied = await adminGuard();
  if (denied) return denied;
  return NextResponse.json({ services: await getServices({ includeInactive: true }) });
}

export async function POST(req: Request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await readJson(req);
  if (!body) return bad("Invalid request body");
  const parsed = parseServiceFields(body, false);
  if (parsed.error) return bad(parsed.error);
  const f = parsed.fields!;
  const base = String(f.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "service";
  await initDb();
  const db = getDb();
  const max = (await db.execute(`SELECT COALESCE(MAX(sort),0) AS m FROM services`)).rows[0] as any;
  for (let i = 0; i < 20; i++) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    try {
      await db.execute({
        sql: `INSERT INTO services (slug, title, blurb, image, price_cents, duration_minutes, padding_minutes, deposit_cents, color, category, active, sort)
              VALUES (?, ?, ?, '', ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [slug, f.title, f.blurb ?? "", f.price_cents, f.duration_minutes, f.padding_minutes ?? 0, f.deposit_cents, f.color, f.category ?? "",
               f.active ?? 1, Number(max.m) + 1],
      });
      return NextResponse.json({ slug }, { status: 201 });
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
    }
  }
  return bad("Couldn't create that service", 500);
}
