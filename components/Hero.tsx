"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1800&q=85"
          alt="Luxury press-on nails with intricate floral nail art in emerald and gold"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/50 to-obsidian/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A3D33]/60 via-transparent to-obsidian/40" />
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#FF1493]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-[#F4C430]/10 blur-[80px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pt-28 pb-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#F4C430]/30 bg-[#F4C430]/10 text-[#F4C430] text-xs font-semibold tracking-widest uppercase mb-8"
        >
          <span>✦</span>
          <span>Honduran Artistry · New Orleans Soul</span>
          <span>✦</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.92] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          <span className="block text-white">Press-On</span>
          <span className="block text-gold-shimmer italic">Perfection</span>
          <span className="block text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal mt-1">
            with Honduran Soul
          </span>
          <span className="block text-[#FF1493] text-3xl sm:text-4xl md:text-5xl font-normal italic mt-1">
            & New Orleans Flair
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light leading-relaxed"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Custom luxury press-ons, house calls & pop-ups in New Orleans.
          <br className="hidden sm:block" /> Every set is a wearable work of art.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#booking"
            className="group relative px-8 py-4 rounded-full bg-[#FF1493] text-white font-semibold text-base overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,20,147,0.5)] hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Book Your Glam Session ✦</span>
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>

          <Link
            href="/shop"
            className="group px-8 py-4 rounded-full border border-[#F4C430]/60 text-[#F4C430] font-semibold text-base transition-all duration-300 hover:bg-[#F4C430]/10 hover:border-[#F4C430] hover:scale-105 active:scale-95"
          >
            Shop Press-Ons →
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-xs tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-[#F4C430]/60 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
