export type Service = {
  slug: string;
  title: string;
  image: string;
  fromCents: number;
  durationMinutes: number;
  blurb: string;
};

// Mirrors components/Services.tsx. Keep these in sync — this is the
// source of truth for the booking flow's price/duration.
export const SERVICES: Service[] = [
  {
    slug: "acrylic",
    title: "Acrylic",
    image: "/images/service-acrylic.jpg",
    fromCents: 6500,
    durationMinutes: 90,
    blurb: "Sculpted strength and lasting beauty, custom-built to your preferred length and shape.",
  },
  {
    slug: "gel-x",
    title: "Gel-X",
    image: "/images/service-gel-x.jpg",
    fromCents: 7000,
    durationMinutes: 90,
    blurb: "Lightweight, flexible soft gel extensions with a natural, salon-fresh finish.",
  },
  {
    slug: "natural-nails",
    title: "Natural Nails",
    image: "/images/service-natural-nails.jpg",
    fromCents: 4500,
    durationMinutes: 60,
    blurb: "A meticulous manicure — cuticle care, shaping, and a flawless polish finish.",
  },
  {
    slug: "nail-art",
    title: "Nail Art",
    image: "/images/service-nail-art.jpg",
    fromCents: 11000,
    durationMinutes: 120,
    blurb: "Full creative expression — hand-painted detail, chrome, 3D elements, encapsulated designs.",
  },
  {
    slug: "press-ons",
    title: "Press-Ons",
    image: "/images/service-press-ons.jpg",
    fromCents: 5000,
    durationMinutes: 45,
    blurb: "Salon-quality custom press-ons made to fit your exact nail beds.",
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

// Flat deposit to reserve any appointment. Applies toward the service total
// (matches the Deposits policy on /faq and Policies.tsx). Adjust if Margie
// wants deposit to vary by service instead of a flat rate.
export const DEPOSIT_CENTS = 2500;
