/**
 * Typed data for every programmatic SEO page. Templates render from these types; the generator only
 * writes JSON that matches them (scripts/content/lib/schemas.mjs is the JSON Schema twin of this
 * file; keep the two in sync).
 */

export type SeoPageType = "howto" | "app" | "role" | "role-app" | "problem" | "compare" | "alternatives";

export type LazurCapability =
  | "explain"
  | "point"
  | "guide"
  | "dictate"
  | "draft"
  | "research"
  | "everyday";

export type DemoShell =
  | "sheet"
  | "design"
  | "doc"
  | "mail"
  | "slack"
  | "code"
  | "chat"
  | "generic";

export type SeoSource = {
  title: string;
  url: string;
  publisher?: string;
  accessedAt?: string;
};

export type SeoImageCredit = {
  name: string;
  url?: string;
  source: "Pixabay" | "Lazur" | "Screenshot";
  sourceUrl?: string;
};

export type SeoImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  keywords: string[];
  credit?: SeoImageCredit;
};

export type SeoStat = {
  value: string;
  label: string;
  sourceUrl?: string;
  sourceTitle?: string;
};

export type SeoChart = {
  title: string;
  unit?: string;
  note?: string;
  bars: { label: string; value: number; highlight?: boolean }[];
  sourceUrl?: string;
  sourceTitle?: string;
};

export type SeoFaq = { question: string; answer: string };

/** One "you say → Lazur does" moment. Rendered as the notch capsule + an app window. */
export type LazurDemo = {
  spoken: string;
  capability: LazurCapability;
  /** What Lazur does or says back, in one or two plain sentences. */
  result: string;
  /** What is on screen when you ask. */
  context?: string;
  /** Text Lazur writes at the cursor (draft / dictate only). */
  output?: string;
  /** Label on the circle Lazur draws (point / guide). */
  pointsAt?: string;
  shell?: DemoShell;
};

export type SeoBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level?: 2 | 3 }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; tone: "tip" | "note" | "warning"; title?: string; text: string }
  | { type: "image"; index: number }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "stats" }
  | { type: "chart" }
  | { type: "lazur" };

export type KeywordHits = {
  target: string;
  inTitle: boolean;
  inH1: boolean;
  inDescription: boolean;
  inIntro: boolean;
  bodyCount: number;
  secondary: Record<string, number>;
};

export type SeoPageBase = {
  type: SeoPageType;
  slug: string;
  /** H1. */
  title: string;
  /** <title>, without the " | Lazur" suffix. */
  metaTitle: string;
  description: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  publishedAt: string;
  updatedAt?: string;
  /** Opening paragraph: answers the query in two sentences. */
  intro: string;
  tldr: string[];
  images: SeoImage[];
  stats: SeoStat[];
  chart?: SeoChart;
  blocks: SeoBlock[];
  faq: SeoFaq[];
  sources: SeoSource[];
  keywordHits?: KeywordHits;
  generator?: { by: string; model?: string; runId?: string; version: number };
};

export type HowToStep = {
  name: string;
  text: string;
  /** e.g. ["Insert", "PivotTable"] */
  menuPath?: string[];
  shortcut?: string;
  /** Index into images. */
  image?: number;
  tip?: string;
};

export type HowToPage = SeoPageBase & {
  type: "howto";
  app: string;
  appName: string;
  task: string;
  /** Which versions the steps were checked against. */
  appliesTo: string;
  timeMinutes: number;
  difficulty: "Easy" | "Medium" | "Advanced";
  requirements: string[];
  steps: HowToStep[];
  shortcuts: { action: string; keys: string }[];
  troubleshooting: { problem: string; fix: string }[];
  lazur: LazurDemo;
};

export type LazurAsk = { say: string; result: string; capability: LazurCapability };

export type AppPage = SeoPageBase & {
  type: "app";
  app: string;
  appName: string;
  appCategory: string;
  appUrl: string;
  demos: LazurDemo[];
  asks: LazurAsk[];
};

export type RolePage = SeoPageBase & {
  type: "role";
  role: string;
  roleName: string;
  roleSingular: string;
  painPoints: { title: string; text: string }[];
  day: (LazurAsk & { time: string })[];
  apps: string[];
  demo: LazurDemo;
};

export type RoleAppPage = SeoPageBase & {
  type: "role-app";
  role: string;
  app: string;
  roleName: string;
  appName: string;
  demo: LazurDemo;
  tasks: LazurAsk[];
};

/** /for/<role>/problems/<slug>: one real problem people in a job have, and how to solve it. */
export type ProblemPage = SeoPageBase & {
  type: "problem";
  role: string;
  roleName: string;
  roleSingular: string;
  /** Short noun phrase, e.g. "losing focus while studying". */
  problem: string;
  /** What it costs them: time, money, grades, stress. */
  costs: { title: string; text: string }[];
  /** Why it happens. */
  causes: { title: string; text: string }[];
  /** Fixes that work with or without Lazur. */
  fixes: { title: string; text: string }[];
  /** Where Lazur helps, honestly. */
  lazurHelps: LazurAsk[];
  demo: LazurDemo;
  /** A short routine or plan to follow. */
  plan: { label: string; title: string; text: string }[];
  apps: string[];
};

export type CompareProduct = {
  name: string;
  slug: string;
  site: string;
  isLazur?: boolean;
  /** As stated on their site, e.g. "Free tier; Pro $15/month". */
  pricing: string;
  pricingSourceUrl?: string;
  pricingCheckedAt?: string;
  platforms: string;
  summary: string;
  bestFor: string[];
};

export type ComparePage = SeoPageBase & {
  type: "compare" | "alternatives";
  kind: "lazur-vs" | "x-vs-y" | "alternatives";
  products: CompareProduct[];
  /** values[i] lines up with products[i]. */
  table: { feature: string; values: string[] }[];
  verdict: string;
};

export type SeoPage = HowToPage | AppPage | RolePage | RoleAppPage | ProblemPage | ComparePage;

export type SeoLink = {
  href: string;
  title: string;
  description?: string;
  kicker: string;
};
