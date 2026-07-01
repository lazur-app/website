import type { BlogPost } from "./types";
import { whyTeamsSwitchingFromWisprFlowToLazur } from "./posts/why-teams-switching-from-wispr-flow-to-lazur";
import { lazurVsWisprFlow } from "./posts/lazur-vs-wispr-flow";
import { bestAiDictationApps2026 } from "./posts/best-ai-dictation-apps-2026";

const allPosts: BlogPost[] = [
  whyTeamsSwitchingFromWisprFlowToLazur,
  lazurVsWisprFlow,
  bestAiDictationApps2026,
];

export function getAllPosts(): BlogPost[] {
  return [...allPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return allPosts.find((post) => post.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return allPosts.map((post) => post.slug);
}

export type { BlogPost, BlogBlock } from "./types";
