"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { formatDuration, formatPrice, groupByCategory, type Service } from "@/lib/service-defaults";

// The full booking menu, grouped by category like the Booking Policies accordion.
// On the homepage each row links to /book; inside the booking flow it calls onSelect.
export default function MenuAccordion({
  services,
  onSelect,
  defaultOpen,
}: {
  services: Service[];
  onSelect?: (s: Service) => void;
  defaultOpen?: string;
}) {
  const groups = groupByCategory(services);
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);

  return (
    <div className="border-t border-gold/25">
      {groups.map((g) => {
        const isOpen = open === g.category;
        const id = `menu-${g.category.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
        return (
          <div key={g.category} className="border-b border-gold/25">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : g.category)}
              className="w-full flex items-center justify-between gap-4 py-6 text-left group"
            >
              <span>
                <span className="block text-2xl md:text-3xl font-light text-white group-hover:text-gold transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                  {g.category}
                </span>
                <span className="block text-white/40 text-xs mt-1">
                  {g.items.length} {g.items.length === 1 ? "service" : "services"}
                </span>
              </span>
              <ChevronDown className={`w-5 h-5 text-gold shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <ul id={id} className="pb-4">
                {g.items.map((s) => {
                  const inner = (
                    <>
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg text-white group-hover/row:text-gold transition-colors">{s.title}</span>
                        {s.blurb && <span className="block text-white/45 text-xs leading-relaxed mt-1 max-w-md">{s.blurb}</span>}
                      </span>
                      <span className="text-xs tracking-[0.08em] text-silver whitespace-nowrap text-right">
                        {formatDuration(s.durationMinutes)}
                        <br />
                        <span className="text-white">{s.fromCents ? `from ${formatPrice(s.fromCents)}` : "Free"}</span>
                      </span>
                    </>
                  );
                  const cls = "group/row w-full flex items-start justify-between gap-5 py-4 px-1 text-left border-t border-white/5 hover:bg-white/[0.02] focus-visible:outline-none focus-visible:bg-white/[0.04]";
                  return (
                    <li key={s.slug}>
                      {onSelect ? (
                        <button type="button" onClick={() => onSelect(s)} className={cls}>{inner}</button>
                      ) : (
                        <Link href={`/book?service=${s.slug}`} className={cls}>{inner}</Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
