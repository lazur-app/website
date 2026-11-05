// @ts-check
/**
 * One spec per page type: what to write next, how to research it, how to write it, and how to
 * turn the model's draft into a page. generateOne() runs the same steps for every type:
 *
 *   research (web) → write (JSON schema) → assemble → guard → [one correction round] → images →
 *   guard again with images → save, or log to refused.jsonl.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { APPS, BLOG_SEEDS, COMPETITORS, KEYWORD_PATTERNS, ROLES, appBySlug, roleBySlug } from "../../../src/lib/content/sources.mjs";
import { LAZUR } from "../../../src/lib/content/lazur-facts.mjs";
import { research, write } from "./agent.mjs";
import { ROOT, allowedPaths, fileFor, logRefused, readAll, readJsonl, readType, savePage, today, urlFor, writeJsonl } from "./core.mjs";
import { fake } from "./fake.mjs";
import { guardPage, guardSummary } from "./guards.mjs";
import { imagesForPage, slugify } from "./images.mjs";
import { prompts } from "./prompts.mjs";
import { appSchema, blogSchema, compareSchema, howtoSchema, researchSchema, roleAppSchema, roleSchema, topicsSchema } from "./schemas.mjs";

/** Topic queues. Preview runs (--out) point this elsewhere so tests never touch the real queue. */
const planDir = () => process.env.CONTENT_PLAN_DIR || path.join(ROOT, "content/seo/_plan");
const queueFile = (/** @type {string} */ name) => path.join(planDir(), name);
const MIN_IMAGES = Number(process.env.CONTENT_MIN_IMAGES ?? 2);

/** @param {string} pattern @param {Record<string, string>} vars */
const fill = (pattern, vars) => pattern.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

/** Lazur as a compare product, always from lazur-facts, never from the model. */
const LAZUR_PRODUCT = {
  name: "Lazur",
  slug: "lazur",
  site: "https://www.lazur.app",
  isLazur: true,
  pricing: "3-day free trial, then Pro $18/month or Power $120/month",
  pricingSourceUrl: "https://www.lazur.app/pricing",
  platforms: "macOS (Apple silicon and Intel)",
};

/** Base fields code owns. @param {any} draft @param {Record<string, unknown>} extra */
function basePage(draft, extra) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { imageQueries, ...rest } = draft;
  return {
    ...rest,
    ...extra,
    publishedAt: today(),
    updatedAt: today(),
    images: [],
    chart: draft.chart,
    imageQueries,
  };
}

