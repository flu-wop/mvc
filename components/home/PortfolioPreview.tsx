import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { PORTFOLIO } from "@/lib/portfolio";

// Asymmetric contact sheet: tall and wide frames alternate.
const SHAPES = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[4/5]", "aspect-[3/4]"];

export default function PortfolioPreview({ limit = 8 }: { limit?: number }) {
  const sets = PORTFOLIO.slice(0, limit);
  return (
    <section id="portfolio" className="py-24 md:py-32 bg-ink scroll-mt-16">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="text-gold text-[11px] font-medium tracking-[0.32em] uppercase mb-5">Recent sets</p>
            <h2 className="text-5xl md:text-7xl font-light text-white" style={{ fontFamily: "var(--font-display)" }}>
              The work
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="text-xs tracking-[0.18em] uppercase text-white/60 hover:text-gold transition-colors underline underline-offset-8 decoration-white/20 w-fit"
          >
            See the full portfolio
          </Link>
        </Reveal>

        <div className="columns-2 md:columns-3 gap-3 md:gap-5 [column-fill:_balance]">
          {sets.map((set, i) => (
            <Reveal key={set.id} delay={Math.min((i % 3) * 0.05, 0.15)} className="break-inside-avoid mb-3 md:mb-5">
              <Link
                href={`/book?service=${set.serviceSlug}`}
                className="group relative block overflow-hidden rounded-sm border border-transparent hover:border-gold/60 transition-colors"
              >
                <div className={`relative ${SHAPES[i % SHAPES.length]}`}>
                  <Image
                    src={set.image}
                    alt={set.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ink/90 to-transparent">
                    <p className="text-white text-lg leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                      {set.title}
                    </p>
                    <p className="text-gold text-[10px] tracking-[0.2em] uppercase mt-1 opacity-80 group-hover:opacity-100">
                      Book this set
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
