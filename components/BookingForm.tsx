"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SERVICES, DEPOSIT_CENTS, type Service } from "@/lib/services";

const inputClasses =
  "w-full px-5 py-3 rounded-2xl bg-white/5 border border-border text-white text-sm placeholder:text-grey focus:outline-none focus:border-gold/50 transition-colors";

function nextNDays(n: number): string[] {
  const days: string[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const day = new Date(d);
    day.setDate(d.getDate() + i);
    const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(
      day.getDate()
    ).padStart(2, "0")}`;
    days.push(iso);
  }
  return days;
}

function formatDayLabel(iso: string): { weekday: string; day: string } {
  const [y, mo, d] = iso.split("-").map(Number);
  const date = new Date(y, mo - 1, d);
  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
    day: String(date.getDate()),
  };
}

export default function BookingForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [service, setService] = useState<Service | null>(null);

  const days = nextNDays(21);
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

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSelectedTime(null);
    fetch(`/api/availability?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data) => {
        setSlots(data.slots || []);
        setClosed(!!data.closed);
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

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
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`h-1.5 rounded-full transition-all ${
              step >= n ? "bg-gold w-8" : "bg-white/10 w-6"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div>
          <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-2 text-center">
            Step 1
          </p>
          <h2 className="text-2xl md:text-3xl text-center mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
            Choose a service
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {SERVICES.map((s) => (
              <button
                key={s.slug}
                onClick={() => {
                  setService(s);
                  setStep(2);
                }}
                className="flex items-center gap-4 p-3 rounded-2xl border border-border bg-white/[0.02] hover:border-gold/50 transition-colors text-left"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                  <Image src={s.image} alt={s.title} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
                    {s.title}
                  </p>
                  <p className="text-grey text-xs">From ${(s.fromCents / 100).toFixed(0)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && service && (
        <div>
          <button onClick={() => setStep(1)} className="text-grey text-xs mb-6 hover:text-gold transition-colors">
            ← Change service
          </button>
          <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-2 text-center">Step 2</p>
          <h2 className="text-2xl md:text-3xl text-center mb-8" style={{ fontFamily: "var(--font-playfair)" }}>
            Pick a date &amp; time
          </h2>

          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-1 px-1">
            {days.map((iso) => {
              const { weekday, day } = formatDayLabel(iso);
              const isSunday = new Date(iso + "T00:00:00").getDay() === 0;
              return (
                <button
                  key={iso}
                  disabled={isSunday}
                  onClick={() => setSelectedDate(iso)}
                  className={`flex flex-col items-center justify-center shrink-0 w-14 h-16 rounded-xl border text-xs transition-colors ${
                    selectedDate === iso
                      ? "bg-gold text-ink border-gold"
                      : isSunday
                      ? "border-border text-white/20 cursor-not-allowed"
                      : "border-border text-white/70 hover:border-gold/50"
                  }`}
                >
                  <span className="uppercase">{weekday}</span>
                  <span className="text-base font-semibold">{day}</span>
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <div>
              {loadingSlots && <p className="text-grey text-sm text-center py-6">Loading times...</p>}
              {!loadingSlots && closed && (
                <p className="text-grey text-sm text-center py-6">Closed this day — please pick another.</p>
              )}
              {!loadingSlots && !closed && slots.length === 0 && (
                <p className="text-grey text-sm text-center py-6">No times left this day — please pick another.</p>
              )}
              {!loadingSlots && !closed && slots.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`px-3 py-2.5 rounded-full text-xs border transition-colors ${
                        selectedTime === t
                          ? "bg-gold text-ink border-gold"
                          : "border-border text-white/70 hover:border-gold/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTime && (
            <button
              onClick={() => setStep(3)}
              className="w-full mt-8 px-7 py-3.5 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold-light transition-all"
            >
              Continue
            </button>
          )}
        </div>
      )}

      {step === 3 && service && selectedDate && selectedTime && (
        <form onSubmit={handleCheckout}>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="text-grey text-xs mb-6 hover:text-gold transition-colors"
          >
            ← Change date/time
          </button>
          <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-2 text-center">Step 3</p>
          <h2 className="text-2xl md:text-3xl text-center mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
            Your details
          </h2>
          <p className="text-grey text-xs text-center mb-8">
            {service.title} · {selectedDate} at {selectedTime}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              required
              maxLength={200}
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
            />
            <input
              type="tel"
              required
              maxLength={40}
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClasses}
            />
          </div>
          <input
            type="email"
            required
            maxLength={200}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClasses} mb-4`}
          />
          <textarea
            maxLength={1000}
            rows={3}
            placeholder="Anything I should know? (nail length, inspo, allergies, etc.)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${inputClasses} resize-none mb-4`}
          />

          <div className="rounded-2xl border border-border bg-white/[0.02] p-4 mb-4 text-xs text-white/60">
            A ${(DEPOSIT_CENTS / 100).toFixed(0)} non-refundable deposit reserves this slot and applies toward
            your service total (from ${(service.fromCents / 100).toFixed(0)}). Full policies at checkout and
            on the FAQ page.
          </div>

          {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full px-7 py-3.5 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold-light transition-all disabled:opacity-60"
          >
            {status === "loading" ? "Redirecting to payment..." : `Pay $${(DEPOSIT_CENTS / 100).toFixed(0)} Deposit`}
          </button>
        </form>
      )}
    </div>
  );
}
