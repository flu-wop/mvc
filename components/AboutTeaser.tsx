"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const fadeLeft = {
  hidden: { opacity: 0, x: -32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 32 },
  show: { opacity: 1, x: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const, delay: 0.1 } },
};

export default function AboutTeaser() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={ref} className="relative py-14 md:py-20 bg-ink">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Portrait — elongated half-moon, straight bottom edge */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="relative mx-auto md:mx-0 w-full max-w-sm"
          >
            <div className="relative aspect-[4/5] rounded-t-[999px] overflow-hidden border border-border">
              <Image
                src="/images/margie-portrait.jpg"
                alt="Margie, founder of MVC Creations"
                fill
                className="object-cover object-top"
              />
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Behind the Brand
            </p>
            <div className="flex items-end gap-3 mb-6">
              <div>
                <p className="text-4xl md:text-5xl font-bold leading-none" style={{ fontFamily: "var(--font-playfair)" }}>
                  MEET
                </p>
                <p className="text-sm tracking-[0.2em] uppercase text-white/60 mt-1">the Artist</p>
              </div>
              <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "var(--font-script)" }}>
                Margie
              </h2>
            </div>

            <div className="text-white/75 text-base leading-relaxed space-y-5 mb-8">
              <p>
                <span className="text-white font-semibold">Licensed Nail Artist.</span>{" "}
                Creating luxury nail experiences with artistry, attention to detail, and over
                five years of professional experience.
              </p>
              <p>
                <span className="text-white font-semibold">Entrepreneur &amp; Content Creator.</span>{" "}
                Helping businesses tell their stories through authentic content while
                continuing to grow the MVC brand.
              </p>
              <p>
                <span className="text-white font-semibold">Beauty Enthusiast.</span>{" "}
                Inspired by travel, fashion, self-care, and meaningful connections — beauty is
                about confidence, creativity, and the little details that make every experience
                memorable.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gold text-ink text-sm font-semibold hover:bg-gold-light transition-all duration-300"
              >
                My Story
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-gold/40 text-gold text-sm font-semibold hover:bg-gold/10 transition-all duration-300"
              >
                Shop All My Products
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
