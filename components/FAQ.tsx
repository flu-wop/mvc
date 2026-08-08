"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const groups: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Luxury Nail Services",
    items: [
      {
        q: "What nail services do you offer?",
        a: "I specialize in acrylic enhancements, Gel-X, builder gel, natural nail services, custom nail art, and luxury press-on nails. Whether you're looking for something timeless and elegant or bold and detailed, I'd love to bring your vision to life.",
      },
      {
        q: "Do you offer custom nail art?",
        a: "Absolutely! Nail art is one of my favorite parts of being a nail artist. Feel free to send inspiration photos before your appointment so we can discuss your desired look.",
      },
      {
        q: "How long do appointments take?",
        a: "Appointment times vary depending on the service and design complexity. Most appointments range from 1.5–4 hours.",
      },
      {
        q: "Do you work on other nail technicians' work?",
        a: "No, however a soak-off may be performed before beginning a new service.",
      },
    ],
  },
  {
    title: "Press-On Nails",
    items: [
      {
        q: "Do you offer custom press-on nails?",
        a: "Yes! Every custom set is handcrafted with attention to detail to create a luxury salon-quality experience at home.",
      },
      {
        q: "How do I know my nail sizes?",
        a: "For the most accurate fit, I highly recommend purchasing a sizing kit before ordering your custom press-on set. Order a sizing kit for the most accurate fit before purchasing your custom set. Each kit includes your selected nail shape, numbered sizing tips, and a sizing card to record your measurements — select your desired shape, enter your shipping address, and write down each nail size using the included sizing card. After sizing is completed, contact me to discuss your custom set design before placing your press-on order. Once your sizes are confirmed, they can be saved on file for faster ordering in the future.",
      },
      {
        q: "How long does production take?",
        a: "Sizing kits: 5–15 business days. Custom press-on sets: an additional 5–15 business days depending on design complexity and order volume. If you need your nails by a certain date, please contact me before placing your order.",
      },
    ],
  },
  {
    title: "Booking Policies",
    items: [
      {
        q: "Is a deposit required?",
        a: "Yes. A non-refundable deposit is required to reserve every appointment. Deposits apply toward your service total.",
      },
      {
        q: "Can I reschedule?",
        a: "Absolutely! Please provide at least 24 hours' notice to transfer your deposit. Appointments canceled without proper notice may require a new deposit.",
      },
      {
        q: "What if I'm running late?",
        a: "Please notify me as soon as possible. Clients arriving more than 15 minutes late may need to reschedule depending on my schedule.",
      },
      {
        q: "What forms of payment do you accept?",
        a: "Details on accepted payment methods are available at booking.",
      },
    ],
  },
  {
    title: "Shipping",
    items: [
      {
        q: "How long does shipping take?",
        a: "Shipping times vary depending on your location and current order volume. Tracking information will be provided once your order has shipped.",
      },
      {
        q: "Will I receive tracking?",
        a: "Absolutely! Every shipped order includes tracking information.",
      },
      {
        q: "Do you ship in the U.S.?",
        a: "Yes — shipping is currently within the United States.",
      },
    ],
  },
  {
    title: "Returns & Exchanges",
    items: [
      {
        q: "Do you accept returns?",
        a: "Due to the custom nature of press-on nails, all sales are final.",
      },
      {
        q: "What if my order arrives damaged?",
        a: "Please contact me within 48 hours of delivery with photos so I can review the issue and help find the best solution.",
      },
      {
        q: "What if I ordered the wrong size?",
        a: "Sizing kits are highly recommended before placing custom orders. MVC Creations is not responsible for incorrect sizing submitted by the customer.",
      },
    ],
  },
  {
    title: "Mobile & Travel Services",
    items: [
      {
        q: "Do you offer mobile appointments?",
        a: "Yes! Mobile appointments are available for clients who prefer the convenience of being serviced in their home or preferred location. Travel fees apply separately from the nail service, and require a non-refundable 50% deposit to secure booking.",
      },
      {
        q: "Are there additional travel fees?",
        a: "Yes. Travel fees vary based on distance, parking, same-day requests, and special accommodations.",
      },
      {
        q: "Do you travel out of state?",
        a: "Yes! Out-of-state appointments are available upon request. Travel accommodations and a non-refundable travel retainer are required.",
      },
    ],
  },
  {
    title: "Content Creation",
    items: [
      {
        q: "What content creation services do you offer?",
        a: "I create authentic lifestyle content for restaurants, boutiques, beauty brands, hotels, salons, small businesses, and events — including Instagram Reels, TikTok videos, photography, UGC content, product features, and event coverage.",
      },
      {
        q: "Do you offer monthly content packages?",
        a: "Yes! Custom monthly packages are available for businesses looking for consistent social media content.",
      },
      {
        q: "How do I inquire?",
        a: "Simply fill out the contact form or email me at Cxrtes.margie@gmail.com to discuss your vision — I'd love to create a package tailored to your business.",
      },
    ],
  },
  {
    title: "General Questions",
    items: [
      {
        q: "Where are you located?",
        a: "I'm a licensed nail artist based in Kenner, Louisiana, serving clients throughout the Greater New Orleans area — and willing to travel.",
      },
      {
        q: "Do you accept walk-ins?",
        a: "Appointments are highly required to ensure availability.",
      },
      {
        q: "How can I contact you?",
        a: "Email, phone, or the website contact form.",
      },
      {
        q: "Do you collaborate with brands?",
        a: "Absolutely! I'm always excited to collaborate with beauty brands, local businesses, restaurants, boutiques, hotels, and other creatives. If you're interested in working together, I'd love to hear from you.",
      },
    ],
  },
];

function FAQGroup({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      <h3 className="text-white text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
        {title}
      </h3>
      <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-white text-sm font-medium">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-grey shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="text-grey text-sm leading-relaxed px-5 pb-5">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="faq" ref={ref} className="py-14 md:py-16 bg-ink border-t border-border">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">FAQs</p>
          <h2 className="text-4xl md:text-5xl mb-3" style={{ fontFamily: "var(--font-script)" }}>
            Frequently Asked Questions
          </h2>
          <p className="text-grey text-sm max-w-md mx-auto">
            Everything you need to know before booking your luxury experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {groups.map((group) => (
            <FAQGroup key={group.title} title={group.title} items={group.items} />
          ))}
        </div>
      </div>
    </section>
  );
}
