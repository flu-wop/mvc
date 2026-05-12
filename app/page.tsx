/**
 * MVC Creations — Home Page
 * app/page.tsx
 *
 * v2 additions (keep everything else 100% intact):
 *   1. Framer Motion scroll animations on every section
 *   2. InstagramFeed section after GalleryTeaser
 *   3. Enhanced Footer with Google Maps embed
 */

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutTeaser from "@/components/AboutTeaser";
import Services from "@/components/Services";
import ShopPreview from "@/components/ShopPreview";
import Testimonials from "@/components/Testimonials";
import GalleryTeaser from "@/components/GalleryTeaser";
import InstagramFeed from "@/components/InstagramFeed"; // ← NEW
import BookingCTA from "@/components/BookingCTA";
import Footer from "@/components/Footer"; // ← ENHANCED (Google Maps added)

export default function HomePage() {
  return (
    <>
      {/* ── Navigation ─────────────────────────────── */}
      <Navbar />

      <main>
        {/* ── 1. Hero ────────────────────────────────── */}
        <Hero />

        {/* ── 2. About Teaser ────────────────────────── */}
        <AboutTeaser />

        {/* ── 3. Services ────────────────────────────── */}
        <Services />

        {/* ── 4. Shop Preview ────────────────────────── */}
        {/* TODO: Replace mock data with Shopify Storefront API */}
        <ShopPreview />

        {/* ── 5. Testimonials ────────────────────────── */}
        <Testimonials />

        {/* ── 6. Gallery Teaser ──────────────────────── */}
        <GalleryTeaser />

        {/* ── 7. Instagram Feed ──────────────────────── NEW */}
        <InstagramFeed />

        {/* ── 8. Booking CTA ─────────────────────────── */}
        {/* TODO: Embed Acuity Scheduling iframe here */}
        <BookingCTA />
      </main>

      {/* ── Footer (enhanced with Google Maps) ─────── */}
      <Footer />
    </>
  );
}
