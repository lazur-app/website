import type { ComparisonPage } from "../types";

export const lazurVsMacwhisper: ComparisonPage = {
  slug: "lazur-vs-macwhisper",
  title: "Lazur vs MacWhisper",
  description:
    "Lazur vs MacWhisper: MacWhisper transcribes recordings and files. Lazur is live voice writing at your cursor in Slack, Gmail, and Cursor. Different jobs.",
  competitorName: "MacWhisper",
  targetKeyword: "MacWhisper vs dictation",
  publishedAt: "2026-08-23",
  readingTimeMinutes: 6,
  tldr: [
    "MacWhisper is one of the best Mac apps for transcribing recordings, meetings, and files. It is not a live cursor dictation app.",
    "Lazur pastes into Slack, email, and Cursor as you speak. MacWhisper turns a file into a transcript.",
    "Many people need both: MacWhisper for the meeting, Lazur for the follow-up email.",
  ],
  chooseLazur: [
    "You are in Gmail, Slack, or Cursor and you want to speak the next message.",
    "You measure leftover edits, not transcript accuracy of a file.",
    "You want Command Mode or rewrite on the text in front of you.",
  ],
  chooseCompetitor: [
    "The input is a recording, interview, lecture, or podcast file.",
    "You want a transcript to edit as a document, not a paste into Slack.",
    "Local file processing is the whole job.",
  ],
  table: [
    {
      feature: "Job",
      lazur: "Cursor to send-ready text",
      competitor: "File to transcript",
    },
    {
      feature: "Input",
      lazur: "Live speech at the hotkey",
      competitor: "Audio and video files, meetings",
    },
    {
      feature: "Output",
      lazur: "Paste in the app you are in",
      competitor: "A transcript document",
    },
    {
      feature: "Speech-to-text",
      lazur: "NVIDIA Parakeet on-device",
      competitor: "Local Whisper on-device",
    },
    {
      feature: "Rewrite / Command Mode",
      lazur: "Smart Rewrite and Command Mode",
      competitor: "Transcript editing, not live voice commands",
    },
    {
      feature: "System-wide paste",
      lazur: "Yes",
      competitor: "Not the primary workflow",
    },
    {
      feature: "Pricing",
      lazur: "Free 5k words/mo · Pro $14/mo · Power $35/mo",
      competitor: "One-time or paid tiers (verify on their site)",
    },
  ],
  faq: [
    {
      question: "Is MacWhisper a Wispr Flow alternative?",
      answer:
        "Only in a loose “voice to text on Mac” sense. MacWhisper excels at transcribing audio files and meetings. Wispr Flow, Aqua Voice, and Lazur are live dictation apps that paste at your cursor in other applications.",
    },
    {
      question: "Should I use MacWhisper or Lazur?",
      answer:
        "Use MacWhisper when the input is a recording. Use Lazur when you are in Gmail, Slack, or Cursor and you want to speak the next message. They solve different jobs and often sit on the same Mac.",
    },
    {
      question: "What is the best tool for meeting notes on Mac?",
      answer:
        "For a recorded meeting or an audio file, MacWhisper is a strong specialist. For writing the recap email or Slack update afterward, a live voice writing app such as Lazur is the better fit.",
    },
    {
      question: "Do both keep speech on the Mac?",
      answer:
        "Lazur transcribes with NVIDIA Parakeet on the Mac. MacWhisper typically runs Whisper locally on files. Lazur’s optional polish sends text, not audio. Confirm MacWhisper’s current export and iCloud options if that matters for your team.",
    },
  ],
  blocks: [
    {
      type: "paragraph",
      text: "Lazur vs MacWhisper is a category error people make when they search Wispr Flow alternatives. MacWhisper is excellent at transcription of recordings. Lazur is live voice writing into the field where the cursor is. 2026 lists include MacWhisper in the alternative set, then correctly note it is not a direct Wispr replacement.",
    },
    {
      type: "heading",
      text: "Two jobs",
      level: 2,
    },
    {
      type: "list",
      items: [
        "File to transcript: MacWhisper, desktop Whisper wrappers.",
        "Cursor to send-ready text: Lazur, Wispr, Aqua, Willow.",
      ],
    },
    {
      type: "paragraph",
      text: "If you speak a follow-up in Gmail, you want the second row. If you dropped an M4A from Zoom, you want the first.",
    },
    {
      type: "heading",
      text: "When you want both",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Typical stack: MacWhisper for the recording, Lazur for the recap email you write by voice. Do not force MacWhisper to be Wispr. Do not force Lazur to be a file transcriber.",
    },
    {
      type: "heading",
      text: "The bottom line",
      level: 2,
    },
    {
      type: "paragraph",
      text: "If the thing in front of you is a cursor, download Lazur. If it is a file, keep MacWhisper.",
    },
  ],
  relatedSlugs: [
    "lazur-vs-aqua-voice",
    "lazur-vs-super-whisper",
    "lazur-vs-apple-dictation",
  ],
};
