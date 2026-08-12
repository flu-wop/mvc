"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function MarbleBackground({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  // Subtle parallax: background drifts slower than the page scrolls.
  const y = useTransform(scrollY, [0, 800], [0, 120]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden bg-ink ${className}`}>
      <motion.div className="absolute inset-0" style={{ y }}>
        <motion.div
          className="absolute inset-[-4%]"
          animate={{ scale: [1.08, 1.15, 1.08], x: ["0%", "-1.5%", "0%"] }}
          transition={{ duration: 42, ease: "easeInOut", repeat: Infinity }}
        >
          <Image
            src="/images/marble-hero.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </motion.div>

      {/* Warm gold catch-light + gentle vignette on top */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 80% 90%, rgba(201,163,86,0.10), transparent 60%), " +
            "radial-gradient(ellipse 60% 50% at 15% 10%, rgba(255,255,255,0.05), transparent 55%)",
        }}
      />
      {/* Darken for text legibility over the bright veining */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.35) 35%, rgba(10,10,10,0.55) 100%)",
        }}
      />
    </div>
  );
}
