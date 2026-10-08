"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import InquiryModal from "./InquiryModal";
import { BUSINESS } from "@/lib/site";
import { SHOP_ENABLED } from "@/lib/features";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.78a4.85 4.85 0 01-1.07-.09z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99h-2.54V12h2.54V9.8c0-2.5 1.5-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 16.99 22 12z" />
    </svg>
  );
}

const socials = [
  { label: "Instagram", href: BUSINESS.instagram, icon: InstagramIcon },
  { label: "Facebook", href: BUSINESS.facebook, icon: FacebookIcon },
  { label: "TikTok", href: BUSINESS.tiktok, icon: TikTokIcon },
];

const quickLinks = [
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Booking policies", href: "/policies" },
  ...(SHOP_ENABLED ? [{ label: "Shop", href: "/shop" }] : []),
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [inquiryOpen, setInquiryOpen] = useState(false);

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
    <footer className="relative bg-charcoal border-t border-border pb-24 md:pb-0">
      {/* VIP list */}
      <div className="border-b border-border">
        <div className="max-w-2xl mx-auto px-5 md:px-8 py-14 text-center">
          <h3 className="text-3xl md:text-4xl text-white mb-3 font-light" style={{ fontFamily: "var(--font-display)" }}>
            Get first dibs on openings
          </h3>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            Join the MVC VIP list for new appointment times, seasonal sets and the occasional offer.
          </p>
          {status === "done" ? (
            <p className="text-gold text-sm font-medium">You&apos;re on the list. Thank you!</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                aria-label="Email address"
                className="flex-1 px-5 py-3 rounded-full bg-white/5 border border-border text-white text-sm placeholder:text-grey focus:outline-none focus:border-gold/50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-7 py-3 rounded-full border border-gold/50 text-gold text-xs font-semibold tracking-[0.18em] uppercase hover:bg-gold hover:text-ink transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Joining..." : "Join"}
              </button>
            </form>
          )}
          {status === "error" && <p className="text-red-400 text-xs mt-3">Something went wrong. Please try again.</p>}
          {status !== "done" && (
            <p className="text-grey text-xs mt-3">
              No spam. By joining you agree to our{" "}
              <Link href="/privacy" className="hover:text-gold transition-colors underline">
                Privacy Policy
              </Link>
              .
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-14 pb-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 mb-12">
          <div>
            <span className="relative block h-12 w-32 mb-4">
              <Image src="/images/logo-white.png" alt="MVC Creations" fill className="object-contain object-left" />
            </span>
            <p className="text-white/45 text-sm leading-relaxed mb-5">
              {BUSINESS.city}
              <br />
              By appointment, Monday to Saturday
              <br />
              Travel appointments available
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full bg-white/5 border border-border flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/40 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-white text-[11px] font-medium tracking-[0.25em] uppercase mb-5">Contact</p>
            <div className="flex flex-col gap-3 text-sm text-white/60">
              <a href={BUSINESS.phoneHref} className="flex items-center gap-2 hover:text-gold transition-colors w-fit">
                <Phone className="w-4 h-4 text-gold shrink-0" /> {BUSINESS.phone}
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 hover:text-gold transition-colors w-fit">
                <Mail className="w-4 h-4 text-gold shrink-0" /> {BUSINESS.email}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0" /> {BUSINESS.city}
              </span>
            </div>
          </div>

          <div>
            <p className="text-white text-[11px] font-medium tracking-[0.25em] uppercase mb-5">Explore</p>
            <div className="flex flex-col gap-2.5 text-sm text-white/60">
              {quickLinks.map((l) => (
                <Link key={l.label} href={l.href} className="hover:text-gold transition-colors w-fit">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <p className="text-white/30 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} MVC Creations · All rights reserved ·{" "}
            <Link href="/privacy" className="hover:text-gold transition-colors">
              Privacy Policy
            </Link>
          </p>
          <button
            onClick={() => setInquiryOpen(true)}
            className="text-xs text-white/40 hover:text-gold transition-colors underline underline-offset-4 decoration-white/15"
          >
            Brand &amp; content inquiries
          </button>
        </div>
      </div>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </footer>
  );
}
