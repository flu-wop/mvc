"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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
      {/* CSS marble background — no photo, so no risk of baked-in text */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 10%, rgba(255,255,255,0.05), transparent 60%), " +
            "radial-gradient(ellipse 70% 50% at 85% 90%, rgba(201,163,86,0.06), transparent 60%), " +
            "radial-gradient(ellipse 60% 80% at 90% 15%, rgba(255,255,255,0.04), transparent 55%), " +
            "linear-gradient(135deg, #0A0A0A 0%, #151515 40%, #0A0A0A 70%, #111111 100%)",
        }}
      >
        {/* Fine vein streaks */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, transparent 0px, transparent 60px, rgba(255,255,255,0.6) 61px, transparent 63px, transparent 140px), " +
              "repeating-linear-gradient(25deg, transparent 0px, transparent 90px, rgba(192,192,192,0.5) 91px, transparent 94px, transparent 200px)",
          }}
        />
        <div className="absolute inset-0 bg-ink/35" />
      </div>

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

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.15}
          className="text-white text-6xl sm:text-7xl md:text-8xl mb-4"
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
            className="px-8 py-4 rounded-full border border-white/30 text-white font-medium text-base transition-all duration-300 hover:border-silver hover:text-silver"
          >
            View Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
