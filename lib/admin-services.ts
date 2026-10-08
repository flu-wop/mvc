import { str } from "./admin-api";

export function parseServiceFields(body: Record<string, any>, partial: boolean) {
  const out: Record<string, any> = {};
  const has = (k: string) => k in body;
  if (!partial || has("title")) {
    const t = str(body.title, 80);
    if (!t) return { error: "Name is required" };
    out.title = t;
  }
  if (has("blurb")) {
    const b = str(body.blurb ?? "", 400);
    if (b === null) return { error: "Description is too long" };
    out.blurb = b;
  }
  if (!partial || has("durationMinutes")) {
    const d = Number(body.durationMinutes);
    if (!Number.isInteger(d) || d < 5 || d > 720) return { error: "Duration must be 5 to 720 minutes" };
    out.duration_minutes = d;
  }
  if (!partial || has("fromCents")) {
    const p = Number(body.fromCents);
    if (!Number.isInteger(p) || p < 0 || p > 10_000_00) return { error: "Price looks wrong" };
    out.price_cents = p;
  }
  if (!partial || has("depositCents")) {
    const d = Number(body.depositCents);
    // Stripe's minimum charge is 50 cents.
    if (!Number.isInteger(d) || d < 50 || d > 10_000_00) return { error: "Deposit must be at least $0.50" };
    out.deposit_cents = d;
  }
  if (!partial || has("color")) {
    if (typeof body.color !== "string" || !/^#[0-9a-fA-F]{6}$/.test(body.color)) return { error: "Pick a color" };
    out.color = body.color;
  }
  if (has("category")) {
    const c = str(body.category ?? "", 60);
    if (c === null) return { error: "Category is too long" };
    out.category = c;
  }
  if (has("paddingMinutes")) {
    const p = Number(body.paddingMinutes);
    if (!Number.isInteger(p) || p < 0 || p > 240) return { error: "Cleanup time must be 0 to 240 minutes" };
    out.padding_minutes = p;
  }
  if (has("active")) out.active = body.active ? 1 : 0;
  if (has("sort")) {
    const s = Number(body.sort);
    if (!Number.isInteger(s)) return { error: "Bad sort" };
    out.sort = s;
  }
  return { fields: out };
}


export function parseAddonFields(body: Record<string, any>, partial: boolean) {
  const out: Record<string, any> = {};
  const has = (k: string) => k in body;
  if (!partial || has("name")) {
    const n = str(body.name, 120);
    if (!n) return { error: "Name is required" };
    out.name = n;
  }
  if (!partial || has("priceCents")) {
    const p = Number(body.priceCents);
    if (!Number.isInteger(p) || p < 0 || p > 10_000_00) return { error: "Price looks wrong" };
    out.price_cents = p;
  }
  if (!partial || has("durationMinutes")) {
    const d = Number(body.durationMinutes);
    if (!Number.isInteger(d) || d < 0 || d > 240) return { error: "Added time must be 0 to 240 minutes" };
    out.duration_minutes = d;
  }
  if (has("active")) out.active = body.active ? 1 : 0;
  return { fields: out };
}

