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
      "An ambient writing app for Mac. Hold a hotkey, speak, and get finished text at your cursor in Slack, email, Cursor, anywhere you type.",
  },
  {
    question: "How is Lazur different from Wispr Flow?",
    answer:
      "Wispr Flow is fast speech-to-text. Lazur turns what you meant into send-ready writing, including Command Mode.",
    link: { href: "/compare/lazur-vs-wispr-flow", label: "Full comparison" },
  },
  {
    question: "Does it work in Cursor and VS Code?",
    answer:
      "Yes. One hotkey (Control+Space) works in every Mac app: Cursor, VS Code, Xcode, Slack, Gmail, Notion.",
  },
  {
    question: "Is my voice stored?",
    answer:
      "No. Speech-to-text runs on your Mac. Audio never leaves the device. Cloud AI is used only for rewrite polish, and only text is sent.",
    link: { href: "/privacy", label: "Privacy policy" },
  },
  {
    question: "How much does it cost?",
    answer:
      "Free: 5,000 words/month. Pro: $14/month. Power: $35/month. 7-day Pro trial, no credit card.",
    link: { href: "/pricing", label: "See plans" },
  },
  {
    question: "What's the difference between Dictation and Command Mode?",
    answer:
      "Dictation Mode writes what you said, cleaned up. Command Mode does what you meant: reply to this, rewrite that, keep it brief, using the text in front of you.",
  },
];
