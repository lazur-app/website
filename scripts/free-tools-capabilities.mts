// Writes content/free-tools/capabilities.json: what each free tool really does, so the page writers
// never claim a feature that doesn't exist. AI tools are read straight from ai-config.ts and
// prompts.ts; browser tools are described by hand below (keep in sync with their widgets).
// Run: node --experimental-strip-types scripts/free-tools-capabilities.mts
import { readFileSync, writeFileSync } from "node:fs";
import { AI_TOOLS } from "../src/components/free-tools/ai-config.ts";
import { TOOL_PROMPTS } from "../src/lib/free-tools/prompts.ts";

const BROWSER: Record<string, string> = {
  "mic-test": "Runs in the browser. Asks for microphone access, shows a live level meter and the loudest level so far, lets you pick which microphone if you have several, records a clip of up to 10 seconds and plays it back. Nothing is uploaded or saved.",
  "webcam-test": "Runs in the browser. Shows a live, mirrored camera preview, lets you pick the camera if you have several, shows the resolution and frame rate the camera reports, mirror toggle, snapshot you can download as PNG. Nothing is uploaded.",
  "speaker-test": "Runs in the browser. Plays a test tone in the left speaker only, right only, or both; frequency slider from 100 to 2000 Hz; a sweep from 100 to 2000 Hz; volume slider; left/right indicators light up while playing.",
  "keyboard-test": "Runs in the browser. On-screen keyboard (letters, numbers, F-keys, modifiers, arrows, numpad on wider screens); keys light up while pressed and stay marked once tested; shows the last key's key, code and keyCode; counter of tested keys; reset. Some system keys (Windows key, volume, Fn) never reach a web page.",
  "click-speed-test": "Runs in the browser. Clicks-per-second test with 1, 5, 10, 30 or 60 second timers; live CPS, total clicks, final CPS and a rating; personal best saved in the browser; spacebar mode and right-click mode.",
  "dead-pixel-test": "Runs in the browser. Fills the screen (fullscreen) with solid colours: black, white, red, green, blue, yellow, cyan, magenta; click or press the arrow keys or space for the next colour, Esc to exit. Helps spot dead (always dark) and stuck (always one colour) pixels.",
  "screen-recorder": "Runs in the browser (desktop Chrome, Edge, Firefox; not phones). Records a screen, window or tab you choose; optional microphone and tab/system audio; 3-2-1 countdown, pause, timer; download the recording as WebM. No watermark, no sign-up, nothing uploaded.",
  dictation: "Runs in the browser's own speech recognition (Chrome, Edge, Safari work best). Tap the mic and talk; text appears live and can be edited; many languages; spoken punctuation in English (comma, period, question mark, new line, new paragraph); copy, clear, download .txt; word count. Chrome may send audio to Google's speech service; Lazur does not receive it.",
  "voice-typing": "Runs in the browser's own speech recognition. Pick a language (Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, Malayalam, Kannada, Punjabi, Urdu, Sinhala, English, Spanish, French, Arabic); speak and get text in that language's script; copy, clear, open WhatsApp with the text. Chrome and Edge support the most languages.",
  "voice-recorder": "Runs in the browser. Records from the microphone with a level meter and timer; pause and resume; play back and download the recording (WebM/OGG/MP4, whichever the browser makes); a live transcript alongside when the browser supports speech recognition. Nothing is uploaded.",
  teleprompter: "Runs in the browser. Paste a script; font size, scroll speed, line height, text width, mirror mode for glass rigs, a reading line; fullscreen auto-scroll; Space pauses, arrow keys change speed, +/- change text size, Esc exits; optional camera preview; the script is remembered in the browser.",
  "words-to-minutes": "Runs in the browser. Paste text or type a word count; pick a pace (slow 110, normal 130, fast 160 words per minute, or custom); shows speaking time, word count and pages, plus a table of how many words fit in 1 to 20 minutes.",
  "pronunciation-checker": "Runs in the browser's speech recognition. Type or pick a word or sentence, press Say it, and see each word marked right or wrong with what the engine heard, plus a score; Hear it plays the correct pronunciation with the browser's voice. Several languages. The browser's engine judges, so results show what a computer understands.",
  "dictation-practice": "Runs in the browser. English sentences at three levels (easy, medium, hard); the browser reads each one aloud (speed slider, replay, slow replay); you type what you hear; Check shows correct words in green and wrong or missing ones in red, an accuracy score and a running session score.",
  "text-to-speech": "Runs in the browser's built-in voices. Paste text, choose a voice (grouped by language), rate and pitch sliders, play, pause, resume, stop; character count; sample text.",
  "read-pdf-aloud": "Runs in the browser. Opens a PDF on your device, pulls out its text, and reads it aloud with the browser's voices (voice and speed choice, play, pause, stop, shows the current part). Scanned PDFs with no text layer can't be read; the page says so and suggests PDF to Text.",
  "color-picker": "Runs in the browser. Upload or drop an image, click anywhere (with a magnifier) to get the colour as HEX, RGB and HSL, copy any of them; history of the last 10 colours; extract a 6-colour palette from the image. Nothing is uploaded.",
  "email-signature": "Runs in the browser. Form for name, title, company, phone, email, website, LinkedIn and X links, photo URL, accent colour; four templates (Classic, Modern, Minimal, Bold); live preview; copy the signature as rich text to paste into Gmail, Outlook or Apple Mail, or copy the HTML.",
  "word-counter": "Runs in the browser. Live count of words, characters with and without spaces, sentences, paragraphs, reading time (238 wpm) and speaking time (130 wpm), average word length, most used words; limits for a tweet (280), SMS (160), meta description (160) and LinkedIn post (3000).",
};

const tools = JSON.parse(readFileSync("src/lib/free-tools/data.generated.json", "utf8")) as { subdomain: string; name: string }[];
const out: Record<string, { kind: "browser" | "ai"; does: string }> = {};
for (const t of tools) {
  if (BROWSER[t.subdomain]) {
    out[t.subdomain] = { kind: "browser", does: BROWSER[t.subdomain] };
    continue;
  }
  const c = AI_TOOLS[t.subdomain];
  const p = TOOL_PROMPTS[t.subdomain];
  if (!c || !p) throw new Error(`no capability for ${t.subdomain}`);
  const fields = c.fields
    .map((f) => `${f.label}${f.optional ? " (optional)" : ""}${f.kind === "select" ? `: ${f.options?.join(" / ")}` : f.kind === "file" ? ` (file: ${f.accept})` : ""}`)
    .join("; ");
  const rule = p.instruction.split(" Reply with only the result.")[0].split(" Put ONLY the answer first")[0];
  out[t.subdomain] = {
    kind: "ai",
    does: `AI tool (Google Gemini on Lazur's servers; files up to 15 MB; answers in about 1-3 seconds, videos longer). Inputs: ${fields}. What it does: ${rule} Free: 3 runs a day, 3 more after leaving an email; no account needed. Results can be copied with one click.`,
  };
}
writeFileSync("content/free-tools/capabilities.json", JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, "tools described");
