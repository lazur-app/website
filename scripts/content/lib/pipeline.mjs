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
import { APPS, BLOG_SEEDS, COMPETITORS, KEYWORD_PATTERNS, ROLES, appBySlug, roleBySlug as baseRoleBySlug } from "../../../src/lib/content/sources.mjs";
import { LAZUR } from "../../../src/lib/content/lazur-facts.mjs";
import { wordCount } from "../../../src/lib/content/keywords.mjs";
import { MIN_WORDS } from "../../../src/lib/content/rules.mjs";
import { research, write } from "./agent.mjs";
import { cleanNotes, getCached, putCached } from "./research-cache.mjs";
import { suggestions } from "./suggest.mjs";
import { ROOT, allowedPaths, fileFor, logRefused, readAll, readJsonl, readType, savePage, today, urlFor, writeJsonl } from "./core.mjs";
import { fake } from "./fake.mjs";
import { guardPage, guardSummary } from "./guards.mjs";
import { imagesForPage, slugify } from "./images.mjs";
import { prompts } from "./prompts.mjs";
import { appSchema, blogSchema, compareSchema, howtoSchema, problemSchema, researchSchema, roleAppSchema, roleSchema, rolesSchema, topicsSchema } from "./schemas.mjs";

/** Topic queues. Preview runs (--out) point this elsewhere so tests never touch the real queue. */
const planDir = () => process.env.CONTENT_PLAN_DIR || path.join(ROOT, "content/seo/_plan");
const queueFile = (/** @type {string} */ name) => path.join(planDir(), name);
const MIN_IMAGES = Number(process.env.CONTENT_MIN_IMAGES ?? 2);

/**
 * Content checks (writing rules, word count, sources, claims, keyword in H1). OFF by default, as
 * Veer asked on 2026-11-09: whatever the model writes is published as long as it is valid JSON for
 * the template. CONTENT_CHECKS=on brings back the guards, fix rounds and source filtering.
 */
export const CHECKS_ON = process.env.CONTENT_CHECKS === "on";

/** Where discovered roles live (CONTENT_ROLES_FILE overrides it for tests). */
const rolesFile = () => process.env.CONTENT_ROLES_FILE || path.join(ROOT, "src/lib/content/roles-discovered.mjs");

