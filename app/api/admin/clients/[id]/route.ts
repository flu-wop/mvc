import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { bad, isUniqueViolation, mapAppointments, readJson, str } from "@/lib/admin-api";
import { getDb, initDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id)) return bad("Bad id");
  await initDb();
  const db = getDb();
  const c = (await db.execute({ sql: `SELECT * FROM clients WHERE id = ?`, args: [id] })).rows[0] as any;
  if (!c) return bad("Not found", 404);
  const rows = (
    await db.execute({
      sql: `SELECT * FROM bookings WHERE client_id = ? ORDER BY event_date DESC, id DESC`,
      args: [id],
    })
  ).rows;
  return NextResponse.json({
    client: {
      id,
      name: String(c.name),
      email: c.email ? String(c.email) : null,
      phone: c.phone ? String(c.phone) : null,
      notes: c.notes ? String(c.notes) : null,
    },
    appointments: await mapAppointments(rows),
  });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = await adminGuard();
  if (denied) return denied;
  const id = Number((await ctx.params).id);
  if (!Number.isInteger(id)) return bad("Bad id");
  const body = await readJson(req);
  if (!body) return bad("Invalid request body");
  await initDb();
  const db = getDb();
  const sets: string[] = [];
  const args: any[] = [];
  if ("name" in body) {
    const n = str(body.name, 200);
    if (!n) return bad("Name is required");
    sets.push("name = ?");
    args.push(n);
  }
  if ("email" in body) {
    const e = str(body.email ?? "", 200);
    if (e === null || (e && !/^\S+@\S+\.\S+$/.test(e))) return bad("That email doesn't look right");
    sets.push("email = ?", "email_lc = ?");
    args.push(e || null, e ? e.toLowerCase() : null);
  }
  if ("phone" in body) {
    const p = str(body.phone ?? "", 40);
    if (p === null) return bad("Phone is too long");
    sets.push("phone = ?");
    args.push(p || null);
  }
  if ("notes" in body) {
    const n = str(body.notes ?? "", 4000);
    if (n === null) return bad("Notes are too long");
    sets.push("notes = ?");
    args.push(n || null);
  }
  if (!sets.length) return bad("Nothing to update");
  try {
    const r = await db.execute({ sql: `UPDATE clients SET ${sets.join(", ")} WHERE id = ?`, args: [...args, id] });
    if (!r.rowsAffected) return bad("Not found", 404);
  } catch (err) {
    if (isUniqueViolation(err)) return bad("Another client already has that email", 409);
    throw err;
  }
  return NextResponse.json({ ok: true });
}
