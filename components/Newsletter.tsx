"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail } from "lucide-react";

export default function Newsletter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section ref={ref} className="py-14 md:py-16 bg-charcoal border-t border-border">
      <div className="max-w-xl mx-auto px-5 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-5">
            <Mail className="w-4.5 h-4.5 text-gold" />
          </div>
          <h2 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: "var(--font-script)" }}>
            Stay in the Loop
          </h2>
          <p className="text-grey text-sm mb-7 max-w-sm mx-auto">
            Be the first to know about new press-on drops, product launches, appointment openings, and exclusive offers.
          </p>

          {status === "done" ? (
            <p className="text-gold text-sm font-medium">You're on the list — thank you!</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full bg-white/5 border border-border text-white text-sm placeholder:text-grey focus:outline-none focus:border-gold/50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-7 py-3 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold-light transition-all duration-300 disabled:opacity-60"
              >
                {status === "loading" ? "Joining..." : "Join the List"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-red-400 text-xs mt-3">Something went wrong — please try again.</p>
          )}

          <p className="text-grey text-xs mt-4">No spam — just the good stuff. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
}