/** Internal links offered to the writer for one page. @param {string[]} prefer */
function internalFor(prefer) {
  const all = readAll().map((p) => ({ url: urlFor(p), title: p.title }));
  const scored = all
    .map((p) => ({ ...p, score: prefer.reduce((n, w) => n + (`${p.url} ${p.title}`.toLowerCase().includes(w.toLowerCase()) ? 1 : 0), 0) }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
  return scored.map((p) => `${p.url} (${p.title})`);
}

/** @typedef {{ key: string, [k: string]: any }} Target */

/**
 * @typedef {{
 *   type: string,
 *   flag: string,
 *   next: (n: number) => Promise<Target[]>,
 *   research: (t: Target) => string,
 *   write: (t: Target, notes: unknown, internal: string[]) => string,
 *   schema: object,
 *   assemble: (draft: any, t: Target) => any,
 *   internal: (t: Target) => string[],
 *   extraKeywords: (t: Target) => string[],
 * }} Spec
 */

/** @type {Record<string, Spec>} */
export const SPECS = {
  howto: {
    type: "howto",
    flag: "howto",
    async next(n) {
      const have = new Set(readType("howto").map((p) => p.slug));
      let queue = readJsonl(queueFile("howto-topics.jsonl")).filter((t) => !have.has(t.slug) && appBySlug(t.app));
      if (queue.length < n) {
        await planHowtoTopics(Math.max(n - queue.length + 20, 30));
        queue = readJsonl(queueFile("howto-topics.jsonl")).filter((t) => !have.has(t.slug) && appBySlug(t.app));
      }
      return queue.slice(0, n).map((t) => ({ ...t, key: `howto:${t.slug}` }));
    },
    research: (t) => prompts.howtoResearch({ app: /** @type {any} */ (appBySlug(t.app)), task: t.task, keyword: t.targetKeyword }),
    write: (t, notes, internal) => prompts.howtoWrite({ app: /** @type {any} */ (appBySlug(t.app)), task: t.task, keyword: t.targetKeyword, notes, internal }),
    schema: howtoSchema,
    assemble(draft, t) {
      const app = /** @type {any} */ (appBySlug(t.app));
      return basePage(draft, { type: "howto", slug: t.slug, app: app.slug, appName: app.name, targetKeyword: draft.targetKeyword || t.targetKeyword });
    },
    internal: (t) => internalFor([t.app, /** @type {any} */ (appBySlug(t.app))?.name ?? t.app]),
    extraKeywords: (t) => [/** @type {any} */ (appBySlug(t.app))?.name, t.task, "Mac"],
  },

  apps: {
    type: "app",
    flag: "apps",
    async next(n) {
      const have = new Set(readType("app").map((p) => p.slug));
      return APPS.filter((a) => !have.has(a.slug))
        .slice(0, n)
        .map((a) => ({ key: `app:${a.slug}`, app: a.slug, keyword: fill(KEYWORD_PATTERNS.app[1], { app: a.name.toLowerCase() }) + " mac" }));
    },
    research: (t) => prompts.appResearch({ app: /** @type {any} */ (appBySlug(t.app)) }),
    write: (t, notes, internal) => prompts.appWrite({ app: /** @type {any} */ (appBySlug(t.app)), keyword: t.keyword, notes, internal }),
    schema: appSchema,
    assemble(draft, t) {
      const app = /** @type {any} */ (appBySlug(t.app));
      return basePage(draft, { type: "app", slug: app.slug, app: app.slug, appName: app.name, appUrl: app.site, appCategory: app.category });
    },
    internal: (t) => internalFor([t.app, /** @type {any} */ (appBySlug(t.app))?.name ?? t.app]),
    extraKeywords: (t) => [/** @type {any} */ (appBySlug(t.app))?.name, "voice assistant", "Mac"],
  },

  roles: {
    type: "role",
    flag: "roles",
    async next(n) {
      const have = new Set(readType("role").map((p) => p.slug));
      return ROLES.filter((r) => !have.has(r.slug))
        .slice(0, n)
        .map((r) => ({ key: `role:${r.slug}`, role: r.slug, keyword: r.keywords[0] }));
    },
    research: (t) => prompts.roleResearch({ role: /** @type {any} */ (roleBySlug(t.role)) }),
    write: (t, notes, internal) => prompts.roleWrite({ role: /** @type {any} */ (roleBySlug(t.role)), keyword: t.keyword, notes, internal }),
    schema: roleSchema,
    assemble(draft, t) {
      const role = /** @type {any} */ (roleBySlug(t.role));
      return basePage(draft, { type: "role", slug: role.slug, role: role.slug, roleName: role.name, roleSingular: role.singular, apps: role.apps });
    },
    internal: (t) => internalFor([t.role, ...(/** @type {any} */ (roleBySlug(t.role))?.apps ?? [])]),
    extraKeywords: (t) => [/** @type {any} */ (roleBySlug(t.role))?.name, "AI assistant", "Mac"],
  },

  "role-apps": {
    type: "role-app",
    flag: "role-apps",
    async next(n) {
      const have = new Set(readType("role-app").map((p) => `${p.role}/${p.app}`));
      const pairs = [];
      // Breadth first: every role's first app, then every role's second app, and so on.
      for (let i = 0; i < 8; i++) for (const r of ROLES) if (r.apps[i] && !have.has(`${r.slug}/${r.apps[i]}`)) pairs.push({ role: r.slug, app: r.apps[i] });
      return pairs.slice(0, n).map((p) => {
        const app = /** @type {any} */ (appBySlug(p.app));
        const role = /** @type {any} */ (roleBySlug(p.role));
        return { ...p, key: `role-app:${p.role}/${p.app}`, keyword: fill(KEYWORD_PATTERNS["role-app"][0], { app: app.name.toLowerCase(), role: role.name.toLowerCase() }) };
      });
    },
    research: (t) => prompts.roleAppResearch({ role: /** @type {any} */ (roleBySlug(t.role)), app: /** @type {any} */ (appBySlug(t.app)) }),
    write: (t, notes, internal) => prompts.roleAppWrite({ role: /** @type {any} */ (roleBySlug(t.role)), app: /** @type {any} */ (appBySlug(t.app)), keyword: t.keyword, notes, internal }),
    schema: roleAppSchema,
    assemble(draft, t) {
      const app = /** @type {any} */ (appBySlug(t.app));
      const role = /** @type {any} */ (roleBySlug(t.role));
      return basePage(draft, { type: "role-app", slug: `${role.slug}-${app.slug}`, role: role.slug, app: app.slug, roleName: role.name, appName: app.name });
    },
    internal: (t) => internalFor([t.role, t.app]),
    extraKeywords: (t) => [/** @type {any} */ (appBySlug(t.app))?.name, /** @type {any} */ (roleBySlug(t.role))?.name, "Mac"],
  },

  compare: {
    type: "compare",
    flag: "compare",
    async next(n) {
      const have = new Set([...readType("compare"), ...readType("alternatives")].map((p) => `${p.type}:${p.slug}`));
      /** @type {Target[]} */
      const out = [];
      for (const c of COMPETITORS) {
        const s = `lazur-vs-${c.slug}`;
        if (!have.has(`compare:${s}`)) out.push({ key: `compare:${s}`, kind: "lazur-vs", pageType: "compare", slug: s, title: `Lazur vs ${c.name}`, keyword: `lazur vs ${c.name.toLowerCase()}`, products: [c.slug] });
        if (!have.has(`alternatives:${c.slug}`)) out.push({ key: `alternatives:${c.slug}`, kind: "alternatives", pageType: "alternatives", slug: c.slug, title: `${c.name} alternatives for Mac`, keyword: `${c.name.toLowerCase()} alternatives mac`, products: [c.slug, ...COMPETITORS.filter((x) => x.category === c.category && x.slug !== c.slug).slice(0, 3).map((x) => x.slug)] });
      }
      const dict = COMPETITORS.filter((c) => c.category === "dictation" || c.category === "os");
      for (const a of dict)
        for (const b of dict) {
          if (a.slug >= b.slug) continue;
          const s = `${a.slug}-vs-${b.slug}`;
          if (!have.has(`compare:${s}`)) out.push({ key: `compare:${s}`, kind: "x-vs-y", pageType: "compare", slug: s, title: `${a.name} vs ${b.name}`, keyword: `${a.name.toLowerCase()} vs ${b.name.toLowerCase()}`, products: [a.slug, b.slug] });
        }
      return out.slice(0, n);
    },
    research: (t) => prompts.compareResearch({ kind: t.kind, products: t.products.map((/** @type {string} */ s) => COMPETITORS.find((c) => c.slug === s)) }),
    write: (t, notes, internal) =>
      prompts.compareWrite({
        title: t.title,
        kind: t.kind,
        keyword: t.keyword,
        notes,
        internal,
        products: [...(t.kind === "x-vs-y" ? [] : [LAZUR_PRODUCT]), ...t.products.map((/** @type {string} */ s) => /** @type {any} */ (COMPETITORS.find((c) => c.slug === s))), ...(t.kind === "x-vs-y" ? [LAZUR_PRODUCT] : [])],
      }),
    schema: compareSchema,
    assemble(draft, t) {
      // Lazur's row is always rewritten from lazur-facts so the model cannot misstate our price.
      const products = draft.products.map((/** @type {any} */ p) =>
        p.slug === "lazur" || /^lazur$/i.test(p.name) ? { ...p, ...LAZUR_PRODUCT, pricingCheckedAt: today(), summary: p.summary, bestFor: p.bestFor } : p,
      );
      return basePage({ ...draft, products }, { type: t.pageType, kind: t.kind, slug: t.slug });
    },
    internal: (t) => internalFor(["compare", "alternatives", ...t.products]),
    extraKeywords: (t) => t.products.map((/** @type {string} */ s) => COMPETITORS.find((c) => c.slug === s)?.name ?? s),
  },

  blog: {
    type: "blog",
    flag: "blog",
    async next(n) {
      const have = new Set(readType("blog").map((p) => p.slug));
      let queue = readJsonl(queueFile("blog-topics.jsonl")).filter((t) => !have.has(t.slug));
      if (queue.length < n) {
        await planBlogTopics(Math.max(n - queue.length + 5, 10));
        queue = readJsonl(queueFile("blog-topics.jsonl")).filter((t) => !have.has(t.slug));
      }
      return queue.slice(0, n).map((t) => ({ ...t, key: `blog:${t.slug}` }));
    },
    research: (t) => prompts.blogResearch({ topic: /** @type {any} */ (t) }),
    write: (t, notes, internal) => prompts.blogWrite({ topic: /** @type {any} */ (t), notes, internal, relatedOptions: readType("blog").map((p) => p.slug).slice(0, 60) }),
    schema: blogSchema,
    assemble(draft, t) {
      const intro = String(draft.body).trim().split(/\n\s*\n/)[0] ?? "";
      return { ...draft, type: "blog", slug: t.slug, metaTitle: draft.title, intro, publishedAt: today(), updatedAt: today(), author: "Lazur Team", images: [], secondaryKeywords: [] };
    },
    internal: (t) => internalFor(String(t.targetKeyword).split(" ")),
    extraKeywords: (t) => String(t.targetKeyword).split(" ").slice(0, 3),
  },
};

/** Write a blog page as markdown with frontmatter. @param {any} page @param {string} root */
function saveBlog(page, root) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { body, type, slug, file, imageQueries, metaTitle, intro, secondaryKeywords, keywordHits, ...front } = page;
  const hero = page.images[0];
  const data = JSON.parse(JSON.stringify({ ...front, heroImage: hero, keywordHits }));
  const md = matter.stringify(`\n${body.trim()}\n`, data);
  const out = path.join(root, "content/blog", `${slug}.md`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, md);
  return out;
}

/**
 * Generate one page end to end.
 * @param {Spec} spec
 * @param {Target} t
 * @param {{ runDir: string, images: boolean, outRoot?: string, existing?: any }} opts
 * @returns {Promise<{ status: "done" | "refused" | "failed", file?: string, url?: string, reason?: string }>}
 */
export async function generateOne(spec, t, opts) {
  const label = t.key;
  try {
    const notes = await research({ prompt: spec.research(t), schema: researchSchema, label: `${label}:research`, runDir: opts.runDir, fake: () => fake.research(t) });
    const internal = spec.internal(t);
    const existingNote = opts.existing ? `\n\nTHIS IS A REFRESH of an existing page. Keep the same topic and slug, keep what is still true, update facts, prices and versions from the new research, and fix anything that breaks the rules. Existing page:\n${JSON.stringify(opts.existing).slice(0, 12000)}` : "";
    const prompt = spec.write(t, notes, internal) + existingNote;
    let draft = await write({ prompt, schema: spec.schema, label: `${label}:write`, runDir: opts.runDir, fake: () => fake.draft(spec.type, t) });
    let page = spec.assemble(draft, t);
    const ctx = { type: page.type, allowedPaths: allowedPaths(), existingTitles: opts.existing ? undefined : new Set(readAll().map((p) => String(p.title).toLowerCase())) };
    if (page.type === "blog") ctx.allowedPaths.add(`/blog/${page.slug}`);
    let check = guardPage(page, ctx);

    if (check.errors.length) {
      const fixPrompt = `${prompt}\n\nYOUR DRAFT:\n${JSON.stringify(draft)}\n\nCODE CHECKS FAILED. Fix every one of these and return the full corrected JSON:\n- ${check.errors.join("\n- ")}`;
      draft = await write({ prompt: fixPrompt, schema: spec.schema, label: `${label}:fix`, runDir: opts.runDir, fake: () => fake.draft(spec.type, t) });
      page = spec.assemble(draft, t);
      check = guardPage(page, ctx);
      if (check.errors.length) {
        logRefused(opts.runDir, { key: label, stage: "write", errors: check.errors, warnings: check.warnings });
        return { status: "refused", reason: guardSummary(check) };
      }
    }

    if (opts.existing) {
      page.publishedAt = opts.existing.publishedAt ?? page.publishedAt;
      if (!opts.images && opts.existing.images?.length) page.images = opts.existing.images;
    }

    if (opts.images) {
      page.images = await imagesForPage({ type: page.type, slug: page.slug, keyword: page.targetKeyword, extraKeywords: spec.extraKeywords(t).filter(Boolean), queries: page.imageQueries ?? [] });
    }
    const final = guardPage(page, { ...ctx, minImages: opts.images ? MIN_IMAGES : 0 });
    if (final.errors.length) {
      logRefused(opts.runDir, { key: label, stage: "images", errors: final.errors });
      return { status: "refused", reason: guardSummary(final) };
    }
    page.generator = { by: "scripts/content", model: process.env.CONTENT_AGENT_FAKE === "1" ? "fake" : process.env.CONTENT_WRITE_MODEL || "haiku", runId: path.basename(opts.runDir), version: (opts.existing?.generator?.version ?? 0) + 1 };
    delete page.imageQueries;
    const root = opts.outRoot ?? ROOT;
    const file = page.type === "blog" ? saveBlog(page, root) : root === ROOT ? savePage(page) : savePreview(page, root);
    return { status: "done", file: path.relative(ROOT, file), url: urlFor(page) };
  } catch (e) {
    const reason = /** @type {Error} */ (e).message.slice(0, 500);
    logRefused(opts.runDir, { key: label, stage: "error", error: reason });
    return { status: "failed", reason };
  }
}

/** @param {any} page @param {string} root */
function savePreview(page, root) {
  const file = path.join(root, path.relative(ROOT, fileFor(page)));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(page, null, 2) + "\n");
  return file;
}

