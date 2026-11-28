/**
 * Free tools, each on its own subdomain (<subdomain>.lazur.app).
 *
 * The words (title, H1, tagline, extra pages, FAQ questions) come from docs/free-tools-naming.md
 * via scripts/free-tools-parse.mjs -> data.generated.json. Everything the doc can't say (sticker,
 * mic/camera permission, hand-written page copy, FAQ answers) is in META below.
 * The widget for each tool is in src/app/sub/[tool]/widgets.tsx.
 */
import data from "./data.generated.json";
import faqData from "./faq.generated.json";
import type { StickerName } from "@/components/landing/Sticker";

/** FAQ answers written by scripts/free-tools-faq.mjs (reviewed), keyed by subdomain then question. */
const FAQ = faqData as Record<string, Record<string, string>>;

export type FreeToolPage = { slug: string; title: string; h1: string; intro: string };

export type FreeTool = {
  subdomain: string;
  name: string;
  category: string;
  /** One of Lazur's chrome stickers (components/landing/Sticker.tsx), shown with the tool. */
  sticker: StickerName;
  /** A second sticker that goes with the first (top right of the page). */
  sticker2: StickerName;
  title: string;
  h1: string;
  tagline: string;
  description: string;
  /** Needs the browser's microphone / camera permission (turns the Permissions-Policy block off). */
  permissions: ("microphone" | "camera")[];
  pages: FreeToolPage[];
  faq: { q: string; a?: string }[];
  /** Subdomains of related tools. */
  related: string[];
};

type Meta = {
  sticker: StickerName;
  permissions?: ("microphone" | "camera")[];
  pages?: FreeToolPage[];
  answers?: Record<string, string>;
};

const META: Record<string, Meta> = {
  "mic-test": {
    sticker: "mic",
    permissions: ["microphone"],
    pages: [
      { slug: "playback", title: "Mic Test with Playback – Hear Yourself Back | Lazur", h1: "Mic test with playback", intro: "Record a few seconds and play them back to hear exactly what other people hear on a call." },
      { slug: "hear-yourself", title: "Mic Test: Hear Yourself Online | Lazur", h1: "Hear yourself on your mic", intro: "Record a short clip and play it straight back so you can hear how your voice comes through." },
      { slug: "headphones", title: "Headphones Mic Test – Check Your Headset Mic | Lazur", h1: "Headphones mic test", intro: "Pick your headset from the list, talk, and watch the level. Then play your recording back." },
      { slug: "iphone", title: "iPhone Mic Test – Check Your iPhone Microphone | Lazur", h1: "iPhone mic test", intro: "Open this page in Safari on your iPhone, allow the microphone, and talk. The bar moves when the mic hears you." },
      { slug: "windows-11", title: "Windows 11 Mic Test – Check Your Microphone | Lazur", h1: "Windows 11 mic test", intro: "Test the microphone Windows 11 is using, without opening Settings. Talk and watch the level." },
      { slug: "mac", title: "Mac Mic Test – Check Your MacBook Microphone | Lazur", h1: "Mac mic test", intro: "Test your MacBook or external mic in the browser. Talk, watch the level, record and play back." },
    ],
    answers: {
      "What is a mic test used for?": "To check that your computer hears you before a call, a recording or a stream. If the level bar moves when you talk, the microphone is working.",
      "What should I say during a mic test?": "Anything, for a few seconds. Count to ten or read a sentence at your normal volume, then play the recording back to hear how you sound.",
      "How can I test my microphone online?": "Press Start, allow microphone access in your browser, and talk. The bar shows your level. Press Record to save a short clip and play it back.",
    },
  },
  "webcam-test": { sticker: "camera", permissions: ["camera", "microphone"] },
  "speaker-test": { sticker: "speaker" },
  "keyboard-test": { sticker: "key" },
  "click-speed-test": { sticker: "bolt" },
  "dead-pixel-test": { sticker: "gem" },
  "screen-recorder": { sticker: "play", permissions: ["microphone"] },
  dictation: { sticker: "notch", permissions: ["microphone"] },
  "voice-typing": { sticker: "globe", permissions: ["microphone"] },
  "audio-to-text": { sticker: "drop" },
  "voice-note-to-text": { sticker: "heart" },
  "voice-recorder": { sticker: "planet", permissions: ["microphone"] },
  "audio-to-notes": { sticker: "pencil" },
  "youtube-transcript": { sticker: "youtube" },
  "youtube-summarizer": { sticker: "youtube" },
  teleprompter: { sticker: "doc", permissions: ["camera", "microphone"] },
  "words-to-minutes": { sticker: "clock" },
  "pronunciation-checker": { sticker: "smiley", permissions: ["microphone"] },
  "dictation-practice": { sticker: "pencil" },
  "text-to-speech": { sticker: "speaker" },
  "read-pdf-aloud": { sticker: "doc" },
  "image-to-text": { sticker: "camera" },
  "handwriting-to-text": { sticker: "pencil" },
  "image-to-excel": { sticker: "grid" },
  "pdf-to-text": { sticker: "doc" },
  "chat-with-pdf": { sticker: "bubble" },
  "image-to-prompt": { sticker: "star" },
  "color-picker": { sticker: "flower" },
  "prompt-generator": { sticker: "bolt" },
  "excel-formula": { sticker: "grid" },
  "sql-generator": { sticker: "code" },
  "regex-generator": { sticker: "code" },
  "email-reply": { sticker: "mail" },
  "linkedin-message": { sticker: "mail" },
  "text-reply": { sticker: "bubble" },
  "email-signature": { sticker: "mail" },
  "meeting-minutes": { sticker: "clock" },
  summarizer: { sticker: "doc" },
  "grammar-checker": { sticker: "text" },
  "paraphrasing-tool": { sticker: "text" },
  "ai-humanizer": { sticker: "smiley" },
  "ai-detector": { sticker: "eye" },
  "word-counter": { sticker: "donut" },
  "bio-generator": { sticker: "crown" },
  "linkedin-headline": { sticker: "briefcase" },
  "linkedin-post": { sticker: "briefcase" },
  "caption-generator": { sticker: "camera" },
  "cover-letter": { sticker: "briefcase" },
  "resignation-letter": { sticker: "doc" },
};

