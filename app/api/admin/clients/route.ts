import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/admin-auth";
import { bad, isUniqueViolation, readJson, str } from "@/lib/admin-api";
import { getDb, initDb } from "@/lib/db";
import { nowInShop } from "@/lib/time";
import type { ClientRow } from "@/lib/admin-types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const denied = await adminGuard();
  if (denied) return denied;
  await initDb();
  const q = (new URL(req.url).searchParams.get("q") || "").trim().toLowerCase().slice(0, 100);
  const today = nowInShop().date;
  const like = `%${q.replace(/[%_]/g, "")}%`;
  const rows = (
    await getDb().execute({
      sql: `SELECT c.id, c.name, c.email, c.phone, c.notes,
              (SELECT COUNT(*) FROM bookings b WHERE b.client_id = c.id AND b.status IN ('paid','completed')) AS visits,
              (SELECT COALESCE(SUM(b.deposit_cents),0) FROM bookings b WHERE b.client_id = c.id AND b.status IN ('paid','completed')) AS deposits,
              (SELECT MAX(b.event_date) FROM bookings b WHERE b.client_id = c.id AND b.status IN ('paid','completed') AND b.event_date < ?) AS last_visit,
              (SELECT MIN(b.event_date) FROM bookings b WHERE b.client_id = c.id AND b.status IN ('paid','pending') AND b.event_date >= ?) AS next_visit
            FROM clients c
            WHERE (? = '' OR lower(c.name) LIKE ? OR lower(COALESCE(c.email,'')) LIKE ? OR COALESCE(c.phone,'') LIKE ?)
            ORDER BY lower(c.name) LIMIT 500`,
      args: [today, today, q, like, like, like],
    })
  ).rows as any[];
  const clients: ClientRow[] = rows.map((r) => ({
    id: Number(r.id),
    name: String(r.name),
    email: r.email ? String(r.email) : null,
    phone: r.phone ? String(r.phone) : null,
    notes: r.notes ? String(r.notes) : null,
    visits: Number(r.visits),
    depositsCents: Number(r.deposits),
    lastVisit: r.last_visit ? String(r.last_visit) : null,
    nextVisit: r.next_visit ? String(r.next_visit) : null,
  }));
  return NextResponse.json({ clients });
}

export async function POST(req: Request) {
  const denied = await adminGuard();
  if (denied) return denied;
  const body = await readJson(req);
  if (!body) return bad("Invalid request body");
  const name = str(body.name, 200);
  if (!name) return bad("Name is required");
  const email = str(body.email ?? "", 200) ?? "";
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return bad("That email doesn't look right");
  const phone = str(body.phone ?? "", 40) ?? "";
  const notes = str(body.notes ?? "", 4000);
  await initDb();
  try {
    const r = await getDb().execute({
      sql: `INSERT INTO clients (name, email, email_lc, phone, notes) VALUES (?, ?, ?, ?, ?) RETURNING id`,
      args: [name, email || null, email ? email.toLowerCase() : null, phone || null, notes || null],
    });
    return NextResponse.json({ id: Number(r.rows[0].id) }, { status: 201 });
  } catch (err) {
    if (isUniqueViolation(err)) return bad("A client with that email already exists", 409);
    throw err;
  }
}
