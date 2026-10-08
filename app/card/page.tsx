import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { qrSvg } from "@/lib/qr";
import { BUSINESS, SITE_URL } from "@/lib/site";
import CopyLink from "./CopyLink";

export const metadata: Metadata = {
  title: "Book with MVC Creations",
  description: "Scan or tap to book your appointment with Margie in Kenner, Louisiana.",
  robots: { index: false },
  alternates: { canonical: `${SITE_URL}/card` },
};

// Standalone, shareable booking card: tap it, screenshot it, download it or print the QR.
// Change CARD_IMAGE here and in app/card/image.png/route.tsx to use a different photo.
const CARD_IMAGE = "/images/service-gel-x.jpg";

const btn = "inline-flex items-center justify-center px-6 py-3.5 rounded-full text-xs font-semibold tracking-[0.2em] uppercase transition-colors";

export default async function CardPage() {
  const svg = await qrSvg(SITE_URL);
  const host = SITE_URL.replace(/^https?:\/\//, "");
  return (
    <main className="min-h-screen bg-ink flex flex-col items-center px-5 py-8 sm:py-12">
      <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden border border-border">
        <Image src={CARD_IMAGE} alt="A set by Margie" fill priority sizes="420px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/10 to-ink/95" />
        <p className="absolute top-6 left-6 text-gold text-[10px] tracking-[0.34em] uppercase">{BUSINESS.name}</p>
        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl leading-[0.95] font-light text-white" style={{ fontFamily: "var(--font-display)" }}>
              Your chair
              <br />
              <em className="text-gold">is waiting.</em>
            </h1>
            <p className="text-silver text-[11px] tracking-[0.12em] mt-4">Kenner, Louisiana · By appointment</p>
            <p className="text-white text-xs mt-1">{host}</p>
          </div>
          <div className="shrink-0 text-center">
            <div
              className="w-[104px] h-[104px] rounded-xl overflow-hidden [&>svg]:w-full [&>svg]:h-full"
              role="img"
              aria-label={`QR code linking to ${host}`}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            <p className="text-gold text-[9px] tracking-[0.26em] uppercase mt-2">Scan to book</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[420px] mt-6 space-y-3">
        <Link href="/book" className={`${btn} w-full bg-gold text-ink hover:bg-gold-light`}>
          Book now
        </Link>
        <div className="grid grid-cols-2 gap-3">
          <a href="/card/image.png?download=1" className={`${btn} border border-border text-white/80 hover:border-gold/50 hover:text-gold`}>
            Download card
          </a>
          <a href="/card/qr.png?download=1" className={`${btn} border border-border text-white/80 hover:border-gold/50 hover:text-gold`}>
            Download QR
          </a>
        </div>
        <div className="flex items-center justify-between text-xs text-white/40 pt-1">
          <a href="/card/qr.svg?download=1" className="hover:text-gold">QR as SVG (for print)</a>
          <CopyLink url={`${SITE_URL}/card`} />
        </div>
      </div>
    </main>
  );
}
