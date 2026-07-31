// TODO: Build out /gallery with full masonry grid, lightbox, and Instagram feed embed
import Link from "next/link";
export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center text-white px-6 text-center">
      <p className="text-[#F4C430] text-xs font-semibold tracking-widest uppercase mb-4">Coming Soon</p>
      <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Gallery</h1>
      <p className="text-white/50 mb-8">This page is under construction.</p>
      <Link href="/" className="px-6 py-3 rounded-full bg-[#FF1493] text-white font-semibold text-sm hover:bg-[#FF1493]/90 transition-all">← Back to Home</Link>
    </main>
  );
}
