import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function ShopSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink flex flex-col items-center justify-center text-center px-6 pt-24">
        <CheckCircle className="w-12 h-12 text-gold mb-5" />
        <h1 className="text-4xl mb-3" style={{ fontFamily: "var(--font-script)" }}>
          Thank You For Your Order
        </h1>
        <p className="text-white/60 max-w-md mb-8">
          Your order has been received. A confirmation will be sent to your email shortly.
        </p>
        <Link href="/shop" className="px-6 py-3 rounded-full bg-gold text-ink font-semibold text-sm hover:bg-gold-light transition-all">
          Continue Shopping
        </Link>
      </main>
      <Footer />
    </>
  );
}
