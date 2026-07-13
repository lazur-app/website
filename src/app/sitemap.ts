import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllComparisons } from "@/lib/compare";
import { SITE_URL } from "@/lib/seo/constants";

/** Static marketing pages — bump when content meaningfully changes. */
const STATIC_LAST_MODIFIED = new Date("2026-07-05");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/pricing",
    "/download",
    "/leaderboard",
    "/blog",
    "/compare",
    "/terms",
    "/privacy",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/compare" ? 0.9 : 0.8,
  }));

  const compareRoutes = getAllComparisons().map((page) => ({
    url: `${SITE_URL}/compare/${page.slug}`,
    lastModified: new Date(page.updatedAt ?? page.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const blogRoutes = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...compareRoutes, ...blogRoutes];
}
