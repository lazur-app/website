import type { ComparisonPage } from "../types";
import { lazurVsWisprFlow as wisprBlogBlocks } from "@/lib/blog/posts/lazur-vs-wispr-flow";

export const lazurVsWisprFlow: ComparisonPage = {
  slug: "lazur-vs-wispr-flow",
  title: "Lazur vs Wispr Flow",
  description:
    "Comparing Lazur and Wispr Flow for macOS — AI voice dictation, Smart Rewrite vs fast transcription, privacy, Command Mode, and pricing. Which dictation app fits your workflow?",
  competitorName: "Wispr Flow",
  targetKeyword: "wispr flow alternative",
  publishedAt: "2026-07-01",
  updatedAt: "2026-07-05",
  readingTimeMinutes: 8,
  tldr: [
    "Wispr Flow optimizes for fast speech-to-text; Lazur optimizes for finished, send-ready writing via Smart Rewrite.",
    "Both work system-wide on macOS with a hotkey workflow.",
    "Choose Wispr Flow if you mainly need transcription and edit afterward. Choose Lazur if post-dictation cleanup is your bottleneck.",
  ],
  chooseLazur: [
    "You dictate across Slack, email, docs, and IDEs and want consistent polished output.",
    "Edit time after dictation is eating your day.",
    "You want Command Mode for voice-driven rewriting.",
  ],
  chooseCompetitor: [
    "You mainly need fast speech-to-text and are comfortable editing afterward.",
    "Your messages are short and informal.",
    "You already have a Wispr Flow workflow you are happy with.",
  ],
  table: [
    {
      feature: "Core focus",
      lazur: "Ambient writing — finished text via Smart Rewrite",
      competitor: "Fast AI transcription with light cleanup",
    },
    {
      feature: "Output quality",
      lazur: "App-aware tone (Slack vs email vs docs)",
      competitor: "Strong STT; output can read like speech",
    },
    {
      feature: "System-wide",
      lazur: "Yes — ⌃ Space in any Mac app",
      competitor: "Yes — broad macOS app coverage",
    },
    {
      feature: "Speech-to-text",
      lazur: "Local Whisper on-device",
      competitor: "Cloud AI transcription (varies by plan)",
    },
    {
      feature: "Voice commands",
      lazur: "Command Mode (edit, rewrite, expand)",
      competitor: "Primarily dictation-focused",
    },
    {
      feature: "Personal dictionary",
      lazur: "Yes",
      competitor: "Yes",
    },
    {
      feature: "Platforms",
      lazur: "macOS (Windows soon)",
      competitor: "macOS, Windows, iOS, Android",
    },
    {
      feature: "Pricing",
      lazur: "Free 5k words/mo · Pro $14/mo · Power $35/mo",
      competitor: "Free tier · Pro ~$12–15/mo (verify on site)",
    },
    {
      feature: "Free trial",
      lazur: "7-day Pro trial, no credit card",
      competitor: "Free tier available",
    },
  ],
  faq: [
    {
      question: "Is Lazur a good Wispr Flow alternative?",
      answer:
        "Yes, if your bottleneck is editing after dictation. Lazur Smart Rewrite targets send-ready text in any app. If you only need fast transcription, Wispr Flow remains a capable option.",
    },
    {
      question: "Does Lazur work on more apps than Wispr Flow?",
      answer:
        "Both aim for system-wide macOS coverage. The practical difference is output quality per context — Lazur adapts tone for Slack, email, and docs rather than delivering one transcript style.",
    },
    {
      question: "Which has better privacy?",
      answer:
        "Lazur runs Whisper speech-to-text locally on your Mac. Cloud is used only for Smart Rewrite polish when enabled. Compare each vendor's current privacy documentation for your team's requirements.",
    },
    {
      question: "Can I switch from Wispr Flow to Lazur?",
      answer:
        "Yes. Download Lazur, import or rebuild your personal dictionary, and run a side-by-side test on the messages you actually send. Most users evaluate over 3–7 days of real work.",
    },
  ],
  blocks: wisprBlogBlocks.blocks,
  relatedSlugs: [
    "lazur-vs-super-whisper",
    "lazur-vs-apple-dictation",
  ],
};
