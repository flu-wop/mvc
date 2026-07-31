"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function ShopPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="shop" ref={ref} className="py-24 md:py-32 relative bg-[#080808]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF1493]/30 to-transparent" />
      <div className="absolute -left-60 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#0A3D33]/20 blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-5 md:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-14 h-14 rounded-full bg-[#F4C430]/10 border border-[#F4C430]/30 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-6 h-6 text-[#F4C430]" />
          </div>
          <p className="text-[#F4C430] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            ✦ Coming Soon
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Shop the <span className="text-[#FF1493] italic">Collection</span>
          </h2>
          <p className="text-white/50 max-w-md mx-auto text-base mb-8">
            Custom press-on sets and nail care products — launching soon. Follow along
            for the drop.
          </p>
          <Link
            href="https://www.instagram.com/mvcxcreations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#F4C430]/50 text-[#F4C430] font-semibold text-sm hover:bg-[#F4C430]/10 transition-all duration-300"
          >
            @mvcxcreations ✦
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
