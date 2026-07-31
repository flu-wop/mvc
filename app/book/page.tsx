import Script from "next/script";

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#0C0C0C] flex flex-col items-center px-5 pt-28 pb-16">
      <p className="text-[#F4C430] text-xs font-semibold tracking-widest uppercase mb-4">
        Book a Session
      </p>
      <h1 className="text-5xl font-bold mb-8 text-white" style={{ fontFamily: "var(--font-playfair)" }}>
        Let&apos;s Get You Booked
      </h1>

      <div className="w-full max-w-3xl rounded-2xl overflow-hidden border border-white/10 bg-white">
        <iframe
          src="https://app.acuityscheduling.com/schedule.php?owner=19553804&ref=embedded_csp"
          title="Schedule Appointment — MVC Creations"
          width="100%"
          height="800"
          frameBorder="0"
          allow="payment"
        />
      </div>

      <Script src="https://embed.acuityscheduling.com/js/embed.js" strategy="lazyOnload" />
    </main>
  );
}
