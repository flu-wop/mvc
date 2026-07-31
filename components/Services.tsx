"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "Acrylic",
    description: "Classic acrylic enhancements, shaped and sized to fit your style.",
    image: "/images/service-acrylic.jpg",
    accent: "#FF1493",
    bg: "rgba(255,20,147,0.08)",
  },
  {
    title: "Gel-X",
    description: "Lightweight gel extensions with a natural, flexible finish.",
    image: "/images/service-gel-x.jpg",
    accent: "#F4C430",
    bg: "rgba(244,196,48,0.08)",
  },
  {
    title: "Natural Nails",
    description: "Clean, healthy natural nail care — simple and polished.",
    image: "/images/service-natural-nails.jpg",
    accent: "#0A3D33",
    bg: "rgba(10,61,51,0.25)",
  },
  {
    title: "Nail Art",
    description: "Hand-painted, intricate designs — bring your vision, I'll bring it to life.",
    image: "/images/service-nail-art.jpg",
    accent: "#FF1493",
    bg: "rgba(255,20,147,0.08)",
  },
  {
    title: "Press-Ons",
    description: "Custom press-on sets, built to order and ready to wear.",
    image: "/images/service-press-ons.jpg",
    accent: "#1A7A60",
    bg: "rgba(26,122,96,0.15)",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

const headerVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="services"
      ref={ref}
      className="py-24 md:py-32 bg-gradient-to-b from-[#0C0C0C] to-[#0A0A0A] relative"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F4C430]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <motion.div
          variants={headerVariant}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-center mb-16"
        >
          <p className="text-[#F4C430] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            ✦ Our Services
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Built for{" "}
            <span className="text-[#FF1493] italic">Your Glam</span>
          </h2>
          <p className="text-white/50 max-w-md mx-auto text-base">
            Every set is designed to give you results that last — with the
            personal touch of a true artist.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariant}
              className="card-lift group relative rounded-2xl border border-white/5 overflow-hidden flex flex-col cursor-pointer"
              style={{ background: service.bg }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex-1">
                  <h3
                    className="text-white text-xl font-semibold mb-2"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-end pt-3 border-t border-white/5">
                  <Link
                    href="#booking"
                    className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 hover:scale-105"
                    style={{
                      background: `${service.accent}20`,
                      color: service.accent,
                      border: `1px solid ${service.accent}30`,
                    }}
                  >
                    Book Now →
                  </Link>
                </div>
              </div>

              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${service.accent}08, transparent 70%)` }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
