import { toolOrigin } from "@/lib/free-tools/host";
import { freeToolBySubdomain } from "@/lib/free-tools/registry";

/** sitemap.xml for <tool>.lazur.app (the proxy rewrites /sitemap.xml here). */
export async function GET(_req: Request, { params }: { params: Promise<{ tool: string }> }) {
  const tool = freeToolBySubdomain((await params).tool);
  if (!tool) return new Response("Not found", { status: 404 });
  const origin = toolOrigin(tool.subdomain);
  const urls = [origin, ...tool.pages.map((p) => `${origin}/${p.slug}`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
