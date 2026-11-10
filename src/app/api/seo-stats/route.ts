import fs from "fs";
import path from "path";
import { timingSafeEqual } from "crypto";
import { getAllPosts } from "@/lib/blog";
import { wordCount } from "@/lib/content/keywords.mjs";
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
import type { SeoPage, SeoPageType } from "@/lib/seo-pages/types";
import { SITE_URL } from "@/lib/seo/constants";
import { TOOLS } from "@/lib/tools";

/**
 * GET /api/seo-stats: every SEO page on the site plus what each daily content run made and cost.
 * Read once a day by the backend's SEO job (backend/app/seo), which stores it in Postgres for the
 * admin SEO dashboard. Needs `Authorization: Bearer <SEO_STATS_TOKEN>` (same value on the backend);
 * without SEO_STATS_TOKEN set here it answers 503, so cost data is never public by accident.
 */
export const dynamic = "force-dynamic";

/** Dashboard type names: the content/seo folder names, plus blog and tools. */
const TYPE: Record<SeoPageType, string> = {
  howto: "howto", app: "apps", role: "roles", "role-app": "role-apps", problem: "problems",
  compare: "compare", alternatives: "alternatives",
};

type StatsPage = {
  url: string; path: string; type: string; title: string; role: string | null; app: string | null;
  published_at: string | null; updated_at: string | null;
  word_count: number | null; image_count: number; source_count: number;
};

function authorized(req: Request): boolean {
  const token = process.env.SEO_STATS_TOKEN;
  if (!token) return false;
  const given = Buffer.from(req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "");
  const want = Buffer.from(token);
  return given.length === want.length && timingSafeEqual(given, want);
}

const day = (iso: string | undefined | null) => (iso ? iso.slice(0, 10) : null);

function seoPages(): StatsPage[] {
  const all: SeoPage[] = [
    ...getHowTos(), ...getAppPages(), ...getRolePages(), ...getRoleAppPages(),
    ...getProblemPages(), ...getComparePages(), ...getAlternativesPages(),
  ];
  return all.map((p) => {
    const path = seoPath(p as Parameters<typeof seoPath>[0]);
    const rec = p as unknown as { role?: string; app?: string; images?: unknown[]; sources?: unknown[] };
    return {
      url: `${SITE_URL}${path}`, path, type: TYPE[p.type], title: p.title,
      role: rec.role ?? null, app: rec.app ?? null,
      published_at: day(p.publishedAt), updated_at: day(p.updatedAt ?? p.publishedAt),
      word_count: wordCount(p), image_count: rec.images?.length ?? 0, source_count: rec.sources?.length ?? 0,
    };
  });
}

function blogPages(): StatsPage[] {
  return getAllPosts().map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`, path: `/blog/${p.slug}`, type: "blog", title: p.title, role: null, app: null,
    published_at: day(p.publishedAt), updated_at: day(p.updatedAt ?? p.publishedAt),
    word_count: p.body.split(/\s+/).filter(Boolean).length,
    image_count: p.heroImage ? 1 : 0, source_count: p.sources.length,
  }));
}

function toolPages(): StatsPage[] {
  return TOOLS.map((t) => ({
    url: `${SITE_URL}/tools/${t.slug}`, path: `/tools/${t.slug}`, type: "tools", title: t.title, role: null, app: null,
    published_at: null, updated_at: null, word_count: null, image_count: 0, source_count: 0,
  }));
}

/** One row per content-runs/daily-<date>: pages written (new and refreshed) and the model spend. */
function runs() {
  const dir = path.join(process.cwd(), "content-runs");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((d) => /^daily-\d{4}-\d{2}-\d{2}$/.test(d)).sort().map((d) => {
    let created = 0, refreshed = 0, cost = 0;
    try {
      const m = JSON.parse(fs.readFileSync(path.join(dir, d, "manifest.json"), "utf8")) as { items?: Record<string, { type: string; status: string }> };
      for (const it of Object.values(m.items ?? {})) {
        if (it.status !== "done") continue;
        if (it.type === "refresh") refreshed++;
        else created++;
      }
    } catch { /* run without a manifest yet */ }
    try {
      for (const line of fs.readFileSync(path.join(dir, d, "usage.jsonl"), "utf8").split("\n")) {
        if (!line.trim()) continue;
        try { cost += Number(JSON.parse(line).cost_usd) || 0; } catch { /* half-written line */ }
      }
    } catch { /* no usage yet */ }
    return { date: d.slice(6), pages_created: created, pages_refreshed: refreshed, cost_usd: Math.round(cost * 10000) / 10000 };
  });
}

export function GET(req: Request) {
  if (!process.env.SEO_STATS_TOKEN) return Response.json({ detail: "SEO_STATS_TOKEN is not set" }, { status: 503 });
  if (!authorized(req)) return Response.json({ detail: "Unauthorized" }, { status: 401 });
  const pages = [...seoPages(), ...blogPages(), ...toolPages()];
  return Response.json(
    { generated_at: new Date().toISOString(), site_url: SITE_URL, total: pages.length, pages, runs: runs() },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
  );
}
