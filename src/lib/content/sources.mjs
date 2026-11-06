// @ts-check
import { DISCOVERED_ROLES } from "./roles-discovered.mjs";
/**
 * One file for every keyword and source the content pipeline works from (SRCo's content-sources
 * pattern). The generators read the lists below to decide what to write next; pages record which
 * keyword they target and how often it appears (keywordHits).
 *
 * Add an app, role or competitor here and the daily job picks it up. Nothing here is a page by
 * itself: a page exists only once content/seo/<type>/<slug>.json does.
 */

/**
 * Mac apps Lazur pages cover. `shell` picks the demo window style. `howtoSeeds` are starting
 * topics; the planner researches more ("how to … in <app> mac") and stores them in
 * content/seo/_plan/howto-topics.jsonl.
 * @type {{ slug: string, name: string, category: string, site: string, shell: "sheet"|"design"|"doc"|"mail"|"slack"|"code"|"chat"|"generic", keywords: string[], howtoSeeds: string[] }[]}
 */
export const APPS = [
  { slug: "excel", name: "Excel", category: "Spreadsheets", site: "https://www.microsoft.com/microsoft-365/excel", shell: "sheet", keywords: ["excel on mac", "excel mac shortcuts", "voice assistant for excel"], howtoSeeds: ["make a pivot table", "freeze panes", "use vlookup", "use xlookup", "make a drop-down list", "remove duplicates", "wrap text", "merge cells", "insert a chart", "use conditional formatting"] },
  { slug: "google-sheets", name: "Google Sheets", category: "Spreadsheets", site: "https://www.google.com/sheets/about/", shell: "sheet", keywords: ["google sheets on mac", "google sheets shortcuts mac"], howtoSeeds: ["make a pivot table", "freeze rows", "use vlookup", "make a drop-down list", "remove duplicates"] },
  { slug: "numbers", name: "Numbers", category: "Spreadsheets", site: "https://www.apple.com/numbers/", shell: "sheet", keywords: ["apple numbers tips"], howtoSeeds: ["make a pivot table", "freeze header rows", "add a formula"] },
  { slug: "figma", name: "Figma", category: "Design", site: "https://www.figma.com", shell: "design", keywords: ["figma on mac", "figma shortcuts mac", "ai assistant for figma"], howtoSeeds: ["use auto layout", "create a component", "make a prototype", "export as svg", "use variables"] },
  { slug: "notion", name: "Notion", category: "Docs and notes", site: "https://www.notion.com", shell: "doc", keywords: ["notion on mac", "notion shortcuts mac"], howtoSeeds: ["make a database", "create a template", "add a table of contents", "make a toggle list"] },
  { slug: "slack", name: "Slack", category: "Messaging", site: "https://slack.com", shell: "slack", keywords: ["slack on mac", "slack shortcuts mac", "dictate slack messages"], howtoSeeds: ["schedule a message", "set a reminder", "create a channel", "start a huddle"] },
  { slug: "gmail", name: "Gmail", category: "Email", site: "https://mail.google.com", shell: "mail", keywords: ["gmail on mac", "write emails by voice"], howtoSeeds: ["schedule an email", "add a signature", "create a filter", "unsend an email"] },
  { slug: "apple-mail", name: "Apple Mail", category: "Email", site: "https://support.apple.com/mail", shell: "mail", keywords: ["mail app mac tips"], howtoSeeds: ["add a signature", "schedule an email", "create a rule"] },
  { slug: "outlook", name: "Outlook", category: "Email", site: "https://www.microsoft.com/microsoft-365/outlook", shell: "mail", keywords: ["outlook for mac"], howtoSeeds: ["add a signature", "recall an email", "set an out of office reply"] },
  { slug: "word", name: "Word", category: "Docs and notes", site: "https://www.microsoft.com/microsoft-365/word", shell: "doc", keywords: ["word for mac"], howtoSeeds: ["add page numbers", "make a table of contents", "track changes", "insert a footnote"] },
  { slug: "google-docs", name: "Google Docs", category: "Docs and notes", site: "https://docs.google.com", shell: "doc", keywords: ["google docs on mac", "voice typing google docs mac"], howtoSeeds: ["add page numbers", "make a table of contents", "use voice typing"] },
  { slug: "pages", name: "Pages", category: "Docs and notes", site: "https://www.apple.com/pages/", shell: "doc", keywords: ["apple pages tips"], howtoSeeds: ["add page numbers", "add a table of contents"] },
  { slug: "powerpoint", name: "PowerPoint", category: "Presentations", site: "https://www.microsoft.com/microsoft-365/powerpoint", shell: "generic", keywords: ["powerpoint for mac"], howtoSeeds: ["add speaker notes", "use presenter view", "add a transition"] },
  { slug: "keynote", name: "Keynote", category: "Presentations", site: "https://www.apple.com/keynote/", shell: "generic", keywords: ["keynote tips mac"], howtoSeeds: ["add presenter notes", "use magic move"] },
  { slug: "xcode", name: "Xcode", category: "Developer tools", site: "https://developer.apple.com/xcode/", shell: "code", keywords: ["xcode tips", "xcode shortcuts"], howtoSeeds: ["add a package dependency", "run on a physical iphone", "use breakpoints"] },
  { slug: "vs-code", name: "VS Code", category: "Developer tools", site: "https://code.visualstudio.com", shell: "code", keywords: ["vs code mac shortcuts"], howtoSeeds: ["open the command palette", "use multiple cursors", "change the theme"] },
  { slug: "cursor", name: "Cursor", category: "Developer tools", site: "https://cursor.com", shell: "code", keywords: ["cursor ide", "voice coding cursor"], howtoSeeds: ["add rules", "use agent mode"] },
  { slug: "chatgpt", name: "ChatGPT", category: "AI chat", site: "https://chatgpt.com", shell: "chat", keywords: ["chatgpt mac app", "talk to chatgpt on mac"], howtoSeeds: ["use the mac app shortcut", "create a project"] },
  { slug: "chrome", name: "Chrome", category: "Browsers", site: "https://www.google.com/chrome/", shell: "generic", keywords: ["chrome on mac"], howtoSeeds: ["clear the cache", "pin a tab", "take a full page screenshot"] },
  { slug: "safari", name: "Safari", category: "Browsers", site: "https://www.apple.com/safari/", shell: "generic", keywords: ["safari mac tips"], howtoSeeds: ["clear the cache", "use tab groups"] },
  { slug: "finder", name: "Finder", category: "macOS", site: "https://support.apple.com/guide/mac-help/", shell: "generic", keywords: ["finder tips mac"], howtoSeeds: ["show hidden files", "rename multiple files", "show the path bar"] },
  { slug: "photoshop", name: "Photoshop", category: "Design", site: "https://www.adobe.com/products/photoshop.html", shell: "design", keywords: ["photoshop mac shortcuts"], howtoSeeds: ["remove a background", "use generative fill"] },
  { slug: "canva", name: "Canva", category: "Design", site: "https://www.canva.com", shell: "design", keywords: ["canva on mac"], howtoSeeds: ["remove a background", "resize a design"] },
  { slug: "linear", name: "Linear", category: "Project management", site: "https://linear.app", shell: "generic", keywords: ["linear app shortcuts"], howtoSeeds: ["create an issue", "set up cycles"] },
  { slug: "zoom", name: "Zoom", category: "Meetings", site: "https://zoom.us", shell: "generic", keywords: ["zoom on mac"], howtoSeeds: ["share your screen", "record a meeting", "change your background"] },
];

