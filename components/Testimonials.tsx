"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    quote: "I've had press-ons from a lot of places but MVC Creations is on a whole other level. My set lasted 3 weeks and got stopped at the grocery store twice. The florals were SO detailed — I almost cried.",
    name: "Jasmine R.",
    handle: "@jasmine.nola",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80",
    stars: 5,
  },
  {
    quote: "Booked a house call for my birthday and she showed up with the most gorgeous custom set I've ever seen. Emerald, gold, and little Mardi Gras beads — I felt like royalty all weekend. Will NOT be going anywhere else.",
    name: "Destiny M.",
    handle: "@destinyglam",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    stars: 5,
  },
  {
    quote: "She did press-ons for my entire bridal party and every single set was DIFFERENT and PERFECT. Our photos look incredible. The attention to detail is unmatched. Honduras raised a true artist.",
    name: "Priya K.",
    handle: "@priyabridesNOLA",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80",
    stars: 5,
  },
  {
    quote: "Ordered a custom set online and it arrived perfectly packaged with little reusable tabs already sorted by size. The chrome ombre was so good I kept staring at my hands at work. 12/10.",
    name: "Camille T.",
    handle: "@camille.nailspo",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    stars: 5,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] } },
};

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-[#0A3D33]/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0A3D33]/60 to-transparent" />
      <div className="absolute -top-40 right-0 w-[400px] h-[400px] rounded-full bg-[#FF1493]/5 blur-[100px] pointer-events-none" />
      <div
        className="absolute top-12 left-8 text-[12rem] text-[#F4C430]/5 font-serif leading-none pointer-events-none select-none"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        &ldquo;
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-[#F4C430] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            ✦ Client Love
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            They <span className="text-[#FF1493] italic">obsess</span> over their sets.
          </h2>
        </motion.div>

        {/* Staggered testimonial cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid sm:grid-cols-2 gap-5"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.handle}
              variants={cardVariant}
              className="card-lift relative rounded-2xl border border-white/5 bg-[#111111]/80 backdrop-blur-sm p-7 flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#F4C430] text-[#F4C430]" />
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-white/75 text-sm leading-relaxed italic flex-1"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#FF1493]/40">
                  <Image src={t.avatar} alt={`${t.name} profile photo`} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-[#FF1493] text-xs">{t.handle}</p>
                </div>
                <div className="ml-auto">
                  <svg className="w-5 h-5 text-white/20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
