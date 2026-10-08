// Client-safe service types and the seed catalog. The live catalog is the
// `services` table (edited by Margie in /admin/services); these defaults only
// seed an empty table and act as a fallback if the database is unreachable.

export type Service = {
  slug: string;
  title: string;
  image: string;
  fromCents: number;
  durationMinutes: number;
  depositCents: number;
  color: string; // hex, used for calendar blocks and the legend
  blurb: string;
  active: boolean;
  sort: number;
};

// Flat deposit that applies toward the service total (matches the Deposits
// policy). Per-service deposits are editable in admin; this is the default.
export const DEPOSIT_CENTS = 2500;

export const DEFAULT_SERVICES: Service[] = [
  {
    slug: "acrylic",
    title: "Acrylic",
    image: "/images/service-acrylic.jpg",
    fromCents: 6500,
    durationMinutes: 90,
    depositCents: DEPOSIT_CENTS,
    color: "#C9A96E",
    blurb: "Sculpted strength and lasting beauty, custom-built to your preferred length and shape.",
    active: true,
    sort: 1,
  },
  {
    slug: "gel-x",
    title: "Gel-X",
    image: "/images/service-gel-x.jpg",
    fromCents: 7000,
    durationMinutes: 90,
    depositCents: DEPOSIT_CENTS,
    color: "#B8BBC0",
    blurb: "Lightweight, flexible soft gel extensions with a natural, salon-fresh finish.",
    active: true,
    sort: 2,
  },
  {
    slug: "natural-nails",
    title: "Natural Nails",
    image: "/images/service-natural-nails.jpg",
    fromCents: 4500,
    durationMinutes: 60,
    depositCents: DEPOSIT_CENTS,
    color: "#A9794A",
    blurb: "A meticulous manicure: cuticle care, shaping, and a flawless polish finish.",
    active: true,
    sort: 3,
  },
  {
    slug: "nail-art",
    title: "Nail Art",
    image: "/images/service-nail-art.jpg",
    fromCents: 11000,
    durationMinutes: 120,
    depositCents: DEPOSIT_CENTS,
    color: "#8E3B4C",
    blurb: "Full creative expression: hand-painted detail, chrome, 3D elements, encapsulated designs.",
    active: true,
    sort: 4,
  },
  {
    slug: "press-ons",
    title: "Custom Press-Ons",
    image: "/images/service-press-ons.jpg",
    fromCents: 5000,
    durationMinutes: 45,
    depositCents: DEPOSIT_CENTS,
    color: "#F2EDE4",
    blurb: "Salon-quality custom press-ons made to fit your exact nail beds.",
    active: true,
    sort: 5,
  },
];

export const FALLBACK_DURATION_MINUTES = 90;

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
