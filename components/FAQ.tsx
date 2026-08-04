"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const pressOnFaqs = [
  {
    q: "How do I find my size?",
    a: "Use our size guide (or a simple measuring method): measure the width of each of your natural nails at the widest point, or use the sizing chart included with every set. We also offer a sizing kit if you'd like extra certainty before ordering a full custom set.",
  },
  {
    q: "How do I apply and remove them?",
    a: "Apply: Gently push back cuticles, lightly buff the nail surface, clean with alcohol, select the correct size, apply a thin layer of glue (or adhesive tabs), press and hold for 20–30 seconds. Finish with cuticle oil. Remove: Soak in warm soapy water or use the soak-off method with acetone (or our Soak Off Kits). Never force them off — this protects your natural nails.",
  },
  {
    q: "Are our press-ons reusable?",
    a: "Yes. With proper application and gentle removal, most sets can be worn multiple times. Store them in the case provided and keep the nail beds clean for best results.",
  },
  {
    q: "What is the refund / exchange policy for press-ons?",
    a: "Because each set is custom or hygiene-sensitive, we do not offer returns on worn press-ons. If your set arrives damaged or the wrong size due to an error on our end, contact us within 7 days and we'll make it right.",
  },
  {
    q: "Do you ship in the U.S.?",
    a: "Yes — we currently ship within the United States. Shipping times and rates are calculated at checkout.",
  },
];

const serviceFaqs = [
  {
    q: "What is your deposit and cancellation policy?",
    a: "A $30 non-refundable deposit is required to secure your appointment. Cancellations or reschedules need at least 24 hours' notice. Late arrivals have a 10-minute grace period.",
  },
  {
    q: "What should I know before my appointment?",
    a: "Please arrive 10 minutes early. Come with clean, polish-free nails if possible. Let me know about any allergies or preferences in advance. Travel appointments are available on request (additional fee).",
  },
  {
    q: "Do you offer refunds on services?",
    a: "Deposits are non-refundable. If you need to reschedule with proper notice, your deposit can usually be applied to the new date. Full service refunds are handled case-by-case.",
  },
  {
    q: "Where are you located?",
    a: "Based in Kenner, Louisiana — conveniently near MSY airport. Travel appointments available upon request.",
  },
];

function FAQGroup({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      <h3 className="text-white text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
        {title}
      </h3>
      <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-white text-sm font-medium">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-grey shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
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
                    <p className="text-grey text-sm leading-relaxed px-5 pb-5">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="faq" ref={ref} className="py-14 md:py-16 bg-ink border-t border-border">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">FAQs</p>
          <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "var(--font-script)" }}>
            Good to Know
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          <FAQGroup title="Press-Ons" items={pressOnFaqs} />
          <FAQGroup title="Services" items={serviceFaqs} />
        </div>
      </div>
    </section>
  );
}
