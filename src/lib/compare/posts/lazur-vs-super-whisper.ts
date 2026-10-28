import type { ComparisonPage } from "../types";

export const lazurVsSuperWhisper: ComparisonPage = {
  slug: "lazur-vs-super-whisper",
  title: "Lazur vs Super Whisper",
  description:
    "Lazur vs Super Whisper for Mac: local vs cloud transcription, Smart Rewrite, system-wide polish, and pricing compared. Best Super Whisper alternative for finished writing.",
  competitorName: "Super Whisper",
  targetKeyword: "super whisper alternative",
  publishedAt: "2026-07-05",
  readingTimeMinutes: 7,
  tldr: [
    "Super Whisper excels at local, privacy-focused speech-to-text on Mac.",
    "Lazur adds Smart Rewrite, reshaping speech into polished, app-appropriate writing, not just accurate transcription.",
    "Choose Super Whisper for minimal cloud exposure and short capture. Choose Lazur when edit time after dictation is the problem.",
  ],
  chooseLazur: [
    "You want dictation to end at send-ready text, not raw transcripts.",
    "You dictate long emails, Slack threads, and docs daily.",
    "You need Intent Mode for voice-driven editing and rewrites.",
  ],
  chooseCompetitor: [
    "Local-only STT is your top priority with minimal feature overhead.",
    "You dictate short notes and don't mind manual formatting.",
    "You prefer a lightweight tool without cloud polish layers.",
  ],
  table: [
    {
      feature: "Core focus",
      lazur: "Ambient writing with Smart Rewrite",
      competitor: "Local, privacy-focused STT",
    },
    {
      feature: "Speech-to-text",
      lazur: "Fast cloud speech-to-text; recordings aren't kept",
      competitor: "Local on-device processing",
    },
    {
      feature: "AI rewrite / polish",
      lazur: "Smart Rewrite, app-aware finished text",
      competitor: "Light cleanup; more manual editing",
    },
    {
      feature: "System-wide",
      lazur: "Yes, ⌃ Space in any Mac app",
      competitor: "Yes, works across macOS apps",
    },
    {
      feature: "Voice commands",
      lazur: "Intent Mode on Pro/Power",
      competitor: "Limited command layer",
    },
    {
      feature: "Personal dictionary",
      lazur: "Yes",
      competitor: "Yes",
    },
    {
      feature: "Best for",
      lazur: "Daily professional writing across apps",
      competitor: "Privacy-sensitive short dictation",
    },
    {
      feature: "Pricing",
      lazur: "3-day Pro trial · Pro $18/mo · Power $120/mo",
      competitor: "One-time / subscription (verify on site)",
    },
  ],
  faq: [
    {
      question: "Is Lazur a good Super Whisper alternative?",
      answer:
        "Yes, if you need more than transcription. Lazur adds Smart Rewrite, screen awareness and actions, using cloud transcription that keeps no recordings. Super Whisper fits users who need fully local transcription and handle formatting themselves.",
    },
    {
      question: "Do both use local speech-to-text?",
      answer:
        "No. Super Whisper can transcribe fully on-device. Lazur transcribes in the cloud while you hold the shortcut and keeps no recordings.",
    },
    {
      question: "Which is better for engineers?",
      answer:
        "Lazur targets developers who dictate in Cursor, VS Code, and Slack, Smart Rewrite adapts tone per app. Super Whisper works for quick capture but may require more cleanup for PR descriptions and client-facing writing.",
    },
  ],
  blocks: [
    {
      type: "paragraph",
      text: "Super Whisper and Lazur both appeal to Mac users who care about local speech-to-text. They diverge after transcription: Super Whisper stops at accurate text capture; Lazur continues with Smart Rewrite to produce writing you'd actually send.",
    },
    {
      type: "heading",
      text: "Local STT, shared ground",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Super Whisper built its reputation on fully local transcription. Lazur sends audio to the cloud only while you hold the shortcut, keeps no recordings, and never trains AI on your content. If fully offline transcription is your only criterion, Super Whisper is the safer pick.",
    },
    {
      type: "heading",
      text: "Where Lazur pulls ahead",
      level: 2,
    },
    {
      type: "paragraph",
      text: "The gap shows up in daily volume. Dictate five Slack updates, three emails, and a PR description, Super Whisper gives you accurate transcripts. Lazur gives you messages that match each context: casual in chat, structured in email, concise in code comments. That difference is Smart Rewrite, not raw WER.",
    },
    {
      type: "heading",
      text: "Intent Mode",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Lazur Intent Mode lets you edit and rewrite selected text with voice, expand a paragraph, tighten tone, fix structure. Super Whisper is optimized for capture, not post-dictation editing workflows.",
    },
    {
      type: "heading",
      text: "The bottom line",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Super Whisper is a strong Super Whisper, local, fast, private STT. Lazur is for users who tried local dictation and quit because of cleanup work. If that sounds familiar, Lazur is the upgrade path.",
    },
  ],
  relatedSlugs: ["lazur-vs-wispr-flow", "lazur-vs-apple-dictation"],
};
