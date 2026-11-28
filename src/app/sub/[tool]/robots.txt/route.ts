import { toolOrigin } from "@/lib/free-tools/host";
import { freeToolBySubdomain } from "@/lib/free-tools/registry";

/** robots.txt for <tool>.lazur.app (the proxy rewrites /robots.txt here). */
export async function GET(_req: Request, { params }: { params: Promise<{ tool: string }> }) {
  const tool = freeToolBySubdomain((await params).tool);
  if (!tool) return new Response("Not found", { status: 404 });
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${toolOrigin(tool.subdomain)}/sitemap.xml\n`, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
