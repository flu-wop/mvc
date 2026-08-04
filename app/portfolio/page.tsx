import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink flex flex-col items-center justify-center text-white px-6 text-center pt-24">
        <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-4">Coming Soon</p>
        <h1 className="text-5xl mb-4" style={{ fontFamily: "var(--font-script)" }}>Portfolio</h1>
        <p className="text-white/50 max-w-md mb-8">
          Luxury lifestyle photography — nails, travel, restaurants, boutiques, events, and
          content examples. Launching soon.
        </p>
        <Link href="/" className="px-6 py-3 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold-light transition-all">← Back to Home</Link>
      </main>
      <Footer />
    </>
  );
}
