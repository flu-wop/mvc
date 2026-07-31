/**
 * MVC Creations — Home Page
 * app/page.tsx
 */

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutTeaser from "@/components/AboutTeaser";
import Services from "@/components/Services";
import ShopPreview from "@/components/ShopPreview";
import Policies from "@/components/Policies";
import BookingCTA from "@/components/BookingCTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <AboutTeaser />
        <Services />
        <ShopPreview />
        <Policies />
        <BookingCTA />
      </main>

      <Footer />
    </>
  );
}
