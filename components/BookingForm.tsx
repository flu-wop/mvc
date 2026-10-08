"use client";

import { useEffect, useState } from "react";
import BookingCalendar from "./BookingCalendar";
import MenuAccordion from "./MenuAccordion";
import TravelInfo from "./TravelInfo";
import { DEPOSIT_CENTS, TRAVEL_TIERS, formatDuration, formatPrice, type Addon, type Service, type TravelTierKey } from "@/lib/service-defaults";

const inputClasses =
  "w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-border text-white text-sm placeholder:text-grey focus:outline-none focus:border-gold/60 transition-colors";

// Calendar-day math done on plain y/m/d so the browser's timezone never shifts
// a date. `todayIso` comes from the server in the shop's timezone.
function dayParts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return {
    weekdayNum: dt.getUTCDay(),
    weekday: dt.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
    day: String(d),
    month: dt.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
    long: dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }),
  };
}

export default function BookingForm({
  services,
  addons,
  addonMap,
  initialSlug,
  todayIso,
  closedWeekdays,
}: {
  services: Service[];
  addons: Addon[];
  addonMap: Record<string, number[]>;
  initialSlug?: string;
  todayIso: string;
  closedWeekdays: number[];
}) {
  const preselected = services.find((s) => s.slug === initialSlug) ?? null;
  // 1 service, 2 options (add-ons, salon or mobile), 3 date/time, 4 details
  const [step, setStep] = useState<1 | 2 | 3 | 4>(preselected ? 2 : 1);
  const [service, setService] = useState<Service | null>(preselected);
  const [addonIds, setAddonIds] = useState<number[]>([]);
  const [mobile, setMobile] = useState(false);
  const [tier, setTier] = useState<TravelTierKey>("within15");
  const [address, setAddress] = useState("");

  const offered = service ? addons.filter((a) => (addonMap[service.slug] ?? []).includes(a.id)) : [];
  const chosen = offered.filter((a) => addonIds.includes(a.id));
  const tierInfo = TRAVEL_TIERS.find((t) => t.key === tier)!;
  const totalMinutes = (service?.durationMinutes ?? 0) + chosen.reduce((n, a) => n + a.durationMinutes, 0);
  const estimate = (service?.fromCents ?? 0) + chosen.reduce((n, a) => n + a.priceCents, 0);
  const travelFee = mobile ? tierInfo.feeCents : 0;
  const addonsParam = addonIds.length ? `&addons=${addonIds.join(",")}` : "";

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [closed, setClosed] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0); // bump to re-fetch times after a 409

  useEffect(() => {
    if (!selectedDate || !service) return;
    let cancelled = false;
    setLoadingSlots(true);
    setSelectedTime(null);
    fetch(`/api/availability?date=${selectedDate}&service=${encodeURIComponent(service.slug)}${addonsParam}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setSlots(data.slots || []);
        setClosed(!!data.closed);
      })
      .catch(() => {
        if (cancelled) return;
        setSlots([]);
        setClosed(false);
      })
      .finally(() => !cancelled && setLoadingSlots(false));
    return () => {
      cancelled = true;
    };
  }, [selectedDate, service, refresh, addonsParam]);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!service || !selectedDate || !selectedTime) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/checkout/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          serviceSlug: service.slug,
          addonIds,
          travel: mobile ? { tier, address } : null,
          eventDate: selectedDate,
          eventTime: selectedTime,
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        if (res.status === 409) {
          // Slot vanished: send them back to pick another.
          setStep(3);
          setSelectedTime(null);
          setRefresh((n) => n + 1);
        }
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  const deposit = service?.depositCents ?? DEPOSIT_CENTS;
  const pickService = (s: Service) => {
    setService(s);
    setAddonIds([]);
    setSelectedDate(null);
    setSelectedTime(null);
    setStep(2);
  };
  const optionsInvalid = mobile && address.trim().length < 8;

  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      <div className="flex items-center justify-center gap-2 mb-10" aria-hidden>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className={`h-1 rounded-full transition-all ${step >= n ? "bg-gold w-10" : "bg-white/10 w-6"}`} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <p className="text-gold text-[11px] font-medium tracking-[0.3em] uppercase mb-3 text-center">Step 1</p>
          <h2 className="text-4xl text-center mb-8 font-light" style={{ fontFamily: "var(--font-display)" }}>
            Choose a service
          </h2>
          <MenuAccordion services={services} onSelect={pickService} defaultOpen={services[0]?.category} />
        </div>
      )}

      {step === 2 && service && (
        <div>
          <button onClick={() => setStep(1)} className="text-grey text-xs mb-6 hover:text-gold transition-colors py-2">
            ← {service.title} · change service
          </button>
          <p className="text-gold text-[11px] font-medium tracking-[0.3em] uppercase mb-3 text-center">Step 2</p>
          <h2 className="text-4xl text-center mb-8 font-light" style={{ fontFamily: "var(--font-display)" }}>
            Make it yours
          </h2>

          {offered.length > 0 && (
            <div className="mb-8">
              <p className="text-white/70 text-sm mb-3">Add-ons <span className="text-white/35">(optional)</span></p>
              <ul className="rounded-2xl border border-border divide-y divide-white/5 overflow-hidden">
                {offered.map((a) => {
                  const on = addonIds.includes(a.id);
                  return (
                    <li key={a.id}>
                      <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.03]">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => setAddonIds(on ? addonIds.filter((x) => x !== a.id) : [...addonIds, a.id])}
                          className="accent-[#C9A96E] w-4 h-4"
                        />
                        <span className="flex-1 text-sm text-white/85">{a.name}</span>
                        <span className="text-xs text-silver whitespace-nowrap">
                          {a.priceCents ? `+${formatPrice(a.priceCents)}` : "Free"}
                          {a.durationMinutes ? ` · ${a.durationMinutes} min` : ""}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <p className="text-white/70 text-sm mb-3">Where?</p>
            <div className="grid grid-cols-2 gap-2">
              {[false, true].map((m) => (
                <button
                  key={String(m)}
                  type="button"
                  onClick={() => setMobile(m)}
                  className={`px-4 py-3 rounded-full text-xs border transition-colors ${mobile === m ? "bg-gold text-ink border-gold" : "border-border text-white/70 hover:border-gold/50"}`}
                >
                  {m ? "Mobile (Margie travels)" : "At the salon"}
                </button>
              ))}
            </div>
          </div>

          {mobile && (
            <div className="mb-6 space-y-3">
              <label className="block text-xs text-white/60">How far are you from Kenner, LA?</label>
              <select value={tier} onChange={(e) => setTier(e.target.value as TravelTierKey)} className={inputClasses}>
                {TRAVEL_TIERS.map((t) => (
                  <option key={t.key} value={t.key} className="bg-ink">
                    {t.label} — {formatPrice(t.feeCents)}{t.key === "21plus" ? "+" : ""}
                  </option>
                ))}
              </select>
              {tierInfo.note && <p className="text-white/45 text-xs">{tierInfo.note}</p>}
              <input
                type="text"
                maxLength={300}
                autoComplete="street-address"
                placeholder="Full address for the appointment"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputClasses}
              />
              <p className="text-white/45 text-xs leading-relaxed">
                The {formatPrice(tierInfo.feeCents)} travel fee is charged now with your deposit. It is separate from your service and non-refundable.
              </p>
            </div>
          )}

          <div className="rounded-2xl border border-gold/25 bg-white/[0.02] p-4 mb-6 text-sm">
            <div className="flex justify-between text-white/70"><span>{service.title}</span><span>from {formatPrice(service.fromCents)}</span></div>
            {chosen.map((a) => (
              <div key={a.id} className="flex justify-between text-white/50 text-xs mt-1"><span>{a.name}</span><span>+{formatPrice(a.priceCents)}</span></div>
            ))}
            {mobile && <div className="flex justify-between text-white/50 text-xs mt-1"><span>Travel ({tierInfo.label})</span><span>{formatPrice(travelFee)}{tier === "21plus" ? "+" : ""}</span></div>}
            <div className="flex justify-between text-white mt-3 pt-3 border-t border-white/10">
              <span>Estimated total</span><span>from {formatPrice(estimate + travelFee)}</span>
            </div>
            <p className="text-white/40 text-xs mt-2">About {formatDuration(totalMinutes)}. Final price is confirmed at your appointment.</p>
          </div>

          <button
            onClick={() => setStep(3)}
            disabled={optionsInvalid}
            className="w-full px-7 py-4 rounded-full bg-gold text-ink text-xs font-semibold tracking-[0.22em] uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {optionsInvalid ? "Enter your address to continue" : "Continue"}
          </button>
          <div className="mt-8"><TravelInfo compact /></div>
        </div>
      )}

      {step === 3 && service && (
        <div>
          <button onClick={() => setStep(2)} className="text-grey text-xs mb-6 hover:text-gold transition-colors py-2">
            ← Change options
          </button>
          <p className="text-gold text-[11px] font-medium tracking-[0.3em] uppercase mb-3 text-center">Step 3</p>
          <h2 className="text-4xl text-center mb-8 font-light" style={{ fontFamily: "var(--font-display)" }}>
            Pick a date &amp; time
          </h2>

          <BookingCalendar
            todayIso={todayIso}
            serviceSlug={service.slug}
            addons={addonIds}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            closedWeekdays={closedWeekdays}
          />

          {selectedDate && (
            <div aria-live="polite">
              <p className="text-white/50 text-xs text-center mb-4">{dayParts(selectedDate).long}</p>
              {loadingSlots && <p className="text-grey text-sm text-center py-6">Loading times...</p>}
              {!loadingSlots && closed && <p className="text-grey text-sm text-center py-6">Not available this day. Please pick another.</p>}
              {!loadingSlots && !closed && slots.length === 0 && (
                <p className="text-grey text-sm text-center py-6">No times left this day. Please pick another.</p>
              )}
              {!loadingSlots && !closed && slots.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`px-3 py-3 rounded-full text-xs border transition-colors ${
                        selectedTime === t ? "bg-gold text-ink border-gold" : "border-border text-white/70 hover:border-gold/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && step === 3 && <p className="text-red-400 text-xs text-center mt-4">{error}</p>}

          {selectedTime && (
            <button
              onClick={() => setStep(4)}
              className="w-full mt-8 px-7 py-4 rounded-full bg-gold text-ink text-xs font-semibold tracking-[0.22em] uppercase hover:bg-gold-light transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      )}

      {step === 4 && service && selectedDate && selectedTime && (
        <form onSubmit={handleCheckout}>
          <button type="button" onClick={() => setStep(3)} className="text-grey text-xs mb-6 hover:text-gold transition-colors py-2">
            ← Change date / time
          </button>
          <p className="text-gold text-[11px] font-medium tracking-[0.3em] uppercase mb-3 text-center">Step 4</p>
          <h2 className="text-4xl text-center mb-2 font-light" style={{ fontFamily: "var(--font-display)" }}>
            Your details
          </h2>
          <p className="text-grey text-xs text-center mb-8">
            {service.title}{chosen.length ? ` + ${chosen.length} add-on${chosen.length > 1 ? "s" : ""}` : ""} · {dayParts(selectedDate).long} at {selectedTime}{mobile ? " · mobile" : ""}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input type="text" required maxLength={200} autoComplete="name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} />
            <input type="tel" required maxLength={40} autoComplete="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClasses} />
          </div>
          <input type="email" required maxLength={200} autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClasses} mb-4`} />
          <textarea
            maxLength={1000}
            rows={3}
            placeholder="Anything I should know? (nail length, inspo, allergies, etc.)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputClasses} resize-none mb-4`}
          />

          <div className="rounded-2xl border border-gold/25 bg-white/[0.02] p-5 mb-4 text-xs text-white/60 leading-relaxed">
            A {formatPrice(deposit)} non-refundable deposit holds this time and applies toward your total (from{" "}
            {formatPrice(estimate)}).{mobile ? ` The ${formatPrice(travelFee)} travel fee is charged now too and is non-refundable.` : ""} Please give 24 hours&apos; notice to reschedule or cancel; late cancellations are
            charged 50% and no-shows 100%.{" "}
            <a href="/policies" target="_blank" rel="noopener noreferrer" className="text-gold underline underline-offset-4">
              Full policies
            </a>
            .
          </div>

          {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full px-7 py-4 rounded-full bg-gold text-ink text-xs font-semibold tracking-[0.22em] uppercase hover:bg-gold-light transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "Redirecting to payment..." : `Pay ${formatPrice(deposit + travelFee)}${mobile ? " (deposit + travel)" : " deposit"}`}
          </button>
        </form>
      )}
    </div>
  );
}
