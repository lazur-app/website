import type { ComparisonPage } from "./types";
import { lazurVsWisprFlow } from "./posts/lazur-vs-wispr-flow";
import { lazurVsSuperWhisper } from "./posts/lazur-vs-super-whisper";
import { lazurVsWillowVoice } from "./posts/lazur-vs-willow-voice";
import { lazurVsAppleDictation } from "./posts/lazur-vs-apple-dictation";
import { lazurVsAquaVoice } from "./posts/lazur-vs-aqua-voice";
import { lazurVsMacwhisper } from "./posts/lazur-vs-macwhisper";
import { googleVoiceTypingAlternative } from "./posts/google-voice-typing-alternative";

const allComparisons: ComparisonPage[] = [
  lazurVsWisprFlow,
  lazurVsAquaVoice,
  lazurVsMacwhisper,
  googleVoiceTypingAlternative,
  lazurVsSuperWhisper,
  lazurVsWillowVoice,
  lazurVsAppleDictation,
];

export function getAllComparisons(): ComparisonPage[] {
  return [...allComparisons].sort(
    (a, b) =>
      new Date(b.updatedAt ?? b.publishedAt).getTime() -
      new Date(a.updatedAt ?? a.publishedAt).getTime(),
  );
}

export function getComparisonBySlug(slug: string): ComparisonPage | undefined {
  return allComparisons.find((page) => page.slug === slug);
}

export function getAllComparisonSlugs(): string[] {
  return allComparisons.map((page) => page.slug);
}

export type { ComparisonPage, CompareTableRow, CompareFaqItem } from "./types";
