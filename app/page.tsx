/**
 * MVC Creations — Home Page
 * /app/page.tsx
 *
 * Stack: Next.js 15 App Router · Tailwind CSS · Framer Motion
 *
 * TODO checklist before going live:
 * ─────────────────────────────────
 * [ ] Replace placeholder images with real nail photography
 * [ ] Embed actual Acuity Scheduling iframe in <BookingCTA> (see component for instructions)
 * [ ] Integrate Shopify Storefront API in <ShopPreview> (see component for instructions)
 * [ ] Update Instagram handle & link in Footer
 * [ ] Add Google Analytics / Meta Pixel inside layout.tsx
 * [ ] Configure Resend / SendGrid for contact form emails
 * [ ] Set NEXT_PUBLIC_SITE_URL in .env.local
 */

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutTeaser from "@/components/AboutTeaser";
import Services from "@/components/Services";
import ShopPreview from "@/components/ShopPreview";
import Testimonials from "@/components/Testimonials";
import GalleryTeaser from "@/components/GalleryTeaser";
import BookingCTA from "@/components/BookingCTA";
import Footer from "@/components/Footer";

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

        {/* ── 7. Booking CTA ─────────────────────────── */}
        {/* TODO: Embed Acuity Scheduling iframe here */}
        <BookingCTA />
      </main>

      {/* ── Footer ─────────────────────────────────── */}
      <Footer />
    </>
  );
}
