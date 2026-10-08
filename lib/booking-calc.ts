import { getAddons, getService, getServiceAddonMap } from "./services";
import { TRAVEL_TIERS, type Addon, type Service, type TravelTierKey } from "./service-defaults";
import type { Timing } from "./availability";

export const MAX_ADDONS = 30;

export type BookingCalc = {
  service: Service;
  addons: Addon[];
  timing: Timing;
  travel: { tier: TravelTierKey; label: string; feeCents: number; note: string } | null;
  totalFromCents: number; // service + add-ons + travel (estimate; final price confirmed in person)
};

export type CalcError = { error: string };

export function parseAddonIds(raw: unknown): number[] | null {
  if (raw == null || raw === "") return [];
  const list = Array.isArray(raw) ? raw : String(raw).split(",");
  const ids: number[] = [];
  for (const v of list) {
    const n = Number(v);
    if (!Number.isInteger(n) || n <= 0) return null;
    ids.push(n);
  }
  return ids;
}

// Everything price- or time-related is derived here from the database, never from the browser.
export async function calcBooking(input: {
  serviceSlug: unknown;
  addonIds?: unknown;
  travelTier?: unknown;
}): Promise<BookingCalc | CalcError> {
  const service = await getService(input.serviceSlug);
  if (!service) return { error: "Invalid service" };

  const ids = parseAddonIds(input.addonIds);
  if (!ids || new Set(ids).size !== ids.length || ids.length > MAX_ADDONS) return { error: "Invalid add-ons" };

  let addons: Addon[] = [];
  if (ids.length) {
    const [all, map] = await Promise.all([getAddons(), getServiceAddonMap()]);
    const allowed = new Set(map[service.slug] ?? []);
    for (const id of ids) {
      const a = all.find((x) => x.id === id);
      if (!a || !allowed.has(id)) return { error: "One of those add-ons isn't available for this service" };
      addons.push(a);
    }
  }

  let travel: BookingCalc["travel"] = null;
  if (input.travelTier != null && input.travelTier !== "") {
    const t = TRAVEL_TIERS.find((x) => x.key === input.travelTier);
    if (!t) return { error: "Invalid travel option" };
    travel = { tier: t.key, label: t.label, feeCents: t.feeCents, note: t.note };
  }

  const duration = service.durationMinutes + addons.reduce((n, a) => n + a.durationMinutes, 0);
  const totalFromCents =
    service.fromCents + addons.reduce((n, a) => n + a.priceCents, 0) + (travel?.feeCents ?? 0);
  return { service, addons, timing: { duration, padding: service.paddingMinutes }, travel, totalFromCents };
}

export function isCalcError(x: BookingCalc | CalcError): x is CalcError {
  return "error" in x;
}
