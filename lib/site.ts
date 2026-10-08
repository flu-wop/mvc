// Canonical site facts in one place. SITE_URL follows NEXT_PUBLIC_SITE_URL so
// attaching a custom domain is an env-var change, not a code change.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://mvc-creations.vercel.app").replace(/\/+$/, "");

export const BUSINESS = {
  name: "MVC Creations",
  artist: "Margie",
  city: "Kenner, LA",
  phone: "(504) 303-2763",
  phoneHref: "tel:5043032763",
  email: "mvcxcreations@gmail.com",
  instagram: "https://www.instagram.com/mvcxcreations",
  instagramHandle: "@mvcxcreations",
  facebook: "https://www.facebook.com/mvcxcreations",
  tiktok: "https://www.tiktok.com/@mvcxcreations",
} as const;
