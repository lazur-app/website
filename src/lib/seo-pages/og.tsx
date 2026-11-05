import { readFile } from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Open Graph card for every programmatic page: Lazur's notch and listening capsule over the warm
 * off-white, the kicker and the page title. Rendered by Next on demand and cached.
 */
export async function renderSeoOg({ kicker, title }: { kicker: string; title: string }) {
  const fontDir = path.join(process.cwd(), "src/fonts/open-sauce-one");
  const [bold, medium] = await Promise.all([
    readFile(path.join(fontDir, "OpenSauceOne-Bold.ttf")),
    readFile(path.join(fontDir, "OpenSauceOne-Medium.ttf")),
  ]);
  const size = title.length > 70 ? 54 : title.length > 45 ? 64 : 76;
  const bars = [0.35, 0.7, 1, 0.55, 0.9, 0.45, 0.8, 0.6, 0.3];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fffdfb",
          position: "relative",
          fontFamily: "OpenSauce",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -200,
            width: 760,
            height: 760,
            borderRadius: 760,
            background: "radial-gradient(circle, rgba(168,85,247,0.22) 0%, rgba(107,75,252,0.10) 40%, rgba(255,253,251,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -200,
            bottom: -300,
            width: 700,
            height: 700,
            borderRadius: 700,
            background: "radial-gradient(circle, rgba(249,115,22,0.16) 0%, rgba(255,253,251,0) 70%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <div style={{ width: 230, height: 40, background: "#0b0b0c", borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }} />
          <div
            style={{
              marginTop: 14,
              width: 190,
              height: 52,
              borderRadius: 52,
              background: "white",
              border: "2px solid rgba(129,140,248,0.4)",
              boxShadow: "0 8px 30px rgba(99,102,241,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 26 * h,
                  borderRadius: 6,
                  background: "linear-gradient(180deg, #6b4bfc, #a855f7, #f97316)",
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "40px 80px 0", flex: 1 }}>
          <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: 4, textTransform: "uppercase", color: "#a8a29e" }}>{kicker}</div>
          <div style={{ marginTop: 18, fontSize: size, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, color: "#1c1917", maxWidth: 1040 }}>
            {title}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 80px 48px", fontSize: 26, color: "#6b6560" }}>
          <div style={{ display: "flex", fontWeight: 700, color: "#1c1917", fontSize: 32 }}>Lazur</div>
          <div style={{ display: "flex" }}>Hold a key and ask. lazur.app</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "OpenSauce", data: bold, weight: 700, style: "normal" },
        { name: "OpenSauce", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
