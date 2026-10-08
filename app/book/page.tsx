import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import { getServices, getAddons, getServiceAddonMap } from "@/lib/services";
import { getHours } from "@/lib/availability";
import { nowInShop } from "@/lib/time";

export const metadata: Metadata = {
  title: "Book an Appointment | MVC Creations",
  description: "Choose a service, pick a time and reserve your chair with a deposit.",
  alternates: { canonical: "/book" },
};

export const dynamic = "force-dynamic";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; canceled?: string }>;
}) {
  const { service, canceled } = await searchParams;
  const [services, addons, addonMap, hours] = await Promise.all([
    getServices(),
    getAddons(),
    getServiceAddonMap(),
    getHours().catch(() => []),
  ]);
  const closedWeekdays = hours.filter((h) => h.closed).map((h) => h.weekday);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink text-white pt-32 pb-24">
        <div className="text-center px-6 mb-12">
          <p className="text-gold text-[11px] font-medium tracking-[0.32em] uppercase mb-5">Reserve your chair</p>
          <h1 className="text-5xl md:text-7xl font-light mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Book your <em className="italic text-gold">appointment</em>
          </h1>
          <p className="text-white/50 text-sm max-w-sm mx-auto">
            Pick a service and a time, then hold it with a deposit.
          </p>
          {canceled && (
            <p className="text-white/60 text-xs mt-5">Payment wasn&apos;t completed, so nothing was booked. Your time isn&apos;t held yet.</p>
          )}
        </div>
        <BookingForm
          services={services}
          addons={addons}
          addonMap={addonMap}
          initialSlug={service}
          todayIso={nowInShop().date}
          closedWeekdays={closedWeekdays}
        />
      </main>
      <Footer />
    </>
  );
}
