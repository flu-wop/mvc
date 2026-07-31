import Script from "next/script";

export default function BookPage() {
  return (
    <main className="min-h-screen bg-ink flex flex-col items-center px-5 pt-28 pb-16">
      <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-3">
        Book a Session
      </p>
      <h1 className="text-5xl mb-8" style={{ fontFamily: "var(--font-script)" }}>
        Let&apos;s get you booked
      </h1>

      <div className="w-full max-w-3xl rounded-2xl overflow-hidden border border-border bg-white" style={{ height: 900 }}>
        <iframe
          src="https://app.acuityscheduling.com/schedule.php?owner=19553804&ref=embedded_csp"
          title="Schedule Appointment — MVC Creations"
          width="100%"
          height="2300"
          frameBorder="0"
          scrolling="no"
          allow="payment"
          style={{ marginTop: -1350, display: "block" }}
        />
      </div>

      <Script src="https://embed.acuityscheduling.com/js/embed.js" strategy="lazyOnload" />
    </main>
  );
}
