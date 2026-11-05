import "server-only";

import fs from "fs";
import path from "path";
import { CONTENT_DIRS } from "./routes";
import type {
  AppPage,
  ComparePage,
  HowToPage,
  RoleAppPage,
  RolePage,
  SeoPage,
  SeoPageType,
} from "./types";

/**
 * Reads content/seo/<type>/*.json. One file per page; the file name is the slug (role × app files
 * are "<role>--<app>.json"). Files starting with "_" are drafts and are skipped.
 */
function root() {
  const here = process.cwd();
  if (fs.existsSync(path.join(here, "content/seo"))) return here;
  return path.join(here, "website");
}

const cache = new Map<SeoPageType, SeoPage[]>();

function readType<T extends SeoPage>(type: SeoPageType): T[] {
  const hit = cache.get(type);
  if (hit && process.env.NODE_ENV === "production") return hit as T[];

  const dir = path.join(root(), CONTENT_DIRS[type]);
  if (!fs.existsSync(dir)) {
    cache.set(type, []);
    return [];
  }

  const pages = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".json") && !file.startsWith("_"))
    .map((file) => {
      const raw = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) as SeoPage;
      return { ...raw, type } as SeoPage;
    })
    .sort(
      (a, b) =>
        new Date(b.updatedAt ?? b.publishedAt).getTime() -
        new Date(a.updatedAt ?? a.publishedAt).getTime(),
    );

  cache.set(type, pages);
  return pages as T[];
}

export const getHowTos = () => readType<HowToPage>("howto");
export const getAppPages = () => readType<AppPage>("app");
export const getRolePages = () => readType<RolePage>("role");
export const getRoleAppPages = () => readType<RoleAppPage>("role-app");
export const getComparePages = () => readType<ComparePage>("compare");
export const getAlternativesPages = () => readType<ComparePage>("alternatives");

export const getHowTo = (slug: string) => getHowTos().find((p) => p.slug === slug);
export const getAppPage = (slug: string) => getAppPages().find((p) => p.slug === slug);
export const getRolePage = (slug: string) => getRolePages().find((p) => p.slug === slug);
export const getRoleAppPage = (role: string, app: string) =>
  getRoleAppPages().find((p) => p.role === role && p.app === app);
export const getComparePage = (slug: string) => getComparePages().find((p) => p.slug === slug);
export const getAlternativesPage = (slug: string) =>
  getAlternativesPages().find((p) => p.slug === slug);

/**
 * How many pages per type are rendered at build time. The rest render on first request and are
 * cached (ISR), so a deploy stays fast when there are thousands of pages.
 */
export function prerenderLimit(): number {
  const n = Number(process.env.SEO_PRERENDER_LIMIT ?? 1500);
  return Number.isFinite(n) && n >= 0 ? n : 1500;
}
