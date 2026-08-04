import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";
import Link from "next/link";

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink pt-24">
        <div className="text-center pt-10 px-5">
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Everything you need to know before booking your luxury experience.
          </p>
        </div>
        <FAQ />
        <div className="max-w-2xl mx-auto px-5 md:px-8 py-14 text-center border-t border-border">
          <h2 className="text-3xl mb-3" style={{ fontFamily: "var(--font-script)" }}>
            Still Have Questions?
          </h2>
          <p className="text-white/50 text-sm mb-7 max-w-md mx-auto">
            Feel free to reach out, and I&apos;ll get back to you as soon as possible. I look
            forward to welcoming you to the MVC Creations experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#booking" className="px-7 py-3 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold-light transition-all">
              Book Your Appointment
            </Link>
            <Link href="/contact" className="px-7 py-3 rounded-full border border-white/30 text-white font-medium text-sm hover:border-gold hover:text-gold transition-all">
              Contact Me
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