/**
 * Roles for /for/<role>. `persona` links to src/lib/personas.ts where one exists. The list grows on
 * its own: when every role has its pages, the planner researches new jobs and appends them to
 * roles-discovered.mjs, so role, role x app and problem pages never run out.
 * @type {{ slug: string, name: string, singular: string, persona?: string, apps: string[], keywords: string[] }[]}
 */
const BASE_ROLES = [
  { slug: "founders", name: "Founders", singular: "founder", persona: "founder", apps: ["gmail", "slack", "notion", "google-sheets", "linear", "chrome"], keywords: ["ai assistant for founders", "ai chief of staff mac"] },
  { slug: "developers", name: "Developers", singular: "developer", persona: "developer", apps: ["cursor", "vs-code", "xcode", "slack", "chrome", "linear"], keywords: ["voice assistant for developers mac", "ai pair programmer voice"] },
  { slug: "students", name: "Students", singular: "student", persona: "student", apps: ["google-docs", "notion", "word", "chrome", "pages", "keynote"], keywords: ["ai study buddy mac", "voice assistant for students"] },
  { slug: "lawyers", name: "Lawyers", singular: "lawyer", persona: "lawyer", apps: ["word", "outlook", "chrome", "pages", "apple-mail"], keywords: ["ai assistant for lawyers mac", "dictation for lawyers mac"] },
  { slug: "realtors", name: "Realtors", singular: "realtor", apps: ["gmail", "google-sheets", "canva", "chrome", "zoom"], keywords: ["ai assistant for realtors", "voice assistant real estate agents"] },
  { slug: "nurses", name: "Nurses", singular: "nurse", apps: ["word", "outlook", "chrome", "google-docs"], keywords: ["dictation for nurses mac", "ai assistant for nurses"] },
  { slug: "designers", name: "Designers", singular: "designer", apps: ["figma", "photoshop", "canva", "slack", "linear"], keywords: ["ai assistant for designers mac", "figma voice assistant"] },
  { slug: "writers", name: "Writers", singular: "writer", apps: ["google-docs", "word", "pages", "notion"], keywords: ["dictation for writers mac", "voice writing app mac"] },
  { slug: "product-managers", name: "Product managers", singular: "product manager", apps: ["linear", "notion", "slack", "figma", "google-sheets"], keywords: ["ai assistant for product managers"] },
  { slug: "marketers", name: "Marketers", singular: "marketer", apps: ["canva", "google-sheets", "google-docs", "slack", "chrome"], keywords: ["ai assistant for marketers mac"] },
  { slug: "accountants", name: "Accountants", singular: "accountant", apps: ["excel", "outlook", "numbers", "chrome"], keywords: ["excel help for accountants mac"] },
  { slug: "teachers", name: "Teachers", singular: "teacher", apps: ["google-docs", "keynote", "pages", "gmail", "zoom"], keywords: ["ai assistant for teachers mac"] },
  { slug: "recruiters", name: "Recruiters", singular: "recruiter", apps: ["gmail", "linear", "google-sheets", "zoom", "chrome"], keywords: ["ai assistant for recruiters"] },
  { slug: "consultants", name: "Consultants", singular: "consultant", apps: ["powerpoint", "excel", "outlook", "zoom"], keywords: ["ai assistant for consultants mac"] },
  { slug: "researchers", name: "Researchers", singular: "researcher", apps: ["chrome", "word", "notion", "excel"], keywords: ["ai research assistant mac"] },
];

