import { freeToolBySubdomain, type FreeTool } from "./registry";

/**
 * Which free tool a request is for, from its hostname. The Cloudflare Worker sets
 * x-forwarded-host to the visitor's real host. Locally, use mic-test.localhost:3000 or send an
 * x-forwarded-host header. Returns null for www, admin and any unknown host.
 */
export function freeToolFromHost(host: string | null | undefined): FreeTool | null {
  if (!host) return null;
  const name = host.split(":")[0].toLowerCase();
  const m = name.match(/^([a-z0-9-]+)\.(?:lazur\.app|localhost)$/);
  if (!m) return null;
  return freeToolBySubdomain(m[1]) ?? null;
}

export const toolOrigin = (subdomain: string) => `https://${subdomain}.lazur.app`;
