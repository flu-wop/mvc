"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const available = [
  { name: "Press Ons", desc: "Custom and ready-to-wear luxury press-on sets. Perfectly sized, beautifully finished, and made to last." },
  { name: "Cuticle Oils", desc: "Nourishing blends that keep cuticles soft, hydrated, and healthy between sets." },
  { name: "Soak Off Kits", desc: "Everything you need for gentle, damage-free removal at home." },
  { name: "Press On Nail Extras", desc: "Glue, adhesive tabs, files, and finishing essentials to perfect your application and wear." },
];

const comingSoon = [
  "Custom Card Grabbers",
  "Card Grabbers",
  "Lighters",
  "Stickers",
  "Exfoliation Scrubs",
  "Nail Supplies",
  "Nail Growth Serum",
];

function ProductRevealCard({ product, accent }: { product: (typeof available)[number]; accent: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="relative aspect-[2/3] cursor-pointer rounded-2xl border border-border bg-white/[0.02] overflow-hidden flex flex-col"
      style={{ perspective: 1000 }}
      onClick={() => setOpen((o) => !o)}
      whileHover={{ rotateX: -3, rotateY: 3 }}
      animate={{ rotateX: open ? -4 : 0, rotateY: open ? 4 : 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`relative flex-1 m-4 mb-3 rounded-xl bg-white/5 border-2 border-dashed ${accent} flex items-center justify-center overflow-hidden`}>
        <span className="text-grey text-xs px-4 text-center">Product photo pending</span>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-end justify-center p-4"
              style={{
                backdropFilter: "blur(14px)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 35%)",
                maskImage: "linear-gradient(to bottom, transparent, black 35%)",
                background:
                  "linear-gradient(to bottom, transparent, rgba(10,10,10,0.75) 45%, rgba(10,10,10,0.92) 100%)",
              }}
            >
              <p className="text-white/85 text-xs leading-relaxed text-center">{product.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="px-5 pb-5 text-center">
        <p className="text-white font-semibold">{product.name}</p>
        <p className="text-grey text-xs italic mb-1">Price pending</p>
        <p className="flex items-center justify-center gap-1 text-gold text-[11px] font-semibold">
          <Sparkles className="w-3 h-3" /> {open ? "Tap to close" : "Tap for details"}
        </p>
      </div>
    </motion.div>
  );
}

export default function ShopPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="shop" ref={ref} className="py-14 md:py-16 bg-charcoal border-t border-border">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div className="text-center mb-12">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Shop</p>
          <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "var(--font-script)" }}>
            Shop the Collection
          </h2>
          <p className="text-grey text-xs mt-3">Tap a card to see full details</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-14"
        >
          {available.map((p, i) => (
            <ProductRevealCard key={p.name} product={p} accent={i % 2 === 0 ? "border-gold/40" : "border-silver/40"} />
          ))}
        </motion.div>

        <div className="text-center mb-6">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase">Coming Soon</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {comingSoon.map((item) => (
            <span
              key={item}
              className="px-4 py-2 rounded-full border border-border text-grey text-xs"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="https://www.instagram.com/mvcxcreations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-gold/40 text-gold text-sm font-semibold hover:bg-gold/10 transition-all duration-300"
          >
            Follow @mvcxcreations for drops →
          </Link>
        </div>
      </div>
    </section>
  );
}
