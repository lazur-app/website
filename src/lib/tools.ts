/** Hand-built free tools at /tools/<slug>. Not generated daily. */
export type ToolInfo = {
  slug: string;
  name: string;
  title: string;
  description: string;
  targetKeyword: string;
  kicker: string;
};

export const TOOLS: ToolInfo[] = [
  {
    slug: "typing-speed-test",
    name: "Typing speed test",
    title: "Typing speed test: check your words per minute",
    description: "Free 60-second typing test. Type the passage and get your words per minute and accuracy, scored the standard way (5 characters = 1 word).",
    targetKeyword: "typing speed test",
    kicker: "Free tool",
  },
  {
    slug: "speaking-vs-typing-test",
    name: "Speaking vs typing test",
    title: "Speaking vs typing: which is faster for you?",
    description: "Type one short passage, then read another out loud. See your own typing and speaking speed side by side, and how much faster talking is for you.",
    targetKeyword: "speaking vs typing speed",
    kicker: "Free tool",
  },
  {
    slug: "typing-tax-calculator",
    name: "Typing tax calculator",
    title: "Typing tax calculator: how many hours a year you spend typing",
    description: "Enter how much you type each day and your speed. See the hours a year it takes, what that time costs, and how much speaking could give back.",
    targetKeyword: "time spent typing calculator",
    kicker: "Free tool",
  },
  {
    slug: "dictation-accuracy-checker",
    name: "Dictation accuracy checker",
    title: "Dictation accuracy checker: word error rate in your browser",
    description: "Paste what you meant to say and what your dictation app typed. Get the word error rate and every substituted, missing and extra word highlighted.",
    targetKeyword: "dictation accuracy test",
    kicker: "Free tool",
  },
];

export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);

/** Research the tools cite. */
export const TOOL_SOURCES = {
  keystrokes: {
    title: "Observations on Typing from 136 Million Keystrokes (Dhakal et al., CHI 2018)",
    url: "https://userinterfaces.aalto.fi/136Mkeystrokes/",
  },
  speechPhones: {
    title: "Comparing Speech and Keyboard Text Entry for Short Messages (Ruan et al., Stanford, 2016)",
    url: "https://arxiv.org/abs/1608.07323",
  },
  wer: {
    title: "Word error rate (Wikipedia)",
    url: "https://en.wikipedia.org/wiki/Word_error_rate",
  },
};
