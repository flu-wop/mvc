-- MVC Creations: scheduling upgrade. Safe on existing data (nothing is dropped or rewritten).
-- The app applies all of this automatically on its first request (lib/db.ts), so running
-- it by hand is optional. To run it yourself in Turso:
--   turso db shell <your-db> < db/migrations/001_scheduling.sql
-- Re-running is harmless except the ALTER TABLE lines, which error with
-- "duplicate column name" once a column exists. If you see that, skip the line.

CREATE TABLE IF NOT EXISTS services (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  blurb TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  deposit_cents INTEGER NOT NULL DEFAULT 2500,
  color TEXT NOT NULL DEFAULT '#C9A96E',
  active INTEGER NOT NULL DEFAULT 1,
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  email_lc TEXT,
  phone TEXT,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_email ON clients(email_lc);

CREATE TABLE IF NOT EXISTS business_hours (
  weekday INTEGER PRIMARY KEY,            -- 0 = Sunday
  closed INTEGER NOT NULL DEFAULT 0,
  open_min INTEGER NOT NULL DEFAULT 540,  -- minutes after midnight, shop-local
  close_min INTEGER NOT NULL DEFAULT 1080
);

CREATE TABLE IF NOT EXISTS blocked_time (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  start_min INTEGER,                      -- NULL = all day
  end_min INTEGER,
  reason TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_blocked_dates ON blocked_time(start_date, end_date);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

ALTER TABLE newsletter ADD COLUMN interest TEXT;

-- New booking columns
ALTER TABLE bookings ADD COLUMN service_slug TEXT;
ALTER TABLE bookings ADD COLUMN duration_minutes INTEGER;
ALTER TABLE bookings ADD COLUMN client_id INTEGER;
ALTER TABLE bookings ADD COLUMN notes TEXT;
ALTER TABLE bookings ADD COLUMN total_cents INTEGER;
ALTER TABLE bookings ADD COLUMN source TEXT DEFAULT 'online';
ALTER TABLE bookings ADD COLUMN reminder_sent_at TEXT;
ALTER TABLE bookings ADD COLUMN cancelled_at TEXT;
ALTER TABLE bookings ADD COLUMN refunded_at TEXT;
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id);

-- Seeds. INSERT OR IGNORE never overwrites anything edited later in admin.
INSERT OR IGNORE INTO services (slug,title,blurb,image,price_cents,duration_minutes,deposit_cents,color,active,sort) VALUES
 ('acrylic','Acrylic','Sculpted strength and lasting beauty, custom-built to your preferred length and shape.','/images/service-acrylic.jpg',6500,90,2500,'#C9A96E',1,1),
 ('gel-x','Gel-X','Lightweight, flexible soft gel extensions with a natural, salon-fresh finish.','/images/service-gel-x.jpg',7000,90,2500,'#B8BBC0',1,2),
 ('natural-nails','Natural Nails','A meticulous manicure: cuticle care, shaping, and a flawless polish finish.','/images/service-natural-nails.jpg',4500,60,2500,'#A9794A',1,3),
 ('nail-art','Nail Art','Full creative expression: hand-painted detail, chrome, 3D elements, encapsulated designs.','/images/service-nail-art.jpg',11000,120,2500,'#8E3B4C',1,4),
 ('press-ons','Custom Press-Ons','Salon-quality custom press-ons made to fit your exact nail beds.','/images/service-press-ons.jpg',5000,45,2500,'#F2EDE4',1,5);

-- Mon-Sat 9:00-6:00, Sunday closed (hours from Margie's booking page).
INSERT OR IGNORE INTO business_hours (weekday,closed,open_min,close_min) VALUES
 (0,1,540,1080),(1,0,540,1080),(2,0,540,1080),(3,0,540,1080),(4,0,540,1080),(5,0,540,1080),(6,0,540,1080);
INSERT OR IGNORE INTO settings (key,value) VALUES
 ('slot_minutes','30'),('buffer_minutes','0'),('min_notice_hours','2'),('reminders_enabled','1');

-- Backfill existing bookings: link to a service, default a duration, build client records.
UPDATE bookings SET service_slug = (SELECT slug FROM services s WHERE lower(s.title) = lower(bookings.service))
  WHERE service_slug IS NULL;
UPDATE bookings SET duration_minutes = COALESCE((SELECT duration_minutes FROM services s WHERE s.slug = bookings.service_slug), 90)
  WHERE duration_minutes IS NULL;
INSERT OR IGNORE INTO clients (name, email, email_lc, phone)
  SELECT name, email, lower(trim(email)), phone FROM bookings WHERE trim(email) != '' GROUP BY lower(trim(email));
UPDATE bookings SET client_id = (SELECT id FROM clients c WHERE c.email_lc = lower(trim(bookings.email)))
  WHERE client_id IS NULL AND trim(email) != '';
