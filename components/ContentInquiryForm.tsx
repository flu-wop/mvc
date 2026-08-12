"use client";

import { useState } from "react";

const PROJECT_TYPES = [
  "UGC Video",
  "Instagram Reels",
  "TikTok Content",
  "Photography",
  "Event Coverage",
  "Brand Partnership",
];

const BUDGET_RANGES = ["Under $500", "$500–$1,500", "$1,500–$3,000", "$3,000+", "Let's discuss"];

const TIMELINES = ["ASAP", "Within a month", "1–3 months", "Just exploring"];

const inputClasses =
  "w-full px-5 py-3 rounded-2xl bg-white/5 border border-border text-white text-sm placeholder:text-grey focus:outline-none focus:border-gold/50 transition-colors";

export default function ContentInquiryForm() {
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");
  const [instagramOrSite, setInstagramOrSite] = useState("");
  const [details, setDetails] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function toggleType(t: string) {
    setProjectTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (projectTypes.length === 0) {
      setError("Select at least one project type.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          contactName,
          email,
          phone,
          businessType,
          projectTypes,
          budgetRange,
          timeline,
          instagramOrSite,
          details,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="w-full max-w-xl mx-auto text-center py-16 px-6">
        <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-4">Inquiry Received</p>
        <h3 className="text-2xl md:text-3xl text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
          Thank you for reaching out.
        </h3>
        <p className="text-white/50 text-sm max-w-sm mx-auto">
          I&apos;ll review your project and get back to you within 1–2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          required
          maxLength={200}
          placeholder="Business name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className={inputClasses}
        />
        <input
          type="text"
          required
          maxLength={200}
          placeholder="Your name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          className={inputClasses}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="email"
          required
          maxLength={200}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClasses}
        />
        <input
          type="tel"
          maxLength={40}
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClasses}
        />
      </div>

      <input
        type="text"
        maxLength={200}
        placeholder="Type of business (restaurant, boutique, hotel, event, etc.)"
        value={businessType}
        onChange={(e) => setBusinessType(e.target.value)}
        className={`${inputClasses} mb-4`}
      />

      <p className="text-white/50 text-xs uppercase tracking-widest mb-3 mt-6">What do you need?</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {PROJECT_TYPES.map((t) => {
          const active = projectTypes.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggleType(t)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                active
                  ? "bg-gold text-ink border-gold"
                  : "bg-white/5 text-white/70 border-border hover:border-gold/50"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <select
          value={budgetRange}
          onChange={(e) => setBudgetRange(e.target.value)}
          className={`${inputClasses} appearance-none`}
        >
          <option value="" className="bg-ink">Budget range (optional)</option>
          {BUDGET_RANGES.map((b) => (
            <option key={b} value={b} className="bg-ink">{b}</option>
          ))}
        </select>
        <select
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          className={`${inputClasses} appearance-none`}
        >
          <option value="" className="bg-ink">Timeline (optional)</option>
          {TIMELINES.map((t) => (
            <option key={t} value={t} className="bg-ink">{t}</option>
          ))}
        </select>
      </div>

      <input
        type="text"
        maxLength={300}
        placeholder="Instagram or website (optional)"
        value={instagramOrSite}
        onChange={(e) => setInstagramOrSite(e.target.value)}
        className={`${inputClasses} mb-4`}
      />

      <textarea
        maxLength={2000}
        rows={4}
        placeholder="Tell me a bit about the project..."
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        className={`${inputClasses} rounded-2xl mb-4 resize-none`}
      />

      {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full px-7 py-3.5 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold-light transition-all duration-300 disabled:opacity-60"
      >
        {status === "loading" ? "Submitting..." : "Submit Inquiry"}
      </button>
    </form>
  );
}
