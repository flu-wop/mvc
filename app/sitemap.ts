import type { MetadataRoute } from "next";

const BASE_URL = "https://mvc-creations.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/book",
    "/contact",
    "/content-creation",
    "/faq",
    "/gallery",
    "/portfolio",
    "/press-ons",
    "/privacy",
    "/services",
    "/shop",
  ];

  return staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
