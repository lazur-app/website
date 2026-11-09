// @ts-check
/**
 * Model calls for the content pipeline, on Google's Gemini API.
 *
 *   research(): one call with Google Search grounding and/or URL context (read known official
 *               pages, no search fee). Returns sourced notes as JSON.
 *   write():    no tools, JSON Schema enforced by the API (responseJsonSchema).
 *   Both are validated again here; on failure the errors go back once for a correction.
 *   Every call appends to <runDir>/usage.jsonl: tokens, search queries, and the cost in USD.
 *
 * Keys (either works):
 *   GEMINI_VERTEX_API_KEY  Vertex AI express key (starts "AQ."), aiplatform.googleapis.com
 *   GEMINI_API_KEY         Google AI Studio key, generativelanguage.googleapis.com
 *
 * Guards: CONTENT_MAX_SEARCHES_PER_DAY (default 1400) stops grounding for the rest of the New York
 * day; CONTENT_MAX_USD_PER_DAY (default 60) stops the run. Both are summed from usage.jsonl.
 *
 * CONTENT_AGENT_FAKE=1 swaps the model for fixtures (fake.mjs) so the pipeline runs for free.
 */
import fs from "node:fs";
import path from "node:path";
import { validate } from "./validate.mjs";

export const MODELS = {
  research: process.env.CONTENT_RESEARCH_MODEL || "gemini-3.1-flash-lite",
  write: process.env.CONTENT_WRITE_MODEL || "gemini-3.1-flash-lite",
};

/**
 * List prices in USD (Google AI Studio / Vertex pricing pages, read 2026-11-09).
 * search: per grounded search QUERY on Gemini 3+ (5,000 free a month, then $14 per 1,000);
 * per grounded PROMPT on 2.5 (1,500 free a day, then $35 per 1,000). We count at list price.
 */
export const PRICES = {
  "gemini-3.1-flash-lite": { in: 0.25, out: 1.5, search: 0.014, searchUnit: "query" },
  "gemini-2.5-flash-lite": { in: 0.1, out: 0.4, search: 0.035, searchUnit: "prompt" },
  "gemini-2.5-flash": { in: 0.3, out: 2.5, search: 0.035, searchUnit: "prompt" },
  "gemini-3-flash": { in: 0.5, out: 3, search: 0.014, searchUnit: "query" },
};

const MAX_SEARCHES = Number(process.env.CONTENT_MAX_SEARCHES_PER_DAY ?? 1400);
const MAX_USD = Number(process.env.CONTENT_MAX_USD_PER_DAY ?? 60);

export class BudgetError extends Error {
  /** @param {string} m */
  constructor(m) {
    super(m);
    this.code = "BUDGET";
  }
}

/** @param {string} model */
function endpoint(model) {
  if (process.env.GEMINI_VERTEX_API_KEY) {
    return `https://aiplatform.googleapis.com/v1/publishers/google/models/${model}:generateContent?key=${process.env.GEMINI_VERTEX_API_KEY}`;
  }
  if (process.env.GEMINI_API_KEY) {
    return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  }
  throw new Error("No Gemini key: set GEMINI_VERTEX_API_KEY (Vertex express) or GEMINI_API_KEY (AI Studio). See CONTENT-AUTOMATION.md.");
}

export function checkModelEnv() {
  if (process.env.CONTENT_AGENT_FAKE === "1") return;
  endpoint(MODELS.write);
}

/** Today's totals for this run folder (one folder per New York day). @param {string} runDir */
export function todayTotals(runDir) {
  const file = path.join(runDir, "usage.jsonl");
  let usd = 0;
  let searches = 0;
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
      if (!line) continue;
      try {
        const r = JSON.parse(line);
        usd += Number(r.cost_usd ?? 0);
        searches += Number(r.searches ?? 0);
      } catch {
        /* skip a torn line */
      }
    }
  }
  return { usd, searches };
}

/** @param {string} runDir */
export function overDailyBudget(runDir) {
  return todayTotals(runDir).usd >= MAX_USD;
}

/** @param {string} runDir @param {Record<string, unknown>} row */
function logUsage(runDir, row) {
  if (!runDir) return;
  fs.mkdirSync(runDir, { recursive: true });
  fs.appendFileSync(path.join(runDir, "usage.jsonl"), JSON.stringify({ at: new Date().toISOString(), ...row }) + "\n");
}

