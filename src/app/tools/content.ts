import { TOOL_SOURCES } from "@/lib/tools";
import type { SeoFaq, SeoSource, SeoStat } from "@/lib/seo-pages/types";

/** Copy for each tool page. Written by hand; checked by scripts/content/seo-lint.mjs like everything else. */
export const TOOL_COPY: Record<string, { intro: string; how: string[]; stats: SeoStat[]; faq: SeoFaq[]; sources: SeoSource[]; nudge: string }> = {
  "typing-speed-test": {
    intro: "Type the passage for 60 seconds and this test shows your words per minute and accuracy. It scores the standard way, where every 5 correct characters count as one word.",
    how: [
      "Click the box and start typing. The timer starts on your first key.",
      "Mistakes turn red and do not count toward your speed.",
      "The test ends after 60 seconds or when you finish the passage.",
    ],
    stats: [
      { value: "52 wpm", label: "average typing speed across 168,000 volunteers", sourceUrl: TOOL_SOURCES.keystrokes.url, sourceTitle: "Dhakal et al., CHI 2018" },
      { value: "136M", label: "keystrokes in that study, the largest of its kind", sourceUrl: TOOL_SOURCES.keystrokes.url, sourceTitle: "Dhakal et al., CHI 2018" },
    ],
    faq: [
      { question: "What is a good typing speed?", answer: "The average in the largest public study was 52 words per minute. Anything above 70 is fast. Professional typists often sit between 60 and 90." },
      { question: "How is words per minute calculated?", answer: "Correct characters divided by 5, divided by the minutes you typed. Dividing by 5 makes long and short words count the same." },
      { question: "How do I get faster?", answer: "Practice accuracy first, then speed. Or skip the keyboard for long text: most people speak at well over 100 words per minute." },
    ],
    sources: [TOOL_SOURCES.keystrokes],
    nudge: "Most people speak about three times faster than they type. On a Mac, hold fn with Lazur and talk, and clean text appears at your cursor.",
  },
  "speaking-vs-typing-test": {
    intro: "Type a short passage for 30 seconds, then read another one out loud with the timer running. You get your own typing and speaking speed side by side.",
    how: [
      "Do the 30-second typing test first.",
      "Press Start reading, read the passage out loud at a normal pace, then press Done reading.",
      "Your speaking speed is the passage's word count divided by the time it took.",
    ],
    stats: [
      { value: "2.93x", label: "faster: speech input vs keyboard for English text in a Stanford study", sourceUrl: TOOL_SOURCES.speechPhones.url, sourceTitle: "Ruan et al., 2016" },
      { value: "153 wpm", label: "English speech input speed in the same study, against 52 wpm typed", sourceUrl: TOOL_SOURCES.speechPhones.url, sourceTitle: "Ruan et al., 2016" },
    ],
    faq: [
      { question: "Is speaking really faster than typing?", answer: "For most people, yes. In a Stanford study, English speech input ran at 153 words per minute against 52 on a keyboard. That study used phone keyboards, so desktop typists close some of the gap." },
      { question: "Does this test record my voice?", answer: "No. It only times you. There is no microphone access and nothing leaves your browser." },
      { question: "Why read aloud instead of talking freely?", answer: "A fixed passage gives an exact word count, so the speed is accurate. Free speech is usually a bit faster than reading." },
    ],
    sources: [TOOL_SOURCES.speechPhones, TOOL_SOURCES.keystrokes],
    nudge: "If speaking is faster for you, use it. Hold fn with Lazur on your Mac and clean, formatted text lands where your cursor is.",
  },
  "typing-tax-calculator": {
    intro: "Enter how many words you write a day and how fast you type. The calculator shows the hours a year that takes, what that time costs, and how much of it speaking could give back.",
    how: [
      "Start with words a day. A busy inbox plus Slack is often 2,000 to 5,000.",
      "Use your real typing speed. Take the [typing speed test](/tools/typing-speed-test) if you do not know it.",
      "Speaking speed defaults to 150 wpm, close to the 153 measured in a Stanford study. Change it to your own from the [speaking vs typing test](/tools/speaking-vs-typing-test).",
    ],
    stats: [
      { value: "52 wpm", label: "average typing speed, the default here", sourceUrl: TOOL_SOURCES.keystrokes.url, sourceTitle: "Dhakal et al., CHI 2018" },
      { value: "153 wpm", label: "measured English speech input speed", sourceUrl: TOOL_SOURCES.speechPhones.url, sourceTitle: "Ruan et al., 2016" },
    ],
    faq: [
      { question: "How many hours a year do I spend typing?", answer: "Words a day divided by your typing speed gives minutes a day. At 3,000 words and 52 wpm that is about 58 minutes, or roughly 220 hours across 230 working days." },
      { question: "Is the saving real?", answer: "It is an upper bound. You still read and fix what you dictate. A tool that cleans up as it types keeps that fixing short." },
    ],
    sources: [TOOL_SOURCES.keystrokes, TOOL_SOURCES.speechPhones],
    nudge: "Lazur's dictation is unlimited on every plan. Hold fn, talk, and the text appears cleaned up at your cursor.",
  },
  "dictation-accuracy-checker": {
    intro: "Paste what you meant to say and what your dictation app typed. The checker shows the word error rate (WER) and marks every wrong, missing and extra word.",
    how: [
      "Write or paste the sentence you meant to say in the left box.",
      "Dictate the same sentence in any app, then paste the result in the right box.",
      "WER is (wrong + missing + extra words) divided by the number of words you meant. Lower is better.",
    ],
    stats: [],
    faq: [
      { question: "What is a good word error rate?", answer: "Under 5% reads as nearly perfect. At 10% you fix about one word per sentence. Names, numbers and jargon are where most apps slip." },
      { question: "Why does “3” vs “three” count as an error?", answer: "WER compares words exactly. Most scoring normalizes numbers first. Write both boxes the same way if you only care about the words." },
      { question: "Is my text sent anywhere?", answer: "No. The comparison runs in your browser." },
    ],
    sources: [TOOL_SOURCES.wer],
    nudge: "Lazur keeps a personal dictionary, so the names and terms you use stop coming out wrong. Free for 3 days on Mac.",
  },
};
