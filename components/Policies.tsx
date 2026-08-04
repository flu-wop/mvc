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
    accent: "#C9A356",
  },
  {
    icon: DollarSign,
    title: "Deposits",
    summary: "A non-refundable deposit applies toward your service total.",
    detail:
      "A non-refundable deposit is required to reserve every appointment. This deposit applies toward your service total. Travel appointments require an additional travel fee based on distance, which is separate from the service and deposit.",
    accent: "#C0C0C0",
  },
  {
    icon: Clock,
    title: "Late Arrivals",
    summary: "10-minute grace period on late arrivals.",
    detail:
      "Please arrive 10 minutes early to receive your full service time. A 10-minute grace period is allowed. After 10 minutes, a $10 late fee will apply, and the appointment may be canceled at my discretion with deposit forfeiture. If accepted beyond the grace period, an additional $1 per minute late fee may apply if agreed upon before continuing the appointment.",
    accent: "#C9A356",
  },
  {
    icon: XCircle,
    title: "Cancellations",
    summary: "24-hour notice to reschedule or cancel.",
    detail:
      "You can reschedule or cancel up to 24 hours ahead of your appointment. Failure to do so will result in your card being charged 50% of the total balance. No shows are charged 100%.",
    accent: "#C0C0C0",
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
    <section id="policies" ref={ref} className="py-14 md:py-16 bg-ink relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Good to Know
          </p>
          <h2 className="text-5xl md:text-6xl" style={{ fontFamily: "var(--font-script)" }}>
            Booking Policies
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid sm:grid-cols-2 gap-4"
        >
          {policies.map((policy) => {
            const Icon = policy.icon;
            const isOpen = open === policy.title;
            return (
              <div
                key={policy.title}
                className="rounded-2xl border border-border overflow-hidden"
                style={{ background: `${policy.accent}0d` }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : policy.title)}
                  className="w-full flex items-center gap-4 p-6 text-left"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${policy.accent}20`, border: `1px solid ${policy.accent}40` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: policy.accent }} />
                  </div>
                  <span className="flex-1">
                    <span
                      className="text-white font-semibold block"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {policy.title}
                    </span>
                    <span className="text-white/50 text-sm block mt-0.5">{policy.summary}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-300 ${
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
                      <p className="text-white/55 text-sm leading-relaxed px-6 pb-6">
                        {policy.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Before your appointment — spans full width */}
          <div className="sm:col-span-2 rounded-2xl border border-border overflow-hidden bg-white/[0.02]">
            <button
              onClick={() => setOpen(open === "Prep" ? null : "Prep")}
              className="w-full flex items-center gap-4 p-6 text-left"
            >
              <span className="flex-1">
                <span
                  className="text-white font-semibold block"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Before Your Appointment
                </span>
                <span className="text-white/50 text-sm block mt-0.5">
                  A few things to know before you arrive.
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white/40 shrink-0 transition-transform duration-300 ${
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
                  <ul className="text-white/55 text-sm leading-relaxed px-6 pb-6 space-y-3 list-disc list-inside">
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
