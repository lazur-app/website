/**
 * Config for the AI tools. One template (AiTool.tsx) renders all of these: fields in, text out.
 * The server side is src/app/api/free-tools/run/route.ts, which gets `tool` + the fields.
 * Tools that need the browser's own speech engine or no AI at all are separate widgets.
 */
export type AiField = {
  id: string;
  label: string;
  kind: "text" | "textarea" | "select" | "file" | "url";
  placeholder?: string;
  options?: string[];
  accept?: string;
  rows?: number;
  optional?: boolean;
  hint?: string;
  /** Sample input for the "Try an example" button. Falls back to the placeholder when that is a real example. */
  example?: string;
};

export type AiConfig = {
  button: string;
  fields: AiField[];
  /** Output is a CSV the visitor can download (image to Excel). */
  download?: "csv";
  outputLabel?: string;
  /** Heading for the explanation shown under the answer (never copied). */
  notesLabel?: string;
};

const text = (id: string, label: string, placeholder = "", extra: Partial<AiField> = {}): AiField => ({ id, label, kind: "text", placeholder, ...extra });
const area = (id: string, label: string, placeholder = "", rows = 6, extra: Partial<AiField> = {}): AiField => ({ id, label, kind: "textarea", placeholder, rows, ...extra });
const pick = (id: string, label: string, options: string[], extra: Partial<AiField> = {}): AiField => ({ id, label, kind: "select", options, ...extra });
const file = (id: string, label: string, accept: string, extra: Partial<AiField> = {}): AiField => ({ id, label, kind: "file", accept, ...extra });

