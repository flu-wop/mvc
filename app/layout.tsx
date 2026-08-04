import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MVC Creations | Licensed Nail Artist · Kenner, LA",
  description:
    "Custom acrylics, gel-X, natural nail care, nail art, and press-ons with Margie — licensed nail technician based in Kenner near MSY. Book your appointment.",
  keywords: [
    "nail tech Kenner",
    "press-on nails New Orleans",
    "acrylic nails Kenner LA",
    "nail art New Orleans",
    "MVC Creations",
    "Margie nails",
  ],
  authors: [{ name: "MVC Creations" }],
  openGraph: {
    title: "MVC Creations | Licensed Nail Artist · Kenner, LA",
    description:
      "Custom acrylics, gel-X, natural nail care, nail art, and press-ons with Margie. Book your appointment.",
    url: "https://mvccreations.com",
    siteName: "MVC Creations",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MVC Creations | Licensed Nail Artist · Kenner, LA",
    description: "Custom acrylics, gel-X, natural nail care, nail art, and press-ons with Margie.",
  },
  metadataBase: new URL("https://mvccreations.com"),
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Alex+Brush&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
