/**
 * What each AI free tool asks the model. One entry per tool in components/free-tools/ai-config.ts.
 * `kind` says which input the tool needs besides text: a file (image / pdf / audio) or a YouTube link.
 */
export type ToolPrompt = {
  instruction: string;
  /** Which fields (by id) to put into the prompt as labelled text. */
  use: string[];
  youtube?: boolean;
  /** "notes": the answer, then ---NOTES--- and an explanation (only the answer is copied). "options": several answers separated by ---OPTION--- (each gets its own Copy). */
  format?: "notes" | "options";
  /** How much the model thinks first. "minimal" is fastest; "low" for tools that need reasoning. */
  think?: "minimal" | "low";
};

const NOTES = "Put ONLY the answer first, with no labels or headings. Then a line containing exactly ---NOTES--- and after it the explanation.";
const OPTIONS = "Separate the options with a line containing exactly ---OPTION---. No numbering, no labels, no text before the first option or after the last.";

const PLAIN =
  "Reply with only the result. Plain text: no markdown symbols (no ** or # or backticks), no preamble, no closing remarks. Use '• ' for bullets and blank lines between sections.";

export const TOOL_PROMPTS: Record<string, ToolPrompt> = {
  "audio-to-text": { use: [], instruction: `Transcribe this audio word for word. Add punctuation and paragraph breaks. Do not summarize or translate. If there is no speech, reply exactly: No speech found. ${PLAIN}` },
  "voice-note-to-text": { use: [], instruction: `Transcribe this voice note word for word, in the language spoken, with punctuation and paragraph breaks. If there is no speech, reply exactly: No speech found. ${PLAIN}` },
  "audio-to-notes": { use: ["style"], instruction: `Listen to this recording and turn it into clear notes in the requested style. Start with a one-line title. ${PLAIN}` },
  "youtube-transcript": { use: [], youtube: true, instruction: `Give the full transcript of this video, word for word, with punctuation and paragraph breaks. If you cannot access its speech, say so in one sentence. ${PLAIN}` },
  "youtube-summarizer": { use: ["length"], youtube: true, instruction: `Summarize this video in the requested length. Start with a one-line title. Be specific: names, numbers, steps. ${PLAIN}` },
  "image-to-text": { use: [], instruction: `Extract all the text in this image exactly as written, in reading order, keeping line breaks. Output only the text. If there is no text, reply exactly: No text found. ${PLAIN}` },
  "handwriting-to-text": { use: [], instruction: `Read the handwriting in this image and type it out exactly, keeping line breaks. Mark any word you cannot read as [?]. Output only the text. ${PLAIN}` },
  "image-to-excel": { use: [], instruction: "Extract the table in this image as CSV. First row is the header. Wrap any value containing a comma or quote in double quotes. Output only the CSV, nothing else, no code fences." },
  "pdf-to-text": { use: [], instruction: `Extract all the text from this PDF in reading order, keeping paragraphs and headings. For scanned pages, read the text from the image. Output only the text. ${PLAIN}` },
  "chat-with-pdf": { think: "low", use: ["question"], instruction: `Answer the question using only this PDF. Be direct and short. Mention the page number when you can. If the PDF does not contain the answer, say so. ${PLAIN}` },
  "image-to-prompt": { use: ["engine"], instruction: `Write the text prompt that would make the named image AI produce an image like this one. Cover subject, style, lighting, colors, composition and camera or medium. One paragraph, then a line starting 'Negative prompt:' if it suits that engine. ${PLAIN}` },
  "prompt-generator": { use: ["idea", "model"], instruction: `Turn the person's rough idea into a clear, well-structured prompt for the named AI. Include role, task, context, constraints and the output format. Output only the prompt, ready to paste. ${PLAIN}` },
  "excel-formula": { think: "low", use: ["ask", "app"], format: "notes", instruction: `Write the formula for the named app. ${NOTES} The answer is the formula only, on one line, starting with the = sign. The explanation is How it works (2-3 short lines) then Change (the cell references to adjust). ${PLAIN}` },
  "sql-generator": { think: "low", use: ["ask", "schema", "dialect"], format: "notes", instruction: `Write the SQL for the named database. ${NOTES} The answer is the query only. The explanation is how it works in 2-3 short lines, and the table and column names you assumed if no schema was given. ${PLAIN}` },
  "regex-generator": { think: "low", use: ["ask", "sample"], format: "notes", instruction: `Write the regular expression. ${NOTES} The answer is the regex only. The explanation is a short breakdown, the flavor (JavaScript/PCRE) if it matters, and what it matches in the sample text if one was given. ${PLAIN}` },
  "email-reply": { use: ["email", "intent", "tone"], instruction: `Write the reply to this email, saying what the person wants to say, in the requested tone. Start with the greeting, end with a sign-off, no subject line. Keep it as short as the situation allows. ${PLAIN}` },
  "linkedin-message": { use: ["kind", "who", "tone"], format: "options", instruction: `Write the LinkedIn message. For a connection request keep it under 300 characters. Be specific, human and short, no buzzwords, no 'I hope this finds you well'. Write 2 different options. ${OPTIONS} ${PLAIN}` },
  "text-reply": { use: ["msg", "vibe"], format: "options", instruction: `Write 3 different reply options to this message in the requested vibe, each short and natural like a real text. ${OPTIONS} ${PLAIN}` },
  "meeting-minutes": { use: ["transcript"], instruction: `Write clean meeting minutes from the transcript or recording. Sections: Summary (2-3 lines), Key decisions, Action items (owner and deadline if mentioned), Open questions. Never invent names or dates. ${PLAIN}` },
  summarizer: { use: ["text", "length"], instruction: `Summarize the text in the requested length. Keep the important facts, names and numbers. ${PLAIN}` },
  "grammar-checker": { use: ["text"], format: "notes", instruction: `Fix all spelling, grammar, punctuation and clarity mistakes without changing the meaning or voice. ${NOTES} The explanation is a short bullet for each type of fix. If the text is already correct, output it unchanged, then ---NOTES--- and: No changes needed. ${PLAIN}` },
  "paraphrasing-tool": { use: ["text", "mode"], instruction: `Rewrite the text in your own words in the requested style, keeping the meaning and facts. ${PLAIN}` },
  "ai-humanizer": { use: ["text"], instruction: `Rewrite this so it reads like a real person wrote it: varied sentence length, plain words, natural rhythm, no filler phrases like 'delve', 'in today's fast-paced world' or 'it is important to note'. Keep the meaning and facts. ${PLAIN}` },
  "ai-detector": { think: "low", use: ["text"], instruction: `Estimate how likely this text was written by AI. Line 1: 'AI likelihood: X%' (a rough estimate, 0-100). Then 'Why:' with 3 short bullets pointing to specific phrases or patterns. End with: 'This is an estimate. No detector is fully reliable.' ${PLAIN}` },
  "bio-generator": { use: ["platform", "about", "tone"], format: "options", instruction: `Write 3 bio options for the platform, within its length norms, in the requested tone, using only facts from the person's description. ${OPTIONS} ${PLAIN}` },
  "linkedin-headline": { use: ["role", "for"], format: "options", instruction: `Write 5 LinkedIn headlines, each under 220 characters, that say what the person does and for whom. Specific over clever, no 'passionate' or 'guru'. ${OPTIONS} ${PLAIN}` },
  "linkedin-post": { use: ["idea", "style"], instruction: `Write a LinkedIn post in the requested style, 120-220 words. A first line that earns the click, short lines, one idea, a closing line that invites a reply. No hashtag spam (max 3 at the end). ${PLAIN}` },
  "caption-generator": { use: ["about", "platform"], format: "options", instruction: `Write 5 captions for the platform about this photo and description. Vary the style (funny, short, thoughtful, question, bold). Add 3-5 fitting hashtags to each where the platform uses them. ${OPTIONS} ${PLAIN}` },
  "cover-letter": { use: ["job", "resume"], instruction: `Write a cover letter for this job from the resume or background. 250-350 words, specific to the role, using only facts from the resume. Open with a hook, not 'I am writing to apply'. ${PLAIN}` },
  "resignation-letter": { use: ["role", "last", "tone", "extra"], instruction: `Write a resignation letter in the requested tone, with the role, company and last working day. Professional, no drama, no blame. ${PLAIN}` },
};
