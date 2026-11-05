// @ts-check
/**
 * Stand-in model answers for CONTENT_AGENT_FAKE=1. They let the whole pipeline (planner, manifest,
 * guards, assembly, saving, resume) run in CI or locally with no seat and no cost. The text is
 * deliberately plain and passes the writing rules; it is never meant to be published.
 */
import { APPS, COMPETITORS, ROLES, appBySlug, roleBySlug } from "../../../src/lib/content/sources.mjs";

const SRC = { title: "Example source for a fake run", url: "https://example.com/fake-source", publisher: "Example", accessedAt: "2026-01-01" };
const today = new Date().toISOString().slice(0, 10);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const common = (/** @type {string} */ _subject, /** @type {string} */ keyword) => ({
  // Long-tail H1 that contains the exact keyword, like the real rule wants.
  title: `${keyword[0].toUpperCase()}${keyword.slice(1)}: a fake pipeline test page`,
  metaTitle: `${keyword[0].toUpperCase()}${keyword.slice(1)}`.slice(0, 60),
  description: `Fake run page about ${keyword}. This text exists only to test the content pipeline end to end and is never published to the site.`.slice(0, 160),
  targetKeyword: keyword,
  secondaryKeywords: [`${keyword} guide`],
  intro: `This is a test page about ${keyword}. It checks that research, writing, guards and saving work.`,
  tldr: ["The pipeline ran.", "The guards checked every string.", "Nothing here is real advice."],
  stats: [{ value: "1", label: "test number used to check sources are linked", sourceUrl: SRC.url, sourceTitle: SRC.title }],
  blocks: [
    { type: "heading", text: "What this test checks", level: 2 },
    { type: "paragraph", text: "It checks that every block type renders and that links point to real pages like [the download page](/download)." },
    { type: "stats" },
    { type: "lazur" },
  ],
  faq: [
    { question: "Is this a real page?", answer: "No. It comes from a fake run of the content pipeline." },
    { question: "Why does it exist?", answer: "To test the steps without calling a model or spending money." },
    { question: "Where does it go?", answer: "Into a preview folder, unless someone saves it on purpose." },
  ],
  sources: [SRC],
  imageQueries: [
    { query: "person working on laptop", alt: `Person working on a Mac laptop, ${keyword}`, caption: "A test caption" },
    { query: "desk with computer", alt: `Desk with a computer, ${keyword}`, caption: "Another test caption" },
  ],
});

