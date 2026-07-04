export type FaqItem = {
  question: string;
  answer: string;
  link?: { href: string; label: string };
};

/** Homepage FAQ — shared by FaqSection UI and FAQPage JSON-LD. */
export const HOMEPAGE_FAQ: FaqItem[] = [
  {
    question: "What is Lazur?",
    answer:
      "Lazur is an ambient writing app for Mac that combines AI voice dictation with Smart Rewrite. Hold a hotkey, speak naturally, and get polished text pasted at your cursor in any app — Slack, email, Cursor, Notion, and more.",
  },
  {
    question: "How is Lazur different from Wispr Flow?",
    answer:
      "Wispr Flow focuses on fast speech-to-text. Lazur goes further with intent-aware Smart Rewrite that shapes your speech into finished, app-appropriate writing. See our full comparison for pricing, privacy, and feature details.",
    link: { href: "/blog/lazur-vs-wispr-flow", label: "Lazur vs Wispr Flow" },
  },
  {
    question: "Does Lazur work in Cursor and VS Code?",
    answer:
      "Yes. Lazur is system-wide — one hotkey (Control+Space) works everywhere you type, including Cursor, VS Code, Xcode, and any Mac app. Dictate commit messages, PR descriptions, prompts, and code comments without leaving your editor.",
  },
  {
    question: "Is my voice data stored?",
    answer:
      "Speech-to-text runs locally on your Mac using Whisper — your audio does not leave your device. Cloud AI is used only for Smart Rewrite polish when enabled, and only text (not audio) is sent. Read our privacy policy for full details.",
    link: { href: "/privacy", label: "Privacy policy" },
  },
  {
    question: "How much does Lazur cost?",
    answer:
      "Free tier includes 5,000 words per month. Pro is $14/month (or $108/year) with unlimited words and 50 Command Mode uses. Power is $35/month (or $270/year) with unlimited Command Mode and priority support.",
    link: { href: "/pricing", label: "View pricing" },
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes — start a 7-day Pro trial with no credit card required. Download Lazur for macOS and get unlimited words plus Command Mode during your trial.",
    link: { href: "/download", label: "Download for Mac" },
  },
];
