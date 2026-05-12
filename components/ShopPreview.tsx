"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

// TODO: Replace with Shopify Storefront API integration (use @shopify/hydrogen or custom fetch)
// Example fetch:
// const { data } = await fetch(process.env.SHOPIFY_STORE_URL + '/api/2024-01/graphql.json', {
//   method: 'POST',
//   headers: {
//     'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN!,
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({ query: `{ products(first: 4) { edges { node { id title priceRange ... } } } }` }),
// }).then(r => r.json());

const mockProducts = [
  {
    id: 1,
    name: "Botanical Dream Set",
    price: "$58",
    tag: "Bestseller",
    tagColor: "#FF1493",
    image: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=600&q=80",
    alt: "Pink and green floral press-on nails with botanical leaf art design",
  },
  {
    id: 2,
    name: "Midnight Luxe Set",
    price: "$65",
    tag: "New",
    tagColor: "#F4C430",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    alt: "Deep black and gold press-on nails with geometric luxury pattern",
  },
  {
    id: 3,
    name: "Carnival Chrome Set",
    price: "$72",
    tag: "Limited",
    tagColor: "#0A3D33",
    image: "https://images.unsplash.com/photo-1604055035853-e7ea07e1e5c3?w=600&q=80",
    alt: "Iridescent chrome press-on nails inspired by New Orleans Mardi Gras",
  },
  {
    id: 4,
    name: "Tropical Bloom Set",
    price: "$55",
    tag: null,
    tagColor: null,
    image: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?w=600&q=80",
    alt: "Vibrant tropical flower press-on nails with Honduran-inspired color palette",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function ShopPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="shop" ref={ref} className="py-24 md:py-32 relative bg-[#080808]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF1493]/30 to-transparent" />
      <div className="absolute -left-60 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#0A3D33]/20 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <p className="text-[#F4C430] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              ✦ Featured Press-Ons & Products
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Shop the Collection
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 text-[#F4C430] text-sm font-semibold hover:text-white transition-colors"
          >
            View Full Shop →
          </Link>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {mockProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariant}
              className="card-lift group rounded-2xl overflow-hidden border border-white/5 bg-[#111111] flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {product.tag && (
                  <div
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: product.tagColor! }}
                  >
                    {product.tag}
                  </div>
                )}
                <div className="absolute inset-0 bg-obsidian/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                  <h3
                    className="text-white font-semibold text-base"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-[#F4C430] font-bold text-lg mt-1">{product.price}</p>
                </div>
                {/* TODO: Wire up to Shopify cart / Storefront API addCartLines mutation */}
                <button className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#FF1493]/10 border border-[#FF1493]/30 text-[#FF1493] text-sm font-semibold hover:bg-[#FF1493] hover:text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,20,147,0.3)]">
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[#F4C430]/50 text-[#F4C430] font-semibold text-sm hover:bg-[#F4C430]/10 transition-all duration-300"
          >
            View Full Shop ✦
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
