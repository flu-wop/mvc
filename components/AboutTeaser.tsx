"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

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
    <section id="about" ref={ref} className="relative py-24 md:py-32 bg-ink">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Portrait */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="relative mx-auto md:mx-0 w-full max-w-sm"
          >
            <div className="relative aspect-[5/6] rounded-t-[999px] overflow-hidden border border-border">
              <Image
                src="/images/margie-portrait.jpg"
                alt="Margie, licensed nail technician and owner of MVC Creations"
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
              Meet the Artist
            </p>
            <h2 className="text-4xl md:text-5xl mb-6" style={{ fontFamily: "var(--font-script)" }}>
              Margie
            </h2>

            <div className="text-white/75 text-base md:text-lg leading-relaxed space-y-4 mb-8">
              <p>
                Licensed nail tech. Five-plus years of experience. Based in Kenner, near MSY.
              </p>
              <p>
                Acrylics, gel-X, press-ons, natural nail care — and nail art whenever you want to
                go all the way.
              </p>
              <p>Every set is built around you, not a menu.</p>
              <p className="text-grey">Travel appointments available on request.</p>
            </div>

            <p className="text-gold text-lg" style={{ fontFamily: "var(--font-script)" }}>
              xo, Margie
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
