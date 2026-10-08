"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// One tap from anywhere. Desktop already has Book in the navbar, so this is
// the mobile-only bottom-center pill.
export default function StickyBook() {
  const pathname = usePathname();
  // The hero already has a Book button, so the pill only appears once it has scrolled away.
  const [past, setPast] = useState(false);
  useEffect(() => {
    const on = () => setPast(window.scrollY > window.innerHeight * 0.7);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [pathname]);
  if (pathname.startsWith("/book") || pathname.startsWith("/admin") || pathname.startsWith("/card")) return null;
  if (pathname === "/" && !past) return null;
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 flex justify-center pointer-events-none safe-bottom">
      <Link
        href="/book"
        className="pointer-events-auto px-9 py-3.5 rounded-full bg-gold text-ink text-sm font-semibold tracking-[0.18em] uppercase shadow-[0_8px_30px_rgba(0,0,0,0.55)] active:scale-95 transition-transform"
      >
        Book
      </Link>
    </div>
  );
}
