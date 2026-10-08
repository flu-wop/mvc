import Link from "next/link";
import Reveal from "@/components/Reveal";
import { formatDuration, formatPrice, type Service } from "@/lib/service-defaults";

// Reads like a spa menu: name on the left, time and price on the right,
// one line underneath. No cards, no icons.
export default function ServiceMenu({ services, depositLabel }: { services: Service[]; depositLabel: string }) {
  return (
    <section id="services" className="py-24 md:py-32 bg-ink scroll-mt-16">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <Reveal className="text-center mb-14 md:mb-20">
          <p className="text-gold text-[11px] font-medium tracking-[0.32em] uppercase mb-5">The menu</p>
          <h2 className="text-5xl md:text-7xl font-light text-white" style={{ fontFamily: "var(--font-display)" }}>
            Services
          </h2>
        </Reveal>

        <ul className="border-t border-gold/25">
          {services.map((s, i) => (
            <li key={s.slug} className="border-b border-gold/25">
              <Reveal delay={Math.min(i * 0.04, 0.2)}>
                <Link
                  href={`/book?service=${s.slug}`}
                  className="group block py-7 md:py-8 focus-visible:outline-none focus-visible:bg-white/[0.03]"
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <h3
                      className="text-3xl md:text-4xl font-light text-white group-hover:text-gold transition-colors"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-xs md:text-sm tracking-[0.12em] text-silver whitespace-nowrap">
                      {formatDuration(s.durationMinutes)} <span className="text-gold/60 mx-1.5">·</span>
                      <span className="text-white">from {formatPrice(s.fromCents)}</span>
                    </p>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mt-2 max-w-md">{s.blurb}</p>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="text-center mt-12">
          <p className="text-white/45 text-xs leading-relaxed max-w-md mx-auto mb-8">
            Prices are starting rates. Final pricing is confirmed based on length, complexity and add-ons. A{" "}
            {depositLabel} deposit holds your time and applies to your total.
          </p>
          <Link
            href="/book"
            className="inline-flex px-12 py-4 rounded-full bg-gold text-ink text-sm font-semibold tracking-[0.22em] uppercase hover:bg-gold-light transition-colors"
          >
            Book
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
