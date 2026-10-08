import type { Metadata, Viewport } from "next";
import "./globals.css";
import StickyBook from "@/components/StickyBook";
import { SITE_URL } from "@/lib/site";

const TITLE = "MVC Creations | Nail Artist in Kenner, LA · Book Your Chair";
const DESCRIPTION =
  "Custom acrylics, Gel-X, nail art and press-ons with Margie, a licensed nail artist in Kenner, Louisiana. Reserve your appointment online with a $25 deposit.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "nail tech Kenner",
    "acrylic nails Kenner LA",
    "Gel-X nails New Orleans",
    "nail art New Orleans",
    "custom press-on nails",
    "MVC Creations",
    "Margie nails",
  ],
  authors: [{ name: "MVC Creations" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "MVC Creations",
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "MVC Creations nail artistry" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Montserrat:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain antialiased">
        {children}
        <StickyBook />
      </body>
    </html>
  );
}
