"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function AboutTeaser() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden bg-[#0C0C0C]"
    >
      {/* Background emerald accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#F4C430] via-[#FF1493] to-[#0A3D33]" />
      <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#0A3D33]/30 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=800&q=85"
                alt="Artist crafting beautiful custom press-on nails with intricate detailing"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D33]/40 to-transparent" />
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-4 md:-right-8 bg-[#FF1493] text-white rounded-2xl px-5 py-3 shadow-xl"
            >
              <p
                className="text-xs font-medium opacity-80"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Based in
              </p>
              <p
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                New Orleans, LA
              </p>
            </motion.div>

            {/* Gold corner accent */}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-[#F4C430] rounded-tl-xl opacity-60" />
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-[#FF1493] rounded-br-xl opacity-60" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[#F4C430] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              ✦ Meet the Artist
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              <span className="text-white">Honduran craft,</span>
              <br />
              <span className="text-[#FF1493] italic">NOLA magic.</span>
            </h2>

            <div
              className="text-white/65 text-base leading-relaxed space-y-4"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              <p>
                Born in Honduras and rooted in New Orleans, the artist behind MVC
                Creations blends the vibrant colors of her tropical heritage with
                the bold, festive spirit of the Crescent City — one set of press-ons
                at a time.
              </p>
              <p>
                Each design is handcrafted with obsessive attention to detail:
                think iridescent glazes, hand-painted florals, crystal embellishments,
                and silhouettes inspired by everything from Carnival beads to
                Honduran textiles. No two sets are ever alike.
              </p>
              <p>
                Whether you&apos;re booking a house call, catching her at a pop-up, or
                ordering a custom set shipped to your door — you&apos;re getting luxury
                nail art made with genuine love.
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-[#F4C430]/40 to-transparent" />
              <span className="text-[#F4C430] text-sm italic font-light" style={{ fontFamily: "var(--font-playfair)" }}>
                "Your nails, your story."
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[#F4C430]/40 to-transparent" />
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#0A3D33] bg-[#0A3D33]/60 text-white font-semibold text-sm hover:bg-[#0A3D33] hover:border-[#0F5244] transition-all duration-300 hover:shadow-[0_0_30px_rgba(10,61,51,0.5)] group"
            >
              Meet the Artist
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
