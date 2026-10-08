import type { MetadataRoute } from "next";
import { SHOP_ENABLED } from "@/lib/features";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/book", "/portfolio", "/about", "/faq", "/policies", "/contact", "/privacy", ...(SHOP_ENABLED ? ["/shop"] : [])];

  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
