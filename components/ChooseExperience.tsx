"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Calendar, Sparkles, Camera, Handshake } from "lucide-react";

const cards = [
  {
    title: "Luxury Nail Services",
    body: "Book luxury appointments.",
    cta: "Book Now",
    href: "/book",
    icon: Calendar,
    accent: "gold",
  },
  {
    title: "Premium Press-Ons",
    body: "Shop ready-to-wear and custom sets.",
    cta: "Shop Now",
    href: "/press-ons",
    icon: Sparkles,
    accent: "silver",
  },
  {
    title: "Beauty Products",
    body: "Cuticle oils, soak-off kits, accessories, and future product collections.",
    cta: "Shop Now",
    href: "/shop",
    icon: ShoppingBag,
    accent: "gold",
  },
  {
    title: "Content Creation",
    body: "Hire me to create authentic content for your business.",
    cta: "Learn More",
    href: "/content-creation",
    icon: Camera,
    accent: "silver",
  },
  {
    title: "Brand Collaborations",
    body: "Let's partner together through social media, events, and campaigns.",
    cta: "Contact Me",
    href: "/contact",
    icon: Handshake,
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
            const accentClass = card.accent === "gold" ? "gold" : "silver";
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
                  e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
                }}
                className="group relative rounded-2xl overflow-hidden border border-border bg-white/[0.02] flex flex-col"
              >
                {/* Cursor-follow glow */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(220px circle at var(--x, 50%) var(--y, 50%), ${
                      card.accent === "gold" ? "rgba(201,163,86,0.18)" : "rgba(192,192,192,0.16)"
                    }, transparent 70%)`,
                  }}
                />
                {/* Elegant placeholder panel — no repeated photography */}
                <div
                  className="relative aspect-[4/3] flex items-center justify-center overflow-hidden"
                  style={{
                    background:
                      card.accent === "gold"
                        ? "radial-gradient(ellipse at 50% 30%, rgba(201,163,86,0.16), transparent 70%), linear-gradient(160deg, #151515, #0A0A0A)"
                        : "radial-gradient(ellipse at 50% 30%, rgba(192,192,192,0.14), transparent 70%), linear-gradient(160deg, #151515, #0A0A0A)",
                  }}
                >
                  <Icon
                    className={`w-10 h-10 transition-transform duration-500 group-hover:scale-110 ${
                      card.accent === "gold" ? "text-gold/70" : "text-silver/70"
                    }`}
                    strokeWidth={1.25}
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-white text-lg font-semibold mb-1" style={{ fontFamily: "var(--font-playfair)" }}>
                    {card.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-4 flex-1">{card.body}</p>
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