export const AI_TOOLS: Record<string, AiConfig> = {
  "audio-to-text": { button: "Transcribe", fields: [file("file", "Audio or video file", "audio/*,video/*", { hint: "MP3, WAV, M4A, MP4… up to 25 MB" })] },
  "voice-note-to-text": { button: "Read my voice note", fields: [file("file", "Voice note", "audio/*,.opus,.ogg,.m4a", { hint: "Export it from WhatsApp, then drop it here" })] },
  "audio-to-notes": { button: "Make notes", fields: [file("file", "Recording", "audio/*,video/*"), pick("style", "Notes style", ["Short summary + bullet points", "Detailed notes", "Action items only"])] },
  "youtube-transcript": { button: "Get transcript", fields: [{ id: "url", label: "YouTube link", kind: "url", placeholder: "https://www.youtube.com/watch?v=…", example: "https://www.youtube.com/watch?v=jNQXAC9IVRw" }] },
  "youtube-summarizer": { button: "Summarize video", fields: [{ id: "url", label: "YouTube link", kind: "url", placeholder: "https://www.youtube.com/watch?v=…", example: "https://www.youtube.com/watch?v=jNQXAC9IVRw" }, pick("length", "Length", ["Key points", "One paragraph", "Detailed"])] },
  "image-to-text": { button: "Extract text", fields: [file("file", "Screenshot or photo", "image/*", { hint: "PNG, JPG, WebP" })] },
  "handwriting-to-text": { button: "Read handwriting", fields: [file("file", "Photo of your notes", "image/*")] },
  "image-to-excel": { button: "Make spreadsheet", download: "csv", outputLabel: "Table (CSV)", fields: [file("file", "Picture of a table", "image/*")] },
  "pdf-to-text": { button: "Extract text", fields: [file("file", "PDF", "application/pdf", { hint: "Scanned PDFs work too" })] },
  "chat-with-pdf": { button: "Ask", fields: [file("file", "PDF", "application/pdf"), text("question", "Your question", "What is the notice period in this contract?")] },
  "image-to-prompt": { button: "Get the prompt", fields: [file("file", "Image", "image/*"), pick("engine", "For", ["Midjourney", "DALL·E", "Stable Diffusion", "Any image AI"])] },
  "prompt-generator": { button: "Write my prompt", fields: [area("idea", "Your idea, as messy as you like", "I want ChatGPT to help me plan a week of healthy meals on a budget…", 5), pick("model", "Writing for", ["ChatGPT", "Claude", "Gemini", "Any AI"])] },
  "excel-formula": { notesLabel: "How it works", button: "Get the formula", fields: [area("ask", "What do you want it to do?", "Sum column C where column A says Paid and the date is this month", 4), pick("app", "App", ["Excel", "Google Sheets"])] },
  "sql-generator": { notesLabel: "How it works", button: "Write the SQL", fields: [area("ask", "What do you need?", "Customers who ordered more than 3 times in the last 30 days", 4), area("schema", "Table names and columns (optional)", "customers(id, name), orders(id, customer_id, created_at)", 3, { optional: true }), pick("dialect", "Database", ["PostgreSQL", "MySQL", "SQL Server", "SQLite", "BigQuery"])] },
  "regex-generator": { notesLabel: "How it works", button: "Make the regex", fields: [area("ask", "Describe the pattern", "Match Indian phone numbers with optional +91", 3), area("sample", "Sample text to test on (optional)", "", 3, { optional: true })] },
  "email-reply": { button: "Write my reply", fields: [area("email", "The email you got", "Paste it here", 6, { example: "Hi, can we move tomorrow's call to Friday? I'm stuck in a client meeting. Thanks, Sam" }), text("intent", "What do you want to say?", "Say yes but push the deadline to Friday"), pick("tone", "Tone", ["Friendly", "Professional", "Short and direct", "Apologetic"])] },
  "linkedin-message": { button: "Write the message", fields: [pick("kind", "Type", ["Connection request", "Follow-up", "Cold outreach", "Thank you", "Asking for a referral"]), area("who", "Who is it to and why?", "A recruiter at Stripe, I'm a backend engineer", 3), pick("tone", "Tone", ["Warm", "Professional", "Casual"])] },
  "text-reply": { button: "Write the reply", fields: [area("msg", "The message you got", "Paste it here", 4, { example: "are we still on for dinner tonight? let me know by 5" }), pick("vibe", "Vibe", ["Friendly", "Funny", "Flirty", "Polite no", "Firm", "Apology"])] },
  "meeting-minutes": { button: "Make minutes", fields: [area("transcript", "Transcript or notes", "Paste it here, or upload a recording below", 8, { optional: true, example: "Priya: Launch is Friday. Rahul: Design is done, QA needs two more days. Priya: Then we ship Monday. Rahul, please send the final checklist by Thursday. Sam: I will update the customers." }), file("file", "Or a recording", "audio/*,video/*", { optional: true })] },
  summarizer: { button: "Summarize", fields: [area("text", "Text", "Paste the long text here", 9, { example: "Remote work has changed how companies hire. Teams can now recruit from anywhere, which widens the talent pool but also increases competition for the best people. Managers say the hardest part is not productivity but communication: decisions that once happened in a hallway now need a written trail. Many firms respond by writing more documents and holding fewer meetings, and early data suggests this makes new hires productive faster." }), pick("length", "Length", ["Short", "Medium", "Bullet points"])] },
  "grammar-checker": { notesLabel: "What changed", button: "Fix my text", fields: [area("text", "Text", "Paste your text here", 9, { example: "i has went to the store yesterday and buyed three apple, there was no bananas so me and my freind goes home early" })] },
  "paraphrasing-tool": { button: "Rewrite", fields: [area("text", "Text", "Paste your text here", 8, { example: "The quarterly results were better than expected, mainly because of a strong increase in online sales during the holiday period." }), pick("mode", "Style", ["Standard", "Simple", "More professional", "Shorter", "Creative"])] },
  "ai-humanizer": { button: "Humanize", fields: [area("text", "AI-written text", "Paste it here", 9, { example: "In today's fast-paced world, it is important to note that leveraging innovative solutions can significantly enhance productivity and foster meaningful collaboration across teams." })] },
  "ai-detector": { button: "Check", outputLabel: "Result", fields: [area("text", "Text to check", "Paste at least 100 words", 9, { example: "In today's fast-paced digital landscape, it is crucial to note that effective communication serves as a cornerstone of organizational success. By leveraging cutting-edge strategies, businesses can foster synergy, streamline workflows, and unlock their full potential." })] },
  "bio-generator": { button: "Write my bio", fields: [pick("platform", "Platform", ["Instagram", "LinkedIn", "Twitter / X", "TikTok", "Personal website", "Dating app"]), area("about", "About you", "Photographer in Mumbai, love street food, cat person", 4), pick("tone", "Tone", ["Professional", "Playful", "Minimal", "Bold"])] },
  "linkedin-headline": { button: "Write headlines", fields: [text("role", "What you do", "Product designer for fintech apps"), text("for", "Who you help or want to impress (optional)", "Startups, recruiters", { optional: true })] },
  "linkedin-post": { button: "Write the post", fields: [area("idea", "Your idea", "I got rejected 40 times before my first job offer", 4), pick("style", "Style", ["Story", "Lesson learned", "Hot take", "How-to list", "Announcement"])] },
  "caption-generator": { button: "Write captions", fields: [file("file", "Photo (optional)", "image/*", { optional: true }), text("about", "Or describe it", "Sunset at the beach with friends", { optional: true }), pick("platform", "For", ["Instagram", "LinkedIn", "TikTok", "Facebook", "X"])] },
  "cover-letter": { button: "Write my cover letter", fields: [area("job", "The job post", "Paste the job description", 6, { example: "Product Designer at Acme. You will design onboarding flows, run user research and work with engineers to ship weekly. 3+ years of experience, Figma, strong communication." }), area("resume", "Your resume or background", "Paste your resume or a few lines about you", 6, { example: "4 years as a designer at a fintech startup. Redesigned onboarding, lifting activation by 18%. Ran 30+ user interviews. Skilled in Figma, prototyping and design systems." })] },
  "resignation-letter": { button: "Write my letter", fields: [text("role", "Your role and company", "Senior designer at Acme"), text("last", "Last working day", "30 December"), pick("tone", "Tone", ["Warm and grateful", "Short and formal", "Neutral"]), text("extra", "Anything to add (optional)", "Happy to help with the handover", { optional: true })] },
};