/**
 * Extra pages per tool (/playback, /hindi ...) are OFF on purpose. They will be written one by one
 * with SEO, GEO and AEO in mind, not generated. While this is false every tool has only its home
 * page, so no thin pages reach the sitemap or Google. Flip it (or fill META pages) when ready.
 */
const EXTRA_PAGES_ENABLED = false;

/** The second sticker on each page (top right on wide screens), picked to go with the first. */
const SECOND: Record<string, StickerName> = {
  "mic-test": "speaker", "webcam-test": "smiley", "speaker-test": "cd", "keyboard-test": "text", "click-speed-test": "star",
  "dead-pixel-test": "eye", "screen-recorder": "camera", dictation: "bubble", "voice-typing": "mic", "audio-to-text": "doc",
  "voice-note-to-text": "bubble", "voice-recorder": "cd", "audio-to-notes": "doc", "youtube-transcript": "doc", "youtube-summarizer": "bolt",
  teleprompter: "camera", "words-to-minutes": "mic", "pronunciation-checker": "mic", "dictation-practice": "speaker", "text-to-speech": "bubble",
  "read-pdf-aloud": "speaker", "image-to-text": "text", "handwriting-to-text": "doc", "image-to-excel": "camera", "pdf-to-text": "text",
  "chat-with-pdf": "doc", "image-to-prompt": "flower", "color-picker": "drop", "prompt-generator": "star", "excel-formula": "code",
  "sql-generator": "grid", "regex-generator": "text", "email-reply": "bubble", "linkedin-message": "briefcase", "text-reply": "heart",
  "email-signature": "pencil", "meeting-minutes": "doc", summarizer: "bolt", "grammar-checker": "check", "paraphrasing-tool": "pencil",
  "ai-humanizer": "heart", "ai-detector": "ghost", "word-counter": "clock", "bio-generator": "star", "linkedin-headline": "text",
  "linkedin-post": "bubble", "caption-generator": "heart", "cover-letter": "mail", "resignation-letter": "mail",
};

const humanize = (slug: string) =>
  slug
    .split("-")
    .map((w) => (/^\d/.test(w) ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");

type Raw = (typeof data)[number];

function build(raw: Raw, all: Raw[]): FreeTool {
  const meta = META[raw.subdomain] ?? { sticker: "doc" };
  const isLanguageTool = raw.title.includes("{Language}");
  const pages: FreeToolPage[] = !EXTRA_PAGES_ENABLED
    ? []
    : meta.pages ??
    raw.pages.map((slug) => {
      const label = humanize(slug);
      if (isLanguageTool) {
        return {
          slug,
          title: raw.title.replaceAll("{Language}", label),
          h1: raw.h1.replaceAll("{Language}", label),
          intro: raw.tagline.replaceAll("{language}", label),
        };
      }
      return { slug, title: `${raw.name}: ${label} | Lazur`, h1: `${raw.name}: ${label}`, intro: raw.tagline };
    });
  const same = all.filter((t) => t.category === raw.category && t.subdomain !== raw.subdomain);
  const idx = all.findIndex((t) => t.subdomain === raw.subdomain);
  const near = [...all.slice(idx + 1), ...all.slice(0, idx)].filter((t) => same.includes(t));
  return {
    subdomain: raw.subdomain,
    name: raw.name,
    category: raw.category,
    sticker: meta.sticker,
    sticker2: SECOND[raw.subdomain] && SECOND[raw.subdomain] !== meta.sticker ? SECOND[raw.subdomain] : "star",
    title: isLanguageTool ? raw.title.replace("{Language} ", "").replaceAll("{Language}", "Hindi, Tamil, English & More") : raw.title,
    h1: raw.h1.replaceAll("{Language}", "").trim() || raw.name,
    tagline: raw.tagline.replaceAll("{language}", "your language"),
    description: `${raw.tagline.replaceAll("{language}", "your language")} Free online tool by Lazur. Runs in your browser.`,
    permissions: meta.permissions ?? [],
    pages,
    faq: Object.entries(FAQ[raw.subdomain] ?? {}).map(([q, a]) => ({ q, a: meta.answers?.[q] ?? a })),
    related: near.slice(0, 3).map((t) => t.subdomain),
  };
}

export const FREE_TOOLS: FreeTool[] = data.map((raw) => build(raw, data));

export const freeToolBySubdomain = (sub: string) => FREE_TOOLS.find((t) => t.subdomain === sub);

/** Categories in doc order, for the hub page. */
export const FREE_TOOL_CATEGORIES = [...new Set(FREE_TOOLS.map((t) => t.category))];
