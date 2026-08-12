"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const primaryNav = [
  { label: "Services", href: "/#services" },
  { label: "Book", href: "/book" },
  { label: "Shop", href: "/shop" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Content Creation", href: "/content-creation" },
  { label: "FAQ", href: "/faq" },
];

const fullNav = [
  { label: "Behind the Brand", href: "/about" },
  { label: "Services", href: "/#services" },
  { label: "Book", href: "/book" },
  { label: "Press-Ons", href: "/press-ons" },
  { label: "Shop", href: "/shop" },
  { label: "Content Creation", href: "/content-creation" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ink/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between h-[68px]">
        <Link href="/" className="text-2xl" style={{ fontFamily: "var(--font-script)" }}>
          <span className="text-white">MVC Creations</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-sm">
          {primaryNav.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-white/70 hover:text-gold transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/book"
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-gold text-ink hover:bg-gold-light transition-all duration-200 active:scale-95"
          >
            Book Now
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-white p-1"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-ink/98 backdrop-blur-xl border-t border-border overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-6 gap-5">
              {fullNav.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-white/80 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="inline-block mt-2 px-6 py-3 rounded-full text-sm font-semibold bg-gold text-ink w-full text-center hover:bg-gold-light transition-all"
              >
                Book Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
