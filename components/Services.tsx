"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { RotateCw } from "lucide-react";

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

function FlipCard({ service, accent }: { service: (typeof services)[number]; accent: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      variants={cardVariant}
      className="relative aspect-[4/5] cursor-pointer"
      style={{ perspective: 1200 }}
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front — half-moon image + title below */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-border bg-white/[0.02] flex flex-col items-center pt-6 px-5 pb-5"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className={`relative w-full flex-1 overflow-hidden rounded-t-[999px] border-2 mb-4 ${accent}`}>
            <Image src={service.image} alt={service.title} fill className="object-cover" />
          </div>
          <div className="text-center">
            <p className="text-white text-base font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
              {service.title}
            </p>
            <p className="text-grey text-xs mb-1">From ${service.from}</p>
            <p className="flex items-center justify-center gap-1 text-gold text-[11px] font-semibold">
              <RotateCw className="w-3 h-3" /> Tap for details
            </p>
          </div>
        </div>

        {/* Back — description */}
        <div
          className={`absolute inset-0 rounded-2xl overflow-hidden border-2 ${accent} bg-charcoal p-6 flex flex-col justify-center text-center`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <p className="text-white text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
            {service.title}
          </p>
          <p className="text-gold text-xs mb-4">From ${service.from}</p>
          <p className="text-white/65 text-sm leading-relaxed">{service.full}</p>
        </div>
      </motion.div>
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
            return <FlipCard key={service.title} service={service} accent={accent} />;
          })}
        </motion.div>

        <p className="text-center text-grey text-xs mt-8">
          Prices shown are starting rates — final pricing is confirmed at booking based on length, complexity, and any add-ons.
        </p>
      </div>
    </section>
  );
}
