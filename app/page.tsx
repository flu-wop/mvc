/**
 * MVC Creations — Home Page
 * Book-first: hero, menu, policies, work, Margie, Book. The retail side
 * (shop, tutorials, merch) is hidden behind lib/features.ts until it's ready.
 */

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ServiceMenu from "@/components/home/ServiceMenu";
import PolicyStrip from "@/components/home/PolicyStrip";
import ChooseExperience from "@/components/ChooseExperience";
import NailCards from "@/components/NailCards";
import PortfolioPreview from "@/components/home/PortfolioPreview";
import MargieIntro from "@/components/home/MargieIntro";
import ShopPreview from "@/components/ShopPreview";
import Tutorials from "@/components/Tutorials";
import FeaturedCollaborations from "@/components/FeaturedCollaborations";
import FAQ from "@/components/FAQ";
import BookBand from "@/components/home/BookBand";
import { getServices } from "@/lib/services";
import { formatPrice } from "@/lib/service-defaults";
import { BUSINESS, SITE_URL } from "@/lib/site";

export const revalidate = 60; // service edits in admin show up within a minute

export default async function HomePage() {
  const services = await getServices();
  const deposits = new Set(services.map((s) => s.depositCents));
  const deposit = deposits.size === 1 ? formatPrice([...deposits][0]) : "small";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: BUSINESS.name,
    description: "Licensed nail artist offering custom acrylic, Gel-X, nail art and press-ons by appointment.",
    url: SITE_URL,
    telephone: BUSINESS.phone,
    sameAs: [BUSINESS.instagram, BUSINESS.facebook, BUSINESS.tiktok],
    address: { "@type": "PostalAddress", addressLocality: "Kenner", addressRegion: "LA", addressCountry: "US" },
    image: `${SITE_URL}/images/og-logo.jpg`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <Hero />
        <MargieIntro />
        <ServiceMenu services={services} depositLabel={deposit} />
        <PolicyStrip depositLabel={deposit} />
        <ChooseExperience />
        <NailCards catalog={services} />
        <PortfolioPreview limit={8} />
        <ShopPreview />
        <Tutorials />
        <FeaturedCollaborations />
        <FAQ />
        <BookBand />
      </main>
      <Footer />
    </>
  );
}
