import { toolOrigin } from "./host";
import { freeToolBySubdomain } from "./registry";

/**
 * Picks the free tools that fit a page's topic, so blog posts and how-to pages on www link to the
 * right tool subdomains (they have the authority; the tools need the links).
 */
const TOPICS: [string, RegExp][] = [
  ["mic-test", /\b(mic|mics|microphone|microphones)\b/i],
  ["webcam-test", /\b(webcam|camera)\b/i],
  ["speaker-test", /\b(speaker|speakers|headphones|audio output)\b/i],
  ["keyboard-test", /\b(keyboard|keyboards|keys? (not working|stuck))\b/i],
  ["dictation", /\b(dictat\w*|talk to text|speak to type)\b/i],
  ["voice-typing", /\b(voice typing|voice type|type with your voice|hindi|tamil|telugu|marathi)\b/i],
  ["audio-to-text", /\b(transcri\w*|audio to text|speech to text)\b/i],
  ["meeting-minutes", /\b(meeting notes|meeting minutes|minutes of (the )?meeting)\b/i],
  ["youtube-summarizer", /\byoutube\b/i],
  ["grammar-checker", /\b(grammar|proofread\w*|spelling mistakes?)\b/i],
  ["email-reply", /\b(email|e-mail|gmail|outlook|inbox)\b/i],
  ["summarizer", /\b(summar\w+|tl;?dr)\b/i],
  ["pdf-to-text", /\bpdfs?\b/i],
  ["chat-with-pdf", /\b(ask (a|your) pdf|chat with (a|your) pdf)\b/i],
  ["screen-recorder", /\b(screen record\w*|record (your|my) screen)\b/i],
  ["teleprompter", /\b(teleprompter|read (a|your) script)\b/i],
  ["text-to-speech", /\b(text to speech|read aloud|tts)\b/i],
  ["prompt-generator", /\b(prompts?|chatgpt|claude|gemini)\b/i],
  ["linkedin-post", /\blinkedin\b/i],
  ["excel-formula", /\b(excel|spreadsheets?|google sheets)\b/i],
  ["sql-generator", /\bsql\b/i],
  ["word-counter", /\b(word count|character count|word limit)\b/i],
  ["paraphrasing-tool", /\b(paraphras\w*|rewrit\w*|reword\w*)\b/i],
  ["image-to-text", /\b(screenshots?|ocr|text from (an )?image)\b/i],
];

export type ToolLink = { href: string; name: string; tagline: string };

export function toolsForTopic(text: string, max = 3): ToolLink[] {
  if (!text) return [];
  return TOPICS.map(([sub, re]) => ({ sub, hits: (text.match(new RegExp(re.source, "gi")) ?? []).length }))
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, max)
    .map(({ sub }) => freeToolBySubdomain(sub))
    .filter((t): t is NonNullable<typeof t> => !!t)
    .map((t) => ({ href: toolOrigin(t.subdomain), name: t.name, tagline: t.tagline }));
}
