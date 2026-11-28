import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import {
  getAlternativesPages,
  getAppPages,
  getComparePages,
  getHowTos,
  getRoleAppPages,
} from "@/lib/seo-pages/load";
import { seoPath } from "@/lib/seo-pages/routes";
import type { SeoPage } from "@/lib/seo-pages/types";
import { SITE_URL } from "@/lib/seo/constants";
import { getToolContent } from "@/lib/free-tools/content";
import { toolOrigin } from "@/lib/free-tools/host";
import { FREE_TOOLS } from "@/lib/free-tools/registry";
import { TOOLS } from "@/lib/tools";

/** Static marketing pages, bump when content meaningfully changes. */
const STATIC_LAST_MODIFIED = new Date("2026-11-05");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/pricing",
    "/changelog",
    "/team",
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

  // The free tools live on their own subdomains (all under the verified lazur.app domain property,
  // so one sitemap may list them): each tool's home and its keyword pages.
  const freeToolRoutes = FREE_TOOLS.flatMap((t) => {
    const origin = toolOrigin(t.subdomain);
    const pages = getToolContent(t.subdomain)?.pages ?? [];
    return [
      { url: origin, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "weekly" as const, priority: 0.8 },
      ...pages.map((p) => ({ url: `${origin}/${p.slug}`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: "monthly" as const, priority: 0.6 })),
    ];
  });

  return [
    ...staticRoutes,
    ...toolRoutes,
    ...freeToolRoutes,
    ...seo(getComparePages(), 0.85),
    ...seo(getAlternativesPages(), 0.85),
    ...seo(getAppPages(), 0.85),
    ...seo(getRoleAppPages(), 0.7),
    ...seo(howtos, 0.7),
    ...howtoAppHubs,
    ...blogRoutes,
  ];
}
