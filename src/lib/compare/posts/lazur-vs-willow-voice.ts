import type { ComparisonPage } from "../types";

export const lazurVsWillowVoice: ComparisonPage = {
  slug: "lazur-vs-willow-voice",
  title: "Lazur vs Willow Voice",
  description:
    "Lazur vs Willow Voice on Mac — AI voice dictation compared for rewrite quality, system-wide support, commands, and pricing. Find the best Willow Voice alternative.",
  competitorName: "Willow Voice",
  targetKeyword: "willow voice alternative",
  publishedAt: "2026-07-05",
  readingTimeMinutes: 6,
  tldr: [
    "Willow Voice targets lightweight, low-friction voice capture on Mac.",
    "Lazur targets power users who dictate hundreds of messages per week and need polished output.",
    "Choose Willow for casual capture. Choose Lazur for daily professional writing.",
  ],
  chooseLazur: [
    "Dictation is a daily habit across Slack, email, and IDEs.",
    "You need Smart Rewrite and Command Mode, not just STT.",
    "Output quality and tone matching matter for your work.",
  ],
  chooseCompetitor: [
    "You want the simplest possible voice-to-text layer.",
    "You dictate occasionally — quick notes, short messages.",
    "You don't need app-aware rewrite or voice commands.",
  ],
  table: [
    {
      feature: "Core focus",
      lazur: "Ambient writing — finished text",
      competitor: "Lightweight voice capture",
    },
    {
      feature: "Smart Rewrite",
      lazur: "Intent-aware, app-specific tone",
      competitor: "Basic transcription",
    },
    {
      feature: "System-wide",
      lazur: "Yes — ⌃ Space everywhere",
      competitor: "Yes — macOS apps",
    },
    {
      feature: "Command Mode",
      lazur: "Voice edit, rewrite, expand",
      competitor: "Not a primary feature",
    },
    {
      feature: "Personal dictionary",
      lazur: "Yes",
      competitor: "Limited",
    },
    {
      feature: "Local STT",
      lazur: "Whisper on-device",
      competitor: "Varies — verify on site",
    },
    {
      feature: "Best for",
      lazur: "Power users, engineers, operators",
      competitor: "Casual, occasional dictation",
    },
    {
      feature: "Pricing",
      lazur: "Free 5k words/mo · Pro $14/mo · Power $35/mo",
      competitor: "Subscription (verify on site)",
    },
  ],
  faq: [
    {
      question: "Is Lazur a good Willow Voice alternative?",
      answer:
        "Yes, if you've outgrown lightweight capture tools. Lazur adds Smart Rewrite, Command Mode, and a personal dictionary for users who dictate professionally every day.",
    },
    {
      question: "Is Willow Voice easier to start with?",
      answer:
        "Willow Voice optimizes for simplicity — fewer features, lower learning curve. Lazur has a short onboarding (microphone + accessibility permissions) but pays off when dictation volume is high.",
    },
    {
      question: "Which is better for Cursor and VS Code?",
      answer:
        "Lazur is built for system-wide IDE dictation with Smart Rewrite for code comments, PR descriptions, and prompts. Willow Voice works for quick capture but lacks depth for developer workflows.",
    },
  ],
  blocks: [
    {
      type: "paragraph",
      text: "Willow Voice and Lazur both offer macOS voice typing, but they serve different intensity levels. Willow Voice is built for users who want voice capture without complexity. Lazur is built for users who want voice to replace typing entirely.",
    },
    {
      type: "heading",
      text: "Lightweight vs power-user",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Willow Voice fits the occasional dictator — a quick note, a short reply, a caption. Lazur fits the daily dictator — dozens of Slack messages, email threads, specs, and code comments where each minute of edit time compounds.",
    },
    {
      type: "heading",
      text: "Rewrite depth",
      level: 2,
    },
    {
      type: "paragraph",
      text: "This is the core split. Willow Voice gets words on screen. Lazur Smart Rewrite reshapes those words into structured writing that matches where you are — tighter in chat, fuller in email, cleaner in docs.",
    },
    {
      type: "heading",
      text: "The bottom line",
      level: 2,
    },
    {
      type: "paragraph",
      text: "If Willow Voice covers your needs, keep it. If you find yourself editing every dictation or avoiding voice for important messages, Lazur is the natural upgrade.",
    },
  ],
  relatedSlugs: ["lazur-vs-wispr-flow", "lazur-vs-super-whisper"],
};
