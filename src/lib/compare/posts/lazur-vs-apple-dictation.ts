import type { ComparisonPage } from "../types";

export const lazurVsAppleDictation: ComparisonPage = {
  slug: "lazur-vs-apple-dictation",
  title: "Lazur vs Apple Dictation",
  description:
    "Lazur vs Apple Dictation on Mac — free built-in voice typing vs AI Smart Rewrite, system-wide polish, Command Mode, and personal dictionary. Best Apple dictation alternative.",
  competitorName: "Apple Dictation",
  targetKeyword: "apple dictation alternative mac",
  publishedAt: "2026-07-05",
  readingTimeMinutes: 7,
  tldr: [
    "Apple Dictation is free, built into macOS, and works well in Apple apps.",
    "Lazur adds Smart Rewrite, consistent system-wide polish, Command Mode, and a personal dictionary — especially in third-party apps like Cursor, Slack, and Notion.",
    "Choose Apple if you live entirely in Mail and Notes. Choose Lazur for cross-app professional writing.",
  ],
  chooseLazur: [
    "You work in Cursor, Slack, Linear, Notion, or Gmail — not just Apple apps.",
    "You want AI rewrite, not raw transcription with basic punctuation.",
    "You dictate professionally and need tone matching plus Command Mode.",
  ],
  chooseCompetitor: [
    "You stay within Apple apps and Apple Intelligence features.",
    "Free, zero-install dictation is your only requirement.",
    "You dictate rarely and don't need rewrite or commands.",
  ],
  table: [
    {
      feature: "Price",
      lazur: "Free tier · Pro $14/mo · Power $35/mo",
      competitor: "Free (built into macOS)",
    },
    {
      feature: "Smart Rewrite",
      lazur: "Intent-aware, app-specific",
      competitor: "Basic punctuation and capitalization",
    },
    {
      feature: "Third-party apps",
      lazur: "Full support — Cursor, Slack, IDEs",
      competitor: "Inconsistent outside Apple apps",
    },
    {
      feature: "Speech-to-text",
      lazur: "Local Whisper on-device",
      competitor: "Apple on-device / cloud hybrid",
    },
    {
      feature: "Command Mode",
      lazur: "Voice edit and rewrite",
      competitor: "Not available",
    },
    {
      feature: "Personal dictionary",
      lazur: "Custom names, jargon, acronyms",
      competitor: "Limited system vocabulary",
    },
    {
      feature: "Hotkey workflow",
      lazur: "Global ⌃ Space — one workflow everywhere",
      competitor: "Fn key / mic button — varies by app",
    },
    {
      feature: "Best for",
      lazur: "Cross-app professional dictation",
      competitor: "Casual use in Apple ecosystem",
    },
  ],
  faq: [
    {
      question: "Why pay for Lazur when Apple Dictation is free?",
      answer:
        "Apple Dictation handles basic speech-to-text. Lazur adds Smart Rewrite that turns messy speech into polished writing, works consistently in third-party apps, and includes Command Mode — saving edit time that free dictation doesn't address.",
    },
    {
      question: "Does Lazur work better in Cursor than Apple Dictation?",
      answer:
        "Yes. Lazur is designed for system-wide paste with a single hotkey in any Mac app, including Cursor and VS Code. Apple Dictation can be inconsistent in IDEs and team tools.",
    },
    {
      question: "Is Lazur more private than Apple Dictation?",
      answer:
        "Both can process speech on-device. Lazur uses local Whisper for STT and only sends text (not audio) for optional Smart Rewrite. Review both privacy policies for your organization's requirements.",
    },
  ],
  blocks: [
    {
      type: "paragraph",
      text: "Apple Dictation is the default answer when someone asks about voice typing on Mac — it's free, built in, and improving with Apple Intelligence. Lazur exists for users who've tried it and hit the ceiling: raw transcripts, inconsistent third-party app behavior, and no rewrite layer.",
    },
    {
      type: "heading",
      text: "Where Apple Dictation wins",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Cost and convenience. No download, no subscription, no permissions dance beyond enabling dictation. If you dictate occasionally in Notes or Mail, Apple may be enough.",
    },
    {
      type: "heading",
      text: "Where Lazur wins",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Cross-app consistency. Modern knowledge work happens in Slack, Linear, Cursor, Notion, and Gmail — not just Apple apps. Lazur Smart Rewrite adapts output per context. Command Mode replaces formatting shortcuts. Personal dictionary preserves customer names and product jargon that Apple's generic vocabulary misses.",
    },
    {
      type: "heading",
      text: "The real test",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Dictate the same messy Slack update and the same professional email with both tools. Count edits before send. Apple gives you words; Lazur gives you writing.",
    },
    {
      type: "heading",
      text: "The bottom line",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Apple Dictation is the baseline. Lazur is the upgrade when dictation becomes daily infrastructure — not a party trick.",
    },
  ],
  relatedSlugs: ["lazur-vs-wispr-flow", "lazur-vs-super-whisper"],
};
