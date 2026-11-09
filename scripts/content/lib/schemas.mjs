// @ts-check
/**
 * JSON Schemas the model must answer with. The JSON Schema twin of src/lib/seo-pages/types.ts:
 * the model writes the editorial fields; code adds slug, type, dates, images, links and
 * keywordHits. Keep both files in sync.
 */
import { LAZUR_CAPABILITY_IDS } from "../../../src/lib/content/lazur-facts.mjs";

const str = (min = 1, max = 2000) => ({ type: "string", minLength: min, maxLength: max });
const arr = (items, min = 0, max = 50) => ({ type: "array", items, minItems: min, maxItems: max });
const obj = (properties, required = Object.keys(properties)) => ({ type: "object", properties, required, additionalProperties: false });
const url = { type: "string", pattern: "^https://" };

export const SHELLS = ["sheet", "design", "doc", "mail", "slack", "code", "chat", "generic"];

export const sourceSchema = obj({ title: str(3, 200), url, publisher: str(1, 120), accessedAt: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" } }, ["title", "url"]);
export const statSchema = obj({ value: str(1, 24), label: str(5, 160), sourceUrl: url, sourceTitle: str(3, 120) });
export const chartSchema = obj(
  {
    title: str(5, 120),
    unit: str(1, 20),
    note: str(1, 200),
    bars: arr(obj({ label: str(1, 40), value: { type: "number" }, highlight: { type: "boolean" } }, ["label", "value"]), 2, 8),
    sourceUrl: url,
    sourceTitle: str(3, 120),
  },
  ["title", "bars", "sourceUrl", "sourceTitle"],
);
export const faqSchema = obj({ question: str(8, 160), answer: str(20, 700) });
export const demoSchema = obj(
  {
    spoken: str(4, 160),
    capability: { type: "string", enum: LAZUR_CAPABILITY_IDS },
    result: str(10, 260),
    context: str(3, 160),
    output: str(3, 700),
    pointsAt: str(1, 28),
    shell: { type: "string", enum: SHELLS },
  },
  ["spoken", "capability", "result", "shell"],
);
export const askSchema = obj({ say: str(4, 140), result: str(10, 260), capability: { type: "string", enum: LAZUR_CAPABILITY_IDS } });
export const imageQuerySchema = obj({
  query: str(3, 80),
  alt: str(10, 160),
  caption: str(5, 160),
});

export const blockSchema = {
  anyOf: [
    obj({ type: { const: "paragraph" }, text: str(20, 1600) }),
    obj({ type: { const: "heading" }, text: str(3, 100), level: { type: "integer", enum: [2, 3] } }, ["type", "text"]),
    obj({ type: { const: "list" }, items: arr(str(2, 400), 2, 12), ordered: { type: "boolean" } }, ["type", "items"]),
    obj({ type: { const: "callout" }, tone: { type: "string", enum: ["tip", "note", "warning"] }, title: str(2, 60), text: str(10, 600) }, ["type", "tone", "text"]),
    obj({ type: { const: "image" }, index: { type: "integer", minimum: 0, maximum: 6 } }),
    obj({ type: { const: "table" }, headers: arr(str(1, 40), 2, 6), rows: arr(arr(str(0, 200), 2, 6), 1, 12), caption: str(3, 160) }, ["type", "headers", "rows"]),
    obj({ type: { const: "stats" } }),
    obj({ type: { const: "chart" } }),
    obj({ type: { const: "lazur" } }),
  ],
};

/** Fields every page shares. */
const base = {
  title: str(10, 90),
  metaTitle: str(10, 70),
  description: str(110, 165),
  targetKeyword: str(3, 90),
  secondaryKeywords: arr(str(3, 90), 1, 8),
  intro: str(60, 500),
  tldr: arr(str(10, 220), 3, 5),
  stats: arr(statSchema, 0, 4),
  chart: chartSchema,
  blocks: arr(blockSchema, 12, 90),
  faq: arr(faqSchema, 5, 10),
  sources: arr(sourceSchema, 1, 15),
  imageQueries: arr(imageQuerySchema, 2, 5),
};
const baseRequired = Object.keys(base).filter((k) => k !== "chart");

export const howtoSchema = obj(
  {
    ...base,
    task: str(3, 80),
    appliesTo: str(5, 120),
    timeMinutes: { type: "integer", minimum: 1, maximum: 120 },
    difficulty: { type: "string", enum: ["Easy", "Medium", "Advanced"] },
    requirements: arr(str(3, 160), 0, 6),
    steps: arr(
      obj(
        {
          name: str(3, 90),
          text: str(15, 700),
          menuPath: arr(str(1, 40), 1, 6),
          shortcut: str(1, 30),
          image: { type: "integer", minimum: 0, maximum: 4 },
          tip: str(5, 300),
        },
        ["name", "text"],
      ),
      3,
      14,
    ),
    shortcuts: arr(obj({ action: str(3, 80), keys: str(1, 30) }), 0, 10),
    troubleshooting: arr(obj({ problem: str(5, 120), fix: str(10, 500) }), 1, 6),
    lazur: demoSchema,
  },
  [...baseRequired, "task", "appliesTo", "timeMinutes", "difficulty", "requirements", "steps", "shortcuts", "troubleshooting", "lazur"],
);

export const appSchema = obj(
  { ...base, appCategory: str(3, 40), demos: arr(demoSchema, 2, 3), asks: arr(askSchema, 6, 10) },
  [...baseRequired, "appCategory", "demos", "asks"],
);

export const roleSchema = obj(
  {
    ...base,
    painPoints: arr(obj({ title: str(3, 70), text: str(20, 300) }), 3, 6),
    day: arr(obj({ time: { type: "string", pattern: "^\\d{1,2}:\\d{2}$" }, say: str(4, 140), result: str(10, 260), capability: { type: "string", enum: LAZUR_CAPABILITY_IDS } }), 4, 8),
    demo: demoSchema,
  },
  [...baseRequired, "painPoints", "day", "demo"],
);

export const roleAppSchema = obj({ ...base, demo: demoSchema, tasks: arr(askSchema, 5, 9) }, [...baseRequired, "demo", "tasks"]);

const productSchema = obj(
  {
    name: str(2, 60),
    slug: { type: "string", pattern: "^[a-z0-9-]+$" },
    site: url,
    pricing: str(3, 160),
    pricingSourceUrl: url,
    pricingCheckedAt: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
    platforms: str(3, 120),
    summary: str(20, 400),
    bestFor: arr(str(5, 200), 1, 4),
  },
  ["name", "slug", "site", "pricing", "platforms", "summary", "bestFor"],
);

export const problemSchema = obj(
  {
    ...base,
    problem: str(5, 70),
    costs: arr(obj({ title: str(3, 70), text: str(40, 600) }), 3, 6),
    causes: arr(obj({ title: str(3, 80), text: str(60, 900) }), 3, 7),
    fixes: arr(obj({ title: str(3, 80), text: str(60, 900) }), 4, 10),
    lazurHelps: arr(askSchema, 4, 8),
    demo: demoSchema,
    plan: arr(obj({ label: str(2, 20), title: str(3, 70), text: str(30, 500) }), 3, 8),
    apps: arr({ type: "string", pattern: "^[a-z0-9-]+$" }, 1, 6),
  },
  [...baseRequired, "problem", "costs", "causes", "fixes", "lazurHelps", "demo", "plan", "apps"],
);

export const compareSchema = obj(
  {
    ...base,
    products: arr(productSchema, 2, 8),
    table: arr(obj({ feature: str(2, 60), values: arr(str(1, 200), 2, 8) }), 4, 14),
    verdict: str(40, 700),
  },
  [...baseRequired, "products", "table", "verdict"],
);

/** Research output: sourced facts the writer may use. Nothing else gets into the page. */
export const researchSchema = obj(
  {
    summary: str(20, 1500),
    facts: arr({ anyOf: [obj({ fact: str(5, 400), sourceUrl: url, sourceTitle: str(3, 200) }, ["fact"]), str(5, 400)] }, 3, 40),
    sources: arr(sourceSchema, 2, 20),
    searchQueries: arr(str(3, 120), 1, 20),
    caveats: arr(str(3, 300), 0, 10),
  },
  ["summary", "facts", "sources", "searchQueries"],
);

/** Role planner output: new jobs to write for. */
export const rolesSchema = obj({
  roles: arr(
    obj({
      slug: { type: "string", pattern: "^[a-z0-9-]{3,40}$" },
      name: str(3, 40),
      singular: str(3, 40),
      apps: arr({ type: "string", pattern: "^[a-z0-9-]+$" }, 2, 8),
      keywords: arr(str(3, 80), 1, 4),
      why: str(10, 300),
    }),
    1,
    30,
  ),
});

/** Topic planner output for how-tos and blog posts. */
export const topicsSchema = obj({
  topics: arr(
    obj(
      {
        slug: { type: "string", pattern: "^[a-z0-9-]{3,80}$" },
        title: str(10, 100),
        targetKeyword: str(3, 90),
        app: str(2, 40),
        task: str(3, 80),
        why: str(10, 300),
        evidenceUrl: url,
      },
      ["slug", "title", "targetKeyword", "why"],
    ),
    1,
    200,
  ),
});

export const blogSchema = obj(
  {
    title: str(10, 90),
    description: str(110, 165),
    targetKeyword: str(3, 90),
    category: { type: "string", enum: ["How-to", "Guide", "Product", "Comparison"] },
    cover: { type: "string", enum: ["waveform", "apps", "compare", "mail", "code", "privacy"] },
    tldr: arr(str(10, 220), 3, 4),
    faq: arr(faqSchema, 3, 5),
    howto: obj({ name: str(5, 100), steps: arr(obj({ name: str(3, 90), text: str(10, 400) }), 2, 10) }),
    relatedSlugs: arr({ type: "string", pattern: "^[a-z0-9-]+$" }, 2, 4),
    stats: arr(statSchema, 0, 4),
    sources: arr(sourceSchema, 2, 12),
    imageQueries: arr(imageQuerySchema, 2, 4),
    body: str(11000, 34000),
  },
  ["title", "description", "targetKeyword", "category", "cover", "tldr", "faq", "relatedSlugs", "stats", "sources", "imageQueries", "body"],
);
