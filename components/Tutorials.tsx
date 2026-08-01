"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PlayCircle } from "lucide-react";

export default function Tutorials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-14 md:py-16 bg-ink border-t border-border">
      <div className="max-w-2xl mx-auto px-5 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <div className="w-11 h-11 rounded-full bg-silver/10 border border-silver/30 flex items-center justify-center mx-auto mb-5">
            <PlayCircle className="w-5 h-5 text-silver" />
          </div>
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Coming Soon</p>
          <h2 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: "var(--font-script)" }}>
            Tutorials
          </h2>
          <p className="text-grey text-sm max-w-sm mx-auto">
            Application guides, sizing tips, and how-tos — launching soon.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
