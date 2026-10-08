import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/lib/site";

// The work is the hero: a real set from the chair, fading into black.
export default function HomeHero({ depositLabel }: { depositLabel: string }) {
  return (
    <section className="relative min-h-[100svh] flex items-end md:items-center overflow-hidden bg-ink">
      <div className="absolute inset-0 md:left-auto md:w-[64%]">
        <Image
          src="/images/service-gel-x.jpg"
          alt="Chocolate stiletto Gel-X set with a sculpted gold chrome accent nail"
          fill
          priority
          sizes="(min-width: 768px) 64vw, 100vw"
          className="object-cover object-[50%_38%] animate-kenburns"
        />
        {/* Fade into black on the text side, and at the bottom for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10 md:bg-gradient-to-r md:from-ink md:via-ink/25 md:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 md:px-8 pb-28 md:pb-0 pt-32">
        <p className="text-gold text-[11px] font-medium tracking-[0.32em] uppercase mb-6">
          Licensed nail artist · Kenner, Louisiana
        </p>
        <h1
          className="text-[clamp(3.5rem,11vw,8.5rem)] font-light leading-[0.92] tracking-[-0.02em] text-white mb-7"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your chair
          <br />
          is <em className="font-light italic text-gold">waiting.</em>
        </h1>
        <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-sm mb-10">
          Custom acrylic, Gel-X, nail art and press-ons by Margie. Pick a time and reserve it with a{" "}
          {depositLabel} deposit.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
          <Link
            href="/book"
            className="inline-flex justify-center px-12 py-4 rounded-full bg-gold text-ink text-sm font-semibold tracking-[0.22em] uppercase hover:bg-gold-light transition-colors"
          >
            Book
          </Link>
          <Link
            href="#policies"
            className="text-xs tracking-[0.18em] uppercase text-white/60 hover:text-gold transition-colors underline underline-offset-8 decoration-white/20 hover:decoration-gold/60 text-center"
          >
            Deposit &amp; cancellation policy
          </Link>
        </div>
      </div>

      <a
        href={BUSINESS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:block absolute right-8 bottom-8 z-10 text-[11px] tracking-[0.25em] uppercase text-white/50 hover:text-gold transition-colors"
      >
        {BUSINESS.instagramHandle}
      </a>
    </section>
  );
}
