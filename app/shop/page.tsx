import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopPreview from "@/components/ShopPreview";
import { notFound } from "next/navigation";
import { SHOP_ENABLED } from "@/lib/features";

export default function ShopPage() {
  if (!SHOP_ENABLED) notFound();
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink pt-24">
        <ShopPreview />
      </main>
      <Footer />
    </>
  );
}
