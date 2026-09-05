export type FaqItem = {
  question: string;
  answer: string;
  link?: { href: string; label: string };
};

/** Homepage FAQ, shared by FaqSection UI and FAQPage JSON-LD. */
export const HOMEPAGE_FAQ: FaqItem[] = [
  {
    question: "What is Lazur?",
    answer:
      "Lazur writes for you in whatever app you're already in. Hold a key, say what you want, and the finished text lands at your cursor: a reply, an update, a prompt, a commit message. It can see the window you're looking at, so you don't have to explain the situation first.",
  },
  {
    question: "How is Lazur different from Wispr Flow?",
    answer:
      "Wispr Flow reads the text field you're typing in. Lazur reads the whole window, the thread, the document, the diff, and writes from it. That's why you can say \"reply, Thursday works\" without selecting or pasting anything. Lazur also runs speech recognition on your own machine instead of in the cloud.",
    link: { href: "/compare/lazur-vs-wispr-flow", label: "Full comparison" },
  },
  {
    question: "What is Intent?",
    answer:
      "Dictation writes down what you said, cleaned up. Intent writes what you asked for: \"reply to this\", \"summarise this thread\", \"make it shorter\". It works from whatever is already on your screen, so you never have to describe it first.",
  },
  {
    question: "Does it work in Cursor and VS Code?",
    answer:
      "Yes. One shortcut works in every app on your machine: Cursor, VS Code, Xcode, Slack, Gmail, Notion, and anything else you type into.",
  },
  {
    question: "Is my voice stored?",
    answer:
      "No. Speech becomes text on your own machine, so no recording is ever uploaded. When Intent looks at your window it takes one image at the moment you speak, uses it, then discards it. Nothing you write is used to train AI models.",
    link: { href: "/privacy", label: "Privacy policy" },
  },
  {
    question: "How much does it cost?",
    answer:
      "Free: 5,000 words a month, dictation only. Pro: $14/month with 300 Intent requests. Power: $35/month with unlimited Intent. Every download starts with a 7-day Pro trial, no credit card.",
    link: { href: "/pricing", label: "See plans" },
  },
  {
    question: "Is there a Windows version?",
    answer:
      "macOS today, Windows soon. Join the waitlist and we'll email you the moment it's ready.",
    link: { href: "/download", label: "Join the Windows waitlist" },
  },
];
