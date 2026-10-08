"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const inputClasses =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-border text-white text-sm placeholder:text-grey focus:outline-none focus:border-gold/60 transition-colors";

// Short brand / content inquiry. Content creation and collabs live here, in
// the footer, instead of competing with Book on the homepage. Posts to the
// same /api/inquiries table as the long form on /content-creation.
export default function InquiryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [brand, setBrand] = useState("");
  const [kind, setKind] = useState("Brand Partnership");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstField.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: name,
          email,
          businessName: brand || name,
          projectTypes: [kind],
          details,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("done");
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-5"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-title"
    >
      <div className="w-full sm:max-w-md max-h-[92svh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-charcoal border border-border p-6 sm:p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-gold text-[11px] font-medium tracking-[0.3em] uppercase mb-2">Brands &amp; content</p>
            <h2 id="inquiry-title" className="text-3xl text-white" style={{ fontFamily: "var(--font-display)" }}>
              Let&apos;s work together
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-white/50 hover:text-white p-1 -mr-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === "done" ? (
          <div className="py-8 text-center">
            <p className="text-gold text-lg mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Thank you. I&apos;ll be in touch soon.
            </p>
            <button onClick={onClose} className="text-xs tracking-[0.18em] uppercase text-white/50 hover:text-gold mt-4">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input ref={firstField} required maxLength={200} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} />
            <input required type="email" maxLength={200} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} />
            <input maxLength={200} placeholder="Brand or business (optional)" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClasses} />
            <select value={kind} onChange={(e) => setKind(e.target.value)} className={inputClasses} aria-label="What are you looking for">
              <option>Brand Partnership</option>
              <option>UGC Video</option>
              <option>Instagram Reels</option>
              <option>TikTok Content</option>
              <option>Photography</option>
              <option>Event Coverage</option>
            </select>
            <textarea rows={4} maxLength={2000} placeholder="Tell me about your idea" value={details} onChange={(e) => setDetails(e.target.value)} className={`${inputClasses} resize-none`} />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3.5 rounded-full bg-gold text-ink text-xs font-semibold tracking-[0.22em] uppercase hover:bg-gold-light transition-colors disabled:opacity-60"
            >
              {status === "loading" ? "Sending..." : "Send inquiry"}
            </button>
            <p className="text-center text-xs text-white/40 pt-1">
              Prefer the full brief?{" "}
              <Link href="/content-creation" onClick={onClose} className="underline underline-offset-4 hover:text-gold">
                Use the detailed form
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
