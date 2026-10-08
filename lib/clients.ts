import { getDb, initDb } from "./db";

export type ClientInput = { name: string; email?: string | null; phone?: string | null };

// Finds the client by email (case-insensitive) or creates one. Clients without
// an email (walk-ins Margie adds by phone) match on exact phone instead, and
// are created fresh if there is no match. Returns the client id.
export async function upsertClient(input: ClientInput): Promise<number> {
  await initDb();
  const db = getDb();
  const email = (input.email || "").trim();
  const emailLc = email.toLowerCase();
  const phone = (input.phone || "").trim();
  const name = input.name.trim();

  if (emailLc) {
    const found = (await db.execute({ sql: `SELECT id FROM clients WHERE email_lc = ?`, args: [emailLc] })).rows[0];
    if (found) {
      // Keep contact details fresh without clobbering a name Margie corrected.
      await db.execute({
        sql: `UPDATE clients SET phone = COALESCE(NULLIF(?, ''), phone) WHERE id = ?`,
        args: [phone, Number(found.id)],
      });
      return Number(found.id);
    }
    const r = await db.execute({
      sql: `INSERT INTO clients (name, email, email_lc, phone) VALUES (?, ?, ?, ?) RETURNING id`,
      args: [name, email, emailLc, phone || null],
    });
    return Number(r.rows[0].id);
  }

  if (phone) {
    const found = (
      await db.execute({ sql: `SELECT id FROM clients WHERE phone = ? AND email_lc IS NULL`, args: [phone] })
    ).rows[0];
    if (found) return Number(found.id);
  }
  const r = await db.execute({
    sql: `INSERT INTO clients (name, email, email_lc, phone) VALUES (?, NULL, NULL, ?) RETURNING id`,
    args: [name, phone || null],
  });
  return Number(r.rows[0].id);
}
