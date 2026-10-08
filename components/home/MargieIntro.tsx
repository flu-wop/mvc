import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function MargieIntro() {
  return (
    <section id="about" className="py-24 md:py-32 bg-charcoal border-y border-border scroll-mt-16">
      <div className="max-w-5xl mx-auto px-5 md:px-8 grid md:grid-cols-[minmax(0,340px)_1fr] gap-12 md:gap-20 items-center">
        <Reveal>
          <div className="relative aspect-[2/3] max-w-[340px] mx-auto md:mx-0 rounded-t-[999px] overflow-hidden border border-gold/30">
            <Image
              src="/images/margie-portrait.jpg"
              alt="Margie, licensed nail artist and founder of MVC Creations"
              fill
              sizes="(min-width: 768px) 340px, 80vw"
              className="object-cover object-[center_15%]"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-gold text-[11px] font-medium tracking-[0.32em] uppercase mb-5">Your nail artist</p>
          <h2 className="text-5xl md:text-6xl font-light text-white mb-8" style={{ fontFamily: "var(--font-display)" }}>
            Hi, I&apos;m <em className="italic text-gold">Margie.</em>
          </h2>
          <div className="text-white/70 text-base leading-relaxed space-y-4 max-w-md mb-8">
            <p>
              I&apos;m a licensed nail artist in Kenner with more than five years of experience creating luxury nail
              experiences.
            </p>
            <p>Every set is custom-built, detailed, and never rushed.</p>
            <p>I can&apos;t wait to welcome you into the chair.</p>
          </div>
          <p className="text-gold text-3xl mb-8" style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}>
            xo, Margie
          </p>
          <Link
            href="/about"
            className="text-xs tracking-[0.18em] uppercase text-white/60 hover:text-gold transition-colors underline underline-offset-8 decoration-white/20"
          >
            Read my story
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
