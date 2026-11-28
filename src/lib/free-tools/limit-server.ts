import { memoryKV, type KV, type Who } from "./limiter";

/**
 * Local / backstop side of the daily limit. In production the Cloudflare Worker enforces it with
 * KV (edge/src/index.ts). With FREE_TOOLS_LOCAL_LIMIT=1 (set in .env.local) this process enforces
 * the same limit in memory, so the whole flow (3 runs, then sign-up, then 10) works on localhost.
 */
export const localLimitEnabled = () => process.env.FREE_TOOLS_LOCAL_LIMIT === "1";

const g = globalThis as unknown as { __freeToolsKV?: KV };
export const localKV: KV = (g.__freeToolsKV ??= memoryKV());

export function whoFrom(request: Request): { who: Who; setCookie: string | null } {
  const cookie = request.headers.get("cookie") ?? "";
  const existing = /(?:^|;\s*)lz_dev=([A-Za-z0-9-]{8,64})/.exec(cookie)?.[1];
  const dev = existing ?? crypto.randomUUID();
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  return { who: { dev, ip }, setCookie: existing ? null : `lz_dev=${dev}; Path=/; Max-Age=31536000; SameSite=Lax` };
}
