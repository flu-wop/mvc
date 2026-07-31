"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

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
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Marble background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/marble-hero.jpg"
          alt="Black marble background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-8 pt-24 pb-16 text-center">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="text-cream/70 text-xs font-semibold tracking-[0.3em] uppercase mb-6"
        >
          Welcome to
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.15}
          className="text-cream text-6xl sm:text-7xl md:text-8xl mb-4"
          style={{ fontFamily: "var(--font-script)" }}
        >
          MVC Creations
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.3}
          className="text-gold text-sm md:text-base tracking-widest uppercase mb-10"
        >
          Nails, made personal
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.45}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#booking"
            className="px-8 py-4 rounded-full bg-gold text-ink font-semibold text-base transition-all duration-300 hover:bg-gold-light hover:scale-105 active:scale-95"
          >
            Book an Appointment
          </Link>
          <Link
            href="#services"
            className="px-8 py-4 rounded-full border border-cream/30 text-cream font-medium text-base transition-all duration-300 hover:border-gold hover:text-gold"
          >
            View Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
