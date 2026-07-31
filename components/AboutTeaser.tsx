"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// ── Shared animation variants ───────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
  },
};

export default function AboutTeaser() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      id="about"
      className="relative py-24 md:py-32 overflow-hidden bg-[#0C0C0C]"
    >
      {/* Background accents */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#F4C430] via-[#FF1493] to-[#0A3D33]" />
      <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#0A3D33]/30 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Image — slides in from left */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/images/margie-portrait.jpg"
                alt="Margie, licensed nail technician and owner of MVC Creations"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A3D33]/40 to-transparent" />
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-4 md:-right-8 bg-[#FF1493] text-white rounded-2xl px-5 py-3 shadow-xl"
            >
              <p className="text-xs font-medium opacity-80" style={{ fontFamily: "var(--font-dm-sans)" }}>
                Based in
              </p>
              <p className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                Kenner, LA
              </p>
            </motion.div>

            {/* Corner accents */}
            <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-[#F4C430] rounded-tl-xl opacity-60" />
            <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-[#FF1493] rounded-br-xl opacity-60" />
          </motion.div>

          {/* Text — slides in from right, staggered children */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0.2}
              className="text-[#F4C430] text-xs font-semibold tracking-[0.2em] uppercase mb-4"
            >
              ✦ Meet the Artist
            </motion.p>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0.3}
              className="text-4xl md:text-5xl font-bold leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              <span className="text-white">Licensed nail tech,</span>
              <br />
              <span className="text-[#FF1493] italic">five+ years in.</span>
            </motion.h2>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0.4}
              className="text-white/65 text-base leading-relaxed space-y-4"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              <p>
                I&apos;m Margie — a licensed nail technician based in Kenner, near MSY Airport.
                Nails have been a passion of mine since childhood, and I&apos;ve poured my heart
                into turning that passion into something meaningful for every client I serve.
              </p>
              <p>
                I specialize in acrylic enhancements, gel extensions, builder gel, press-ons,
                and natural nail care. Whether you want something simple and clean or bold and
                detailed, I love bringing your vision to life — nail art and intricate designs
                are truly my favorite.
              </p>
              <p>
                I&apos;m currently residential-based, but I do offer travel appointments for an
                additional fee. Let&apos;s get you booked and pampered.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0.48}
              className="flex items-center gap-4 mt-4 mb-8"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-[#F4C430]/40 to-transparent" />
              <span className="text-[#F4C430] text-sm italic font-light" style={{ fontFamily: "var(--font-playfair)" }}>
                &quot;Your nails, your story.&quot;
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[#F4C430]/40 to-transparent" />
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0.55}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#0A3D33] bg-[#0A3D33]/60 text-white font-semibold text-sm hover:bg-[#0A3D33] hover:border-[#0F5244] transition-all duration-300 hover:shadow-[0_0_30px_rgba(10,61,51,0.5)] group"
              >
                Meet the Artist
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
