"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const services = [
  {
    title: "Acrylic",
    image: "/images/service-acrylic.jpg",
    from: 65,
    summary: "Sculpted strength and lasting beauty, built to your exact shape and style.",
    full: "Sculpted strength and lasting beauty. Each set is custom-built to your preferred length, shape, and style — from clean and classic to full glam. Durable, versatile, and designed to move with you.",
  },
  {
    title: "Gel-X",
    image: "/images/service-gel-x.jpg",
    from: 70,
    summary: "Lightweight, flexible extensions with a soft, natural finish.",
    full: "Lightweight, flexible, and incredibly natural-looking. Soft gel extensions that give you length and strength without the bulk. Perfect for a refined, salon-fresh finish that feels like your own nails — only better.",
  },
  {
    title: "Natural Nails",
    image: "/images/service-natural-nails.jpg",
    from: 45,
    summary: "Healthy, polished, and meticulously cared for.",
    full: "Healthy, polished, and cared for. A meticulous manicure focused on cuticle care, shaping, and a flawless gel or regular polish finish. Ideal when you want your natural nails looking their absolute best.",
  },
  {
    title: "Nail Art",
    image: "/images/service-nail-art.jpg",
    from: 110,
    summary: "Full creative expression — every set is one-of-a-kind.",
    full: "Full creative expression. Intricate hand-painted details, chrome, 3D elements, encapsulated designs, and everything in between. Every set is a one-of-a-kind piece created just for you.",
  },
  {
    title: "Press-Ons",
    image: "/images/service-press-ons.jpg",
    from: 50,
    summary: "Salon-quality custom press-ons, made to fit and reusable.",
    full: "Salon-quality custom press-ons made to fit your exact nail beds. Reusable, long-lasting, and delivered ready to wear — so you can have luxury nails on your schedule.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="services" ref={ref} className="py-14 md:py-16 bg-ink">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Our</p>
          <h2 className="text-5xl md:text-6xl" style={{ fontFamily: "var(--font-script)" }}>
            Services
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-5"
        >
          {services.map((service, i) => {
            const accent = i % 2 === 0 ? "border-gold/40" : "border-silver/40";
            const isOpen = open === service.title;
            return (
              <motion.div
                key={service.title}
                variants={cardVariant}
                className="rounded-2xl border border-border overflow-hidden bg-white/[0.02] flex flex-col items-center pt-6 px-5 pb-5"
              >
                <div className={`relative w-40 aspect-[4/5] overflow-hidden rounded-t-[999px] border-2 mb-5 ${accent}`}>
                  <Image src={service.image} alt={service.title} fill className="object-cover" />
                </div>
                <div className="w-full text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <p className="text-white text-base font-semibold">{service.title}</p>
                  </div>
                  <p className="text-grey text-xs mb-2">From ${service.from}</p>
                  <p className="text-grey text-sm leading-relaxed">{service.summary}</p>

                  <button
                    onClick={() => setOpen(isOpen ? null : service.title)}
                    className="flex items-center gap-1.5 text-gold text-xs font-semibold mt-3 mx-auto hover:text-gold-light transition-colors"
                  >
                    {isOpen ? "Show less" : "Read more"}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="text-white/55 text-sm leading-relaxed pt-3">{service.full}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <p className="text-center text-grey text-xs mt-8">
          Prices shown are starting rates — final pricing is confirmed at booking based on length, complexity, and any add-ons.
        </p>
      </div>
    </section>
  );
}
