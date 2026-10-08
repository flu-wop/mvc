import { createClient, type Client } from "@libsql/client";
import { DEFAULT_SERVICES } from "./service-defaults";

let _db: Client | null = null;

export function getDb(): Client {
  if (_db) return _db;
  _db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  return _db;
}

// Statuses that hold a slot on the calendar. `cancelled`, `no_show` and
// `needs_review` (a paid double-booking waiting on Margie) do not.
export const OCCUPYING_STATUSES = ["pending", "paid", "completed"] as const;

async function addColumn(table: string, column: string, ddl: string) {
  const db = getDb();
  const info = await db.execute(`PRAGMA table_info(${table})`);
  if (info.rows.some((r) => r.name === column)) return;
  try {
    await db.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${ddl}`);
  } catch (err: any) {
    // Another cold start may have added it between the check and the ALTER.
    if (!/duplicate column/i.test(String(err?.message))) throw err;
  }
}

let _init: Promise<void> | null = null;

// Call before first read/write. Idempotent, and memoized per server instance
// so it only does real work on a cold start. Safe to run on live data: it only
// creates what is missing and never drops or rewrites existing rows.
// Mirrored in db/migrations/001_scheduling.sql for running by hand.
export function initDb(): Promise<void> {
  if (!_init) {
    _init = runInit().catch((err) => {
      _init = null; // let the next request retry
      throw err;
    });
  }
  return _init;
}

async function runInit() {
  const db = getDb();

  // ── Original tables (unchanged) ────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT NOT NULL,
      items_json TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      stripe_session_id TEXT UNIQUE,
      status TEXT DEFAULT 'pending',
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
      project_types TEXT NOT NULL,
      budget_range TEXT,
      timeline TEXT,
      instagram_or_site TEXT,
      details TEXT,
      status TEXT DEFAULT 'new',
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
      event_date TEXT NOT NULL,         -- ISO yyyy-mm-dd, shop-local
      event_time TEXT NOT NULL,         -- e.g. "2:00 PM", shop-local
      message TEXT,
      deposit_cents INTEGER NOT NULL,
      stripe_session_id TEXT UNIQUE,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_session ON bookings(stripe_session_id)`);
  // Prevents two paid bookings starting at the same minute. Overlap between
  // different start times is checked in code (lib/availability.ts).
  await db.execute(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_slot ON bookings(event_date, event_time) WHERE status = 'paid'`
  );
  await db.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_session ON orders(stripe_session_id)`);

  // ── Scheduling tables ──────────────────────────────────────────────────
  await db.execute(`
    CREATE TABLE IF NOT EXISTS services (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      blurb TEXT NOT NULL DEFAULT '',
      image TEXT NOT NULL DEFAULT '',
      price_cents INTEGER NOT NULL,        -- "from" price
      duration_minutes INTEGER NOT NULL,
      deposit_cents INTEGER NOT NULL DEFAULT 2500,
      color TEXT NOT NULL DEFAULT '#C9A96E',
      active INTEGER NOT NULL DEFAULT 1,
      sort INTEGER NOT NULL DEFAULT 0
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      email_lc TEXT,
      phone TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_email ON clients(email_lc)`);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS business_hours (
      weekday INTEGER PRIMARY KEY,         -- 0 = Sunday
      closed INTEGER NOT NULL DEFAULT 0,
      open_min INTEGER NOT NULL DEFAULT 600,
      close_min INTEGER NOT NULL DEFAULT 1080
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS blocked_time (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,              -- inclusive; same as start_date for one day
      start_min INTEGER,                   -- NULL = all day
      end_min INTEGER,
      reason TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_blocked_dates ON blocked_time(start_date, end_date)`);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // ── New booking columns ────────────────────────────────────────────────
  await addColumn("bookings", "service_slug", "TEXT");
  await addColumn("bookings", "duration_minutes", "INTEGER");
  await addColumn("bookings", "client_id", "INTEGER");
  await addColumn("bookings", "notes", "TEXT");
  await addColumn("bookings", "total_cents", "INTEGER");
  await addColumn("bookings", "source", "TEXT DEFAULT 'online'");
  await addColumn("bookings", "reminder_sent_at", "TEXT");
  await addColumn("bookings", "cancelled_at", "TEXT");
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(event_date)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id)`);

  // ── Seed defaults (never overwrites edits) ─────────────────────────────
  await db.batch(
    [
      ...DEFAULT_SERVICES.map((s) => ({
        sql: `INSERT OR IGNORE INTO services (slug, title, blurb, image, price_cents, duration_minutes, deposit_cents, color, active, sort)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
        args: [s.slug, s.title, s.blurb, s.image, s.fromCents, s.durationMinutes, s.depositCents, s.color, s.sort],
      })),
      // Mon–Sat 10:00–6:00, Sunday closed: exactly what online booking did before.
      ...[0, 1, 2, 3, 4, 5, 6].map((d) => ({
        sql: `INSERT OR IGNORE INTO business_hours (weekday, closed, open_min, close_min) VALUES (?, ?, 600, 1080)`,
        args: [d, d === 0 ? 1 : 0],
      })),
      ...(
        [
          ["slot_minutes", "30"],
          ["buffer_minutes", "0"],
          ["min_notice_hours", "2"],
          ["reminders_enabled", "1"],
        ] as const
      ).map(([k, v]) => ({
        sql: `INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`,
        args: [k, v],
      })),
    ],
    "write"
  );

  // ── Backfill rows created before this migration ────────────────────────
  await db.execute(`
    UPDATE bookings SET
      service_slug = (SELECT slug FROM services s WHERE lower(s.title) = lower(bookings.service) LIMIT 1),
      duration_minutes = COALESCE(duration_minutes, (SELECT duration_minutes FROM services s WHERE lower(s.title) = lower(bookings.service) LIMIT 1))
    WHERE duration_minutes IS NULL OR service_slug IS NULL
  `);
  await db.execute(`
    INSERT OR IGNORE INTO clients (name, email, email_lc, phone)
    SELECT name, email, lower(trim(email)), phone FROM bookings
    WHERE email IS NOT NULL AND trim(email) != '' AND client_id IS NULL
    GROUP BY lower(trim(email))
  `);
  await db.execute(`
    UPDATE bookings SET client_id = (SELECT id FROM clients c WHERE c.email_lc = lower(trim(bookings.email)))
    WHERE client_id IS NULL AND email IS NOT NULL AND trim(email) != ''
  `);
}
