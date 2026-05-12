// /app/book/page.tsx
// This page can either embed Acuity directly or redirect to the external scheduler
// Option: Add `redirect('https://mvcxcreations.as.me/schedule/27795b22')` from next/navigation for instant redirect

import Link from "next/link";

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center text-white px-6 text-center">
      <p className="text-[#F4C430] text-xs font-semibold tracking-widest uppercase mb-4">Book a Session</p>
      <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Let&apos;s Get Glam</h1>
      <p className="text-white/50 mb-8 max-w-sm">Choose your service and pick a time that works for you.</p>
      {/* TODO: Replace with embedded Acuity iframe */}
      <a
        href="https://mvcxcreations.as.me/schedule/27795b22"
        target="_blank"
        rel="noopener noreferrer"
        className="px-8 py-4 rounded-full bg-[#FF1493] text-white font-bold text-base hover:bg-[#FF1493]/90 transition-all hover:shadow-[0_0_40px_rgba(255,20,147,0.4)] mb-6"
      >
        Open Full Scheduler ✦
      </a>
      <Link href="/" className="text-white/40 text-sm hover:text-white transition-colors">← Back to Home</Link>
    </main>
  );
}
