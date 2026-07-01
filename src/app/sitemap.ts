import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.lazur.app";

  const staticRoutes = [
    "",
    "/pricing",
    "/download",
    "/leaderboard",
    "/blog",
    "/terms",
    "/privacy",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const blogRoutes = getAllPostSlugs().map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}
