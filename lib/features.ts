// Single switch for the unfinished retail side of the site (shop, press-on
// catalog, gallery, tutorials, merch). The code stays in the repo; the routes
// 404 and every link disappears until this is flipped on in Vercel:
//   NEXT_PUBLIC_FEATURE_SHOP=true
// NEXT_PUBLIC_ vars are inlined at build time, so redeploy after changing it.
export const SHOP_ENABLED = process.env.NEXT_PUBLIC_FEATURE_SHOP === "true";
