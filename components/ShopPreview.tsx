"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { RotateCw } from "lucide-react";

const available = [
  { name: "Press Ons", desc: "Custom and ready-to-wear luxury press-on sets. Perfectly sized, beautifully finished, and made to last." },
  { name: "Cuticle Oils", desc: "Nourishing blends that keep cuticles soft, hydrated, and healthy between sets." },
  { name: "Soak Off Kits", desc: "Everything you need for gentle, damage-free removal at home." },
  { name: "Press On Nail Extras", desc: "Glue, adhesive tabs, files, and finishing essentials to perfect your application and wear." },
];

const comingSoon = [
  "Custom Grabbers",
  "Card Grabbers",
  "Lighters",
  "Stickers",
  "Exfoliation Scrubs",
  "Nail Supplies",
  "Nail Growth Serum",
];

function ProductFlipCard({ product, accent }: { product: (typeof available)[number]; accent: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative aspect-[4/5] cursor-pointer"
      style={{ perspective: 1200 }}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-border bg-white/[0.02] flex flex-col"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className={`flex-1 m-4 mb-3 rounded-xl bg-white/5 border-2 border-dashed ${accent} flex items-center justify-center`}>
            <span className="text-grey text-xs px-4 text-center">Product photo pending</span>
          </div>
          <div className="px-5 pb-5 text-center">
            <p className="text-white font-semibold">{product.name}</p>
            <p className="flex items-center justify-center gap-1 text-gold text-[11px] font-semibold mt-1">
              <RotateCw className="w-3 h-3" /> Tap for details
            </p>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-2xl overflow-hidden border-2 ${accent} bg-charcoal p-6 flex flex-col justify-center text-center`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-white text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
            {product.name}
          </p>
          <p className="text-grey text-xs italic mb-4">Price pending</p>
          <p className="text-white/65 text-sm leading-relaxed">{product.desc}</p>
        </div>
      </motion.div>
    </div>
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
            <ProductFlipCard key={p.name} product={p} accent={i % 2 === 0 ? "border-gold/40" : "border-silver/40"} />
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
