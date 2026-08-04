import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopPreview from "@/components/ShopPreview";

export default function ShopPage() {
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
