import "server-only";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  BlogCoverTone,
  BlogFaqItem,
  BlogHowToStep,
  BlogPost,
} from "./types";

const COVER_TONES: BlogCoverTone[] = [
  "waveform",
  "apps",
  "compare",
  "mail",
  "code",
  "privacy",
];

const CATEGORY_COVER: Record<string, BlogCoverTone> = {
  Product: "waveform",
  Guide: "apps",
  Comparison: "compare",
  "How-to": "mail",
};

function postsDirectory() {
  const fromWebsite = path.join(process.cwd(), "content/blog");
  if (fs.existsSync(fromWebsite)) return fromWebsite;
  return path.join(process.cwd(), "website/content/blog");
}

function isCoverTone(value: unknown): value is BlogCoverTone {
  return typeof value === "string" && COVER_TONES.includes(value as BlogCoverTone);
}

function readingTime(markdown: string) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*`_\-\[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function parseFaq(value: unknown): BlogFaqItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const question = "question" in item ? String(item.question ?? "") : "";
    const answer = "answer" in item ? String(item.answer ?? "") : "";
    if (!question || !answer) return [];
    return [{ question, answer }];
  });
}

function parseHowto(value: unknown): BlogPost["howto"] {
  if (!value || typeof value !== "object") return undefined;
  const raw = value as { name?: unknown; steps?: unknown };
  if (!Array.isArray(raw.steps) || raw.steps.length === 0) return undefined;
  const steps: BlogHowToStep[] = raw.steps.flatMap((step) => {
    if (!step || typeof step !== "object") return [];
    const name = "name" in step ? String(step.name ?? "") : "";
    const text = "text" in step ? String(step.text ?? "") : "";
    if (!name || !text) return [];
    return [{ name, text }];
  });
  if (steps.length === 0) return undefined;
  return {
    name: String(raw.name ?? "How to"),
    steps,
  };
}

function parsePost(filename: string, file: string): BlogPost {
  const { data, content } = matter(file);
  const slug = filename.replace(/\.md$/, "");
  const category = String(data.category ?? "Guide");
  const cover = isCoverTone(data.cover)
    ? data.cover
    : (CATEGORY_COVER[category] ?? "apps");

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    publishedAt: String(data.publishedAt ?? "2026-01-01"),
    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
    author: String(data.author ?? "Lazur Team"),
    category,
    cover,
    targetKeyword: data.targetKeyword ? String(data.targetKeyword) : undefined,
    tldr: Array.isArray(data.tldr) ? data.tldr.map(String) : [],
    faq: parseFaq(data.faq),
    howto: parseHowto(data.howto),
    relatedSlugs: Array.isArray(data.relatedSlugs)
      ? data.relatedSlugs.map(String)
      : [],
    readingTimeMinutes: readingTime(content),
    body: content.trim(),
  };
}

let cache: BlogPost[] | null = null;

export function loadAllPosts(): BlogPost[] {
  if (cache && process.env.NODE_ENV === "production") return cache;

  const dir = postsDirectory();
  if (!fs.existsSync(dir)) {
    cache = [];
    return cache;
  }

  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"));

  cache = files
    .map((file) =>
      parsePost(file, fs.readFileSync(path.join(dir, file), "utf8")),
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  return cache;
}
