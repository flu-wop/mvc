import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ContentCreationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink flex flex-col items-center justify-center text-white px-6 text-center pt-24">
        <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-4">Coming Soon</p>
        <h1 className="text-5xl mb-4" style={{ fontFamily: "var(--font-script)" }}>Content Creation</h1>
        <p className="text-white/50 max-w-md mb-8">
          UGC videos, Instagram Reels, TikTok content, and photography for restaurants,
          boutiques, hotels, beauty brands, and events. Details launching soon.
        </p>
        <Link href="/" className="px-6 py-3 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold-light transition-all">
          ← Back to Home
        </Link>
      </main>
      <Footer />
    </>
  );
}
