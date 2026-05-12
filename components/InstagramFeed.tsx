"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

// TODO: Replace these placeholder images with real @mvcxcreations latest posts.
// Options:
//   A) Hardcode: swap each `src` and `href` below with the actual image CDN URL
//      and Instagram post URL (e.g. https://www.instagram.com/p/POSTID/).
//   B) Instagram Graph API: fetch via GET https://graph.instagram.com/me/media
//      with fields=id,media_url,permalink,thumbnail_url,media_type
//      using a long-lived access token stored in INSTAGRAM_ACCESS_TOKEN env var.
//      See: https://developers.facebook.com/docs/instagram-basic-display-api
//   C) Third-party: use a service like Curator.io, Elfsight, or Behold.so
//      for a zero-code embed.

const instaPosts = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=85",
    alt: "Emerald and gold tropical press-on nails — custom set for a New Orleans bride",
    href: "https://www.instagram.com/mvcxcreations",
    tall: true,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=600&q=85",
    alt: "Hand-painted pink floral press-on nails with crystal embellishments",
    href: "https://www.instagram.com/mvcxcreations",
    tall: false,
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1604055035853-e7ea07e1e5c3?w=600&q=85",
    alt: "Black and gold abstract art press-on nails — Mardi Gras inspired",
    href: "https://www.instagram.com/mvcxcreations",
    tall: false,
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=85",
    alt: "Iridescent chrome coffin press-on nails catching the New Orleans sun",
    href: "https://www.instagram.com/mvcxcreations",
    tall: true,
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=600&q=85",
    alt: "Vibrant Honduran-inspired coral and green press-on nail art",
    href: "https://www.instagram.com/mvcxcreations",
    tall: false,
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1604055035853-e7ea07e1e5c3?w=600&q=85",
    alt: "Luxury full set with 3D rose embellishments and gold foil detail",
    href: "https://www.instagram.com/mvcxcreations",
    tall: true,
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=85",
    alt: "Hot pink ombre almond press-on nails for a bachelorette party",
    href: "https://www.instagram.com/mvcxcreations",
    tall: false,
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=600&q=85",
    alt: "Deep emerald gel press-on nails with hand-painted gold leaf accents",
    href: "https://www.instagram.com/mvcxcreations",
    tall: false,
  },
];

// Instagram SVG icon (inline so no extra dependency)
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const tileVariant = {
  hidden: { opacity: 0, scale: 0.93 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } },
};

export default function InstagramFeed() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-[#0A0A0A] relative overflow-hidden">
      {/* Accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF1493]/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F4C430]/20 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#FF1493]/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <p className="text-[#F4C430] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            ✦ Follow the Vibes
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            <span className="text-[#FF1493] italic">@mvcxcreations</span>
          </h2>
          <p className="text-white/45 text-base max-w-sm mx-auto">
            Fresh sets, behind-the-scenes, and nail inspo — live on Instagram.
          </p>
        </motion.div>

        {/* Masonry grid — 2 cols mobile, 3 tablet, 4 desktop */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3"
        >
          {instaPosts.map((post) => (
            <motion.a
              key={post.id}
              variants={tileVariant}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block rounded-xl overflow-hidden mb-3 break-inside-avoid"
              aria-label={`View Instagram post: ${post.alt}`}
            >
              {/* Image */}
              <div className={`relative w-full ${post.tall ? "aspect-[3/4]" : "aspect-square"}`}>
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-[#FF1493]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-350 flex items-center justify-center">
                  {/* Instagram icon centered on hover */}
                  <div className="flex flex-col items-center gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-350">
                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <InstagramIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white text-xs font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                      View Post
                    </span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <a
            href="https://www.instagram.com/mvcxcreations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF1493] to-[#FF69B4] text-white font-semibold text-sm hover:shadow-[0_0_40px_rgba(255,20,147,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <InstagramIcon className="w-4 h-4" />
            Follow on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
