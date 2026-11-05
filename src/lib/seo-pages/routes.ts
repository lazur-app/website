import type { SeoPage, SeoPageType } from "./types";

/** Public URL path for a page. The one place URLs are built. */
export function seoPath(page: Pick<SeoPage, "type" | "slug"> & { role?: string; app?: string }): string {
  switch (page.type) {
    case "howto":
      return `/how-to/${page.slug}`;
    case "app":
      return `/apps/${page.slug}`;
    case "role":
      return `/for/${page.slug}`;
    case "role-app":
      return `/for/${page.role}/${page.app}`;
    case "compare":
      return `/compare/${page.slug}`;
    case "alternatives":
      return `/alternatives/${page.slug}`;
  }
}

export const HUB_PATHS: Record<SeoPageType, string> = {
  howto: "/how-to",
  app: "/apps",
  role: "/for",
  "role-app": "/for",
  compare: "/compare",
  alternatives: "/alternatives",
};

export const TYPE_LABEL: Record<SeoPageType, string> = {
  howto: "How-to",
  app: "Apps",
  role: "Roles",
  "role-app": "Roles",
  compare: "Compare",
  alternatives: "Alternatives",
};

/** Data folder per type, relative to the repo root. */
export const CONTENT_DIRS: Record<SeoPageType, string> = {
  howto: "content/seo/howto",
  app: "content/seo/apps",
  role: "content/seo/roles",
  "role-app": "content/seo/role-apps",
  compare: "content/seo/compare",
  alternatives: "content/seo/alternatives",
};
