"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, MapPin } from "lucide-react";

// Instagram SVG icon (inline)
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

// TikTok SVG icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.78a4.85 4.85 0 01-1.07-.09z" />
    </svg>
  );
}

const footerLinks = {
  Pages: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Book", href: "/book" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Refund Policy", href: "/refunds" },
  ],
};

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/mvcxcreations",
    icon: InstagramIcon,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@mvcxcreations",
    // TODO: Update TikTok handle if different
    icon: TikTokIcon,
  },
];

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer ref={ref} className="relative bg-[#060606] border-t border-white/5">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F4C430]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20">

        {/* ── Main footer grid ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14"
        >
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-[#F4C430]" />
              <span className="text-xl" style={{ fontFamily: "var(--font-playfair)" }}>
                <span className="text-white font-bold">MVC</span>
                <span className="text-[#F4C430] font-normal italic ml-1">Creations</span>
              </span>
            </Link>

            <p
              className="text-white/45 text-sm leading-relaxed max-w-xs mb-6"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Licensed nail technician based in Kenner, near MSY. Custom acrylics, gel-X,
              nail art, and press-ons — every set built around you.
            </p>

            {/* Location */}
            <div className="flex items-center gap-2 text-white/35 text-sm mb-5">
              <MapPin className="w-4 h-4 text-[#FF1493] shrink-0" />
              <span>Kenner, Louisiana</span>
            </div>

            {/* Social icons */}
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
                    className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#FF1493] hover:border-[#FF1493]/30 hover:bg-[#FF1493]/10 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}

              {/* Instagram handle text link */}
              <a
                href="https://www.instagram.com/mvcxcreations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF1493] text-sm font-semibold hover:text-[#FF69B4] transition-colors ml-1"
              >
                @mvcxcreations
              </a>
            </div>

            <div className="flex flex-col gap-2 mt-5 text-sm text-white/45">
              <a href="tel:5043032763" className="hover:text-[#F4C430] transition-colors w-fit">
                (504) 303-2763
              </a>
              <a href="mailto:mvcxreations@gmail.com" className="hover:text-[#F4C430] transition-colors w-fit">
                mvcxreations@gmail.com
              </a>
              <p>9:00 AM – 6:00 PM · Mon–Sat</p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-white text-xs font-semibold tracking-[0.15em] uppercase mb-5">
                {group}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/45 text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* ── Google Maps embed ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          {/* Section header */}
          <div className="flex items-center gap-3 mb-5">
            <MapPin className="w-4 h-4 text-[#FF1493] shrink-0" />
            <h3
              className="text-white text-base font-semibold"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Visit Us in Kenner
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          {/* Map container — styled to match the dark site aesthetic */}
          <div className="relative rounded-2xl overflow-hidden border border-white/8 shadow-[0_0_40px_rgba(255,20,147,0.05)]">
            {/* Coloured top bar accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 z-10 bg-gradient-to-r from-[#FF1493] via-[#F4C430] to-[#0A3D33]" />

            <iframe
              src="https://www.google.com/maps?q=Kenner,LA&output=embed"
              width="100%"
              height="320"
              style={{ border: 0, display: "block", filter: "grayscale(20%) contrast(1.05)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MVC Creations — Kenner, LA"
            />
          </div>

          {/* Caption */}
          <p className="text-white/35 text-xs mt-3 flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#FF1493]" />
            Residential-based in Kenner — travel appointments available on request
          </p>
        </motion.div>

        {/* ── Booking CTA strip ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="rounded-2xl border border-[#FF1493]/20 bg-[#FF1493]/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-14"
        >
          <p className="text-white text-base font-medium" style={{ fontFamily: "var(--font-playfair)" }}>
            Ready to transform your nails?
          </p>
          <a
            href="https://mvcxcreations.as.me/schedule/27795b22"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full bg-[#FF1493] text-white text-sm font-semibold hover:bg-[#FF1493]/90 transition-all duration-200 hover:shadow-[0_0_24px_rgba(255,20,147,0.4)] shrink-0"
          >
            Book Your Session ✦
          </a>
        </motion.div>

        {/* ── Bottom bar ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/5"
        >
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} MVC Creations · All rights reserved
          </p>
          <p className="text-white/25 text-xs">
            Built with love on{" "}
            <span className="text-[#F4C430]/50">Vercel</span> +{" "}
            <span className="text-[#F4C430]/50">Next.js</span> ✦
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
