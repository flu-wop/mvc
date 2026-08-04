import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, Instagram } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink flex flex-col items-center justify-center text-white px-6 text-center pt-24 pb-16">
        <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-4">Get In Touch</p>
        <h1 className="text-5xl mb-6" style={{ fontFamily: "var(--font-script)" }}>Contact Me</h1>
        <p className="text-white/50 max-w-md mb-10">
          Didn&apos;t find the answer you were looking for? I&apos;d be happy to help. Reach
          out and I&apos;ll get back to you as soon as possible.
        </p>
        <div className="flex flex-col gap-4 text-white/70 text-sm">
          <a href="tel:5043032763" className="flex items-center justify-center gap-2 hover:text-gold transition-colors">
            <Phone className="w-4 h-4 text-gold" /> (504) 303-2763
          </a>
          <a href="mailto:mvcxreations@gmail.com" className="flex items-center justify-center gap-2 hover:text-gold transition-colors">
            <Mail className="w-4 h-4 text-gold" /> mvcxreations@gmail.com
          </a>
          <a href="https://www.instagram.com/mvcxcreations" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 hover:text-gold transition-colors">
            <Instagram className="w-4 h-4 text-gold" /> @mvcxcreations
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
