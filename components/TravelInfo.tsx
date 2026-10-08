import { TRAVEL_TIERS, formatPrice } from "@/lib/service-defaults";
import { BUSINESS } from "@/lib/site";

// Static explainer for mobile appointments. Shown on the homepage menu and in the booking flow.
export default function TravelInfo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`rounded-2xl border border-gold/25 bg-white/[0.02] ${compact ? "p-4" : "p-6"}`}>
      <p className="text-gold text-[11px] font-medium tracking-[0.28em] uppercase mb-3">Mobile appointments</p>
      <p className="text-white/60 text-xs leading-relaxed mb-4">
        Margie can come to you. The travel fee is separate from your service and deposit, and is non-refundable.
      </p>
      <ul className="text-sm space-y-2 mb-4">
        {TRAVEL_TIERS.map((t) => (
          <li key={t.key} className="flex justify-between gap-4 text-white/80">
            <span>{t.label}</span>
            <span className="text-white">{formatPrice(t.feeCents)}{t.key === "21plus" ? "+" : ""}</span>
          </li>
        ))}
      </ul>
      <p className="text-white/45 text-xs leading-relaxed">
        Beyond 20 miles adds $2 per mile, confirmed before your appointment. Out-of-state travel is a $300 retainer, limited and by
        advance request only: text {BUSINESS.phone}. Appointments outside regular hours carry a $50 fee and are arranged directly.
      </p>
    </div>
  );
}
