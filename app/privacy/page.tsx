import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink pt-28 pb-20 px-5 md:px-8">
        <div className="max-w-2xl mx-auto text-white/75 text-sm leading-relaxed space-y-6">
          <div>
            <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">Legal</p>
            <h1 className="text-white text-3xl font-semibold mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              Privacy Policy
            </h1>
            <p className="text-grey text-xs">Last updated {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>

          <section>
            <h2 className="text-white font-semibold mb-2">What we collect</h2>
            <p>
              When you book an appointment, join our email list, or purchase a product, we
              collect the information you provide directly — such as your name, email
              address, phone number, appointment details, and (for shop orders) shipping
              address.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Why we collect it</h2>
            <p>
              We use this information to schedule and confirm appointments, fulfill and ship
              product orders, send updates you've opted into (like our VIP list), and respond
              to inquiries.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Where it's stored</h2>
            <p>
              Booking and order data is stored in our database (Turso). Payments are
              processed securely by Stripe — we never see or store your full card details.
              Email communications are sent through our email provider.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Who it's shared with</h2>
            <p>
              We share only what's necessary to complete your booking or order: payment
              details with Stripe, and (for shop orders) your shipping address with our
              shipping provider to fulfill delivery. We do not sell your information to
              third parties.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">How long we keep it</h2>
            <p>
              We retain your information until you request deletion, or as required to meet
              legal and accounting obligations.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">Your choices</h2>
            <p>
              You can unsubscribe from our email list at any time using the link in any
              email. To request deletion of your personal data, contact us at{" "}
              <a href="mailto:mvcxreations@gmail.com" className="text-gold hover:text-gold-light">
                mvcxreations@gmail.com
              </a>
              .
            </p>
          </section>

          <p className="text-grey text-xs pt-4 border-t border-border">
            This page is a disclosure of our data practices and is not legal advice. If you
            have questions about your rights under applicable law, please consult a legal
            professional.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
