/**
 * MVC Creations — Home Page
 * app/page.tsx
 */

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutTeaser from "@/components/AboutTeaser";
import ChooseExperience from "@/components/ChooseExperience";
import Services from "@/components/Services";
import ShopPreview from "@/components/ShopPreview";
import Tutorials from "@/components/Tutorials";
import FAQ from "@/components/FAQ";
import Policies from "@/components/Policies";
import BookingCTA from "@/components/BookingCTA";
import Footer from "@/components/Footer";
import FlowerDivider from "@/components/FlowerDivider";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <AboutTeaser />
        <FlowerDivider />
        <ChooseExperience />
        <Services />
        <FlowerDivider />
        <ShopPreview />
        <Tutorials />
        <FlowerDivider />
        <FAQ />
        <Policies />
        <BookingCTA />
      </main>

      <Footer />
    </>
  );
}
