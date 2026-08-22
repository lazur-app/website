import type { UseCasePage } from "../types";

export const slackUseCase: UseCasePage = {
  slug: "slack",
  title: "Dictate Slack without editing",
  description:
    "Dictate Slack on Mac and paste a sendable update. Dictation Mode turns a messy standup into a message you can send without rewriting.",
  appName: "Slack",
  mode: "dictation",
  targetKeyword: "dictation for Slack Mac",
  publishedAt: "2026-08-23",
  readingTimeMinutes: 5,
  tldr: [
    "Speak the standup the way you think it. Dictation Mode writes the message you would send.",
    "The leftover work after Slack dictation is usually tone and bullets, not spelling.",
    "Hold the shortcut in the Slack compose box. Do not dictate in Notes and copy.",
  ],
  demo: {
    spoken:
      "standup update we shipped the invite flow last night two bugs in the share modal I'll pair with Priya after lunch otherwise on track for Thursday",
    caption:
      "Rambling standup notes become a message you can send without editing.",
    output:
      "Standup:\n• Shipped the invite flow last night\n• Two bugs in the share modal, pairing with Priya after lunch\n• Still on track for Thursday",
  },
  howto: {
    name: "How to dictate a Slack update",
    steps: [
      {
        name: "Click the Slack compose box",
        text: "Open the channel or DM. Put the cursor where the message will go.",
      },
      {
        name: "Hold the shortcut and talk it through",
        text: "Say what shipped, what is blocked, and what is next. Fillers are fine.",
      },
      {
        name: "Scan names, then send",
        text: "Check people and channel-specific jargon. Then send.",
      },
    ],
  },
  faq: [
    {
      question: "Can I dictate Slack messages on a Mac?",
      answer:
        "Yes. Place the cursor in Slack, hold the Lazur shortcut, and speak. Dictation Mode pastes a cleaned-up message in the compose box. You do not need to dictate in Notes and copy.",
    },
    {
      question: "Why do dictated Slack messages still need editing?",
      answer:
        "Most tools paste speech. Slack wants short lines, a clear update, and no filler. Lazur Dictation Mode is built for that cleanup so the paste is sendable.",
    },
    {
      question: "When should I use Command Mode in Slack instead?",
      answer:
        "Use Command Mode when you are looking at a thread and you want an action: reply, shorten this, make it warmer. Use Dictation Mode when you are writing a new update from scratch.",
    },
    {
      question: "Does this work in Slack desktop and the browser?",
      answer:
        "Yes. Lazur pastes at the system cursor, so Slack desktop and Slack in Chrome both work.",
    },
  ],
  blocks: [
    {
      type: "paragraph",
      text: "Dictate Slack without editing by speaking the update the way you would say it in standup, then letting Dictation Mode write the message. If the paste still sounds like a transcript, the tool stopped at speech-to-text.",
    },
    {
      type: "heading",
      text: "The Slack problem is leftover editing",
      level: 2,
    },
    {
      type: "paragraph",
      text: "You already talk faster than you type. The tax is the minute you spend turning “um we shipped invite last night, two bugs, Priya after lunch” into something the channel can scan. That is where the week goes, not in the transcription.",
    },
    {
      type: "heading",
      text: "What to speak",
      level: 2,
    },
    {
      type: "list",
      items: [
        "What shipped.",
        "What is stuck, and who owns it.",
        "What is still on track.",
        "The channel tone: standup, customer thread, or casual DM.",
      ],
    },
    {
      type: "heading",
      text: "Threads need Command Mode",
      level: 2,
    },
    {
      type: "paragraph",
      text: "If someone asked a question above your cursor, do not re-dictate the whole reply. Hold Command Mode and say “reply, yes Thursday works, keep it short.” That is the same habit as email. Slack is just faster.",
    },
    {
      type: "heading",
      text: "Next step",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Use it on tomorrow’s standup. If you still rewrite every bullet, you are using a transcriber. Download Lazur and dictate in the real Slack box.",
    },
  ],
  relatedSlugs: ["gmail", "cursor", "chatgpt"],
};
