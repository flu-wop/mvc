"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Calendar, DollarSign, Clock, XCircle, ChevronDown } from "lucide-react";

const policies = [
  {
    icon: Calendar,
    title: "Appointments",
    summary: "Please arrive 10 minutes early.",
    detail:
      "Please arrive 10 minutes early to help ensure we begin promptly. I take pride in providing detailed, quality work and do not rush my services, so appointments may run longer than standard salon timing. Thank you for your patience and understanding as I work to give you the best experience possible.",
  },
  {
    icon: DollarSign,
    title: "Deposits",
    summary: "$30 non-refundable deposit secures your appointment.",
    detail:
      "All services require a non-refundable $30 fee to secure your appointment. Travel appointments require a $75–$100 travel fee, and before/after-hours appointments require a $50 fee. These fees do not go toward your service total and are separate charges, serving as the deposit to hold your appointment.",
  },
  {
    icon: Clock,
    title: "Late Arrivals",
    summary: "10-minute grace period on late arrivals.",
    detail:
      "Please arrive 10 minutes early to receive your full service time. A 10-minute grace period is allowed. After 10 minutes, a $10 late fee will apply, and the appointment may be canceled at my discretion with deposit forfeiture. If accepted beyond the grace period, an additional $1 per minute late fee may apply if agreed upon before continuing the appointment.",
  },
  {
    icon: XCircle,
    title: "Cancellations",
    summary: "24-hour notice to reschedule or cancel.",
    detail:
      "You can reschedule or cancel up to 24 hours ahead of your appointment. Failure to do so will result in your card being charged 50% of the total balance. No shows are charged 100%.",
  },
];

const prep = [
  "Services will not be performed on clients with damaged nails, fungus, or visible infections — reach out beforehand if you're unsure.",
  "Arrive with clean nails. Avoid heavy oils or creams before your visit, as this can affect adhesion. Book a soak-off if needed (unless getting a refill) — a $10 fee applies if not done ahead of time.",
  "Have specific styles or designs in mind? Text inspiration photos beforehand — it helps achieve your perfect nail design.",
  "No extra guests unless discussed. All payments accepted; some methods may include a processing fee.",
];

export default function Policies() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="policies" ref={ref} className="py-24 md:py-28 bg-ink border-t border-border">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div className="text-center mb-14">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Booking</p>
          <h2 className="text-5xl md:text-6xl" style={{ fontFamily: "var(--font-script)" }}>
            Policies
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="divide-y divide-border border-y border-border"
        >
          {policies.map((policy) => {
            const Icon = policy.icon;
            const isOpen = open === policy.title;
            return (
              <div key={policy.title}>
                <button
                  onClick={() => setOpen(isOpen ? null : policy.title)}
                  className="w-full flex items-center gap-4 py-5 text-left group"
                >
                  <Icon className="w-5 h-5 text-gold shrink-0" />
                  <span className="flex-1">
                    <span className="text-cream font-semibold block">{policy.title}</span>
                    <span className="text-mist text-sm block mt-0.5">{policy.summary}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-mist shrink-0 transition-transform duration-300 ${
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
                      <p className="text-cream/60 text-sm leading-relaxed pb-6 pl-9 pr-4">
                        {policy.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Before your appointment — same accordion pattern */}
          <div>
            <button
              onClick={() => setOpen(open === "Prep" ? null : "Prep")}
              className="w-full flex items-center gap-4 py-5 text-left group"
            >
              <span className="flex-1">
                <span className="text-cream font-semibold block">Before Your Appointment</span>
                <span className="text-mist text-sm block mt-0.5">
                  A few things to know before you arrive.
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-mist shrink-0 transition-transform duration-300 ${
                  open === "Prep" ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {open === "Prep" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="text-cream/60 text-sm leading-relaxed pb-6 pl-4 pr-4 space-y-3 list-disc list-inside">
                    {prep.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
