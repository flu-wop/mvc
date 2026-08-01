"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

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
  { label: "Instagram", href: "https://www.instagram.com/mvcxcreations", icon: InstagramIcon },
  { label: "Facebook", href: "https://www.facebook.com/mvcxcreations", icon: FacebookIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@mvcxcreations", icon: TikTokIcon },
];

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer ref={ref} className="relative bg-charcoal border-t border-border">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 mb-12"
        >
          {/* Brand */}
          <div>
            <span className="relative block h-10 w-40 mb-1">
              <Image
                src="/images/logo-white.png"
                alt="MVC Creations"
                fill
                className="object-contain object-left"
              />
            </span>
            <p className="text-white/45 text-sm leading-relaxed mt-4 mb-5 max-w-xs">
              Licensed nail technician based in Kenner, near MSY. Book below.
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
                    className="w-9 h-9 rounded-full bg-white/5 border border-border flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/40 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Hours */}
          <div>
            <p className="text-white text-xs font-semibold tracking-[0.15em] uppercase mb-4">
              Business Hours
            </p>
            <p className="text-white/60 text-sm">9:00 AM – 6:00 PM</p>
            <p className="text-white/60 text-sm mb-2">Monday – Saturday</p>
            <p className="text-white/40 text-sm">Closed Sunday</p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white text-xs font-semibold tracking-[0.15em] uppercase mb-4">
              Contact
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/60">
              <a href="tel:5043032763" className="flex items-center gap-2 hover:text-gold transition-colors">
                <Phone className="w-4 h-4 text-gold shrink-0" /> (504) 303-2763
              </a>
              <a href="mailto:mvcxreations@gmail.com" className="flex items-center gap-2 hover:text-gold transition-colors">
                <Mail className="w-4 h-4 text-gold shrink-0" /> mvcxreations@gmail.com
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0" /> Kenner, LA
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} MVC Creations · All rights reserved
          </p>
          <Link href="#booking" className="text-gold text-xs font-semibold hover:text-gold-light transition-colors">
            Book an appointment →
          </Link>
        </div>
      </div>
    </footer>
  );
}
