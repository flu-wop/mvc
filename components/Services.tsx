"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles } from "lucide-react";

const services = [
  {
    title: "Acrylic",
    image: "/images/service-acrylic.jpg",
    from: 65,
    full: "Sculpted strength and lasting beauty. Each set is custom-built to your preferred length, shape, and style — from clean and classic to full glam. Durable, versatile, and designed to move with you.",
  },
  {
    title: "Gel-X",
    image: "/images/service-gel-x.jpg",
    from: 70,
    full: "Lightweight, flexible, and incredibly natural-looking. Soft gel extensions that give you length and strength without the bulk. Perfect for a refined, salon-fresh finish that feels like your own nails — only better.",
  },
  {
    title: "Natural Nails",
    image: "/images/service-natural-nails.jpg",
    from: 45,
    full: "Healthy, polished, and cared for. A meticulous manicure focused on cuticle care, shaping, and a flawless gel or regular polish finish. Ideal when you want your natural nails looking their absolute best.",
  },
  {
    title: "Nail Art",
    image: "/images/service-nail-art.jpg",
    from: 110,
    full: "Full creative expression. Intricate hand-painted details, chrome, 3D elements, encapsulated designs, and everything in between. Every set is a one-of-a-kind piece created just for you.",
  },
  {
    title: "Press-Ons",
    image: "/images/service-press-ons.jpg",
    from: 50,
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

function RevealCard({ service, accent }: { service: (typeof services)[number]; accent: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={cardVariant}
      className="relative aspect-[2/3] cursor-pointer rounded-2xl border border-border bg-white/[0.02] overflow-hidden flex flex-col items-center pt-6 px-5 pb-5"
      style={{ perspective: 1000 }}
      onClick={() => setOpen((o) => !o)}
      whileHover={{ rotateX: -3, rotateY: 3 }}
      animate={{ rotateX: open ? -4 : 0, rotateY: open ? 4 : 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`relative w-full flex-1 overflow-hidden rounded-t-[999px] border-2 mb-4 ${accent}`}>
        <Image src={service.image} alt={service.title} fill className="object-cover" />

        {/* Ombré blur reveal panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-end justify-center p-5"
              style={{
                backdropFilter: "blur(14px)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent, black 35%)",
                maskImage: "linear-gradient(to bottom, transparent, black 35%)",
                background:
                  "linear-gradient(to bottom, transparent, rgba(10,10,10,0.75) 45%, rgba(10,10,10,0.92) 100%)",
              }}
            >
              <p className="text-white/85 text-xs leading-relaxed text-center">{service.full}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center">
        <p className="text-white text-base font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
          {service.title}
        </p>
        <p className="text-grey text-xs mb-1">From ${service.from}</p>
        <p className="flex items-center justify-center gap-1 text-gold text-[11px] font-semibold">
          <Sparkles className="w-3 h-3" /> {open ? "Tap to close" : "Tap for details"}
        </p>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="services" ref={ref} className="py-14 md:py-16 bg-ink">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Our</p>
          <h2 className="text-5xl md:text-6xl" style={{ fontFamily: "var(--font-script)" }}>
            Services
          </h2>
          <p className="text-grey text-xs mt-3">Tap a card to see full details</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-5"
        >
          {services.map((service, i) => {
            const accent = i % 2 === 0 ? "border-gold/40" : "border-silver/40";
            return <RevealCard key={service.title} service={service} accent={accent} />;
          })}
        </motion.div>

        <p className="text-center text-grey text-xs mt-8">
          Prices shown are starting rates — final pricing is confirmed at booking based on length, complexity, and any add-ons.
        </p>
      </div>
    </section>
  );
}
