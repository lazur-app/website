import type { UseCasePage } from "../types";

export const gmailUseCase: UseCasePage = {
  slug: "gmail",
  title: "Write email by voice on Mac",
  description:
    "Write Gmail by voice on a Mac from intent, not a spoken letter. Intent Mode replies from the thread: yes, notes by Thursday, keep it warm.",
  appName: "Gmail",
  mode: "command",
  targetKeyword: "voice to email Mac",
  publishedAt: "2026-08-23",
  readingTimeMinutes: 6,
  tldr: [
    "Speak the job of the email. Intent Mode writes the reply from the thread in front of you.",
    "“Yes, notes by Thursday, keep it warm” is enough. You do not dictate the whole letter.",
    "Paste in the Gmail compose window. Do not dictate in Notes and copy.",
  ],
  demo: {
    context:
      "Hey, can you review the onboarding feedback by Friday? A few people are getting stuck.",
    spoken: "reply, yes I'll have notes by Thursday, keep it warm",
    caption:
      "You do not dictate the email. Intent Mode writes the reply from what you meant.",
    output:
      "Hi Alex, yes, I'll have notes on the onboarding feedback by Thursday. Talk soon.",
  },
  howto: {
    name: "How to write a Gmail reply by voice",
    steps: [
      {
        name: "Open the real compose window",
        text: "Reply in Gmail, Outlook, or Apple Mail. Put the cursor in the body.",
      },
      {
        name: "Speak intent, not the letter",
        text: "Say the answer, the date, and the tone. Intent Mode uses the thread you are looking at.",
      },
      {
        name: "Scan names and the ask",
        text: "Check the greeting, proper nouns, and the call to action. Then send.",
      },
    ],
  },
  faq: [
    {
      question: "Can you write Gmail by voice on a Mac?",
      answer:
        "Yes. Click into the Gmail compose box, hold the Lazur shortcut, and speak the point of the email. Intent Mode writes a reply from the thread and your intent so it does not read like a transcript.",
    },
    {
      question: "Why do dictated emails sound weird?",
      answer:
        "Because you spoke them. Speech uses longer sentences and filler. Voice writing reshapes that into email tone: short paragraphs, a clear ask, and punctuation.",
    },
    {
      question: "Is this better than Apple Dictation in Mail?",
      answer:
        "Apple Dictation gets words down in Mail. It does not consistently turn “reply, Thursday, keep it warm” into a sendable email, and it is weaker in Gmail in Chrome. Lazur is built for that job.",
    },
    {
      question: "What should I say out loud?",
      answer:
        "Recipient or reply, the ask, the deadline, and the tone. Example: “Reply to Jordan, warm, Tuesday 10am PT works, send a calendar hold.”",
    },
  ],
  blocks: [
    {
      type: "paragraph",
      text: "Write email by voice on a Mac by dictating what the email needs to do, then letting Intent Mode finish it. If you speak a full letter word for word, you get a transcript. If you speak intent, you get something you would send.",
    },
    {
      type: "heading",
      text: "Reply from the thread",
      level: 2,
    },
    {
      type: "paragraph",
      text: "The useful case is not a blank compose window. It is a message already on screen. Intent Mode can see that you were asked for Friday and you said Thursday, warm. The paste should mention the feedback and land like you typed it.",
    },
    {
      type: "heading",
      text: "Prompts that work",
      level: 2,
    },
    {
      type: "list",
      items: [
        "“Reply, warm, yes we can do Tuesday 10am PT, send a calendar hold.”",
        "“Customer email, apologetic, bug is fixed in 1.4, steps to update, offer a call.”",
        "“Internal, we are slipping the launch by a week, here is why, here is the new date.”",
      ],
    },
    {
      type: "heading",
      text: "New emails vs replies",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Blank compose is closer to Dictation Mode: speak the brief, get a structured email. A thread is Intent Mode: speak the action. Same shortcut, different job. Slack uses the same split.",
    },
    {
      type: "heading",
      text: "Next step",
      level: 2,
    },
    {
      type: "paragraph",
      text: "Pick the next email you would have typed. Speak the brief in Gmail. If the paste still sounds like speech, the tool is transcribing, not writing. Download Lazur and try it in the actual compose window.",
    },
  ],
  relatedSlugs: ["slack", "chatgpt", "cursor"],
};
