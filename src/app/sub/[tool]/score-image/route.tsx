import { ImageResponse } from "next/og";
import { freeToolBySubdomain } from "@/lib/free-tools/registry";
import { SCORE_SPECS } from "@/lib/free-tools/stats";

/**
 * <tool>.lazur.app/score-image?score=9.2: the card shown when someone shares a score
 * (Open Graph image of the tool page with ?score=). 1200 x 630, Lazur's ink-on-paper look.
 */
export async function GET(request: Request, { params }: { params: Promise<{ tool: string }> }) {
  const tool = freeToolBySubdomain((await params).tool);
  const spec = tool ? SCORE_SPECS[tool.subdomain] : undefined;
  if (!tool || !spec) return new Response("Not found", { status: 404 });
  const raw = Number(new URL(request.url).searchParams.get("score"));
  const score = Number.isFinite(raw) ? Math.min(spec.max, Math.max(spec.min, raw)) : null;
  const shown = score === null ? "?" : `${score}${spec.unit === "%" ? "%" : ` ${spec.unit}`}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f3f1ec", padding: 64, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 34, color: "#1c1917", fontWeight: 700 }}>{tool.name.toLowerCase()}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 40, color: "#6b6560" }}>i scored</div>
          <div style={{ display: "flex", fontSize: 150, color: "#1c1917", fontWeight: 800, letterSpacing: -4 }}>{shown}</div>
          <div style={{ display: "flex", fontSize: 44, color: "#1c1917" }}>can you beat it?</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#6b6560" }}>{tool.subdomain}.lazur.app</div>
          <div style={{ display: "flex", background: "#1c1917", color: "white", borderRadius: 999, padding: "14px 30px", fontSize: 28, fontWeight: 700 }}>free tool by lazur</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
