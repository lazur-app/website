#!/usr/bin/env node
// @ts-check
/**
 * Give existing pages their stock photos (SRCo's fill-images step, on Pixabay).
 *
 *   PIXABAY_API_KEY=... node scripts/content/fill-images.mjs            # every page with fewer than 3 photos
 *   PIXABAY_API_KEY=... node scripts/content/fill-images.mjs --type=howto --limit=10
 *   ... --blog   also gives blog posts a hero image
 *
 * Without BLOB_READ_WRITE_TOKEN the files go to public/content-images/ (fine for a handful of pages,
 * not for the daily job). Queries come from each page's own data (app, role, competitor, keyword).
 */
import fs from "node:fs";
import matter from "gray-matter";
import { APPS } from "../../src/lib/content/sources.mjs";
import { flags, readType, savePage } from "./lib/core.mjs";
import { checkImageEnv, imagesForPage } from "./lib/images.mjs";

const f = flags(process.argv.slice(2));
checkImageEnv();
const WANT = Number(f.count ?? 3);
const limit = Number(f.limit ?? 1e9);

/** Photo subjects per kind of app: real scenes, never screenshots or logos. */
const SCENE = {
  Spreadsheets: ["spreadsheet laptop office", "financial charts desk", "business analyst computer"],
  Design: ["designer laptop workspace", "ui design sketch", "creative studio desk"],
  "Docs and notes": ["writing laptop desk", "notebook laptop coffee", "person typing document"],
  Messaging: ["team chat laptop", "remote work video call", "coworkers laptop office"],
  Email: ["email laptop morning", "inbox laptop coffee", "person typing email"],
  Presentations: ["presentation meeting room", "slides laptop business", "speaker presentation"],
  "Developer tools": ["programmer code screen", "developer laptop night", "software engineer desk"],
  "AI chat": ["artificial intelligence laptop", "person talking computer", "futuristic workspace"],
  Browsers: ["web browsing laptop", "research laptop desk", "person reading laptop"],
  macOS: ["macbook desk minimal", "laptop files folders", "clean workspace computer"],
  "Project management": ["planning board team", "project manager laptop", "kanban sticky notes"],
  Meetings: ["video conference laptop", "online meeting home", "headset video call"],
};
const ROLE_SCENE = {
  founders: ["startup founder laptop", "entrepreneur office night", "startup team meeting"],
  lawyers: ["lawyer documents desk", "law office books", "contract signing"],
  developers: ["programmer code screen", "developer laptop night", "software engineer desk"],
  students: ["student studying laptop", "university library study", "student notes desk"],
};

/** @param {any} p @returns {{ query: string, alt: string, caption: string }[]} */
function queriesFor(p) {
  const app = APPS.find((a) => a.slug === p.app);
  /** @type {string[]} */
  let subjects;
  if (p.type === "role" || p.type === "role-app") subjects = ROLE_SCENE[/** @type {keyof typeof ROLE_SCENE} */ (p.role)] ?? [`${p.roleSingular ?? p.role} working laptop`, "office desk computer", "professional laptop work"];
  else if (app) subjects = SCENE[/** @type {keyof typeof SCENE} */ (app.category)] ?? ["laptop desk work", "office computer", "person laptop"];
  else if (p.type === "compare" || p.type === "alternatives") subjects = ["microphone laptop desk", "person dictating laptop", "headphones microphone computer"];
  else subjects = ["laptop desk work", "person using laptop", "home office computer"];
  const topic = p.type === "role-app" ? `${p.appName} for ${String(p.roleName).toLowerCase()}` : p.appName ?? p.roleName ?? p.title;
  return subjects.slice(0, WANT).map((query, i) => ({
    query,
    alt: `${query[0].toUpperCase()}${query.slice(1)}, for a guide on ${p.targetKeyword}`.slice(0, 158),
    caption: i === 0 ? `${p.title.split(":")[0]}` : `${topic} on a Mac`,
  }));
}

let done = 0;
const types = f.type ? [f.type] : ["howto", "app", "role", "role-app", "compare", "alternatives"];
for (const type of types) {
  for (const p of readType(type)) {
    if (done >= limit) break;
    if ((p.images ?? []).length >= WANT) continue;
    const images = await imagesForPage({ type, slug: p.slug, keyword: p.targetKeyword, extraKeywords: [p.appName, p.roleName].filter(Boolean), queries: queriesFor(p) });
    if (images.length === 0) {
      console.log(`no photos found  ${type}/${p.slug}`);
      continue;
    }
    p.images = images;
    // Put the 2nd photo into the body if the writer did not place one.
    if (images[1] && !p.blocks.some((/** @type {any} */ b) => b.type === "image")) {
      const at = Math.min(2, p.blocks.length);
      p.blocks.splice(at, 0, { type: "image", index: 1 });
    }
    if (images[2] && !p.blocks.some((/** @type {any} */ b) => b.type === "image" && b.index === 2)) p.blocks.push({ type: "image", index: 2 });
    savePage(p);
    done++;
    console.log(`${images.length} photos  ${type}/${p.slug}`);
  }
}

if (f.blog) {
  for (const p of readType("blog")) {
    if (done >= limit) break;
    if (p.heroImage) continue;
    const kw = p.targetKeyword ?? p.title;
    const [img] = await imagesForPage({ type: "blog", slug: p.slug, keyword: kw, extraKeywords: [p.category], queries: [{ query: /dictat|voice|speech/i.test(kw) ? "microphone laptop desk" : "macbook desk workspace", alt: `Mac on a desk, for a post on ${kw}`, caption: p.title }] });
    if (!img) continue;
    const raw = fs.readFileSync(p.file, "utf8");
    const parsed = matter(raw);
    fs.writeFileSync(p.file, matter.stringify(parsed.content, { ...parsed.data, heroImage: JSON.parse(JSON.stringify(img)) }));
    done++;
    console.log(`hero  blog/${p.slug}`);
  }
}
console.log(`fill-images: ${done} pages updated`);
