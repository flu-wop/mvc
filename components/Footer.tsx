import Link from "next/link";
import { Sparkles, MapPin, Instagram } from "lucide-react";

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

export default function Footer() {
  return (
    <footer className="relative bg-[#060606] border-t border-white/5">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F4C430]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-[#F4C430]" />
              <span
                className="text-xl"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                <span className="text-white font-bold">MVC</span>
                <span className="text-[#F4C430] font-normal italic ml-1">
                  Creations
                </span>
              </span>
            </Link>
            <p
              className="text-white/45 text-sm leading-relaxed max-w-xs mb-6"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Luxury custom press-on nails handcrafted with Honduran artistry
              and New Orleans soul. Every set is wearable art.
            </p>

            {/* Location */}
            <div className="flex items-center gap-2 text-white/35 text-sm mb-5">
              <MapPin className="w-4 h-4 text-[#FF1493] shrink-0" />
              <span>New Orleans, Louisiana 🎷</span>
            </div>

            {/* Instagram */}
            <a
              href="https://instagram.com/mvccreations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#FF1493] text-sm font-semibold hover:text-[#FF69B4] transition-colors"
            >
              <Instagram className="w-4 h-4" />
              @mvccreations
            </a>
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
        </div>

        {/* Booking CTA strip */}
        <div className="rounded-2xl border border-[#FF1493]/20 bg-[#FF1493]/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-14">
          <p
            className="text-white text-base font-medium"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
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
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/5">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} MVC Creations · All rights reserved
          </p>
          <p className="text-white/25 text-xs">
            Built with love on{" "}
            <span className="text-[#F4C430]/50">Vercel</span> +{" "}
            <span className="text-[#F4C430]/50">Next.js</span> ✦
          </p>
        </div>
      </div>
    </footer>
  );
}
