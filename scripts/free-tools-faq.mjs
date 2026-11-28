// Writes FAQ answers for every free tool -> src/lib/free-tools/faq.generated.json
// Run: node scripts/free-tools-faq.mjs [subdomain ...]   (no args = all tools missing answers)
// Needs GEMINI_VERTEX_API_KEY in .env.local. Review the output before shipping.
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const env = Object.fromEntries(readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("=") && !l.startsWith("#")).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]));
const KEY = env.GEMINI_VERTEX_API_KEY;
const MODEL = "gemini-3.1-flash-lite";
const tools = JSON.parse(readFileSync("src/lib/free-tools/data.generated.json", "utf8"));
const out = existsSync("src/lib/free-tools/faq.generated.json") ? JSON.parse(readFileSync("src/lib/free-tools/faq.generated.json", "utf8")) : {};
const only = process.argv.slice(2);

// Tools that use an AI model on Lazur's side (files/text are sent to it). Everything else runs in the browser.
const AI = new Set(["audio-to-text","voice-note-to-text","audio-to-notes","youtube-transcript","youtube-summarizer","image-to-text","handwriting-to-text","image-to-excel","pdf-to-text","chat-with-pdf","image-to-prompt","prompt-generator","excel-formula","sql-generator","regex-generator","email-reply","linkedin-message","text-reply","meeting-minutes","summarizer","grammar-checker","paraphrasing-tool","ai-humanizer","ai-detector","bio-generator","linkedin-headline","linkedin-post","caption-generator","cover-letter","resignation-letter"]);
const SPEECH = new Set(["dictation","voice-typing","pronunciation-checker","voice-recorder"]);

for (const t of tools) {
  if (only.length ? !only.includes(t.subdomain) : out[t.subdomain]) continue;
  const how = AI.has(t.subdomain)
    ? "An AI model (Google Gemini) processes what the visitor adds, on Lazur's servers. Results appear on the page. Nothing is posted anywhere."
    : SPEECH.has(t.subdomain)
      ? "Runs in the browser using the browser's built-in speech recognition (Chrome, Edge and Safari work best; Chrome may send audio to Google's speech service). Lazur does not receive the audio or text."
      : "Runs entirely in the visitor's browser. Nothing is uploaded.";
  const prompt = `Write FAQ answers for a free online tool page.
Tool: ${t.name} (${t.tagline})
How it works: ${how}
Questions (answer each): ${JSON.stringify(t.faq.map((f) => f.q))}
Also add ONE extra question, ${AI.has(t.subdomain) ? "about what happens to the visitor's files or text" : "about privacy or which browsers work"}, with its answer.

Rules for every answer: 35-70 words. Answer in the first sentence. Plain, concrete, no hype, no emojis, no em dashes. Be accurate about this tool only; do not invent features, limits, prices or statistics. If a question has {language} in it, answer generically for any supported language. If a question is about a different product, answer briefly in general terms. Mention Lazur at most once across all answers, only if natural (Lazur is a voice-typing app: hold two keys and talk to type in any app on Mac and Windows).
Return JSON: {"faq":[{"q":"...","a":"..."}]} with the original questions first, in order, then the extra one.`;
  const res = await fetch(`https://aiplatform.googleapis.com/v1/publishers/google/models/${MODEL}:generateContent?key=${KEY}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.4, responseMimeType: "application/json" } }),
  });
  const j = await res.json();
  try {
    const faq = JSON.parse(j.candidates[0].content.parts[0].text).faq;
    out[t.subdomain] = Object.fromEntries(faq.map((f) => [f.q, f.a]));
    console.log("ok", t.subdomain, faq.length);
  } catch (e) {
    console.log("FAIL", t.subdomain, JSON.stringify(j).slice(0, 200));
  }
  writeFileSync("src/lib/free-tools/faq.generated.json", JSON.stringify(out, null, 1));
}
