"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import MarbleBackground from "./MarbleBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, delay },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <MarbleBackground />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 pt-20 pb-14 text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="text-white/70 text-xs font-semibold tracking-[0.3em] uppercase mb-6"
        >
          Welcome to
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.15}
          className="relative h-24 sm:h-28 md:h-32 mx-auto mb-4"
        >
          <Image
            src="/images/logo-white.png"
            alt="MVC Creations"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.3}
          className="text-gold text-sm md:text-base tracking-widest uppercase mb-10"
        >
          Where Beauty Meets Artistry
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.45}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#choose"
            className="px-8 py-4 rounded-full bg-gold text-ink font-semibold text-base transition-all duration-300 hover:bg-gold-light hover:scale-105 active:scale-95"
          >
            Choose Your Experience
          </Link>
          <Link
            href="/shop"
            className="px-8 py-4 rounded-full border border-white/30 text-white font-medium text-base transition-all duration-300 hover:border-silver hover:text-silver"
          >
            Shop Premium Online
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
