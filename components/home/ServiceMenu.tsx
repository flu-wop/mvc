import Link from "next/link";
import MenuAccordion from "@/components/MenuAccordion";
import TravelInfo from "@/components/TravelInfo";
import Reveal from "@/components/Reveal";
import { type Service } from "@/lib/service-defaults";

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

        <MenuAccordion services={services} />

        <div className="mt-10">
          <TravelInfo />
        </div>

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
