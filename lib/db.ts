import { createClient, type Client } from "@libsql/client";

let _db: Client | null = null;

export function getDb(): Client {
  if (_db) return _db;
  _db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
  return _db;
}

// Call once before first read/write. Idempotent.
export async function initDb() {
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT NOT NULL,
      items_json TEXT NOT NULL,        -- JSON array of {name, qty, unit_amount_cents}
      amount_cents INTEGER NOT NULL,
      stripe_session_id TEXT UNIQUE,
      status TEXT DEFAULT 'pending',   -- pending | paid | cancelled
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS newsletter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS content_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      business_name TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      business_type TEXT,
      project_types TEXT NOT NULL,     -- JSON array, e.g. ["UGC Video","Reels"]
      budget_range TEXT,
      timeline TEXT,
      instagram_or_site TEXT,
      details TEXT,
      status TEXT DEFAULT 'new',       -- new | contacted | booked | closed
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      service TEXT NOT NULL,
      service_from_cents INTEGER NOT NULL,
      event_date TEXT NOT NULL,         -- ISO yyyy-mm-dd
      event_time TEXT NOT NULL,         -- e.g. "2:00 PM"
      message TEXT,
      deposit_cents INTEGER NOT NULL,
      stripe_session_id TEXT UNIQUE,
      status TEXT DEFAULT 'pending',    -- pending | paid | cancelled
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_session ON bookings(stripe_session_id)`
  );
  // Prevents double-booking the same slot once paid
  await db.execute(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_slot ON bookings(event_date, event_time) WHERE status = 'paid'`
  );
  // Safety net: if the orders table already existed before stripe_session_id was UNIQUE
  await db.execute(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_session ON orders(stripe_session_id)`
  );
}