/** Role lookup that also sees roles discovered earlier in this run. @param {string} slug */
function roleBySlug(slug) {
  const hit = baseRoleBySlug(slug);
  if (hit) return hit;
  try {
    const text = fs.readFileSync(rolesFile(), "utf8");
    const list = JSON.parse(text.slice(text.indexOf("[", text.indexOf("DISCOVERED_ROLES")), text.lastIndexOf("]") + 1));
    return list.find((/** @type {any} */ r) => r.slug === slug);
  } catch {
    return undefined;
  }
}

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
        .map((a) => ({ key: `app:${a.slug}`, app: a.slug, keyword: fill(KEYWORD_PATTERNS.app[0], { app: a.name.toLowerCase() }) }));
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
      if (ROLES.filter((r) => !have.has(r.slug)).length < n) await planRoles(Math.max(n, 10));
      const roles = await currentRoles();
      return roles.filter((r) => !have.has(r.slug))
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
      const allRoles = await currentRoles();
      for (let i = 0; i < 8; i++) for (const r of allRoles) if (r.apps[i] && !have.has(`${r.slug}/${r.apps[i]}`)) pairs.push({ role: r.slug, app: r.apps[i] });
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

  problems: {
    type: "problem",
    flag: "problems",
    async next(n) {
      const have = new Set(readType("problem").map((p) => `${p.role}/${p.slug}`));
      let queue = readJsonl(queueFile("problem-topics.jsonl")).filter((t) => !have.has(`${t.role}/${t.slug}`) && roleBySlug(t.role));
      if (queue.length < n) {
        await planProblemTopics(Math.max(n - queue.length + 10, 15));
        queue = readJsonl(queueFile("problem-topics.jsonl")).filter((t) => !have.has(`${t.role}/${t.slug}`) && roleBySlug(t.role));
      }
      // Spread across roles: take one per role in turn.
      const byRole = new Map();
      for (const t of queue) byRole.set(t.role, [...(byRole.get(t.role) ?? []), t]);
      const out = [];
      while (out.length < n && [...byRole.values()].some((l) => l.length)) for (const l of byRole.values()) if (l.length && out.length < n) out.push(l.shift());
      return out.map((t) => ({ ...t, key: `problem:${t.role}/${t.slug}` }));
    },
    research: (t) => prompts.problemResearch({ role: /** @type {any} */ (roleBySlug(t.role)), problem: t.task }),
    write: (t, notes, internal) => prompts.problemWrite({ role: /** @type {any} */ (roleBySlug(t.role)), problem: t.task, keyword: t.targetKeyword, notes, internal }),
    schema: problemSchema,
    assemble(draft, t) {
      const role = /** @type {any} */ (roleBySlug(t.role));
      const apps = (draft.apps ?? []).filter((/** @type {string} */ a) => appBySlug(a));
      return basePage({ ...draft, apps: apps.length ? apps : role.apps.slice(0, 3) }, { type: "problem", slug: t.slug, role: role.slug, roleName: role.name, roleSingular: role.singular, targetKeyword: draft.targetKeyword || t.targetKeyword });
    },
    internal: (t) => internalFor([t.role, ...(/** @type {any} */ (roleBySlug(t.role))?.apps ?? [])]),
    extraKeywords: (t) => [/** @type {any} */ (roleBySlug(t.role))?.name, t.task, "Mac"],
  },

  compare: {
    type: "compare",
    flag: "compare",
    async next(n) {
      const pages = [...readType("compare"), ...readType("alternatives")];
      const have = new Set(pages.map((p) => `${p.type}:${p.slug}`));
      // Dedupe by what a page covers, not only its slug (older pages use other slugs, e.g. lazur-vs-super-whisper).
      for (const p of pages) {
        const others = (p.products ?? []).filter((/** @type {any} */ x) => !x.isLazur).map((/** @type {any} */ x) => x.slug).sort();
        if (p.kind === "lazur-vs" && others[0]) have.add(`compare:lazur-vs-${others[0]}`);
        if (p.kind === "x-vs-y" && others.length >= 2) have.add(`compare:${others[0]}-vs-${others[1]}`);
      }
      /** @type {Target[]} */
      const out = [];
      for (const c of COMPETITORS) {
        const s = `lazur-vs-${c.slug}`;
        if (!have.has(`compare:${s}`)) out.push({ key: `compare:${s}`, kind: "lazur-vs", pageType: "compare", slug: s, title: `Lazur vs ${c.name}`, keyword: `lazur vs ${c.name.toLowerCase()}`, products: [c.slug] });
        if (!have.has(`alternatives:${c.slug}`)) out.push({ key: `alternatives:${c.slug}`, kind: "alternatives", pageType: "alternatives", slug: c.slug, title: `${c.name} alternatives for Mac`, keyword: `${c.name.toLowerCase()} alternatives for mac`, products: [c.slug, ...COMPETITORS.filter((x) => x.category === c.category && x.slug !== c.slug).slice(0, 3).map((x) => x.slug)] });
      }
      const dict = COMPETITORS.filter((c) => c.category === "dictation" || c.category === "os");
      for (const a of dict)
        for (const b of dict) {
          if (a.slug >= b.slug) continue; // slugs sorted, so a-vs-b and b-vs-a are one page
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

/**
 * What each page type researches. Entities (app, role, competitor) are cached and shared across
 * pages; `topic` is the one page-specific grounded call (null when the entities are enough).
 * @type {Record<string, { entities: (t: Target) => { kind: string, slug: string, prompt: string, urls: string[] }[], topic: (t: Target) => { prompt: string, urls: string[] } | null }>}
 */
const RESEARCH = {
  howto: {
    entities: (t) => [appEntity(t.app)],
    topic: (t) => ({ prompt: SPECS.howto.research(t), urls: helpUrls(t.app) }),
  },
  apps: { entities: (t) => [appEntity(t.app)], topic: () => null },
  roles: { entities: (t) => [roleEntity(t.role)], topic: () => null },
  "role-apps": { entities: (t) => [appEntity(t.app), roleEntity(t.role)], topic: () => null },
  problems: { entities: (t) => [roleEntity(t.role)], topic: (t) => ({ prompt: SPECS.problems.research(t), urls: [] }) },
  compare: { entities: (t) => t.products.map((/** @type {string} */ s) => competitorEntity(s)), topic: () => null },
  blog: { entities: () => [], topic: (t) => ({ prompt: SPECS.blog.research(t), urls: [] }) },
};

/** Official help sites, read via URL context (no search fee) before searching. @param {string} app */
function helpUrls(app) {
  const a = appBySlug(app);
  return a ? [a.site] : [];
}
/** @param {string} slug */
function appEntity(slug) {
  const app = /** @type {any} */ (appBySlug(slug));
  return { kind: "app", slug, prompt: prompts.appResearch({ app }), urls: [app.site] };
}
/** @param {string} slug */
function roleEntity(slug) {
  return { kind: "role", slug, prompt: prompts.roleResearch({ role: /** @type {any} */ (roleBySlug(slug)) }), urls: [] };
}
/** @param {string} slug */
function competitorEntity(slug) {
  const c = /** @type {any} */ (COMPETITORS.find((x) => x.slug === slug));
  return { kind: "competitor", slug, prompt: prompts.compareResearch({ kind: "facts for one product", products: [c] }), urls: [c.pricingUrl ?? c.site] };
}

/**
 * Gather notes for one page: cached entities first, at most ONE new grounded call per entity that
 * is missing or stale, plus the page's own topic call if it has one.
 * @param {string} flag @param {Target} t @param {string} runDir
 */
async function gather(flag, t, runDir) {
  const def = RESEARCH[flag];
  /** @type {Record<string, any>} */
  const notes = {};
  for (const e of def.entities(t)) {
    let n = getCached(e.kind, e.slug);
    if (!n) {
      n = cleanNotes(await research({ prompt: e.prompt, urls: e.urls, schema: researchSchema, label: `${t.key}|research:${e.kind}:${e.slug}`, runDir, fake: () => fake.research() }));
      if (process.env.CONTENT_AGENT_FAKE !== "1") putCached(e.kind, e.slug, n);
    }
    notes[`${e.kind}:${e.slug}`] = n;
  }
  const topic = def.topic(t);
  if (topic) notes.topic = cleanNotes(await research({ prompt: topic.prompt, urls: topic.urls, schema: researchSchema, label: `${t.key}:research`, runDir, fake: () => fake.research() }));
  return notes;
}

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
 * @returns {Promise<{ status: "done" | "refused" | "failed" | "deferred", file?: string, url?: string, reason?: string }>}
 */
export async function generateOne(spec, t, opts) {
  const label = t.key;
  try {
    const notes = await gather(spec.flag, t, opts.runDir);
    const internal = spec.internal(t);
    const existingNote = opts.existing ? `\n\nTHIS IS A REFRESH of an existing page. Keep the same topic and slug, keep what is still true, update facts, prices and versions from the new research, and fix anything that breaks the rules. Existing page:\n${JSON.stringify(opts.existing).slice(0, 12000)}` : "";
    const prompt = spec.write(t, notes, internal) + existingNote;
    let draft = await write({ prompt, schema: spec.schema, label: `${label}:write`, runDir: opts.runDir, fake: () => fake.draft(spec.type, t) });
    // Optional length pass (CONTENT_EXPAND=on, off by default: Veer prefers pages at whatever length
    // the model writes). When on, up to two passes ask for new sections until MIN_WORDS.
    for (let pass = 1; pass <= 2 && process.env.CONTENT_EXPAND === "on" && process.env.CONTENT_AGENT_FAKE !== "1"; pass++) {
      const words = wordCount(spec.assemble(draft, t));
      if (words >= MIN_WORDS) break;
      const expandPrompt = `${prompt}\n\nYOUR DRAFT (${words} words):\n${JSON.stringify(draft)}\n\nThe page must be at least ${MIN_WORDS + 300} words of useful prose. Return the full JSON again with the same fields, keeping everything that is there and ADDING depth: new blocks with H2 sections that answer different sub-questions, worked examples, common mistakes, comparisons, what to do next, and more FAQ answers. Do not repeat points or pad sentences.`;
      draft = await write({ prompt: expandPrompt, schema: spec.schema, label: `${label}:expand${pass}`, runDir: opts.runDir, fake: () => fake.draft(spec.type, t) });
    }
    // Sources: only URLs the research actually returned (or pages we read). Anything else the writer
    // cites is dropped, and a stat that relied on it then fails the guard.
    const verified = new Set(Object.values(notes).flatMap((/** @type {any} */ n) => (n?.sources ?? []).map((/** @type {any} */ s) => s.url)));
    const keepVerified = (/** @type {any} */ p) => {
      if (process.env.CONTENT_AGENT_FAKE === "1" || !CHECKS_ON) return p;
      p.sources = (p.sources ?? []).filter((/** @type {any} */ s) => verified.has(s.url));
      return p;
    };
    let page = keepVerified(spec.assemble(draft, t));
    const ctx = { type: page.type, allowedPaths: allowedPaths(), existingTitles: opts.existing ? undefined : new Set(readAll().map((p) => String(p.title).toLowerCase())) };
    if (page.type === "blog") ctx.allowedPaths.add(`/blog/${page.slug}`);
    let check = guardPage(page, ctx);
    if (!CHECKS_ON) check = { errors: [], warnings: [...check.errors, ...check.warnings] };

    // Up to two fix rounds: the errors go back to the writer with its draft.
    for (let round = 1; round <= 2 && check.errors.length; round++) {
      const fixPrompt = `${prompt}\n\nYOUR DRAFT:\n${JSON.stringify(draft)}\n\nCODE CHECKS FAILED. Fix every one of these and return the full corrected JSON. Only cite URLs from the research notes:\n- ${check.errors.join("\n- ")}`;
      draft = await write({ prompt: fixPrompt, schema: spec.schema, label: `${label}:fix${round}`, runDir: opts.runDir, fake: () => fake.draft(spec.type, t) });
      page = keepVerified(spec.assemble(draft, t));
      check = guardPage(page, ctx);
    }
    {
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
    const final = guardPage(page, { ...ctx, minImages: CHECKS_ON && opts.images ? MIN_IMAGES : 0 });
    if (!CHECKS_ON) final.errors = [];
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
    if (/** @type {any} */ (e).code === "BUDGET") return { status: "deferred", reason };
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
  // Free demand signal: Google autocomplete for each app, then one ungrounded call to pick topics.
  const sugg = await suggestions(apps.flatMap((a) => [`${a.name.toLowerCase()} mac how to`, `how to in ${a.name.toLowerCase()} on mac`]), { letters: true });
  const res = await write({
    prompt: prompts.howtoTopics({ apps: apps.map((a) => a.slug), existing: [...have, ...queued.map((q) => q.slug)], count, suggestions: sugg }),
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

/** Research real problems per role, deduped against what exists. @param {number} count */
/** ROLES plus anything discovered during this run (the module import is cached). */
async function currentRoles() {
  const text = fs.readFileSync(rolesFile(), "utf8");
  const json = text.slice(text.indexOf("[", text.indexOf("DISCOVERED_ROLES")), text.lastIndexOf("]") + 1);
  /** @type {any[]} */
  const found = JSON.parse(json || "[]");
  return [...ROLES, ...found.filter((r) => !ROLES.some((x) => x.slug === r.slug))];
}

/**
 * Research new jobs whose people work on a Mac all day, and append them to roles-discovered.mjs.
 * @param {number} count
 */
export async function planRoles(count, runDir = path.join(planDir(), "../../../content-runs/planner")) {
  const roles = await currentRoles();
  const res = await write({
    prompt: prompts.roleTopics({ existing: roles.map((r) => `${r.slug} | ${r.name}`), count, apps: APPS.map((a) => a.slug) }),
    schema: rolesSchema,
    label: "plan:roles",
    runDir,
    fake: () => ({ roles: Array.from({ length: Math.min(count, 3) }, (_, i) => ({ slug: `test-role-${Date.now() % 1000}-${i + 1}`, name: `Test role ${i + 1}s`, singular: `test role ${i + 1}`, apps: ["gmail", "chrome"], keywords: [`ai assistant for test role ${i + 1}`], why: "Fake." })) }),
  });
  const known = new Set(roles.map((r) => r.slug));
  const fresh = res.roles
    .map((/** @type {any} */ r) => ({ ...r, slug: slugify(r.slug), apps: r.apps.filter((/** @type {string} */ a) => appBySlug(a)).slice(0, 6), discoveredAt: today() }))
    .filter((/** @type {any} */ r) => r.apps.length >= 2 && !known.has(r.slug) && (known.add(r.slug), true));
  if (fresh.length === 0) return 0;
  const file = rolesFile();
  const all = [...(await currentRoles()).filter((r) => r.discoveredAt), ...fresh];
  fs.writeFileSync(
    file,
    `// @ts-check\n/**\n * Roles the content planner discovered on its own (scripts/content/lib/pipeline.mjs planRoles).\n * Written by code, appended to ROLES in sources.mjs. Edit or delete entries freely.\n * @type {{ slug: string, name: string, singular: string, apps: string[], keywords: string[], discoveredAt?: string, why?: string }[]}\n */\nexport const DISCOVERED_ROLES = ${JSON.stringify(all, null, 2)};\n`,
  );
  return fresh.length;
}

export async function planProblemTopics(count, runDir = path.join(planDir(), "../../../content-runs/planner")) {
  const have = readType("problem");
  const queued = readJsonl(queueFile("problem-topics.jsonl"));
  const allRoles = await currentRoles();
  const perRole = new Map(allRoles.map((r) => [r.slug, have.filter((p) => p.role === r.slug).length + queued.filter((q) => q.role === r.slug).length]));
  const roles = [...allRoles].sort((a, b) => (perRole.get(a.slug) ?? 0) - (perRole.get(b.slug) ?? 0)).slice(0, 3);
  let added = 0;
  for (const role of roles) {
    const existing = [...have, ...queued].filter((p) => p.role === role.slug).map((p) => `${p.slug} | ${p.title}`);
    const plural = role.name.toLowerCase();
    const sugg = await suggestions([`why do ${plural}`, `how can ${plural}`, `${plural} struggle with`, `${plural} spend too much time`, `${role.singular} burnout`, `${role.singular} problems`, `${plural} hate`]);
    const res = await write({
      prompt: prompts.problemTopics({ role, existing, count: Math.ceil(count / roles.length), suggestions: sugg }),
      schema: topicsSchema,
      label: `plan:problems:${role.slug}`,
      runDir,
      fake: () => fake.topics("problem", [role.slug], Math.ceil(count / roles.length)),
    });
    const seen = new Set([...have, ...queued].map((p) => `${p.role}/${p.slug}`));
    const fresh = res.topics
      .filter((/** @type {any} */ t) => t.task)
      .map((/** @type {any} */ t) => ({ ...t, role: role.slug, slug: slugify(t.slug), addedAt: today() }))
      .filter((/** @type {any} */ t) => !seen.has(`${t.role}/${t.slug}`) && (seen.add(`${t.role}/${t.slug}`), true));
    queued.push(...fresh);
    added += fresh.length;
  }
  writeJsonl(queueFile("problem-topics.jsonl"), queued);
  return added;
}

/** Research new blog topics, avoiding every existing title. @param {number} count */
export async function planBlogTopics(count, runDir = path.join(planDir(), "../../../content-runs/planner")) {
  const posts = readType("blog");
  const queued = readJsonl(queueFile("blog-topics.jsonl"));
  const existing = [...posts.map((p) => `${p.slug} | ${p.title} | ${p.targetKeyword ?? ""}`), ...queued.map((q) => `${q.slug} | ${q.title} | ${q.targetKeyword}`)];
  const sugg = await suggestions(BLOG_SEEDS, { letters: true });
  const res = await write({ prompt: prompts.blogTopics({ seeds: BLOG_SEEDS, existing, count, suggestions: sugg }), schema: topicsSchema, label: "plan:blog", runDir, fake: () => fake.topics("blog", [], count) });
  const titles = new Set(existing.map((e) => e.split(" | ")[1]?.toLowerCase()));
  const seen = new Set([...posts.map((p) => p.slug), ...queued.map((q) => q.slug)]);
  const fresh = res.topics
    .map((/** @type {any} */ t) => ({ ...t, slug: slugify(t.slug), addedAt: today() }))
    .filter((/** @type {any} */ t) => !seen.has(t.slug) && !titles.has(t.title.toLowerCase()) && (seen.add(t.slug), true));
  writeJsonl(queueFile("blog-topics.jsonl"), [...queued, ...fresh]);
  return fresh.length;
}

export { LAZUR };
