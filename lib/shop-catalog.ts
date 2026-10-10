// Server-side price list for the shop (press-on sets, merch). /api/checkout
// prices every order from this list by product id; the browser only ever
// sends ids and quantities, never an amount. Server-only: do not import from
// client components.
//
// EMPTY UNTIL LAUNCH. Margie's real products and prices aren't final yet, so
// every checkout request is refused ("Unknown product") until entries are
// added here. Before flipping NEXT_PUBLIC_FEATURE_SHOP=true:
//   1. Add one entry per product: id (stable, never reused), name, priceCents.
//   2. Have the shop/press-on pages send { email, items: [{ id, qty }] }.
//
// Example:
//   "coffin-nude-set": { name: "Nude Coffin Press-On Set", priceCents: 4500 },

export type ShopProduct = { name: string; priceCents: number };

export const SHOP_CATALOG: Record<string, ShopProduct> = {};

export const MAX_QTY_PER_ITEM = 10;
export const MAX_LINE_ITEMS = 20;
