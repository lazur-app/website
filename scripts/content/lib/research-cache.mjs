// @ts-check
/**
 * Research cache: facts about an app, a role or a competitor are researched once and reused by
 * every page about it for CONTENT_RESEARCH_TTL_DAYS (default 45). Stored in the repo at
 * content/research-cache/<kind>--<slug>.json so every run (and every seat) shares it.
 * A role x app page normally needs no new search at all: it reuses the app and the role.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./core.mjs";

const TTL_DAYS = Number(process.env.CONTENT_RESEARCH_TTL_DAYS ?? 45);
const dir = () => process.env.CONTENT_RESEARCH_DIR || path.join(ROOT, "content/research-cache");

/** @param {string} kind @param {string} slug */
const file = (kind, slug) => path.join(dir(), `${kind}--${slug}.json`);

/**
 * @param {string} kind
 * @param {string} slug
 * @returns {any | null} cached notes if fresh
 */
export function getCached(kind, slug) {
  const f = file(kind, slug);
  if (!fs.existsSync(f)) return null;
  try {
    const entry = JSON.parse(fs.readFileSync(f, "utf8"));
    const ageDays = (Date.now() - Date.parse(entry.fetchedAt)) / 86400_000;
    return ageDays <= TTL_DAYS ? entry.notes : null;
  } catch {
    return null;
  }
}

/** @param {string} kind @param {string} slug @param {any} notes */
export function putCached(kind, slug, notes) {
  fs.mkdirSync(dir(), { recursive: true });
  fs.writeFileSync(file(kind, slug), JSON.stringify({ kind, slug, fetchedAt: new Date().toISOString(), notes }, null, 1) + "\n");
}

/**
 * Keep only facts whose source the tools actually returned (same host), and replace the source
 * list with those real URLs. Removes anything the model may have invented.
 * @param {any} notes
 */
export function cleanNotes(notes) {
  const real = /** @type {string[]} */ (notes.__toolSources ?? []);
  const host = (/** @type {string} */ u) => {
    try {
      return new URL(u).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  };
  if (real.length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __toolSources, __queries, ...rest } = notes;
    return rest;
  }
  const hosts = new Set(real.map(host));
  // Plain-string facts come from a grounded answer without a per-fact link: keep them as context.
  // Facts that name a source must name one the tools really returned.
  const facts = (notes.facts ?? []).filter((/** @type {any} */ f) => typeof f === "string" || !f.sourceUrl || hosts.has(host(f.sourceUrl)));
  const known = new Map((notes.sources ?? []).map((/** @type {any} */ s) => [s.url, s]));
  const sources = real.map((u) => known.get(u) ?? { title: notes.sources?.find((/** @type {any} */ s) => host(s.url) === host(u))?.title ?? host(u), url: u, publisher: host(u), accessedAt: new Date().toISOString().slice(0, 10) });
  return { summary: notes.summary, facts, sources, searchQueries: notes.__queries ?? notes.searchQueries ?? [], caveats: notes.caveats ?? [] };
}