export const fake = {
  research: () => ({ summary: "Fake research notes.", facts: [{ fact: "A fake fact.", sourceUrl: SRC.url, sourceTitle: SRC.title }, { fact: "Another.", sourceUrl: SRC.url, sourceTitle: SRC.title }, { fact: "A third.", sourceUrl: SRC.url, sourceTitle: SRC.title }], sources: [SRC, { ...SRC, url: "https://example.com/two" }], searchQueries: ["fake"], caveats: [] }),

  /** @param {string} type @param {string[]} apps @param {number} count */
  topics: (type, apps, count) => ({
    topics: Array.from({ length: Math.min(count, 6) }, (_, i) =>
      type === "howto"
        ? { slug: `test-task-${i + 1}-in-${apps[i % apps.length]}`, title: `How to test task ${i + 1} in ${appBySlug(apps[i % apps.length])?.name} on Mac`, targetKeyword: `how to test task ${i + 1} in ${appBySlug(apps[i % apps.length])?.name.toLowerCase()} on mac`, app: apps[i % apps.length], task: `test task ${i + 1}`, why: "Fake demand.", evidenceUrl: SRC.url }
        : { slug: `test-blog-topic-${today}-${i + 1}`, title: `Test blog topic ${i + 1}: a fake pipeline post for checking`, targetKeyword: `test blog topic ${i + 1}`, why: "Fake demand.", evidenceUrl: SRC.url },
    ),
  }),

  /** @param {string} type @param {any} t */
  draft(type, t) {
    if (type === "howto") {
      const app = appBySlug(t.app);
      return {
        ...common(`how to ${t.task} in ${app?.name} on Mac`, t.targetKeyword),
        task: t.task,
        appliesTo: `${app?.name} for Mac, test version`,
        timeMinutes: 3,
        difficulty: "Easy",
        requirements: ["A Mac"],
        steps: [
          { name: "Open the app", text: `Open ${app?.name} on your Mac.` },
          { name: "Find the menu", text: "Choose the menu shown below.", menuPath: ["File", "Test"] },
          { name: "Finish", text: "Click OK.", shortcut: "⌘ + S" },
        ],
        shortcuts: [{ action: "Save", keys: "⌘ + S" }],
        troubleshooting: [{ problem: "Nothing happens", fix: "Try again after a restart." }],
        lazur: { spoken: "where is this menu?", capability: "point", result: "Top left. I've circled it.", pointsAt: "File", shell: app?.shell ?? "generic" },
      };
    }
    if (type === "app") {
      const app = appBySlug(t.app);
      const demo = { spoken: "what does this do?", capability: "explain", result: "It explains the screen out loud.", shell: app?.shell ?? "generic" };
      return { ...common(`Lazur in ${app?.name}: an AI assistant for ${app?.name} on Mac`, t.keyword), appCategory: app?.category ?? "Apps", demos: [demo, { ...demo, capability: "point", pointsAt: "Help" }], asks: Array.from({ length: 6 }, (_, i) => ({ say: `test ask ${i + 1}`, result: "Lazur answers out loud.", capability: "explain" })) };
    }
    if (type === "role") {
      const role = roleBySlug(t.role);
      return {
        ...common(`Lazur for ${role?.name.toLowerCase()}: ${t.keyword}`, t.keyword),
        painPoints: Array.from({ length: 3 }, (_, i) => ({ title: `Test pain ${i + 1}`, text: "A short test description of where time goes." })),
        day: Array.from({ length: 4 }, (_, i) => ({ time: `${9 + i}:00`, say: `test ask ${i + 1}`, result: "Lazur answers out loud.", capability: "explain" })),
        demo: { spoken: "sum up this page", capability: "explain", result: "It sums up the page out loud.", shell: "doc" },
      };
    }
    if (type === "role-app") {
      const role = roleBySlug(t.role);
      const app = appBySlug(t.app);
      return {
        ...common(`${app?.name} for ${role?.name.toLowerCase()} on Mac`, t.keyword),
        demo: { spoken: "where's the share button?", capability: "point", result: "Top right. Circled it.", pointsAt: "Share", shell: app?.shell ?? "generic" },
        tasks: Array.from({ length: 5 }, (_, i) => ({ say: `test task ${i + 1}`, result: "Lazur answers out loud.", capability: "explain" })),
      };
    }
    if (type === "compare" || type === "alternatives") {
      const others = t.products.map((/** @type {string} */ s) => COMPETITORS.find((c) => c.slug === s));
      const products = [
        ...(t.kind === "x-vs-y" ? [] : [{ name: "Lazur", slug: "lazur", site: "https://www.lazur.app", pricing: "test", platforms: "macOS", summary: "Voice assistant in the notch.", bestFor: ["Test"] }]),
        ...others.map((/** @type {any} */ c) => ({ name: c.name, slug: c.slug, site: c.site, pricing: "See their pricing page", pricingSourceUrl: c.pricingUrl ?? c.site, platforms: "See their site", summary: "A test summary.", bestFor: ["Test"] })),
      ];
      return {
        ...common(t.title, t.keyword),
        products,
        table: Array.from({ length: 4 }, (_, i) => ({ feature: `Test feature ${i + 1}`, values: products.map(() => "Yes") })),
        verdict: "This is a fake verdict used to test the comparison template and its guards.",
      };
    }
    // blog
    return {
      title: t.title,
      description: `Fake run blog post about ${t.targetKeyword}. Exists only to test the content pipeline end to end and is never published.`.slice(0, 160),
      targetKeyword: t.targetKeyword,
      category: "Guide",
      cover: "apps",
      tldr: ["The pipeline ran.", "The guards checked the post.", "Nothing here is real advice."],
      faq: common("x", "x").faq,
      relatedSlugs: ["what-is-an-ai-buddy", "how-to-dictate-on-mac"],
      stats: common("x", "x").stats,
      sources: [SRC, { ...SRC, url: "https://example.com/two" }],
      imageQueries: common("x", "x").imageQueries,
      body: `This is a test post about ${t.targetKeyword}. It checks the blog path of the pipeline.\n\n## What it checks\n\n${"It checks that markdown posts are written with frontmatter, sources and images. ".repeat(40)}\n\nSee [the download page](/download) and [pricing](/pricing).`,
    };
  },
};

export const FAKE_APPS = APPS.length;
export const FAKE_ROLES = ROLES.length;
