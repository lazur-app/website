// @ts-check
/**
 * Prompts for each page type. Two calls per page: research (web search, sourced facts only) then
 * write (no tools, uses only those facts). Rules come from src/lib/content and are also enforced
 * in code by guards.mjs, so the prompt and the check never disagree.
 */
import { LAZUR_FACTS_PROMPT } from "../../../src/lib/content/lazur-facts.mjs";
import { WRITING_RULES_PROMPT } from "../../../src/lib/content/rules.mjs";

const today = () => new Date().toISOString().slice(0, 10);

const VOICE = `VOICE: Lazur's site sounds like a sharp friend who is good with Macs. Calm, direct, a little dry. Short lines. Example of the voice: "Hold a key and talk. Lazur sees your screen, points at things, answers out loud and gets things done, in any app."`;

const RESEARCH_RULES = `RESEARCH RULES:
- Use WebSearch, then open the pages with WebFetch. Prefer the app maker's own help pages (support.microsoft.com, support.apple.com, help.figma.com, support.google.com, slack.com/help, the company's pricing page) and primary studies. Today is ${today()}.
- Every fact gets the URL you actually opened. No URL, no fact.
- Check the current version of the app and whether menus moved recently. Note old names ("formerly called…").
- Collect 2 to 4 numbers worth showing (limits, version facts, usage, time costs) with sources. Never numbers about Lazur.
- If sources disagree or something is unclear, say so in caveats.
- Return JSON only.`;

const OUTPUT_RULES = `OUTPUT RULES:
- Return JSON only, matching the schema. Use only facts from the research notes. Every number in stats, chart and text must come from the notes, and its URL must be in sources.
- Internal links: you may link with markdown [text](/path) only to these paths: /download, /pricing, /tools/typing-speed-test, /tools/speaking-vs-typing-test, /tools/typing-tax-calculator, /tools/dictation-accuracy-checker, and the paths listed under INTERNAL PAGES. Related pages are added by code; do not list them.
- imageQueries: 2 to 4 Pexels searches for real photos that fit the page (people at a Mac, the kind of work, the setting). Not screenshots, not logos, not text. Alt text describes the photo and includes the keyword naturally.
- blocks may include {"type":"stats"} once, {"type":"chart"} once if you return a chart, {"type":"lazur"} once (a short mid-page nudge rendered by code), {"type":"image","index":N} for imageQueries[N].`;

/**
 * @param {{ internal: string[] }} ctx
 */
const internal = (ctx) => (ctx.internal.length ? `INTERNAL PAGES you may link to:\n${ctx.internal.map((p) => `- ${p}`).join("\n")}` : "");

