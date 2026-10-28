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
      "An AI buddy that lives in your Mac's notch. Hold a key and talk: it can see your screen, point at things, answer out loud, set timers and reminders, open apps, run longer jobs in the background, and type for you in any app.",
  },
  {
    question: "How is it different from ChatGPT or Siri?",
    answer:
      "You don't have to explain what you're looking at. Lazur sees your screen when you ask, so \"what does this error mean?\" or \"where's the export button?\" just works. It can also point at things on screen, walk you through an app step by step, and do things on your Mac instead of only answering.",
  },
  {
    question: "What can I ask it to do?",
    answer:
      "Ask about anything on screen, get pointed to a button or walked through a setting, set timers and reminders, add calendar events and notes, play music and change the volume, open apps and links, search the web, run your Shortcuts, and hand off research or file tidying as a background job. It also types for you: hold fn, talk, and clean text appears at your cursor.",
  },
  {
    question: "Does it work in every app?",
    answer:
      "Yes. Lazur works on top of whatever you're using: Mail, Slack, Chrome, Figma, Cursor, VS Code, Notion and the rest. Web jobs run in their own tabs through the Lazur for Chrome extension.",
  },
  {
    question: "Is it always listening or watching my screen?",
    answer:
      "No. It listens and looks at your screen only while you hold the shortcut. Your audio and that one screenshot are sent to our AI providers to answer you and are not stored, and your content is never used to train AI models.",
    link: { href: "/privacy", label: "Privacy policy" },
  },
  {
    question: "How much does it cost?",
    answer:
      "Try Pro free for 7 days with no credit card; the trial starts when you first open Lazur on your Mac. After that, Pro is $18/month with 150 AI actions and unlimited dictation, or Power is $120/month with 1,000 AI actions. Annual billing is $15/month for Pro and $96/month for Power.",
    link: { href: "/pricing", label: "See plans" },
  },
  {
    question: "Is there a Windows version?",
    answer:
      "macOS today (Apple Silicon and Intel). Windows is on the way; leave your email on the download page and we'll tell you when it's ready.",
    link: { href: "/download", label: "Download for Mac" },
  },
];
