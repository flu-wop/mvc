import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MVC Creations | Luxury Press-On Nails · New Orleans",
  description:
    "Custom luxury press-on nails handcrafted with Honduran artistry and New Orleans flair. House calls, pop-ups, and online shop. Book your glam session today.",
  keywords: [
    "press-on nails New Orleans",
    "luxury nail art NOLA",
    "custom press-ons",
    "Honduran nail artist",
    "MVC Creations",
    "nail pop-up New Orleans",
  ],
  authors: [{ name: "MVC Creations" }],
  openGraph: {
    title: "MVC Creations | Luxury Press-On Nails · New Orleans",
    description:
      "Custom luxury press-ons handcrafted with Honduran artistry and New Orleans flair. Book your glam session.",
    url: "https://mvccreations.com",
    siteName: "MVC Creations",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "MVC Creations luxury press-on nails",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MVC Creations | Luxury Press-On Nails · New Orleans",
    description: "Custom luxury press-ons with Honduran artistry & NOLA flair.",
    images: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80",
    ],
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
        {/* Preconnect for Google Fonts performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