export const prompts = {
  /** @param {{ app: {name: string, slug: string, site: string}, task: string, keyword: string }} t */
  howtoResearch: (t) => `You research a how-to guide: "How to ${t.task} in ${t.app.name} on a Mac". Target search: "${t.keyword}".
Find the exact, current steps on macOS: menu names and paths, the dialog options, keyboard shortcuts on Mac (⌘ ⌥ ⌃ ⇧), what changed in recent versions, the version numbers the steps apply to, differences between the Mac app and the web app, and the common errors with fixes. Start at ${t.app.site} and the official help site.
${RESEARCH_RULES}`,

  /** @param {{ app: {name: string, slug: string, shell: string}, task: string, keyword: string, notes: unknown, internal: string[] }} t */
  howtoWrite: (t) => `Write the data for a how-to page on lazur.app: "How to ${t.task} in ${t.app.name} on a Mac". Target keyword: "${t.keyword}".
The page must genuinely answer the question first: accurate step-by-step instructions for the real ${t.app.name} on Mac (menu paths in menuPath, shortcuts in shortcut). Then, only in the lazur field, show honestly how Lazur helps: the user asks Lazur on their screen ("where's the pivot table button?", "walk me through adding a footnote") and Lazur points at it, guides them or explains. Use capability "point" or "guide" for most how-tos; set pointsAt to the exact button or menu name (max 3 words) and shell to "${t.app.shell}". Do not say Lazur does the task itself.
title: "How to ${t.task} in ${t.app.name} on Mac" style. metaTitle under 60 characters. description 120 to 160 characters with the keyword. intro: two sentences that fully answer the query.
${WRITING_RULES_PROMPT}
${VOICE}
${LAZUR_FACTS_PROMPT}
${OUTPUT_RULES}
${internal(t)}
RESEARCH NOTES (your only facts):
${JSON.stringify(t.notes)}`,

  /** @param {{ app: {name: string, site: string} }} t */
  appResearch: (t) => `Research ${t.app.name} on the Mac for a page about using a voice assistant alongside it. Find: what people struggle with most in ${t.app.name} (look at the official help center's most visited topics and common search questions), its current Mac version and requirements, keyboard shortcut facts, and 2 to 4 sourced numbers about the app (users, limits, release facts) from reliable sources. Official site: ${t.app.site}.
${RESEARCH_RULES}`,

  /** @param {{ app: {name: string, slug: string, shell: string, category: string}, keyword: string, notes: unknown, internal: string[] }} t */
  appWrite: (t) => `Write the data for lazur.app/apps/${t.app.slug}: Lazur in ${t.app.name} on Mac. Target keyword: "${t.keyword}".
Show what someone in ${t.app.name} can say to Lazur and what Lazur does: explain what's on screen, point at a button, walk them through a feature, draft text at the cursor, dictate. demos: 2 or 3 realistic moments (shell "${t.app.shell}"). asks: 6 to 10 short things to say. Ground the problems in the research (real tasks people search for in ${t.app.name}).
appCategory: "${t.app.category}".
${WRITING_RULES_PROMPT}
${VOICE}
${LAZUR_FACTS_PROMPT}
${OUTPUT_RULES}
${internal(t)}
RESEARCH NOTES:
${JSON.stringify(t.notes)}`,

  /** @param {{ role: {name: string, singular: string} }} t */
  roleResearch: (t) => `Research how ${t.role.name.toLowerCase()} spend their working day on computers: the most time-consuming computer tasks, the apps they use on Mac, documentation and email load, and 2 to 4 sourced numbers (surveys, labor statistics, studies) about time spent on admin, email or typing in this job.
${RESEARCH_RULES}`,

  /** @param {{ role: {name: string, singular: string, slug: string, apps: string[]}, keyword: string, notes: unknown, internal: string[] }} t */
  roleWrite: (t) => `Write the data for lazur.app/for/${t.role.slug}: Lazur for ${t.role.name.toLowerCase()}. Target keyword: "${t.keyword}".
painPoints: where their day goes, from the research. day: a realistic day as times (HH:MM) and things they would say to Lazur, each with what Lazur does (capability ids only). demo: one strong moment in one of these apps: ${t.role.apps.join(", ")}. Be specific to the job. Respect professional duties: for lawyers, nurses and other regulated jobs, say they should follow their employer's rules on client or patient data, and do not claim compliance certifications.
${WRITING_RULES_PROMPT}
${VOICE}
${LAZUR_FACTS_PROMPT}
${OUTPUT_RULES}
${internal(t)}
RESEARCH NOTES:
${JSON.stringify(t.notes)}`,

  /** @param {{ role: {name: string}, app: {name: string, site: string} }} t */
  roleAppResearch: (t) => `Research what ${t.role.name.toLowerCase()} do in ${t.app.name} on a Mac: their typical tasks, templates, features they rely on, the parts they find slow or confusing, and 1 to 3 sourced numbers. ${t.app.site}
${RESEARCH_RULES}`,

  /** @param {{ role: {name: string, slug: string}, app: {name: string, slug: string, shell: string}, keyword: string, notes: unknown, internal: string[] }} t */
  roleAppWrite: (t) => `Write the data for lazur.app/for/${t.role.slug}/${t.app.slug}: ${t.app.name} for ${t.role.name.toLowerCase()}, with Lazur. Target keyword: "${t.keyword}".
tasks: 5 to 9 real things ${t.role.name.toLowerCase()} would say to Lazur while in ${t.app.name}. demo: the best one (shell "${t.app.shell}"). Include practical ${t.app.name} tips for this job in the blocks, so the page is useful even without Lazur.
${WRITING_RULES_PROMPT}
${VOICE}
${LAZUR_FACTS_PROMPT}
${OUTPUT_RULES}
${internal(t)}
RESEARCH NOTES:
${JSON.stringify(t.notes)}`,

  /** @param {{ products: {name: string, site: string, pricingUrl?: string}[], kind: string }} t */
  compareResearch: (t) => `Research these products for an honest comparison page (${t.kind}): ${t.products.map((p) => `${p.name} (${p.site}${p.pricingUrl ? `, pricing: ${p.pricingUrl}` : ""})`).join("; ")}.
For each: current pricing exactly as on their own pricing page (with the date you checked), platforms, main features, privacy statements, and what reviewers praise. Only the company's own site counts for prices and features; reviews only for opinions, labeled as opinions.
${RESEARCH_RULES}`,

  /** @param {{ title: string, kind: string, keyword: string, products: {name: string, slug: string, site: string}[], notes: unknown, internal: string[] }} t */
  compareWrite: (t) => `Write the data for a comparison page on lazur.app: "${t.title}" (${t.kind}). Target keyword: "${t.keyword}".
products: ${t.products.map((p) => `${p.name} (slug ${p.slug}, site ${p.site})`).join("; ")}. Put Lazur first when it is in the list${t.kind === "x-vs-y" ? "; for x-vs-y pages Lazur may be added last as a third option" : ""}. Lazur's facts come only from ABOUT LAZUR.
pricing: copy the competitor's price exactly as on its pricing page, with pricingSourceUrl and pricingCheckedAt. If you could not confirm a price, write "See their pricing page" and still give the URL. Never round, guess or remember prices.
table: one row per feature, values in the same order as products. Be fair: say where the other app is better. verdict: who should pick which. No hints of partnership or endorsement.
${WRITING_RULES_PROMPT}
${VOICE}
${LAZUR_FACTS_PROMPT}
${OUTPUT_RULES}
${internal(t)}
RESEARCH NOTES:
${JSON.stringify(t.notes)}`,

  /** @param {{ apps: string[], existing: string[], count: number }} t */
  howtoTopics: (t) => `Find ${t.count} how-to topics people search for, in the form "how to <task> in <app> on mac", for these Mac apps: ${t.apps.join(", ")}.
Use WebSearch to check demand: autocomplete-style queries, "People also ask", help-center top articles, forum threads. Prefer tasks with clear steps and real search demand. Mac-specific angles are a plus.
Do NOT propose anything that matches or is a near-duplicate of these existing slugs:
${t.existing.join("\n")}
For each topic: slug "<task>-in-<app-slug>" (lowercase, hyphens), title "How to <task> in <App> on Mac", targetKeyword, app (app slug from: ${t.apps.join(", ")}), task (verb phrase, lowercase), why (evidence of demand), evidenceUrl.
${RESEARCH_RULES}`,

  /** @param {{ seeds: string[], existing: string[], count: number }} t */
  blogTopics: (t) => `Plan ${t.count} new blog posts for lazur.app (a voice assistant for Mac in the notch; it sees your screen, points, answers out loud, drafts, dictates).
Research real search demand around these seeds: ${t.seeds.join("; ")}. Pick topics a Mac user actually searches, that a useful article can answer, and where Lazur is a natural mention (not the whole point).
Do NOT repeat or closely overlap any of these existing titles and keywords:
${t.existing.join("\n")}
For each: slug, title (matches search intent), targetKeyword, why, evidenceUrl.
${RESEARCH_RULES}`,

  /** @param {{ topic: { title: string, targetKeyword: string } }} t */
  blogResearch: (t) => `Research a blog post: "${t.topic.title}" (keyword: "${t.topic.targetKeyword}"). Collect current, sourced facts, numbers, steps and expert sources that answer the query.
${RESEARCH_RULES}`,

  /** @param {{ topic: { title: string, targetKeyword: string }, notes: unknown, relatedOptions: string[], internal: string[] }} t */
  blogWrite: (t) => `Write a blog post for lazur.app/blog: "${t.topic.title}". Target keyword: "${t.topic.targetKeyword}".
body: markdown, 900 to 1600 words, starting with a two-sentence direct answer (no H1, the title is rendered separately). Use ## headings that match search intent, a table where it helps, and at least two internal links. Mention Lazur once or twice where it genuinely helps, in its own short section near the end, and link /download. Never make Lazur the subject of every section.
relatedSlugs: 2 to 4 from: ${t.relatedOptions.join(", ")}.
${WRITING_RULES_PROMPT}
${VOICE}
${LAZUR_FACTS_PROMPT}
${OUTPUT_RULES}
${internal(t)}
RESEARCH NOTES:
${JSON.stringify(t.notes)}`,
};
