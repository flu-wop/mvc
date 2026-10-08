// Single switch for the unfinished retail side of the site (shop, press-on
// catalog, gallery, tutorials, merch). The code stays in the repo; the routes
// 404 and every link disappears until this is flipped on in Vercel:
//   NEXT_PUBLIC_FEATURE_SHOP=true
// NEXT_PUBLIC_ vars are inlined at build time, so redeploy after changing it.
export const SHOP_ENABLED = process.env.NEXT_PUBLIC_FEATURE_SHOP === "true";

// ─── PLACEHOLDER: "Coming soon" band ─────────────────────────────────────
// Shows Shop / Tutorials / Merch teasers on the homepage and at /shop until
// those are real. Before launch, either delete the <ComingSoon /> line in
// app/page.tsx (and components/home/ComingSoon.tsx), or hide it without code:
//   NEXT_PUBLIC_HIDE_COMING_SOON=true
export const COMING_SOON_ENABLED = process.env.NEXT_PUBLIC_HIDE_COMING_SOON !== "true";
