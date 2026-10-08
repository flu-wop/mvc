import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Policies from "@/components/Policies";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Booking Policies | MVC Creations",
  description: "Deposits, cancellations, late arrivals and how to prepare for your MVC Creations appointment.",
  alternates: { canonical: "/policies" },
};

export default function PoliciesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink pt-24">
        <Policies />
        <div className="text-center pb-24">
          <Link
            href="/book"
            className="inline-flex px-12 py-4 rounded-full bg-gold text-ink text-sm font-semibold tracking-[0.22em] uppercase hover:bg-gold-light transition-colors"
          >
            Book
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
