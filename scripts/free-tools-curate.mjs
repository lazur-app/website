// Human review of the keyword pages picked by free-tools-keywords.mjs (2026-11-28).
// Drops a page when: the tool can't do what was searched; the search means something else;
// it's a brand or an off-topic question; it duplicates another page; or another of our tools
// owns that search. Kept pages stay as picked. The reason for each drop is recorded in keywords.json.
// Run: node scripts/free-tools-curate.mjs
import { readFileSync, writeFileSync } from "node:fs";

const DROP = {
  "mic-test": { webcam: "webcam-test owns 'webcam and mic test'" },
  "grammar-checker": { "no-ai": "the tool uses AI", english: "same search as english-correction" },
  "webcam-test": { effects: "no effects in the tool", "camera-tester": "same as the main page", "web-camera": "same as the main page" },
  "speaker-test": { multimeter: "hardware test, not this tool", "speakers-without-receiver": "hardware question", speakers: "not a real intent", "speakers-without-amplifier": "hardware question", "what-83-rule-speakers": "off-topic" },
  "keyboard-test": { "tester-game": "not a game", tester: "same as the main page", utility: "same as the main page", mac: "same as macbook" },
  "click-speed-test": { reaction: "different test", "keyboard-latency": "different test", "download-pc": "nothing to download" },
  "dead-pixel-test": { "fix-iphone": "same as fix + iphone", "vr-headset": "tool can't run inside a headset" },
  "screen-recorder": { mobile: "doesn't work on phones", windows: "same as pc", webcam: "no webcam overlay" },
  dictation: { practice: "dictation-practice owns it", "english-club": "brand", "test-english": "dictation-practice owns it", youtube: "unclear intent" },
  "audio-to-text": { "speaker-detection": "no speaker labels", whatsapp: "voice-note-to-text owns it", "chatgpt-transcribe": "same as chatgpt" },
  "voice-note-to-text": { translation: "transcribes, doesn't translate", "message-android-samsung": "same as android", "keyboard-shortcut": "same as keyboard" },
  "voice-recorder": { "noise-cancellation": "no noise cancellation", mp3: "saves WebM/OGG/MP4, not MP3", laptop: "same as pc", rev: "brand", "audio-youtube": "same as youtube" },
  "audio-to-notes": { iphone: "means recording notes, not this tool", convert: "the opposite direction", lecture: "same as lecture-ai", make: "means recording notes", "audiobooks-have-sound-effects": "off-topic" },
  "youtube-transcript": { timestamp: "no timestamps in the output" },
  teleprompter: { "video-recording": "doesn't record video" },
  "words-to-minutes": { "minute-by-minute": "not a real intent", say: "off-topic", timer: "different tool", "best-meeting": "off-topic" },
  "pronunciation-checker": { "test-answers": "worksheet intent", "english-ai": "same as english" },
  "dictation-practice": { pdf: "no PDF download", "spelling-answers": "worksheet intent" },
  "text-to-speech": { ai: "uses the browser's voices, not AI voices", "discord-voice-chat": "can't send audio into Discord", "best-app-iphone": "app-store intent" },
  "read-pdf-aloud": { me: "same as out-loud" },
  "handwriting-to-text": { arabic: "the opposite direction (text to handwriting)" },
  "chat-with-pdf": { "by-scispace": "brand", client: "off-topic", "send-via-text": "off-topic" },
  "color-picker": { name: "no colour names, only codes", discord: "unclear intent", what: "unclear intent", word: "different tool" },
  "prompt-generator": { "best-chatgpt": "same as chatgpt" },
  "excel-formula": { "ai-spreadsheet": "doesn't make spreadsheets" },
  "sql-generator": { "from-excel": "different task" },
  "email-reply": { names: "off-topic", ideas: "off-topic" },
  "text-reply": { image: "doesn't read images", what: "same as the main page" },
  summarizer: { "youtube-videos": "youtube-summarizer owns it" },
  "paraphrasing-tool": { "without-ai": "the tool uses AI" },
  "ai-humanizer": { text: "same as the main page", "jarvis-possible": "off-topic" },
  "ai-detector": { photo: "checks text only" },
  "linkedin-post": { image: "doesn't make images" },
  "caption-generator": { video: "means subtitles, a different tool" },
  "cover-letter": { resume: "same as from-resume" },
  "resignation-letter": { "write-strong": "same as write-good" },
};

const path = "content/free-tools/keywords.json";
const k = JSON.parse(readFileSync(path, "utf8"));
let before = 0;
let after = 0;
for (const [tool, v] of Object.entries(k)) {
  before += v.pages.length;
  const drop = DROP[tool] ?? {};
  v.dropped = [...(v.dropped ?? []), ...v.pages.filter((p) => drop[p.slug]).map((p) => ({ slug: p.slug, keyword: p.keyword, why: drop[p.slug] }))];
  v.pages = v.pages.filter((p) => !drop[p.slug]);
  after += v.pages.length;
  for (const slug of Object.keys(drop)) if (!v.dropped.some((d) => d.slug === slug)) console.log(`note: ${tool}/${slug} was not in the list`);
}
writeFileSync(path, JSON.stringify(k, null, 1));
console.log(`kept ${after} of ${before} pages`);
