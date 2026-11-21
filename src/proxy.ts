import { NextResponse, type NextRequest } from "next/server";

/**
 * Role pages (/for/<role>) and problem pages (/for/<role>/problems/...) were removed on 2026-11-22.
 * They answer 410 Gone so search engines drop them quickly. Role x app pages (/for/<role>/<app>)
 * are kept and are not matched here.
 */
export function proxy(request: NextRequest) {
  const parts = request.nextUrl.pathname.split("/").filter(Boolean);
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
  matcher: ["/for/:role", "/for/:role/problems", "/for/:role/problems/:path*"],
};
