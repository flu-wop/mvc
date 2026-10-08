"use client";

import { useEffect, useMemo, useState } from "react";
import { DEPOSIT_CENTS, formatDuration, formatPrice, type Service } from "@/lib/service-defaults";

const inputClasses =
  "w-full px-5 py-3.5 rounded-2xl bg-white/5 border border-border text-white text-sm placeholder:text-grey focus:outline-none focus:border-gold/60 transition-colors";

// Calendar-day math done on plain y/m/d so the browser's timezone never shifts
// a date. `todayIso` comes from the server in the shop's timezone.
function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

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
  initialSlug,
  todayIso,
  closedWeekdays,
}: {
  services: Service[];
  initialSlug?: string;
  todayIso: string;
  closedWeekdays: number[];
}) {
  const preselected = services.find((s) => s.slug === initialSlug) ?? null;
  const [step, setStep] = useState<1 | 2 | 3>(preselected ? 2 : 1);
  const [service, setService] = useState<Service | null>(preselected);

  const days = useMemo(() => Array.from({ length: 28 }, (_, i) => addDays(todayIso, i)), [todayIso]);
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
    fetch(`/api/availability?date=${selectedDate}&service=${encodeURIComponent(service.slug)}`)
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
  }, [selectedDate, service, refresh]);

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
          setStep(2);
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

  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      <div className="flex items-center justify-center gap-2 mb-10" aria-hidden>
        {[1, 2, 3].map((n) => (
          <div key={n} className={`h-1 rounded-full transition-all ${step >= n ? "bg-gold w-10" : "bg-white/10 w-6"}`} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <p className="text-gold text-[11px] font-medium tracking-[0.3em] uppercase mb-3 text-center">Step 1</p>
          <h2 className="text-4xl text-center mb-8 font-light" style={{ fontFamily: "var(--font-display)" }}>
            Choose a service
          </h2>
          <ul className="border-t border-gold/25">
            {services.map((s) => (
              <li key={s.slug} className="border-b border-gold/25">
                <button
                  onClick={() => {
                    setService(s);
                    setSelectedDate(null);
                    setStep(2);
                  }}
                  className="group w-full text-left py-6 flex items-baseline justify-between gap-5"
                >
                  <span>
                    <span className="block text-2xl text-white group-hover:text-gold transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                      {s.title}
                    </span>
                    <span className="block text-white/45 text-xs mt-1 max-w-xs">{s.blurb}</span>
                  </span>
                  <span className="text-xs tracking-[0.1em] text-silver whitespace-nowrap text-right">
                    {formatDuration(s.durationMinutes)}
                    <br />
                    <span className="text-white">from {formatPrice(s.fromCents)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === 2 && service && (
        <div>
          <button onClick={() => setStep(1)} className="text-grey text-xs mb-6 hover:text-gold transition-colors py-2">
            ← {service.title} · change service
          </button>
          <p className="text-gold text-[11px] font-medium tracking-[0.3em] uppercase mb-3 text-center">Step 2</p>
          <h2 className="text-4xl text-center mb-8 font-light" style={{ fontFamily: "var(--font-display)" }}>
            Pick a date &amp; time
          </h2>

          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-1 px-1">
            {days.map((iso) => {
              const p = dayParts(iso);
              const off = closedWeekdays.includes(p.weekdayNum);
              return (
                <button
                  key={iso}
                  disabled={off}
                  onClick={() => setSelectedDate(iso)}
                  className={`flex flex-col items-center justify-center shrink-0 w-14 h-[68px] rounded-xl border text-xs transition-colors ${
                    selectedDate === iso
                      ? "bg-gold text-ink border-gold"
                      : off
                      ? "border-border text-white/20 cursor-not-allowed"
                      : "border-border text-white/70 hover:border-gold/50"
                  }`}
                >
                  <span className="uppercase text-[10px] tracking-wider">{p.weekday}</span>
                  <span className="text-base font-semibold">{p.day}</span>
                  <span className="text-[9px] uppercase opacity-60">{p.month}</span>
                </button>
              );
            })}
          </div>

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

          {error && step === 2 && <p className="text-red-400 text-xs text-center mt-4">{error}</p>}

          {selectedTime && (
            <button
              onClick={() => setStep(3)}
              className="w-full mt-8 px-7 py-4 rounded-full bg-gold text-ink text-xs font-semibold tracking-[0.22em] uppercase hover:bg-gold-light transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      )}

      {step === 3 && service && selectedDate && selectedTime && (
        <form onSubmit={handleCheckout}>
          <button type="button" onClick={() => setStep(2)} className="text-grey text-xs mb-6 hover:text-gold transition-colors py-2">
            ← Change date / time
          </button>
          <p className="text-gold text-[11px] font-medium tracking-[0.3em] uppercase mb-3 text-center">Step 3</p>
          <h2 className="text-4xl text-center mb-2 font-light" style={{ fontFamily: "var(--font-display)" }}>
            Your details
          </h2>
          <p className="text-grey text-xs text-center mb-8">
            {service.title} · {dayParts(selectedDate).long} at {selectedTime}
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
            {formatPrice(service.fromCents)}). Please give 24 hours&apos; notice to reschedule or cancel; late cancellations are
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
            {status === "loading" ? "Redirecting to payment..." : `Pay ${formatPrice(deposit)} deposit`}
          </button>
        </form>
      )}
    </div>
  );
}
