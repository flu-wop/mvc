"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Script from "next/script";

export default function BookingCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="booking"
      ref={ref}
      className="py-24 md:py-28 bg-charcoal border-t border-border"
    >
      <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3"
        >
          Ready?
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-4xl md:text-5xl mb-3"
          style={{ fontFamily: "var(--font-script)" }}
        >
          Let&apos;s get you booked
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-mist text-sm mb-4"
        >
          Deposit required to secure your spot — details above.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="max-w-3xl mx-auto px-5 md:px-8"
      >
        <div className="rounded-2xl overflow-hidden border border-border bg-white">
          <iframe
            src="https://app.acuityscheduling.com/schedule.php?owner=19553804&ref=embedded_csp"
            title="Schedule Appointment — MVC Creations"
            width="100%"
            height="800"
            frameBorder="0"
            allow="payment"
          />
        </div>
      </motion.div>

      <Script src="https://embed.acuityscheduling.com/js/embed.js" strategy="lazyOnload" />
    </section>
  );
}