/** Research new how-to topics and append them to the queue. @param {number} count */
export async function planHowtoTopics(count, runDir = path.join(planDir(), "../../../content-runs/planner")) {
  const have = readType("howto").map((p) => p.slug);
  const queued = readJsonl(queueFile("howto-topics.jsonl"));
  // Rotate through apps so one app does not take the whole queue.
  const perApp = new Map(APPS.map((a) => [a.slug, have.filter((s) => s.endsWith(`-in-${a.slug}`)).length + queued.filter((q) => q.app === a.slug).length]));
  const apps = [...APPS].sort((a, b) => (perApp.get(a.slug) ?? 0) - (perApp.get(b.slug) ?? 0)).slice(0, 6);
  const res = await research({
    prompt: prompts.howtoTopics({ apps: apps.map((a) => a.slug), existing: [...have, ...queued.map((q) => q.slug)], count }),
    schema: topicsSchema,
    label: "plan:howto",
    runDir,
    fake: () => fake.topics("howto", apps.map((a) => a.slug), count),
  });
  const seen = new Set([...have, ...queued.map((q) => q.slug)]);
  const fresh = res.topics
    .filter((/** @type {any} */ t) => t.app && t.task && appBySlug(t.app))
    .map((/** @type {any} */ t) => ({ ...t, slug: slugify(`${t.task}-in-${t.app}`), addedAt: today() }))
    .filter((/** @type {any} */ t) => !seen.has(t.slug) && (seen.add(t.slug), true));
  writeJsonl(queueFile("howto-topics.jsonl"), [...queued, ...fresh]);
  return fresh.length;
}

