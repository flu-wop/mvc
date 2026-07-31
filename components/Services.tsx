"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const services = [
  { title: "Acrylic", image: "/images/service-acrylic.jpg" },
  { title: "Gel-X", image: "/images/service-gel-x.jpg" },
  { title: "Natural Nails", image: "/images/service-natural-nails.jpg" },
  { title: "Nail Art", image: "/images/service-nail-art.jpg" },
  { title: "Press-Ons", image: "/images/service-press-ons.jpg" },
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
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-4"
        >
          {services.map((service, i) => {
            const accent = i % 2 === 0 ? "border-gold/40" : "border-silver/40";
            return (
              <motion.div
                key={service.title}
                variants={cardVariant}
                className="flex flex-col items-center gap-3"
              >
                <div className={`relative w-full aspect-square rounded-t-[999px] overflow-hidden border-2 ${accent}`}>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-white text-sm font-semibold tracking-wide uppercase">
                  {service.title}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
