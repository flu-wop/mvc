import { getDb, initDb } from "./db";
import { DEPOSIT_CENTS, FALLBACK_DURATION_MINUTES, type Addon, type Service } from "./service-defaults";
import { SEED_ADDONS, SEED_SERVICES } from "./catalog-seed";

export { DEPOSIT_CENTS, FALLBACK_DURATION_MINUTES };
export type { Service };

function rowToService(r: any): Service {
  return {
    slug: String(r.slug),
    title: String(r.title),
    blurb: String(r.blurb ?? ""),
    image: String(r.image ?? ""),
    category: String(r.category ?? ""),
    paddingMinutes: Number(r.padding_minutes ?? 0),
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
    return SEED_SERVICES.map((s) => ({
      slug: s.slug, title: s.title, blurb: s.blurb, image: "", category: s.category, paddingMinutes: s.paddingMinutes,
      fromCents: s.fromCents, durationMinutes: s.durationMinutes, depositCents: DEPOSIT_CENTS, color: s.color, active: true, sort: s.sort,
    }));
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

function rowToAddon(r: any): Addon {
  return {
    id: Number(r.id),
    name: String(r.name),
    priceCents: Number(r.price_cents),
    durationMinutes: Number(r.duration_minutes),
    active: Number(r.active) === 1,
    sort: Number(r.sort ?? 0),
  };
}

export async function getAddons(opts: { includeInactive?: boolean } = {}): Promise<Addon[]> {
  try {
    await initDb();
    const rows = (
      await getDb().execute(`SELECT * FROM addons ${opts.includeInactive ? "" : "WHERE active = 1"} ORDER BY sort, name`)
    ).rows;
    return rows.map(rowToAddon);
  } catch (err) {
    console.error("[addons] falling back to defaults:", err);
    return SEED_ADDONS.map((a) => ({ ...a, active: true }));
  }
}

// service slug -> ids of add-ons that service offers
export async function getServiceAddonMap(): Promise<Record<string, number[]>> {
  try {
    await initDb();
    const rows = (await getDb().execute(`SELECT service_slug, addon_id FROM service_addons`)).rows as any[];
    const out: Record<string, number[]> = {};
    for (const r of rows) (out[String(r.service_slug)] ??= []).push(Number(r.addon_id));
    return out;
  } catch {
    return Object.fromEntries(SEED_SERVICES.map((s) => [s.slug, s.addonIds]));
  }
}
