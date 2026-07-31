"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function ShopPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="shop" ref={ref} className="py-14 md:py-16 bg-charcoal border-t border-border">
      <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-5 h-5 text-gold" />
          </div>
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Coming Soon
          </p>
          <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: "var(--font-script)" }}>
            Shop the Collection
          </h2>
          <p className="text-white/60 text-base max-w-md mx-auto mb-8">
            Custom press-on sets and nail care products — launching soon. Follow along for
            the drop.
          </p>
          <Link
            href="https://www.instagram.com/mvcxcreations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-gold/40 text-gold text-sm font-semibold hover:bg-gold/10 transition-all duration-300"
          >
            @mvcxcreations →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
