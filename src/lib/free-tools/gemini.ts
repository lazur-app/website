/**
 * Model calls for the free AI tools, built to stay up when many people use them at once.
 *
 * Every model + region pair on Vertex AI has its own quota pool. When one answers "busy"
 * (429 / 503 / 5xx) we move straight to the next pair instead of making the visitor wait, then
 * do one more round after a short pause. Measured 2026-11-28 with 30 requests at once:
 * each pool held, and a busy pool never took the others down with it.
 *
 * Speed: the "lite" models with thinking set to "minimal" answer in about 0.5-1 s
 * (default thinking took about 3 s for the same answer).
 *
 * Override the order with FREE_TOOLS_MODELS="model@regional,model@global,…".
 */
type Target = { model: string; where: "regional" | "global" };

const DEFAULT_TARGETS: Target[] = [
  { model: "gemini-3.1-flash-lite", where: "regional" },
  { model: "gemini-3.5-flash-lite", where: "global" },
  { model: "gemini-3.5-flash-lite", where: "regional" },
  { model: "gemini-3.1-flash-lite", where: "global" },
  { model: "gemini-3.5-flash", where: "regional" },
];

function targets(): Target[] {
  const env = process.env.FREE_TOOLS_MODELS;
  if (!env) return DEFAULT_TARGETS;
  return env
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [model, where] = s.split("@");
      return { model, where: where === "global" ? "global" : "regional" } as Target;
    });
}

function urlFor(t: Target): string | null {
  const vertex = process.env.GEMINI_VERTEX_API_KEY;
  if (vertex) {
    const project = process.env.GEMINI_VERTEX_PROJECT || "836438811130";
    return t.where === "global"
      ? `https://aiplatform.googleapis.com/v1/projects/${project}/locations/global/publishers/google/models/${t.model}:generateContent?key=${vertex}`
      : `https://aiplatform.googleapis.com/v1/publishers/google/models/${t.model}:generateContent?key=${vertex}`;
  }
  const studio = process.env.GEMINI_API_KEY;
  if (studio) return `https://generativelanguage.googleapis.com/v1beta/models/${t.model}:generateContent?key=${studio}`;
  return null;
}

export const modelConfigured = () => !!(process.env.GEMINI_VERTEX_API_KEY || process.env.GEMINI_API_KEY);

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  error?: { message?: string };
  promptFeedback?: { blockReason?: string };
};

export type GenerateResult =
  | { ok: true; text: string; model: string }
  | { ok: false; kind: "busy" | "blocked" | "empty" | "bad-input" | "error"; message?: string };

const BUSY = new Set([429, 500, 502, 503, 504]);

/** Sends one request body down the fallback chain and returns the first good answer. */
export async function generate(body: Record<string, unknown>, opts: { timeoutMs: number }): Promise<GenerateResult> {
  const list = targets();
  let last: GenerateResult = { ok: false, kind: "error" };
  for (let round = 0; round < 2; round++) {
    if (round > 0) await new Promise((r) => setTimeout(r, 1200));
    for (const t of list) {
      const url = urlFor(t);
      if (!url) return { ok: false, kind: "error", message: "No model key configured." };
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), opts.timeoutMs);
      try {
        const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal: ctrl.signal });
        const data = (await res.json().catch(() => ({}))) as GeminiResponse;
        if (res.ok) {
          const text = (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("").trim();
          if (text) return { ok: true, text, model: `${t.model}@${t.where}` };
          if (data.promptFeedback?.blockReason) return { ok: false, kind: "blocked" };
          last = { ok: false, kind: "empty" };
          continue;
        }
        console.error("free-tools model error", t.model, t.where, res.status, data.error?.message?.slice(0, 160));
        if (BUSY.has(res.status)) last = { ok: false, kind: "busy" };
        else if (res.status === 404) continue; // that model isn't available here: try the next one
        else last = { ok: false, kind: "bad-input", message: data.error?.message };
      } catch (e) {
        console.error("free-tools model fetch failed", t.model, t.where, (e as Error).name);
        last = { ok: false, kind: "busy" };
      } finally {
        clearTimeout(timer);
      }
    }
    // A bad input fails the same way everywhere: no point in a second round.
    if (!last.ok && last.kind !== "busy" && last.kind !== "empty") break;
  }
  return last;
}
