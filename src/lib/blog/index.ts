import { loadAllPosts } from "./load";
import type { BlogPost } from "./types";

export { formatBlogDate } from "./format";

const CATEGORY_ORDER = ["How-to", "Guide", "Product", "Comparison"];

export function getAllPosts(): BlogPost[] {
  return loadAllPosts();
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return loadAllPosts().find((post) => post.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return loadAllPosts().map((post) => post.slug);
}

export function getRelatedPosts(slug: string, limit = 2): BlogPost[] {
  const posts = loadAllPosts();
  const current = posts.find((post) => post.slug === slug);
  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const picked: BlogPost[] = [];

  for (const relatedSlug of current?.relatedSlugs ?? []) {
    const match = bySlug.get(relatedSlug);
    if (match && match.slug !== slug) picked.push(match);
    if (picked.length >= limit) return picked;
  }

  for (const post of posts) {
    if (post.slug === slug) continue;
    if (picked.some((item) => item.slug === post.slug)) continue;
    picked.push(post);
    if (picked.length >= limit) break;
  }

  return picked;
}

export function getBlogCategories(): string[] {
  const found = new Set(loadAllPosts().map((post) => post.category));
  const ordered = CATEGORY_ORDER.filter((category) => found.has(category));
  for (const category of found) {
    if (!ordered.includes(category)) ordered.push(category);
  }
  return ordered;
}

export type { BlogPost, BlogBlock, BlogCoverTone, BlogFaqItem } from "./types";
