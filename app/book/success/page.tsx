import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function BookingSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink text-white flex flex-col items-center justify-center text-center px-6 pt-24">
        <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-4">Booked</p>
        <h1 className="text-4xl md:text-5xl mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
          You&apos;re all set.
        </h1>
        <p className="text-white/50 max-w-sm mb-8 text-sm">
          Your deposit is confirmed and your appointment is reserved. A confirmation with the
          full details is on its way to your email.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold-light transition-all"
        >
          ← Back to Home
        </Link>
      </main>
      <Footer />
    </>
  );
}
