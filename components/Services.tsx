"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { Sparkles, Palette, Star, PartyPopper, Home, Scissors } from "lucide-react";

const services = [
  {
    icon: Sparkles,
    title: "Gel Press-Ons",
    description: "Premium gel-finish press-ons that look and feel like a salon set. Long-lasting, lightweight, and ready to wear.",
    price: "From $45",
    accent: "#FF1493",
    bg: "rgba(255,20,147,0.08)",
  },
  {
    icon: Palette,
    title: "Custom Nail Art",
    description: "Hand-painted one-of-a-kind designs. From florals to abstracts to your own vision — the canvas is your nail.",
    price: "From $75",
    accent: "#F4C430",
    bg: "rgba(244,196,48,0.08)",
  },
  {
    icon: Star,
    title: "Full Sets",
    description: "Complete 20-piece sets sized and shaped to your nails. Pick your length, shape, finish, and vibe.",
    price: "From $55",
    accent: "#0A3D33",
    bg: "rgba(10,61,51,0.25)",
  },
  {
    icon: PartyPopper,
    title: "Pop-Up Events",
    description: "Bring MVC Creations to your bridal shower, birthday, bachelorette, or any celebration. Glamour guaranteed.",
    price: "Inquire for pricing",
    accent: "#FF1493",
    bg: "rgba(255,20,147,0.08)",
  },
  {
    icon: Home,
    title: "House Calls",
    description: "Get your nails done in the comfort of your own home anywhere in the Greater New Orleans area.",
    price: "From $60 + travel",
    accent: "#F4C430",
    bg: "rgba(244,196,48,0.08)",
  },
  {
    icon: Scissors,
    title: "Removal",
    description: "Safe, gentle removal of press-ons with no damage to your natural nails. Add-on or standalone service.",
    price: "From $20",
    accent: "#1A7A60",
    bg: "rgba(26,122,96,0.15)",
  },
];

// Stagger container
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const headerVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
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
        {/* Header */}
        <motion.div
          variants={headerVariant}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-center mb-16"
        >
          <p className="text-[#F4C430] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            ✦ What We Offer
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Services Built for{" "}
            <span className="text-[#FF1493] italic">Your Glam</span>
          </h2>
          <p className="text-white/50 max-w-md mx-auto text-base">
            Every service is designed to give you luxury results that last — with
            the personal touch of a true artist.
          </p>
        </motion.div>

        {/* Staggered card grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={cardVariant}
                className="card-lift group relative rounded-2xl border border-white/5 p-7 flex flex-col gap-5 cursor-pointer"
                style={{ background: service.bg }}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${service.accent}20`, border: `1px solid ${service.accent}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: service.accent }} />
                </div>

                {/* Content */}
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

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-sm font-semibold" style={{ color: service.accent }}>
                    {service.price}
                  </span>
                  {/* TODO: Replace href with actual Acuity Scheduling link per service */}
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

                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${service.accent}08, transparent 70%)` }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
