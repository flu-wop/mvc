"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Calendar, Sparkles, Camera, Handshake } from "lucide-react";

const cards = [
  {
    title: "Luxury Nail Services",
    body: "Book luxury appointments.",
    cta: "Book Now",
    href: "#booking",
    icon: Calendar,
    image: "/images/service-acrylic.jpg",
    accent: "gold",
  },
  {
    title: "Premium Press-Ons",
    body: "Shop ready-to-wear and custom sets.",
    cta: "Shop Now",
    href: "/press-ons",
    icon: Sparkles,
    image: "/images/service-press-ons.jpg",
    accent: "silver",
  },
  {
    title: "Beauty Products",
    body: "Cuticle oils, soak-off kits, accessories, and future product collections.",
    cta: "Shop Now",
    href: "/shop",
    icon: ShoppingBag,
    image: "/images/service-natural-nails.jpg",
    accent: "gold",
  },
  {
    title: "Content Creation",
    body: "Hire me to create authentic content for your business.",
    cta: "Learn More",
    href: "/content-creation",
    icon: Camera,
    image: "/images/service-nail-art.jpg",
    accent: "silver",
  },
  {
    title: "Brand Collaborations",
    body: "Let's partner together through social media, events, and campaigns.",
    cta: "Contact Me",
    href: "/contact",
    icon: Handshake,
    image: "/images/service-gel-x.jpg",
    accent: "gold",
  },
];

export default function ChooseExperience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="choose" ref={ref} className="py-14 md:py-16 bg-ink border-t border-border">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "var(--font-script)" }}>
            Choose Your Experience
          </h2>
          <p className="text-grey text-sm mt-3 max-w-md mx-auto">
            However you'd like to experience the MVC brand.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-2xl overflow-hidden border border-border"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                      card.accent === "gold" ? "bg-gold/20 border border-gold/40" : "bg-silver/20 border border-silver/40"
                    }`}
                  >
                    <Icon className={`w-4.5 h-4.5 ${card.accent === "gold" ? "text-gold" : "text-silver"}`} />
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                    {card.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-4">{card.body}</p>
                  <Link
                    href={card.href}
                    className={`inline-flex w-fit items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                      card.accent === "gold" ? "bg-gold text-ink hover:bg-gold-light" : "bg-silver text-ink hover:bg-silver-light"
                    }`}
                  >
                    {card.cta}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