/**
 * Competitors and neighbours. Facts about them are researched live from `site` / `pricingUrl`
 * every time a page is written or refreshed; nothing about them is stored here except where to look.
 * @type {{ slug: string, name: string, site: string, pricingUrl?: string, category: "dictation"|"assistant"|"ai-chat"|"os" }[]}
 */
export const COMPETITORS = [
  { slug: "wispr-flow", name: "Wispr Flow", site: "https://wisprflow.ai", pricingUrl: "https://wisprflow.ai/pricing", category: "dictation" },
  { slug: "superwhisper", name: "Superwhisper", site: "https://superwhisper.com", category: "dictation" },
  { slug: "aqua-voice", name: "Aqua Voice", site: "https://withaqua.com", category: "dictation" },
  { slug: "macwhisper", name: "MacWhisper", site: "https://goodsnooze.gumroad.com/l/macwhisper", category: "dictation" },
  { slug: "willow-voice", name: "Willow Voice", site: "https://willowvoice.com", category: "dictation" },
  { slug: "apple-dictation", name: "Apple Dictation", site: "https://support.apple.com/guide/mac-help/use-dictation-mh40584/mac", category: "os" },
  { slug: "google-voice-typing", name: "Google Docs voice typing", site: "https://support.google.com/docs/answer/4492226", category: "dictation" },
  { slug: "voiceink", name: "VoiceInk", site: "https://tryvoiceink.com", category: "dictation" },
  { slug: "typeless", name: "Typeless", site: "https://www.typeless.com", category: "dictation" },
  { slug: "siri", name: "Siri", site: "https://www.apple.com/siri/", category: "os" },
  { slug: "chatgpt", name: "ChatGPT for Mac", site: "https://openai.com/chatgpt/desktop/", category: "ai-chat" },
  { slug: "claude", name: "Claude for Mac", site: "https://claude.ai/download", category: "ai-chat" },
  { slug: "raycast", name: "Raycast", site: "https://www.raycast.com", pricingUrl: "https://www.raycast.com/pricing", category: "assistant" },
  { slug: "heyclicky", name: "Clicky", site: "https://heyclicky.com", category: "assistant" },
];

export const ROLES = [...BASE_ROLES, ...DISCOVERED_ROLES.filter((r) => !BASE_ROLES.some((b) => b.slug === r.slug))];

/** Keyword patterns per page type. `{app}`, `{task}`, `{role}`, `{x}`, `{y}` are filled in. */
export const KEYWORD_PATTERNS = {
  howto: ["how to {task} in {app} on mac", "how to {task} in {app}", "{app} {task} mac"],
  app: ["ai assistant for {app} on mac", "{app} voice assistant for mac", "{app} help on mac", "dictate in {app} on mac"],
  role: ["ai assistant for {role}", "voice assistant for {role} mac", "dictation for {role}"],
  "role-app": ["{app} for {role} on mac", "{app} tips for {role} on mac", "ai assistant in {app} for {role}"],
  problem: ["why {role} {problem}", "how {role} can stop {problem}", "{problem} for {role}"],
  compare: ["lazur vs {x}", "{x} alternatives for mac", "{x} vs {y}"],
  blog: [],
};

/** Seed queries the blog topic planner researches around (it avoids every existing title). */
export const BLOG_SEEDS = [
  "voice assistant for mac",
  "ai assistant that sees your screen",
  "dictation on mac",
  "speak instead of type",
  "learn a new mac app faster",
  "mac productivity shortcuts",
  "typing speed vs speaking speed",
  "repetitive strain injury typing",
  "macbook notch apps",
  "ai voice mode desktop",
  "screen reading ai assistant privacy",
];

/** Pages per type the daily job writes by default. Override with flags or workflow inputs. */
export const DEFAULT_DAILY_COUNTS = {
  howto: 100,
  apps: 20,
  roles: 15,
  "role-apps": 50,
  problems: 30,
  compare: 5,
  blog: 5,
};

/** @param {string} slug */
export const appBySlug = (slug) => APPS.find((a) => a.slug === slug);
/** @param {string} slug */
export const roleBySlug = (slug) => ROLES.find((r) => r.slug === slug);
/** @param {string} slug */
export const competitorBySlug = (slug) => COMPETITORS.find((c) => c.slug === slug);
