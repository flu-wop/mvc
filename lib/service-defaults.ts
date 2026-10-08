// Client-safe service types and helpers. The live catalog is the `services` and
// `addons` tables (edited by Margie in /admin/services); the seed data lives in
// lib/catalog-seed.ts and is server-only.

export type Service = {
  slug: string;
  title: string;
  category: string;
  image: string;
  fromCents: number;
  durationMinutes: number;
  paddingMinutes: number; // cleanup time held after the appointment
  depositCents: number;
  color: string; // hex, used for calendar blocks and the legend
  blurb: string;
  active: boolean;
  sort: number;
};

export type Addon = {
  id: number;
  name: string;
  priceCents: number;
  durationMinutes: number;
  active: boolean;
  sort: number;
};

// Flat deposit. Per-service deposits are editable in admin; this is the default.
export const DEPOSIT_CENTS = 2500;

export const FALLBACK_DURATION_MINUTES = 90;

// Mobile appointments (Margie travels to the client). From her booking page:
// within 15 miles $75, 16-20 miles $100, beyond that $100 plus $2 per mile past 20,
// which is confirmed with the client rather than charged online.
export const TRAVEL_TIERS = [
  { key: "within15", label: "Within 15 miles", feeCents: 7500, note: "" },
  { key: "16to20", label: "16 to 20 miles", feeCents: 10000, note: "" },
  { key: "21plus", label: "21+ miles", feeCents: 10000, note: "Plus $2 per mile beyond 20, confirmed before your appointment." },
] as const;
export type TravelTierKey = (typeof TRAVEL_TIERS)[number]["key"];

// The five simplified services from the first build. Hidden once the real
// catalog is seeded; kept in the table so old bookings still resolve.
export const LEGACY_SLUGS = ["acrylic", "gel-x", "natural-nails", "nail-art", "press-ons"];

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h} hr ${m} min`;
  if (h) return `${h} hr`;
  return `${m} min`;
}

export function groupByCategory(services: Service[]): { category: string; items: Service[] }[] {
  const out: { category: string; items: Service[] }[] = [];
  for (const s of [...services].sort((a, b) => a.sort - b.sort)) {
    const cat = s.category || "Services";
    let g = out.find((x) => x.category === cat);
    if (!g) out.push((g = { category: cat, items: [] }));
    g.items.push(s);
  }
  return out;
}
