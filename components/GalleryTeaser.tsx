"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    alt: "Emerald green and gold press-on nails with floral embellishments",
    tall: true,
  },
  {
    src: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=600&q=80",
    alt: "Pastel pink butterfly press-on nail art with crystal details",
    tall: false,
  },
  {
    src: "https://images.unsplash.com/photo-1604055035853-e7ea07e1e5c3?w=600&q=80",
    alt: "Abstract marble press-on nails in black and white",
    tall: false,
  },
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    alt: "Hot pink coffin-shape press-on nails with tropical leaf art",
    tall: true,
  },
  {
    src: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=600&q=80",
    alt: "Holographic chrome almond press-on nails",
    tall: false,
  },
  {
    src: "https://images.unsplash.com/photo-1604055035853-e7ea07e1e5c3?w=600&q=80",
    alt: "Gold foil and glitter festive press-on nails for New Orleans Carnival",
    tall: true,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const imageVariant = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function GalleryTeaser() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="gallery" ref={ref} className="py-24 md:py-32 bg-[#090909] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F4C430]/30 to-transparent" />
      <div className="absolute -right-40 top-1/3 w-[400px] h-[400px] rounded-full bg-[#FF1493]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="text-[#F4C430] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            ✦ The Work
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Every Set is a{" "}
            <span className="text-[#FF1493] italic">Masterpiece</span>
          </h2>
          <p className="text-white/50 max-w-sm mx-auto text-base">
            A peek into what&apos;s coming off the nail table lately.
          </p>
        </motion.div>

        {/* Masonry Gallery */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="masonry-grid"
        >
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              variants={imageVariant}
              className="masonry-item group relative rounded-xl overflow-hidden cursor-pointer"
            >
              <div className={`relative w-full ${img.tall ? "aspect-[3/4]" : "aspect-square"}`}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FF1493]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-[#FF1493] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_8px_rgba(255,20,147,0.8)]" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-14 text-center"
        >
          <Link
            href="/gallery"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
          >
            View Full Gallery ✦
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
