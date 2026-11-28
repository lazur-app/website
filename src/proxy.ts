import { NextResponse, type NextRequest } from "next/server";
import { freeToolFromHost } from "@/lib/free-tools/host";

/**
 * 1. Role pages (/for/<role>) and problem pages (/for/<role>/problems/...) were removed on
 *    2026-11-22. They answer 410 Gone so search engines drop them quickly. Role x app pages
 *    (/for/<role>/<app>) are kept.
 * 2. Free tools: a request on <tool>.lazur.app is rewritten to the internal /sub/<tool>/... route.
 *    The Cloudflare Worker puts the real hostname in x-forwarded-host. A request that already
 *    starts with /sub/ never went through this rewrite (a rewrite doesn't run the proxy again),
 *    so it is someone typing the internal path on www, and answers 404.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/sub" || pathname.startsWith("/sub/")) {
    return new NextResponse("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  }

  // Files in /public (logo.png, textures, fonts…) are served as they are on every host. Only the
  // per-tool robots.txt and sitemap.xml are rewritten.
  const isFile = /\.[a-z0-9]{2,5}$/i.test(pathname) && pathname !== "/robots.txt" && pathname !== "/sitemap.xml";
  if (isFile) return NextResponse.next();

  const tool = freeToolFromHost(request.headers.get("x-forwarded-host") ?? request.headers.get("host"));
  if (tool) {
    const url = request.nextUrl.clone();
    url.pathname = `/sub/${tool.subdomain}${pathname === "/" ? "" : pathname}`;
    const response = NextResponse.rewrite(url);
    // Only the tools that need the mic or camera get it. Everything else keeps the block.
    const allow = (name: "microphone" | "camera") => (tool.permissions.includes(name) ? "(self)" : "()");
    response.headers.set(
      "Permissions-Policy",
      `camera=${allow("camera")}, microphone=${allow("microphone")}, geolocation=(), interest-cohort=()`,
    );
    return response;
  }

  const parts = pathname.split("/").filter(Boolean);
  const isRolePage = parts.length === 2;
  const isProblemPage = parts.length >= 3 && parts[2] === "problems";
  if (parts[0] === "for" && (isRolePage || isProblemPage)) {
    return new NextResponse("This page has been removed.", {
      status: 410,
      headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }
  return NextResponse.next();
}

export const config = {
  // Everything except Next's own assets, PostHog's /ingest path and the API.
  matcher: ["/((?!_next/|ingest/|api/|favicon|icon|apple-icon).*)"],
};
