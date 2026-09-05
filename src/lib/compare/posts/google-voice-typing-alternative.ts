import type { ComparisonPage } from "../types";

export const googleVoiceTypingAlternative: ComparisonPage = {
  slug: "google-voice-typing-alternative",
  title: "Google Voice Typing alternative for Mac",
  description:
    "A Google Voice Typing alternative for Mac that works outside Google Docs. Lazur pastes in Slack, Gmail, Cursor, and Chrome, with rewrite and on-device speech-to-text.",
  competitorName: "Google Voice Typing",
  targetKeyword: "Google Voice Typing alternative",
  publishedAt: "2026-08-23",
  readingTimeMinutes: 6,
  tldr: [
    "Google Voice Typing is free and fine inside Google Docs and some Google surfaces.",
    "It is not a Mac-wide writing tool. Outside Docs, you are back to Apple Dictation or typing.",
    "Lazur is the Mac alternative: one shortcut, finished writing in any app, NVIDIA Parakeet on-device.",
  ],
  chooseLazur: [
    "You write in Slack, Gmail in Chrome, Cursor, Notion, and Linear, not only Docs.",
    "You want send-ready text, not a Docs transcript you still rewrite.",
    "You want speech-to-text on the Mac, not a Google-account voice pipeline.",
  ],
  chooseCompetitor: [
    "You live in Google Docs and rarely leave it.",
    "Free, no install, and “period” / “comma” commands are enough.",
    "You do not need Intent Mode or system-wide paste.",
  ],
  table: [
    {
      feature: "Where it works",
      lazur: "Any Mac app at the cursor",
      competitor: "Best in Google Docs and Google surfaces",
    },
    {
      feature: "Platforms",
      lazur: "macOS",
      competitor: "Docs in the browser, Gboard on phones",
    },
    {
      feature: "Output",
      lazur: "Smart Rewrite and Intent Mode",
      competitor: "Speech plus spoken punctuation",
    },
    {
      feature: "Speech-to-text",
      lazur: "NVIDIA Parakeet on your Mac",
      competitor: "Google’s voice typing (account / cloud path)",
    },
    {
      feature: "Reply / rewrite",
      lazur: "Intent Mode uses the text on screen",
      competitor: "Not built for “reply, keep it warm”",
    },
    {
      feature: "Price",
      lazur: "Free 5k words/mo · Pro $14/mo · Power $35/mo",
      competitor: "Free with a Google account",
    },
    {
      feature: "Trial",
      lazur: "7-day Pro trial, no credit card",
      competitor: "No install required",
    },
  ],
  faq: [
    {
      question: "What is the best Google Voice Typing alternative on Mac?",
      answer:
        "If you need voice outside Google Docs, use a system-wide Mac app. Lazur pastes at the cursor in Slack, Gmail, Cursor, and Chrome, and rewrites messy speech into send-ready text. Apple Dictation is the free built-in option, with weaker rewrite and weaker third-party apps.",
    },
    {
      question: "Does Google Voice Typing work in Slack or Cursor?",
      answer:
        "Not as a first-class Mac overlay. Voice Typing is built for Google Docs and Google’s own surfaces. In Slack, Cursor, and most native Mac apps you need a system-wide tool or Apple Dictation.",
    },
    {
      question: "Is Lazur more private than Google Voice Typing?",
      answer:
        "Lazur runs NVIDIA Parakeet on your Mac and only sends text for optional polish. Google Voice Typing is tied to a Google account. Review both privacy policies if that is the reason you are switching.",
    },
    {
      question: "Can I still use Docs if I switch?",
      answer:
        "Yes. Open Docs in Chrome, put the cursor in the document, and hold the Lazur shortcut. You do not have to stay inside Tools → Voice typing.",
    },
  ],
  blocks: [
    {
      type: "paragraph",
      text: "A Google Voice Typing alternative for Mac has to work where you actually write. Voice Typing is good enough in Google Docs. The moment you switch to Slack, Gmail, or Cursor, it disappears. Lazur is the Mac-wide version of that habit: hold a shortcut, speak, paste finished text.",
    },
    {
      type: "heading",
      text: "Where Google Voice Typing wins",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Price and convenience inside Docs. No download. Spoken punctuation if you remember the commands. If your job is long-form drafting in a single Google Doc, you may not need another app.",
    },
    {
      type: "heading",
      text: "Where it falls over on a Mac",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Knowledge work is not one Doc. It is a reply in Gmail, a standup in Slack, a prompt in Cursor, then back to Docs. Voice Typing does not follow you. Apple Dictation follows you, then hands you a transcript. Lazur follows you and finishes the writing.",
    },
    {
      type: "heading",
      text: "The Mac-only test",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Dictate the same messy reply in Gmail, then the same brief in Docs. If only Docs looks usable, you do not have a Mac voice tool. You have a Google Docs feature. Download Lazur and run both in Chrome.",
    },
  ],
  relatedSlugs: [
    "lazur-vs-apple-dictation",
    "lazur-vs-wispr-flow",
    "lazur-vs-aqua-voice",
  ],
};
