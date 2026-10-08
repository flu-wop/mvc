import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { PORTFOLIO } from "@/lib/portfolio";
import { BUSINESS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Portfolio | MVC Creations",
  description: "Recent custom nail sets by Margie: acrylics, Gel-X, nail art and natural nail care in Kenner, LA.",
  alternates: { canonical: "/portfolio" },
};

const SHAPES = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[4/5]", "aspect-[3/4]"];

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="text-center mb-14 md:mb-20">
            <p className="text-gold text-[11px] font-medium tracking-[0.32em] uppercase mb-5">Recent sets</p>
            <h1 className="text-6xl md:text-8xl font-light text-white mb-6" style={{ fontFamily: "var(--font-display)" }}>
              The work
            </h1>
            <p className="text-white/50 text-sm max-w-sm mx-auto">
              Every set is custom. Tap one to book that style.
            </p>
          </div>

          <div className="columns-2 md:columns-3 gap-3 md:gap-5">
            {PORTFOLIO.map((set, i) => (
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
                      loading={i < 2 ? "eager" : "lazy"}
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

          <div className="text-center mt-20">
            <p className="text-white/50 text-sm mb-6">
              More daily on{" "}
              <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light">
                {BUSINESS.instagramHandle}
              </a>
            </p>
            <Link
              href="/book"
              className="inline-flex px-12 py-4 rounded-full bg-gold text-ink text-sm font-semibold tracking-[0.22em] uppercase hover:bg-gold-light transition-colors"
            >
              Book
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
