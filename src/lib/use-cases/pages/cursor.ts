import type { UseCasePage } from "../types";

export const cursorUseCase: UseCasePage = {
  slug: "cursor",
  title: "Voice writing in Cursor",
  description:
    "Dictate Cursor prompts on Mac without pasting a ramble. Command Mode writes the agent instruction from what you meant, using the file in front of you.",
  appName: "Cursor",
  mode: "command",
  targetKeyword: "voice typing Cursor Mac",
  publishedAt: "2026-08-23",
  readingTimeMinutes: 6,
  tldr: [
    "In Cursor, speak the change. Command Mode writes the instruction your agent can run.",
    "You do not dictate source syntax. You dictate PRs, review notes, and agent prompts.",
    "Same shortcut as Slack and Gmail. Lazur pastes at the cursor in the Composer.",
  ],
  demo: {
    context: "auth-handler.ts  ·  React Context",
    spoken:
      "refactor this to use zustand instead of context and add error handling for failed logins",
    caption:
      "You do not dictate the prompt word for word. Command Mode writes the instruction from the file and the intent.",
    output:
      "Refactor the auth handler to use Zustand instead of React Context. Add error handling for failed login attempts with user-facing messages.",
  },
  howto: {
    name: "How to voice-write a Cursor prompt",
    steps: [
      {
        name: "Open the Composer on the file",
        text: "Click into the Cursor agent field with the relevant file or selection visible.",
      },
      {
        name: "Hold the shortcut and speak the job",
        text: "Say the change, the constraint, and what not to touch. Skip the ums.",
      },
      {
        name: "Scan once, then run",
        text: "Check file names and the constraint. Send the prompt to the agent.",
      },
    ],
  },
  faq: [
    {
      question: "Does Lazur work in Cursor on Mac?",
      answer:
        "Yes. Lazur is system-wide on macOS. Hold the shortcut and it pastes at the cursor in Cursor, VS Code, Xcode, Slack, and the browser.",
    },
    {
      question: "Should I dictate code with voice in Cursor?",
      answer:
        "Dictate the writing around the code: agent prompts, PR descriptions, comments, and review replies. Typing still wins for syntax. Command Mode is for the instruction, not the brackets.",
    },
    {
      question: "How is this different from dictating a ChatGPT prompt?",
      answer:
        "Same idea, different surface. In Cursor, Command Mode can use the file or selection you are looking at. In ChatGPT, Dictation Mode turns a spoken brief into a paste-ready prompt.",
    },
    {
      question: "Is speech sent to the cloud when I dictate in Cursor?",
      answer:
        "Speech-to-text runs on your Mac. Optional polish sends text, not audio. Do not dictate secrets. Treat the mic like a Slack channel.",
    },
  ],
  blocks: [
    {
      type: "paragraph",
      text: "Voice writing in Cursor is for the prompt, not the source file. You talk through the bug, the file, and the constraint. Command Mode turns that into an instruction the agent can actually run.",
    },
    {
      type: "heading",
      text: "Why a transcript fails here",
      level: 2,
    },
    {
      type: "paragraph",
      text: "A raw transcript of how engineers talk looks like this: “uh can you like move this off context, zustand is fine, and if login fails show something, don’t break the public API.” That is a brief. It is not a prompt. Cursor does better when the paste names the file, the change, and the guardrails.",
    },
    {
      type: "heading",
      text: "What to speak",
      level: 2,
    },
    {
      type: "list",
      items: [
        "The file or selection you are looking at.",
        "The change you want.",
        "What not to touch (API, tests, naming).",
        "The failure case, if there is one.",
      ],
    },
    {
      type: "heading",
      text: "What not to speak",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Do not dictate TypeScript. Do not narrate every import. Type the precise bits. Speak the job. That split is the whole developer habit: voice for prose and intent, keyboard for syntax.",
    },
    {
      type: "heading",
      text: "PRs and review, same shortcut",
      level: 2,
    },
    {
      type: "paragraph",
      text: "When you leave Cursor for GitHub or Linear, hold the same shortcut. Dictate the PR body. Command Mode can rewrite a messy review comment into something you would post. See AI dictation for developers for the wider stack.",
    },
    {
      type: "heading",
      text: "Next step",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Tomorrow, write one Cursor prompt and one PR description by voice. If you still rewrite the paste more than you spoke, you used a transcriber. Download Lazur and run both in the apps you ship from.",
    },
  ],
  relatedSlugs: ["chatgpt", "slack", "gmail"],
};
