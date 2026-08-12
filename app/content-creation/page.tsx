import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContentInquiryForm from "@/components/ContentInquiryForm";

export default function ContentCreationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink text-white pt-32 pb-24">
        <div className="text-center px-6 mb-16">
          <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-4">
            Content Creation
          </p>
          <h1 className="text-4xl md:text-5xl mb-5" style={{ fontFamily: "var(--font-script)" }}>
            Authentic content, made simple.
          </h1>
          <p className="text-white/50 max-w-md mx-auto text-sm md:text-base">
            UGC videos, Instagram Reels, TikTok content, and photography for restaurants,
            boutiques, hotels, beauty brands, and events. Tell me about your business below.
          </p>
        </div>

        <ContentInquiryForm />
      </main>
      <Footer />
    </>
  );
}
