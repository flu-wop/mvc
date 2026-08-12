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
import FeaturedCollaborations from "@/components/FeaturedCollaborations";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <AboutTeaser />
        <ChooseExperience />
        <Services />
        <ShopPreview />
        <Tutorials />
        <FeaturedCollaborations />
        <FAQ />
        <Policies />
      </main>

      <Footer />
    </>
  );
}
