// Cloudflare Worker in front of the Lazur sites on Google Cloud Run.
// - www.lazur.app and admin.lazur.app are proxied to their Cloud Run services
//   (Cloud Run only answers on its own *.run.app host).
// - Every other Lazur hostname gets a permanent redirect to www.lazur.app (as on Vercel).
// - The visitor's country is passed on so /api/pricing-region keeps working.
// - /api/free-tools/* (the free AI tools) goes through the daily limit below: 3 runs a day per device,
//   10 after an email. Sign-ups are saved in KV under e:<email>.

import { checkFeedback, claimPass, consume, refund, signUp, standing, type KV } from "../../src/lib/free-tools/limiter";
import { readStats, recordScore } from "../../src/lib/free-tools/stats";
import { TOOL_SUBDOMAINS } from "./tool-subdomains";

interface Env {
  /** Free-tool limits and sign-ups (KV namespace "lazur-free-tools"). */
  LIMITS: KV;
  /** Lazur backend, asked whether an email has sent feedback from the app (20-day pass). */
  LAZUR_API: string;
  /** Shared with the backend (FREE_TOOLS_INTERNAL_KEY there). Set with the Cloudflare API, never in code. */
  FREE_TOOLS_INTERNAL_KEY?: string;
}

const CANONICAL_HOST = "www.lazur.app";

const PASSTHROUGH_HOSTS = new Set(["images.lazur.app", "releases.lazur.app"]);

const WEBSITE_ORIGIN = "https://lazur-website-v2w4wqf5qa-uc.a.run.app";

const ORIGINS: Record<string, string> = {
  "www.lazur.app": WEBSITE_ORIGIN,
  "admin.lazur.app": "https://lazur-admin-v2w4wqf5qa-uc.a.run.app",
  "api.lazur.app": "https://lazur-api-632291817180.asia-northeast1.run.app",
  // Free tools: the website's src/proxy.ts reads x-forwarded-host and serves the tool.
  ...Object.fromEntries(TOOL_SUBDOMAINS.map((s) => [`${s}.lazur.app`, WEBSITE_ORIGIN])),
};

export default {
  async fetch(request: Request, env: Env, ctx: { waitUntil(p: Promise<unknown>): void }): Promise<Response> {
    const url = new URL(request.url);
    const origin = ORIGINS[url.hostname];

    // Other lazur.app hosts with their own Cloudflare setup (images and releases are R2). The wildcard
    // route also matches them, so let them through untouched instead of redirecting.
    if (PASSTHROUGH_HOSTS.has(url.hostname)) return fetch(request);

    if (!origin) {
      url.protocol = "https:";
      url.hostname = CANONICAL_HOST;
      url.port = "";
      return Response.redirect(url.toString(), 308);
    }

    const target = new URL(url.pathname + url.search, origin);
    const headers = new Headers(request.headers);
    const country = (request as Request & { cf?: { country?: string } }).cf?.country;
    if (country) headers.set("x-country-code", country);
    headers.set("x-forwarded-host", url.hostname);
    headers.set("x-forwarded-proto", "https");
    headers.delete("host");

    const forward = async (): Promise<Response> => {
      const upstream = await fetch(target.toString(), {
        method: request.method,
        headers,
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
        redirect: "manual",
      });

      // Keep redirects on our own domain instead of the run.app address.
      const location = upstream.headers.get("location");
      if (location && location.startsWith(origin)) {
        const response = new Response(upstream.body, upstream);
        response.headers.set("location", `https://${url.hostname}${location.slice(origin.length)}`);
        return response;
      }
      return upstream; // also passes WebSocket upgrades (101) straight through
    };

    if (url.pathname.startsWith("/api/free-tools/")) return freeTools(request, env, url, forward);
    if (TOOL_HOSTS.has(url.hostname)) return cachedToolPage(request, url, forward, ctx);
    return forward();
  },

};

const TOOL_HOSTS = new Set(TOOL_SUBDOMAINS.map((s) => `${s}.lazur.app`));

/**
 * Free-tool pages are the same for everyone, so their HTML is cached at Cloudflare's edge for
 * 10 minutes: visitors get it from a nearby data centre instead of waiting on Cloud Run in the US.
 * Only plain GETs of HTML that set no cookie; the key is the full URL, so a shared ?score link
 * gets its own copy. API calls and Next's data requests are never cached.
 */
