"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const available = [
  { name: "Press-Ons", desc: "Custom and ready-to-wear luxury press-on sets. Perfectly sized, beautifully finished, and made to last." },
  { name: "Cuticle Oils", desc: "Nourishing blends that keep cuticles soft, hydrated, and healthy between sets." },
  { name: "Soak Off Kits", desc: "Everything you need for gentle, damage-free removal at home." },
  { name: "Press-On Nail Extras", desc: "Glue, adhesive tabs, files, and finishing essentials to perfect your application and wear." },
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
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="grid sm:grid-cols-2 gap-4 mb-14"
        >
          {available.map((p) => (
            <div key={p.name} className="rounded-2xl border border-border bg-white/[0.02] p-6">
              <div className="aspect-square rounded-xl bg-white/5 border border-dashed border-border flex items-center justify-center mb-4">
                <span className="text-grey text-xs">Product photo pending</span>
              </div>
              <p className="text-white font-semibold mb-1">{p.name}</p>
              <p className="text-grey text-sm leading-relaxed mb-3">{p.desc}</p>
              <p className="text-grey text-xs italic">Price pending</p>
            </div>
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
