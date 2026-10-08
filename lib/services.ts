import { getDb, initDb } from "./db";
import { DEFAULT_SERVICES, DEPOSIT_CENTS, FALLBACK_DURATION_MINUTES, type Service } from "./service-defaults";

export { DEPOSIT_CENTS, FALLBACK_DURATION_MINUTES };
export type { Service };

function rowToService(r: any): Service {
  return {
    slug: String(r.slug),
    title: String(r.title),
    blurb: String(r.blurb ?? ""),
    image: String(r.image ?? ""),
    fromCents: Number(r.price_cents),
    durationMinutes: Number(r.duration_minutes),
    depositCents: Number(r.deposit_cents),
    color: String(r.color || "#C9A96E"),
    active: Number(r.active) === 1,
    sort: Number(r.sort ?? 0),
  };
}

// Live catalog from Turso. Falls back to the seed list if the database can't
// be reached, so the public pages never go blank.
export async function getServices(opts: { includeInactive?: boolean } = {}): Promise<Service[]> {
  try {
    await initDb();
    const db = getDb();
    const rows = (
      await db.execute(
        `SELECT * FROM services ${opts.includeInactive ? "" : "WHERE active = 1"} ORDER BY sort, title`
      )
    ).rows;
    return rows.map(rowToService);
  } catch (err) {
    console.error("[services] falling back to defaults:", err);
    return DEFAULT_SERVICES.filter((s) => opts.includeInactive || s.active);
  }
}

export async function getService(slug: unknown, opts: { includeInactive?: boolean } = {}): Promise<Service | undefined> {
  if (typeof slug !== "string" || !slug) return undefined;
  const all = await getServices({ includeInactive: true });
  const found = all.find((s) => s.slug === slug);
  if (!found) return undefined;
  if (!found.active && !opts.includeInactive) return undefined;
  return found;
}

export async function getServiceByTitle(title: string): Promise<Service | undefined> {
  const all = await getServices({ includeInactive: true });
  return all.find((s) => s.title.toLowerCase() === title.toLowerCase());
}