async function cachedToolPage(request: Request, url: URL, forward: () => Promise<Response>, ctx: { waitUntil(p: Promise<unknown>): void }): Promise<Response> {
  const isPage = request.method === "GET" && !url.pathname.startsWith("/api/") && !url.pathname.startsWith("/_next/") && !request.headers.has("rsc") && !url.searchParams.has("_rsc");
  if (!isPage) return forward();
  const cache = (caches as unknown as { default: Cache }).default;
  const key = new Request(url.toString(), { method: "GET" });
  const hit = await cache.match(key);
  if (hit) return hit;
  const res = await forward();
  if (res.status !== 200 || !(res.headers.get("content-type") ?? "").includes("text/html") || res.headers.has("set-cookie")) return res;
  const out = new Response(res.body, res);
  out.headers.set("cache-control", "public, max-age=0, s-maxage=600");
  ctx.waitUntil(cache.put(key, out.clone()));
  return out;
}

const COOKIE = "lz_dev"; // also named in the cookie regex below
const json = (body: unknown, status = 200, headers: Record<string, string> = {}) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

/** The daily limit for the free AI tools. See src/lib/free-tools/limiter.ts for the rules. */
async function freeTools(request: Request, env: Env, url: URL, forward: () => Promise<Response>): Promise<Response> {
  const cookie = request.headers.get("cookie") ?? "";
  const existing = /(?:^|;\s*)lz_dev=([A-Za-z0-9-]{8,64})/.exec(cookie)?.[1];
  const dev = existing ?? crypto.randomUUID();
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const country = (request as Request & { cf?: { country?: string } }).cf?.country;
  const who = { dev, ip };
  // One cookie for every *.lazur.app tool, so the limit follows the visitor from tool to tool.
  const setCookie = existing ? null : `${COOKIE}=${dev}; Domain=.lazur.app; Path=/; Max-Age=31536000; Secure; HttpOnly; SameSite=Lax`;
  const finish = (res: Response) => {
    const out = new Response(res.body, res);
    if (setCookie) out.headers.append("set-cookie", setCookie);
    return out;
  };
  const path = url.pathname;

  if (path === "/api/free-tools/status" && request.method === "GET") {
    const s = await standing(env.LIMITS, who);
    return finish(json({ left: s.left, limit: s.limit, unlocked: s.unlocked, stage: s.stage, email: s.email, passUntil: s.passUntil }, 200, { "cache-control": "no-store" }));
  }

  if (path === "/api/free-tools/signup" && request.method === "POST") {
    const body = (await request.json().catch(() => ({}))) as { email?: string; tool?: string };
    const r = await signUp(env.LIMITS, who, String(body.email ?? ""), String(body.tool ?? "").slice(0, 60), { country });
    return finish(json(r.ok ? { ok: true, left: r.left } : { ok: false, message: r.message }, r.ok ? 200 : 400, { "cache-control": "no-store" }));
  }

  if (path === "/api/free-tools/score") {
    const tool = url.searchParams.get("tool") ?? "";
    if (request.method === "POST") {
      const body = (await request.json().catch(() => ({}))) as { tool?: string; value?: number };
      await recordScore(env.LIMITS, String(body.tool ?? ""), Number(body.value), dev);
      const st = await readStats(env.LIMITS, String(body.tool ?? ""));
      return finish(json(st ?? { message: "Unknown tool." }, st ? 200 : 400, { "cache-control": "no-store" }));
    }
    const st = await readStats(env.LIMITS, tool);
    return finish(json(st ?? { message: "Unknown tool." }, st ? 200 : 400, { "cache-control": "public, max-age=300" }));
  }

  if (path === "/api/free-tools/claim" && request.method === "POST") {
    const r = await claimPass(env.LIMITS, who, (email) => checkFeedback(email, env.LAZUR_API, env.FREE_TOOLS_INTERNAL_KEY));
    return finish(json(r, r.ok ? 200 : 400, { "cache-control": "no-store" }));
  }

  if (path === "/api/free-tools/run" && request.method === "POST") {
    const c = await consume(env.LIMITS, who);
    if (!c.ok) {
      return finish(
        json(
          { limit: true, unlocked: c.unlocked, stage: c.stage, email: c.email, message: "You've used your free runs for today." },
          429,
          { "x-free-uses-left": "0", "cache-control": "no-store" },
        ),
      );
    }
    const upstream = await forward();
    // A failed run doesn't cost the visitor one.
    if (!upstream.ok) await refund(env.LIMITS, who);
    const out = new Response(upstream.body, upstream);
    out.headers.set("x-free-uses-left", String(upstream.ok ? c.left : c.left + 1));
    out.headers.set("cache-control", "no-store");
    return finish(out);
  }

  return forward();
}