/** Research new blog topics, avoiding every existing title. @param {number} count */
export async function planBlogTopics(count, runDir = path.join(planDir(), "../../../content-runs/planner")) {
  const posts = readType("blog");
  const queued = readJsonl(queueFile("blog-topics.jsonl"));
  const existing = [...posts.map((p) => `${p.slug} | ${p.title} | ${p.targetKeyword ?? ""}`), ...queued.map((q) => `${q.slug} | ${q.title} | ${q.targetKeyword}`)];
  const res = await research({ prompt: prompts.blogTopics({ seeds: BLOG_SEEDS, existing, count }), schema: topicsSchema, label: "plan:blog", runDir, fake: () => fake.topics("blog", [], count) });
  const titles = new Set(existing.map((e) => e.split(" | ")[1]?.toLowerCase()));
  const seen = new Set([...posts.map((p) => p.slug), ...queued.map((q) => q.slug)]);
  const fresh = res.topics
    .map((/** @type {any} */ t) => ({ ...t, slug: slugify(t.slug), addedAt: today() }))
    .filter((/** @type {any} */ t) => !seen.has(t.slug) && !titles.has(t.title.toLowerCase()) && (seen.add(t.slug), true));
  writeJsonl(queueFile("blog-topics.jsonl"), [...queued, ...fresh]);
  return fresh.length;
}

export { LAZUR };