/** Strip JSON Schema keywords the Gemini API may not accept, keep the shape. @param {any} s @returns {any} */
function apiSchema(s) {
  if (Array.isArray(s)) return s.map(apiSchema);
  if (!s || typeof s !== "object") return s;
  /** @type {Record<string, any>} */
  const out = {};
  for (const [k, v] of Object.entries(s)) {
    // The API rejects these; validate.mjs still enforces them on every answer.
    if (["pattern", "minLength", "maxLength", "minItems", "maxItems", "minimum", "maximum", "format"].includes(k)) continue;
    if (k === "const") {
      out.enum = [v];
      continue;
    }
    out[k] = apiSchema(v);
  }
  return out;
}

/** @param {number} ms */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Grounding redirect links (vertexaisearch.cloud.google.com/grounding-api-redirect/...) to real URLs. */
const resolved = new Map();
/** @param {string} uri */
async function resolveUri(uri) {
  if (!/grounding-api-redirect/.test(uri)) return uri;
  if (resolved.has(uri)) return resolved.get(uri);
  let real = uri;
  try {
    const res = await fetch(uri, { method: "HEAD", redirect: "manual" });
    real = res.headers.get("location") || uri;
    if (real === uri) {
      const res2 = await fetch(uri, { redirect: "follow" });
      real = res2.url || uri;
    }
  } catch {
    /* keep the redirect */
  }
  resolved.set(uri, real);
  return real;
}

/**
 * One raw call. Retries rate limits and server errors with backoff.
 * @param {{ model: string, prompt: string, tools?: object[], schema?: object }} o
 */
async function generate(o) {
  /** @type {Record<string, any>} */
  const body = {
    contents: [{ role: "user", parts: [{ text: o.prompt }] }],
    generationConfig: { temperature: 0.6, maxOutputTokens: 16384 },
  };
  if (o.tools?.length) body.tools = o.tools;
  if (o.schema) {
    body.generationConfig.responseMimeType = "application/json";
    body.generationConfig.responseJsonSchema = apiSchema(o.schema);
  }
  let last = "";
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(endpoint(o.model), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (res.ok) return data;
    last = `${res.status} ${data?.error?.message ?? ""}`.slice(0, 400);
    // A schema the API refuses: retry once without API-side enforcement (we still validate here).
    if (res.status === 400 && body.generationConfig.responseJsonSchema && /schema/i.test(last)) {
      delete body.generationConfig.responseJsonSchema;
      continue;
    }
    if (res.status === 429 || res.status >= 500) {
      await sleep(Math.min(60_000, 2000 * 2 ** attempt));
      continue;
    }
    break;
  }
  throw new Error(`Gemini ${o.model}: ${last}`);
}

/**
 * Pull JSON out of an answer (fenced or bare).
 * @param {string} text
 */
