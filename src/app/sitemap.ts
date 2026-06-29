import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/site";
import { getAllPostSlugs, getAllProjectSlugs } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = COMPANY.url.replace(/\/$/, "");
  const now = new Date();

  const routes = ["", "/about", "/services", "/projects", "/youtube", "/careers", "/blog", "/contact"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const slugs = await getAllPostSlugs();
  const posts = slugs.map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const projectSlugs = await getAllProjectSlugs();
  const projects = projectSlugs.map((slug) => ({
    url: `${base}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...routes, ...posts, ...projects];
}
