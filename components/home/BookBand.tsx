import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function BookBand() {
  return (
    <section className="py-28 md:py-40 bg-ink text-center border-b border-border">
      <Reveal className="max-w-3xl mx-auto px-5">
        <h2
          className="text-5xl md:text-8xl font-light text-white leading-[0.95] mb-12"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ready when <em className="italic text-gold">you are.</em>
        </h2>
        <Link
          href="/book"
          className="inline-flex px-14 py-5 rounded-full bg-gold text-ink text-sm font-semibold tracking-[0.24em] uppercase hover:bg-gold-light transition-colors"
        >
          Book
        </Link>
      </Reveal>
    </section>
  );
}
