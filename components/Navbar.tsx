"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SHOP_ENABLED } from "@/lib/features";

// Book-first: the menu is short on purpose. Shop only appears once the
// retail side is switched on (see lib/features.ts).
const links = [
  { label: "Services", href: "/#services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  ...(SHOP_ENABLED ? [{ label: "Shop", href: "/shop" }] : []),
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-ink/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between h-[68px]">
        <Link href="/" aria-label="MVC Creations home" className="relative block h-11 w-28">
          <Image src="/images/logo-white.png" alt="MVC Creations" fill className="object-contain object-left" priority />
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/70 hover:text-gold transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="px-6 py-2.5 rounded-full text-[11px] font-semibold tracking-[0.2em] uppercase bg-gold text-ink hover:bg-gold-light transition-colors duration-200"
          >
            Book
          </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-2 -mr-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
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
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden overflow-hidden"
          >
            <nav className="flex flex-col px-6 pb-8 pt-2 gap-1" aria-label="Mobile">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-2xl text-white/85 hover:text-gold transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                onClick={() => setOpen(false)}
                className="mt-4 px-6 py-4 rounded-full text-sm font-semibold tracking-[0.2em] uppercase bg-gold text-ink w-full text-center"
              >
                Book
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
