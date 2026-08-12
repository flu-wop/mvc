import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";

export default function BookPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink text-white pt-32 pb-24">
        <div className="text-center px-6 mb-14">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Book a Session
          </p>
          <h1 className="text-5xl mb-2" style={{ fontFamily: "var(--font-script)" }}>
            Let&apos;s get you booked
          </h1>
          <p className="text-white/50 text-sm max-w-sm mx-auto">
            Pick a service, a time that works, and reserve your spot with a deposit.
          </p>
        </div>
        <BookingForm />
      </main>
      <Footer />
    </>
  );
}