export function parseJson(text) {
  const fence = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)```/g)].at(-1);
  const candidate = fence ? fence[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return JSON.parse(candidate);
}

/**
 * One model call that must return JSON matching `schema`.
 * @param {{ prompt: string, schema: object, model: string, tools: ("search"|"url")[], label: string, runDir: string, fake?: () => unknown }} opts
 * @returns {Promise<any>}
 */
export async function callJson({ prompt, schema, model, tools, label, runDir, fake }) {
  if (process.env.CONTENT_AGENT_FAKE === "1") {
    if (!fake) throw new Error(`no fixture for ${label}`);
    logUsage(runDir, { label, model: "fake", cost_usd: 0, searches: 0, ok: true });
    return fake();
  }
  if (overDailyBudget(runDir)) throw new BudgetError(`daily spend limit reached ($${MAX_USD}, CONTENT_MAX_USD_PER_DAY)`);

  let useSearch = tools.includes("search");
  if (useSearch && todayTotals(runDir).searches >= MAX_SEARCHES) {
    useSearch = false;
    if (!tools.includes("url")) throw new BudgetError(`daily search limit reached (${MAX_SEARCHES}, CONTENT_MAX_SEARCHES_PER_DAY)`);
  }
  /** @type {object[]} */
  const apiTools = [];
  if (useSearch) apiTools.push({ googleSearch: {} });
  if (tools.includes("url")) apiTools.push({ urlContext: {} });

  const price = PRICES[/** @type {keyof typeof PRICES} */ (model)] ?? PRICES["gemini-3.1-flash-lite"];
  // A response schema cannot be combined with Google Search, so grounded calls get it in the prompt.
  const schemaInPrompt = apiTools.length > 0;
  const basePrompt = schemaInPrompt ? `${prompt}\n\nReturn ONLY a JSON object (no prose, no code fence) matching this JSON Schema:\n${JSON.stringify(schema)}` : prompt;
  prompt = basePrompt;
  let currentPrompt = prompt;
  let lastErrors = "";
  const maxAttempts = apiTools.length ? 2 : 3;
  // Sources found by tools in any attempt (a correction round often does not search again).
  /** @type {Set<string>} */
  const toolSources = new Set();
  /** @type {string[]} */
  const allQueries = [];
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const started = Date.now();
    let data;
    try {
      data = await generate({ model, prompt: currentPrompt, tools: apiTools, schema: schemaInPrompt ? undefined : schema });
    } catch (e) {
      logUsage(runDir, { label, model, attempt, ok: false, error: /** @type {Error} */ (e).message.slice(0, 200), cost_usd: 0, searches: 0 });
      throw e;
    }
    const u = data.usageMetadata ?? {};
    const cand = data.candidates?.[0] ?? {};
    const gm = cand.groundingMetadata ?? {};
    const queries = gm.webSearchQueries ?? [];
    const searches = price.searchUnit === "query" ? queries.length : queries.length ? 1 : 0;
    const tokensIn = (u.promptTokenCount ?? 0) + (u.toolUsePromptTokenCount ?? 0);
    const tokensOut = (u.candidatesTokenCount ?? 0) + (u.thoughtsTokenCount ?? 0);
    const cost = (tokensIn * price.in + tokensOut * price.out) / 1e6 + searches * price.search;
    logUsage(runDir, { label, model, attempt, ms: Date.now() - started, tokens_in: tokensIn, tokens_out: tokensOut, searches, queries, cost_usd: Number(cost.toFixed(6)), ok: true });

    const text = (cand.content?.parts ?? []).map((/** @type {any} */ p) => p.text ?? "").join("");
    let value;
    try {
      value = parseJson(text);
    } catch (e) {
      lastErrors = `not valid JSON: ${/** @type {Error} */ (e).message}`;
      currentPrompt = `${prompt}\n\nYour previous answer was not valid JSON. Return only the JSON object.`;
      continue;
    }

    // Research: keep only sources the tools actually returned, as real URLs (no invented links).
    if (apiTools.length) {
      const chunkUrls = await Promise.all((gm.groundingChunks ?? []).map((/** @type {any} */ c) => (c.web?.uri ? resolveUri(c.web.uri) : null)));
      const urlCtx = (cand.urlContextMetadata?.urlMetadata ?? []).filter((/** @type {any} */ m) => /SUCCESS/.test(m.urlRetrievalStatus ?? "")).map((/** @type {any} */ m) => m.retrievedUrl);
      for (const x of [...chunkUrls, ...urlCtx]) if (x && !/grounding-api-redirect/.test(x)) toolSources.add(x);
      allQueries.push(...queries);
      value.__toolSources = [...toolSources];
      value.__queries = allQueries;
    }

    // With checks off, only the shape the template needs is checked (types, required fields), not lengths or counts.
    const errors = validate(process.env.CONTENT_CHECKS === "on" ? schema : apiSchema(schema), value.__toolSources ? stripMeta(value) : value);
    if (errors.length === 0) return value;
    lastErrors = errors.slice(0, 20).join("\n");
    currentPrompt = `${prompt}\n\nYOUR PREVIOUS ANSWER:\n${JSON.stringify(stripMeta(value))}\n\nIT FAILED SCHEMA VALIDATION:\n${lastErrors}\n\nReturn the corrected JSON object only.`;
  }
  throw new Error(`${label}: ${lastErrors}`);
}

/** @param {any} v */
function stripMeta(v) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __toolSources, __queries, ...rest } = v;
  return rest;
}

/** @param {string} u */
const hostOf = (u) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

/**
 * Research: ONE grounded call. The model writes plain-text notes while Google Search runs (asking
 * for JSON in the same call makes it skip the search). Code then builds the sourced facts from
 * Google's grounding data: every sentence Google tied to a web page becomes a fact with that page's
 * real URL. URL context pages (official help sites) are added as sources too.
 * @param {{ prompt: string, schema?: object, label: string, runDir: string, fake?: () => unknown, urls?: string[], search?: boolean }} o
 */
export async function research(o) {
  if (process.env.CONTENT_AGENT_FAKE === "1") {
    logUsage(o.runDir, { label: o.label, model: "fake", cost_usd: 0, searches: 0, ok: true });
    return o.fake?.();
  }
  if (overDailyBudget(o.runDir)) throw new BudgetError(`daily spend limit reached ($${MAX_USD}, CONTENT_MAX_USD_PER_DAY)`);
  const model = MODELS.research;
  const price = PRICES[/** @type {keyof typeof PRICES} */ (model)] ?? PRICES["gemini-3.1-flash-lite"];
  /** @type {object[]} */
  const tools = [];
  if (o.search !== false && todayTotals(o.runDir).searches < MAX_SEARCHES) tools.push({ googleSearch: {} });
  if (o.urls?.length) tools.push({ urlContext: {} });
  if (!tools.length) throw new BudgetError(`daily search limit reached (${MAX_SEARCHES}, CONTENT_MAX_SEARCHES_PER_DAY)`);

  const pages = o.urls?.length ? `\n\nRead these official pages first:\n${o.urls.map((x) => `- ${x}`).join("\n")}` : "";
  const prompt = `${o.prompt}\n\nUse Google Search with 1 or 2 well-chosen searches (each search costs money; cover the topic in one broad search when you can) and write detailed research notes in plain text: facts, exact menu paths, version numbers, prices, and 3 to 5 numbers worth citing, each with who published it. No JSON.${pages}`;

  const started = Date.now();
  const data = await generate({ model, prompt, tools });
  const usage = data.usageMetadata ?? {};
  const cand = data.candidates?.[0] ?? {};
  const gm = cand.groundingMetadata ?? {};
  const queries = gm.webSearchQueries ?? [];
  const searches = price.searchUnit === "query" ? queries.length : queries.length ? 1 : 0;
  const tokensIn = (usage.promptTokenCount ?? 0) + (usage.toolUsePromptTokenCount ?? 0);
  const tokensOut = (usage.candidatesTokenCount ?? 0) + (usage.thoughtsTokenCount ?? 0);
  const cost = (tokensIn * price.in + tokensOut * price.out) / 1e6 + searches * price.search;
  logUsage(o.runDir, { label: o.label, model, ms: Date.now() - started, tokens_in: tokensIn, tokens_out: tokensOut, searches, queries, cost_usd: Number(cost.toFixed(6)), ok: true });

  const text = (cand.content?.parts ?? []).map((/** @type {any} */ p) => p.text ?? "").join("").trim();
  /** @type {({ url: string, title: string } | null)[]} */
  const chunks = await Promise.all(
    (gm.groundingChunks ?? []).map(async (/** @type {any} */ c) => (c.web?.uri ? { url: await resolveUri(c.web.uri), title: c.web.title ?? c.web.domain ?? "" } : null)),
  );
  const facts = (gm.groundingSupports ?? [])
    .map((/** @type {any} */ sup) => {
      const src = chunks[sup.groundingChunkIndices?.[0] ?? -1];
      const fact = String(sup.segment?.text ?? "").trim();
      return src && fact.length > 10 && !/grounding-api-redirect/.test(src.url) ? { fact, sourceUrl: src.url, sourceTitle: src.title } : null;
    })
    .filter(Boolean);
  const urlCtx = (cand.urlContextMetadata?.urlMetadata ?? [])
    .filter((/** @type {any} */ m) => /SUCCESS/.test(m.urlRetrievalStatus ?? ""))
    .map((/** @type {any} */ m) => ({ url: m.retrievedUrl, title: hostOf(m.retrievedUrl) }));
  const seen = new Set();
  const sources = [...chunks, ...urlCtx]
    .filter((s) => s && !/grounding-api-redirect/.test(s.url) && !seen.has(s.url) && (seen.add(s.url), true))
    .map((s) => ({ title: s?.title || s?.url, url: s?.url, publisher: hostOf(String(s?.url)), accessedAt: new Date().toISOString().slice(0, 10) }));
  return { summary: text.slice(0, 6000), facts, sources, searchQueries: queries, caveats: [], __toolSources: sources.map((s) => s.url), __queries: queries };
}

/**
 * Write step and planners: no tools, schema enforced.
 * @param {{ prompt: string, schema: object, label: string, runDir: string, fake?: () => unknown }} o
 */
export function write(o) {
  return callJson({ ...o, model: MODELS.write, tools: [] });
}
