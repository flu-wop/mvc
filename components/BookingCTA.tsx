"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";

// TODO: Replace this section with actual Acuity Scheduling embed.
// Option A — Direct iframe embed:
//   <iframe
//     src="https://mvcxcreations.as.me/schedule/27795b22"
//     width="100%"
//     height="800"
//     frameBorder="0"
//   />
//
// Option B — Acuity React component (if using @acuity/embed-react):
//   import AcuityScheduling from '@acuity/embed-react';
//   <AcuityScheduling src="https://mvcxcreations.as.me/schedule/27795b22" />
//
// For SSR: wrap in a dynamic import with ssr: false

const perks = [
  { icon: Calendar, text: "Flexible scheduling — weekends available" },
  { icon: Clock, text: "House calls & pop-ups across Greater NOLA" },
  { icon: MapPin, text: "New Orleans, Louisiana" },
];

export default function BookingCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="booking"
      ref={ref}
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0A3D33 0%, #0C0C0C 50%, #1a0a1a 100%)" }}
    >
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-[#FF1493]/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-[#F4C430]/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF1493]/40 to-transparent" />

      <div className="max-w-4xl mx-auto px-5 md:px-8 text-center relative z-10">

        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FF1493]/30 bg-[#FF1493]/10 text-[#FF1493] text-xs font-semibold tracking-widest uppercase mb-8"
        >
          ✦ Book Your Session
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-5"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          <span className="text-white">Ready for your</span>
          <br />
          <span className="text-gold-shimmer italic">new set?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/60 text-lg max-w-lg mx-auto mb-10 font-light leading-relaxed"
        >
          Pick your service, choose your time, and get ready to obsess over your
          nails. Booking is fast, easy, and takes about 2 minutes.
        </motion.p>

        {/* Perks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-12"
        >
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div key={perk.text} className="flex items-center gap-2 text-white/50 text-sm">
                <Icon className="w-4 h-4 text-[#F4C430] shrink-0" />
                <span>{perk.text}</span>
              </div>
            );
          })}
        </motion.div>

        {/* TODO: Replace this div with actual Acuity Scheduling embed (iframe or React component).
            For now this prominent button links to the live scheduler URL. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm p-10 md:p-14 mb-6">
            <div className="flex flex-col items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-full bg-[#FF1493]/10 border border-[#FF1493]/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#FF1493]" />
              </div>
              <p className="text-white/40 text-sm">Acuity Scheduling embed loads here</p>
            </div>

            <a
              href="https://mvcxcreations.as.me/schedule/27795b22"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-[#FF1493] text-white font-bold text-base md:text-lg hover:bg-[#FF1493]/90 hover:shadow-[0_0_50px_rgba(255,20,147,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Open Full Scheduler ✦
            </a>

            <p className="text-white/25 text-xs mt-5">
              Powered by Acuity Scheduling · Secure & encrypted
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
