import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink pt-32 pb-20 px-5 md:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3 text-center">
            Behind the Brand
          </p>
          <h1 className="text-5xl md:text-6xl text-center mb-10" style={{ fontFamily: "var(--font-script)" }}>
            Meet the Artist
          </h1>

          <div className="relative aspect-[2/3] max-w-sm mx-auto rounded-t-[999px] overflow-hidden border border-border mb-10">
            <Image
              src="/images/margie-portrait.jpg"
              alt="Margie, founder of MVC Creations"
              fill
              className="object-cover object-top"
            />
          </div>

          <div className="text-white/75 text-base md:text-lg leading-relaxed space-y-5 max-w-2xl mx-auto">
            <p>
              Hi, I&apos;m Margie. The founder of MVC Creations, a licensed nail artist,
              entrepreneur, content creator, and passionate supporter of small businesses.
            </p>
            <p>
              What started as a childhood love for nails has grown into a brand built on
              creativity, connection, and helping others feel confident. For more than five
              years, I&apos;ve specialized in creating luxury nail experiences through custom
              nail enhancements, detailed nail art, premium press-ons, and natural nail care.
            </p>
            <p>
              Beyond the nail table, I love discovering new places, traveling, creating
              content, and collaborating with local businesses and brands to help tell their
              stories in an authentic way. Whether I&apos;m designing a custom nail set or
              capturing content that showcases a business, my goal is always the same — to
              create beautiful experiences that leave a lasting impression.
            </p>
            <p>
              I&apos;m so grateful you&apos;re here, and I can&apos;t wait to welcome you into
              the MVC Creations experience.
            </p>
            <p className="text-gold text-lg" style={{ fontFamily: "var(--font-script)" }}>
              xo, Margie
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
