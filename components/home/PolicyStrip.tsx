import Link from "next/link";
import Reveal from "@/components/Reveal";

// Short version of the booking policies. Wording matches components/Policies.tsx
// (the full policy page); keep the two in sync if Margie changes a rule.
export default function PolicyStrip({ depositLabel }: { depositLabel: string }) {
  const items = [
    {
      title: "Deposit",
      body: `A ${depositLabel} non-refundable deposit holds your time and applies toward your service total.`,
    },
    {
      title: "Reschedule or cancel",
      body: "Please give 24 hours' notice. Late cancellations are charged 50% of the total, no-shows 100%.",
    },
    {
      title: "Arrival",
      body: "Arrive 10 minutes early. There is a 10-minute grace period; after that a late fee applies and the appointment may be released.",
    },
  ];
  return (
    <section id="policies" className="py-20 md:py-24 bg-charcoal border-y border-border scroll-mt-16">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <Reveal>
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {items.map((it) => (
              <div key={it.title}>
                <p className="text-gold text-[11px] font-medium tracking-[0.3em] uppercase mb-4">{it.title}</p>
                <p className="text-white/65 text-sm leading-relaxed">{it.body}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-12">
            <Link
              href="/policies"
              className="text-xs tracking-[0.18em] uppercase text-white/50 hover:text-gold transition-colors underline underline-offset-8 decoration-white/20"
            >
              Read the full booking policies
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
