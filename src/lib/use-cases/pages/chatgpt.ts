import type { UseCasePage } from "../types";

export const chatgptUseCase: UseCasePage = {
  slug: "chatgpt",
  title: "Voice prompting for ChatGPT",
  description:
    "Voice prompting for ChatGPT on Mac: speak a messy brief, paste a prompt you would actually run. Dictation Mode writes the request, not a transcript of the ramble.",
  appName: "ChatGPT",
  mode: "dictation",
  targetKeyword: "voice prompting ChatGPT Mac",
  publishedAt: "2026-08-23",
  readingTimeMinutes: 5,
  tldr: [
    "Talk through the messy brief. Dictation Mode writes the prompt you would paste.",
    "The win is structure: a table, a constraint, an audience, a format. Not a wall of speech.",
    "Works in ChatGPT, Claude, Gemini, and any other chat box on the Mac.",
  ],
  demo: {
    spoken:
      "okay so I need a competitive teardown of Wispr Flow, Aqua Voice, and us, a table of what's actually different, not marketing fluff, plus a rec for a founder who lives in Slack and Cursor",
    caption:
      "You talk through the messy brief. Dictation Mode writes the prompt you'd paste.",
    output:
      "Compare Wispr Flow, Aqua Voice, and Lazur for a founder who works all day in Slack and Cursor. Give me a table of what actually differs (speed, rewrite, Command Mode, privacy, pricing), skip marketing claims. End with one recommendation and why.",
  },
  howto: {
    name: "How to voice-prompt ChatGPT",
    steps: [
      {
        name: "Click the chat box",
        text: "Open ChatGPT, Claude, or Gemini. Put the cursor in the prompt field.",
      },
      {
        name: "Speak the brief like a teammate",
        text: "Say the job, the format, who it is for, and what to skip. Fillers are fine.",
      },
      {
        name: "Scan the constraint, then send",
        text: "Check that the paste kept the table, the audience, and the “don’t.” Then run it.",
      },
    ],
  },
  faq: [
    {
      question: "Can I dictate ChatGPT prompts on a Mac?",
      answer:
        "Yes. Click the ChatGPT box, hold the Lazur shortcut, and talk through the brief. Dictation Mode pastes a structured prompt. The same shortcut works in Claude, Gemini, and Cursor.",
    },
    {
      question: "Why is voice better than typing a short ChatGPT prompt?",
      answer:
        "A typed prompt is often one sentence. A spoken brief includes the audience, the format, and the constraint. That extra context is usually the difference between a generic answer and a useful one.",
    },
    {
      question: "Should I use Command Mode or Dictation Mode in ChatGPT?",
      answer:
        "Use Dictation Mode for a new prompt from a spoken brief. Use Command Mode when you want to rewrite the last prompt: make it stricter, add a table, keep it shorter.",
    },
    {
      question: "Does this work in the ChatGPT Mac app and the browser?",
      answer:
        "Yes. Lazur pastes at the system cursor, so the ChatGPT desktop app and chat.openai.com both work.",
    },
  ],
  blocks: [
    {
      type: "paragraph",
      text: "Voice prompting for ChatGPT means speaking the messy brief and pasting a request you would actually run. The tool’s job is to keep the constraints and drop the filler, not to transcribe every “okay so.”",
    },
    {
      type: "heading",
      text: "A brief is not a prompt",
      level: 2,
    },
    {
      type: "paragraph",
      text: "How people talk: “okay so I need a teardown of Wispr and Aqua and us, like a table, not fluff, and tell me what a founder should pick if they live in Slack.” How ChatGPT wants it: a comparison, a table, skip marketing, one recommendation, named audience. Dictation Mode is that translation.",
    },
    {
      type: "heading",
      text: "What to include when you speak",
      level: 2,
    },
    {
      type: "list",
      items: [
        "The job (compare, draft, rewrite, outline).",
        "The format (table, bullets, email, code comment).",
        "Who it is for.",
        "What to skip.",
      ],
    },
    {
      type: "heading",
      text: "Cursor vs ChatGPT",
      level: 2,
    },
    {
      type: "paragraph",
      text: "In ChatGPT you usually start from a blank box, so Dictation Mode fits. In Cursor you are often looking at a file, so Command Mode writes the agent instruction from that context. Same product, two surfaces.",
    },
    {
      type: "heading",
      text: "Next step",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Dictate your next ChatGPT brief in the real chat box. If you still rebuild the prompt by hand, you used a transcriber. Download Lazur and try the same brief in ChatGPT and in Cursor.",
    },
  ],
  relatedSlugs: ["cursor", "gmail", "slack"],
};
