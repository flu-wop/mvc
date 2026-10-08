"use client";

// PLACEHOLDER SECTION — remove or replace before launch (see lib/features.ts).
// Copy here is generic on purpose: edit ITEMS to match what Margie actually plans.

import { useState } from "react";
import Reveal from "@/components/Reveal";

const ITEMS = [
  { key: "shop", title: "Shop", line: "Press-on sets and beauty picks, ready to ship." },
  { key: "tutorials", title: "Tutorials", line: "Step-by-step nail tutorials from Margie." },
  { key: "merch", title: "Merch", line: "MVC Creations merch." },
] as const;

export default function ComingSoon({ standalone = false }: { standalone?: boolean }) {
  const [picked, setPicked] = useState<string[]>(ITEMS.map((i) => i.key));
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interest: picked.join(",") }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  const Heading = standalone ? "h1" : "h2";

  return (
    <section id="coming-soon" className={`${standalone ? "pt-36 pb-28" : "py-24 md:py-32 border-t border-border"} bg-charcoal scroll-mt-16`}>
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <Reveal className="text-center mb-14">
          <p className="text-gold text-[11px] font-medium tracking-[0.32em] uppercase mb-5">Coming soon</p>
          <Heading className="text-5xl md:text-6xl font-light text-white" style={{ fontFamily: "var(--font-display)" }}>
            More from <em className="italic text-gold">MVC.</em>
          </Heading>
        </Reveal>

        <ul className="grid sm:grid-cols-3 gap-4 mb-12">
          {ITEMS.map((i) => {
            const on = picked.includes(i.key);
            return (
              <li key={i.key}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPicked((p) => (on ? p.filter((k) => k !== i.key) : [...p, i.key]))}
                  className={`w-full h-full text-left rounded-2xl border p-6 transition-colors ${
                    on ? "border-gold/60 bg-gold/[0.04]" : "border-border hover:border-gold/30"
                  }`}
                >
                  <span className="text-[10px] tracking-[0.24em] uppercase text-gold/80">Soon</span>
                  <span className="block text-3xl font-light text-white mt-2 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    {i.title}
                  </span>
                  <span className="block text-white/50 text-sm leading-relaxed">{i.line}</span>
                  <span className="block text-[11px] text-white/40 mt-4">{on ? "✓ Notify me" : "Tap to be notified"}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {state === "done" ? (
          <p className="text-center text-gold text-sm">You&apos;re on the list. We&apos;ll email you when it&apos;s ready.</p>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-full bg-white/5 border border-border text-white text-sm placeholder:text-grey focus:outline-none focus:border-gold/60"
            />
            <button
              type="submit"
              disabled={state === "loading" || picked.length === 0}
              className="px-8 py-3.5 rounded-full bg-gold text-ink text-xs font-semibold tracking-[0.2em] uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {state === "loading" ? "Saving…" : "Notify me"}
            </button>
          </form>
        )}
        {state === "error" && <p className="text-red-400 text-xs text-center mt-3">Something went wrong. Please try again.</p>}
      </div>
    </section>
  );
}
