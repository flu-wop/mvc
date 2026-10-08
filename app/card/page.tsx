import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { qrSvg } from "@/lib/qr";
import { SITE_URL } from "@/lib/site";
import CopyLink from "./CopyLink";

export const metadata: Metadata = {
  title: "MVC Creations — Booking Page",
  description: "Margie's booking page. Scan or tap to book your appointment in Kenner, Louisiana.",
  robots: { index: false },
  alternates: { canonical: `${SITE_URL}/card` },
  openGraph: { images: [{ url: "/images/booking-page.png", width: 2000, height: 8000 }] },
};

// Standalone, shareable page: Margie's booking-page graphic, a QR to the site, and
// downloads. Swap public/images/booking-page.png to change the graphic.
const btn = "inline-flex items-center justify-center px-5 py-3.5 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors text-center";

export default async function CardPage() {
  const svg = await qrSvg(SITE_URL);
  const host = SITE_URL.replace(/^https?:\/\//, "");
  return (
    <main className="min-h-screen bg-ink flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-[560px]">
        <div className="rounded-3xl border border-border bg-charcoal p-5 mb-6 flex items-center gap-5">
          <div
            className="shrink-0 w-[112px] h-[112px] rounded-xl overflow-hidden [&>svg]:w-full [&>svg]:h-full"
            role="img"
            aria-label={`QR code linking to ${host}`}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <div className="min-w-0">
            <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-1">Scan to book</p>
            <p className="text-white text-xl font-light" style={{ fontFamily: "var(--font-display)" }}>
              Your chair is waiting.
            </p>
            <p className="text-white/50 text-xs mt-1 truncate">{host}</p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <Link href="/book" className={`${btn} w-full bg-gold text-ink hover:bg-gold-light`}>
            Book now
          </Link>
          <div className="grid grid-cols-2 gap-3">
            <a href="/card/flyer.png?download=1" className={`${btn} border border-border text-white/80 hover:border-gold/50 hover:text-gold`}>
              Download page + QR
            </a>
            <a href="/card/qr.png?download=1" className={`${btn} border border-border text-white/80 hover:border-gold/50 hover:text-gold`}>
              Download QR
            </a>
          </div>
          <div className="flex items-center justify-between text-xs text-white/40 pt-1">
            <a href="/card/qr.svg?download=1" className="hover:text-gold">QR as SVG (for print)</a>
            <a href="/card/image.png?download=1" className="hover:text-gold">Story image</a>
            <CopyLink url={`${SITE_URL}/card`} />
          </div>
        </div>

        <Image
          src="/images/booking-page.png"
          alt="MVC Creations booking page: meet Margie, hours, contact, services, booking policies"
          width={2000}
          height={8000}
          sizes="(max-width: 560px) 100vw, 560px"
          className="w-full h-auto rounded-2xl"
          priority
        />
      </div>
    </main>
  );
}
