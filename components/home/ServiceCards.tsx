"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { formatDuration, formatPrice, groupByCategory, type Service } from "@/lib/service-defaults";
import { CATEGORY_IMAGES, DEFAULT_CATEGORY_IMAGE } from "@/lib/category-images";
import TravelInfo from "@/components/TravelInfo";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } };
const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function ServiceCards({ services, depositLabel }: { services: Service[]; depositLabel: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const groups = groupByCategory(services);
  const [open, setOpen] = useState<string | null>(null);
  const current = groups.find((g) => g.category === open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section id="services" ref={ref} className="py-14 md:py-20 bg-ink scroll-mt-16">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Our</p>
          <h2 className="text-5xl md:text-6xl">Services</h2>
          <p className="text-grey text-xs mt-3">Tap a card to see the full menu</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5"
        >
          {groups.map((g, i) => {
            const from = Math.min(...g.items.map((s) => s.fromCents));
            const accent = i % 2 === 0 ? "border-gold/40" : "border-silver/40";
            return (
              <motion.button
                key={g.category}
                type="button"
                variants={cardVariant}
                onClick={() => setOpen(g.category)}
                className="relative aspect-[2/3] rounded-2xl border border-border bg-white/[0.02] overflow-hidden flex flex-col items-center pt-4 px-3 pb-4 md:pt-6 md:px-5 md:pb-5 text-center hover:border-gold/40 transition-colors"
                aria-haspopup="dialog"
              >
                <div className={`relative w-full flex-1 overflow-hidden rounded-t-[999px] border-2 mb-3 ${accent}`}>
                  <Image
                    src={CATEGORY_IMAGES[g.category] ?? DEFAULT_CATEGORY_IMAGE}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <p className="text-white text-sm md:text-base font-semibold leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                  {g.category}
                </p>
                <p className="text-grey text-[11px] md:text-xs mb-1">
                  {g.items.length} services · from {formatPrice(from)}
                </p>
                <p className="flex items-center justify-center gap-1 text-gold text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3" /> Tap for menu
                </p>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="max-w-xl mx-auto mt-12">
          <TravelInfo />
        </div>

        <p className="text-center text-grey text-xs mt-8 max-w-md mx-auto leading-relaxed">
          Prices shown are starting rates. Final pricing is confirmed at booking based on length, complexity, and add-ons. A{" "}
          {depositLabel} deposit holds your time and applies to your total.
        </p>
        <p className="text-center mt-8">
          <Link
            href="/book"
            className="inline-flex px-12 py-4 rounded-full bg-gold text-ink text-sm font-semibold tracking-[0.22em] uppercase hover:bg-gold-light transition-colors"
          >
            Book
          </Link>
        </p>
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={current.category}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full md:max-w-xl max-h-[85vh] overflow-y-auto rounded-t-3xl md:rounded-3xl border border-border bg-charcoal p-6 md:p-8"
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <h3 className="text-3xl text-white" style={{ fontFamily: "var(--font-display)" }}>
                  {current.category}
                </h3>
                <button onClick={() => setOpen(null)} aria-label="Close" className="p-2 -m-2 text-grey hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <ul>
                {current.items.map((s) => (
                  <li key={s.slug} className="border-t border-white/10">
                    <Link href={`/book?service=${s.slug}`} className="group flex items-start justify-between gap-4 py-4">
                      <span className="min-w-0 flex-1">
                        <span className="block text-white group-hover:text-gold transition-colors">{s.title}</span>
                        {s.blurb && <span className="block text-white/45 text-xs leading-relaxed mt-1">{s.blurb}</span>}
                      </span>
                      <span className="text-xs text-silver whitespace-nowrap text-right">
                        {formatDuration(s.durationMinutes)}
                        <br />
                        <span className="text-white">{s.fromCents ? `from ${formatPrice(s.fromCents)}` : "Free"}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
