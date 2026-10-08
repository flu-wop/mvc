import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopPreview from "@/components/ShopPreview";
import ComingSoon from "@/components/home/ComingSoon"; // PLACEHOLDER: remove before launch
import { notFound } from "next/navigation";
import { COMING_SOON_ENABLED, SHOP_ENABLED } from "@/lib/features";

export const metadata: Metadata = { title: "Shop — coming soon", robots: { index: false } };

export default function ShopPage() {
  if (!SHOP_ENABLED && !COMING_SOON_ENABLED) notFound();
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink pt-24">{SHOP_ENABLED ? <ShopPreview /> : <ComingSoon standalone />}</main>
      <Footer />
    </>
  );
}
