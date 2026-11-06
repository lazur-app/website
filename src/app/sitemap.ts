import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import {
  getAlternativesPages,
  getAppPages,
  getComparePages,
  getHowTos,
  getProblemPages,
  getRoleAppPages,
  getRolePages,
} from "@/lib/seo-pages/load";
import { seoPath } from "@/lib/seo-pages/routes";
import type { SeoPage } from "@/lib/seo-pages/types";
import { SITE_URL } from "@/lib/seo/constants";
import { TOOLS } from "@/lib/tools";

/** Static marketing pages, bump when content meaningfully changes. */
const STATIC_LAST_MODIFIED = new Date("2026-11-05");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/pricing",
    "/changelog",
    "/download",
    "/blog",
    "/compare",
    "/alternatives",
    "/apps",
    "/how-to",
    "/for",
    "/tools",
    "/terms",
    "/privacy",
    "/support",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority:
      path === "" ? 1 : path === "/download" || path === "/pricing" || path === "/blog" ? 0.9 : 0.7,
  }));

  const seo = (pages: SeoPage[], priority: number) =>
    pages.map((page) => ({
      url: `${SITE_URL}${seoPath(page)}`,
      lastModified: new Date(page.updatedAt ?? page.publishedAt),
      changeFrequency: "monthly" as const,
      priority,
    }));

  const howtos = getHowTos();
  const howtoAppHubs = [...new Set(howtos.map((p) => p.app))].map((app) => ({
    url: `${SITE_URL}/how-to/app/${app}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const toolRoutes = TOOLS.map((t) => ({
    url: `${SITE_URL}/tools/${t.slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogRoutes = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...toolRoutes,
    ...seo(getComparePages(), 0.85),
    ...seo(getAlternativesPages(), 0.85),
    ...seo(getAppPages(), 0.85),
    ...seo(getRolePages(), 0.8),
    ...seo(getRoleAppPages(), 0.7),
    ...seo(getProblemPages(), 0.75),
    ...[...new Set(getProblemPages().map((p) => p.role))].map((role) => ({
      url: `${SITE_URL}/for/${role}/problems`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...seo(howtos, 0.7),
    ...howtoAppHubs,
    ...blogRoutes,
  ];
}
