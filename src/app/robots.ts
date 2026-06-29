import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = COMPANY.url.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
