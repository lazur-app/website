import { NextResponse } from "next/server";
import { AI_TOOLS } from "@/components/free-tools/ai-config";
import { localKV, localLimitEnabled, whoFrom } from "@/lib/free-tools/limit-server";
import { consume, refund } from "@/lib/free-tools/limiter";
import { generate, modelConfigured } from "@/lib/free-tools/gemini";
import { TOOL_PROMPTS } from "@/lib/free-tools/prompts";

/**
 * Where every AI free-tool request lands. Gemini does the work.
 * The daily limit (3 free runs, 10 after an email) is enforced in the Cloudflare Worker (edge/src/index.ts).
 * With FREE_TOOLS_LOCAL_LIMIT=1 this route enforces it too (localhost). The in-memory guard below is
 * only a backstop against abuse that skips the Worker (the run.app address).
 */
export const maxDuration = 120;

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_TEXT_CHARS = 60_000;

/** Temporary guard: 40 requests per hour per IP, per server instance. Replaced by real limits. */
const hits = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 40;
}


const BY_EXT: Record<string, string> = {
  wav: "audio/wav", mp3: "audio/mp3", m4a: "audio/mp4", aac: "audio/aac", ogg: "audio/ogg", opus: "audio/ogg", flac: "audio/flac", weba: "audio/webm",
  mp4: "video/mp4", mov: "video/quicktime", webm: "video/webm", mpeg: "video/mpeg",
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", webp: "image/webp", heic: "image/heic", gif: "image/png",
  pdf: "application/pdf",
};
const OK_PREFIX = /^(audio|video|image)\/|^application\/pdf$/;

/** The browser's file type when it's usable, else a guess from the extension. */
function mimeFor(file: File) {
  const t = file.type.toLowerCase();
  if (OK_PREFIX.test(t)) return t === "audio/x-m4a" ? "audio/mp4" : t === "audio/mpeg" ? "audio/mp3" : t;
  return BY_EXT[file.name.split(".").pop()?.toLowerCase() ?? ""] ?? null;
}

/** Splits an answer into what gets copied and what is only shown (see prompts.ts). */
function shape(out: string, format?: "notes" | "options") {
  if (format === "notes") {
    const parts = out.split(/\n?[ \t]*---NOTES---[ \t]*\n?/);
    let main = parts[0];
    let notes = parts.slice(1).join("\n");
    if (!notes) {
      // The model skipped the divider: split before its own "Changes:" / "How it works:" heading.
      const m = /\n\s*(Changes|How it works)\s*:/i.exec(out);
      if (m) {
        main = out.slice(0, m.index);
        notes = out.slice(m.index);
      }
    }
    return { text: main.trim(), notes: notes.trim() || undefined };
  }
  if (format === "options") {
    const options = out
      .split(/\n?[ \t]*---OPTION---[ \t]*\n?/)
      .map((o) => o.replace(/^\s*(?:option\s*)?\d+\s*[.):-]\s*/i, "").trim())
      .filter(Boolean);
    if (options.length > 1) return { text: options.join("\n\n"), options };
  }
  return { text: out };
}

const fail = (message: string, status = 400) => NextResponse.json({ message }, { status });

async function run(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (tooMany(ip)) return fail("You're going a bit fast. Try again in a few minutes.", 429);

  const form = await request.formData().catch(() => null);
  const tool = String(form?.get("tool") ?? "");
  const config = AI_TOOLS[tool];
  const spec = TOOL_PROMPTS[tool];
  if (!form || !config || !spec) return fail("Unknown tool.");

  if (!modelConfigured()) return fail("This tool isn't switched on yet.", 503);

  const parts: Record<string, unknown>[] = [];
  let text = "";
  for (const id of spec.use) {
    const field = config.fields.find((f) => f.id === id);
    const value = String(form.get(id) ?? "").trim();
    if (field && value) text += `${field.label}: ${value.slice(0, MAX_TEXT_CHARS)}\n\n`;
  }

  if (spec.youtube) {
    const link = String(form.get("url") ?? "").trim();
    if (!/^https?:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//i.test(link)) return fail("Paste a YouTube link, like https://www.youtube.com/watch?v=…");
    parts.push({ fileData: { fileUri: link, mimeType: "video/mp4" } });
  }

  for (const f of config.fields.filter((f) => f.kind === "file")) {
    const file = form.get(f.id);
    if (file instanceof File && file.size > 0) {
      if (file.size > MAX_FILE_BYTES) return fail("That file is too big. The limit is 15 MB.");
      const mime = mimeFor(file);
      if (!mime) return fail("That file type isn't supported here.");
      parts.push({ inlineData: { mimeType: mime, data: Buffer.from(await file.arrayBuffer()).toString("base64") } });
    }
  }

  const needsInput = !spec.youtube && parts.length === 0 && !text.trim();
  if (needsInput) return fail("Add something first, then try again.");

  const body = {
    systemInstruction: { parts: [{ text: spec.instruction }] },
    contents: [{ role: "user", parts: [...parts, { text: text.trim() || "Go." }] }],
    // "minimal" thinking answers in about a second; tools that reason (SQL, regex…) get a little more.
    generationConfig: { temperature: 0.5, maxOutputTokens: 8192, thinkingConfig: { thinkingLevel: spec.think ?? "minimal" } },
  };

  const hasMedia = parts.length > 0;
  const r = await generate(body, { timeoutMs: hasMedia ? 90_000 : 25_000 });
  if (r.ok) return NextResponse.json(shape(r.text, spec.format));
  if (r.kind === "busy") return fail("We're getting a lot of visitors right now. Please try again in a few seconds. This run won't count.", 503);
  if (r.kind === "blocked") return fail("That input can't be processed.", 422);
  if (r.kind === "empty") return fail("Nothing came back. Try a different input.", 502);
  return fail(spec.youtube ? "Couldn't read that video. Check the link is public and try again." : "The AI couldn't handle that input. Please try something else.", 502);
}

export async function POST(request: Request) {
  if (!localLimitEnabled()) return run(request);
  const { who, setCookie } = whoFrom(request);
  const c = await consume(localKV, who);
  const finish = (res: NextResponse) => {
    if (setCookie) res.headers.append("set-cookie", setCookie);
    return res;
  };
  if (!c.ok) {
    return finish(
      NextResponse.json(
        { limit: true, unlocked: c.unlocked, stage: c.stage, email: c.email, message: "You've used your free runs for today." },
        { status: 429, headers: { "x-free-uses-left": "0" } },
      ),
    );
  }
  const res = await run(request);
  const ok = res.ok;
  if (!ok) await refund(localKV, who);
  const out = new NextResponse(res.body, res);
  out.headers.set("x-free-uses-left", String(ok ? c.left : c.left + 1));
  return finish(out);
}
