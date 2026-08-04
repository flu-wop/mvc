"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin } from "lucide-react";

const collaborations = [
  { name: "The Hidden Gem Event", type: "First Pop-Up / Walk-Up Nail Experience", date: "February 2026" },
];

export default function FeaturedCollaborations() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-14 md:py-16 bg-charcoal border-t border-border">
      <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Featured Collaborations
          </p>
          <h2 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: "var(--font-script)" }}>
            Working Together
          </h2>
          <p className="text-grey text-sm mb-10 max-w-md mx-auto">
            Restaurants, boutiques, beauty brands, hotels, salons, pop-ups, and community
            events — collaborations that grow with the MVC brand.
          </p>

          <div className="grid gap-4">
            {collaborations.map((c) => (
              <div key={c.name} className="rounded-2xl border border-border bg-white/[0.02] p-6 text-left flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-4.5 h-4.5 text-gold" />
                </div>
                <div>
                  <p className="text-white font-semibold">{c.name}</p>
                  <p className="text-grey text-sm">{c.type}</p>
                  <p className="text-gold text-xs mt-1">{c.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
