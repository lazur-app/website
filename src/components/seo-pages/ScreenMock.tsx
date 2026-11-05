import type { DemoShell, LazurDemo } from "@/lib/seo-pages/types";

/**
 * A Mac app window drawn in code, in the style of each kind of app. It shows what Lazur does:
 * a coral circle and label around the thing it points at, or the text it writes at the cursor.
 * Drawn, not screenshotted, so it is crisp, tiny, and never claims to be a real app's UI.
 */

const TOOLBARS: Record<DemoShell, string[]> = {
  sheet: ["Home", "Insert", "Draw", "Formulas", "Data", "Review"],
  design: ["Move", "Frame", "Shape", "Text", "Comment"],
  doc: ["File", "Edit", "Insert", "Format", "Tools"],
  mail: ["Send", "Attach", "Format", "Schedule"],
  slack: ["Home", "DMs", "Activity", "Later"],
  code: ["Explorer", "Search", "Source Control", "Run"],
  chat: ["New chat", "Search", "Projects"],
  generic: ["File", "Edit", "View", "Window", "Help"],
};

const TONE: Record<DemoShell, { bar: string; body: string; ink: string; dim: string; dark?: boolean }> = {
  sheet: { bar: "#1f7a4d", body: "#ffffff", ink: "#1c1917", dim: "#e7e5e4" },
  design: { bar: "#2c2c2c", body: "#f5f5f5", ink: "#1c1917", dim: "#e5e5e5" },
  doc: { bar: "#f7f4ef", body: "#ffffff", ink: "#1c1917", dim: "#ece7e0" },
  mail: { bar: "#f6f8fc", body: "#ffffff", ink: "#202124", dim: "#e8eaed" },
  slack: { bar: "#3f0e40", body: "#1a1d21", ink: "#d1d2d3", dim: "#2b2e33", dark: true },
  code: { bar: "#181818", body: "#1f1f1f", ink: "#cccccc", dim: "#2a2a2a", dark: true },
  chat: { bar: "#ffffff", body: "#ffffff", ink: "#1c1917", dim: "#f0eeeb" },
  generic: { bar: "#f3f1ee", body: "#ffffff", ink: "#1c1917", dim: "#ece9e4" },
};

function Dots() {
  return (
    <span className="flex gap-1.5" aria-hidden>
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
    </span>
  );
}

function Body({ shell, tone }: { shell: DemoShell; tone: (typeof TONE)[DemoShell] }) {
  if (shell === "sheet") {
    return (
      <div className="grid grid-cols-[28px_repeat(5,1fr)] text-[10px]" aria-hidden>
        {Array.from({ length: 36 }).map((_, i) => {
          const row = Math.floor(i / 6);
          const col = i % 6;
          const head = row === 0 || col === 0;
          const label = row === 0 ? (col === 0 ? "" : "ABCDE"[col - 1]) : col === 0 ? String(row) : "";
          return (
            <span
              key={i}
              className="h-5 border-b border-r px-1 leading-5"
              style={{ borderColor: tone.dim, background: head ? "#f5f5f4" : row === 1 ? "#ecfdf5" : "#fff", color: "#78716c" }}
            >
              {label || (row > 1 && col > 0 ? <span className="inline-block h-1.5 rounded bg-stone-200" style={{ width: `${30 + ((i * 17) % 60)}%` }} /> : null)}
            </span>
          );
        })}
      </div>
    );
  }
  if (shell === "design") {
    return (
      <div className="flex h-full gap-2 p-2" aria-hidden>
        <div className="w-14 space-y-1.5 rounded bg-white p-1.5">
          {[70, 55, 80, 45].map((w) => (
            <span key={w} className="block h-1.5 rounded bg-stone-200" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="relative flex-1 rounded bg-[#e5e5e5]">
          <span className="absolute left-[18%] top-[18%] h-[52%] w-[46%] rounded-md border-2 border-[#0d99ff] bg-white" />
        </div>
        <div className="w-14 space-y-1.5 rounded bg-white p-1.5">
          {[60, 85, 50].map((w) => (
            <span key={w} className="block h-1.5 rounded bg-stone-200" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-2 p-4" aria-hidden>
      {[92, 84, 96, 60, 88, 72].map((w, i) => (
        <span key={i} className="block h-2 rounded" style={{ width: `${w}%`, background: tone.dim }} />
      ))}
    </div>
  );
}

export function ScreenMock({ demo, appName }: { demo: LazurDemo; appName: string }) {
  const shell: DemoShell = demo.shell ?? "generic";
  const tone = TONE[shell];
  const pointing = (demo.capability === "point" || demo.capability === "guide") && demo.pointsAt;
  const tools = TOOLBARS[shell].slice();
  if (pointing && !tools.includes(demo.pointsAt!)) tools.splice(Math.min(2, tools.length), 0, demo.pointsAt!);
  const writes = (demo.capability === "dictate" || demo.capability === "draft") && demo.output;

  return (
    <div className="seo-window" style={{ background: tone.body }}>
      <div className="seo-window__bar" style={{ background: tone.bar, color: tone.dark || shell === "sheet" || shell === "design" ? "#fff" : tone.ink }}>
        <Dots />
        <span className="ml-3 truncate text-[11px] font-medium opacity-80">{appName}</span>
      </div>
      <div className="seo-window__tools" style={{ borderColor: tone.dim, color: tone.dark ? "#a1a1aa" : "#57534e", background: tone.dark ? "#202225" : "#fbfaf8" }}>
        {tools.map((t) => (
          <span key={t} className={`seo-window__tool ${pointing && t === demo.pointsAt ? "seo-window__tool--target" : ""}`}>
            {t}
            {pointing && t === demo.pointsAt ? (
              <>
                <span className="seo-circle" aria-hidden />
                <span className="seo-circle__label">{demo.capability === "guide" ? "Click here first" : "Right here"}</span>
              </>
            ) : null}
          </span>
        ))}
      </div>
      <div className="relative min-h-[150px]">
        <Body shell={shell} tone={tone} />
        {writes ? (
          <div className="seo-window__output" style={{ color: tone.ink, background: tone.dark ? "#26282c" : "#ffffffee", borderColor: tone.dim }}>
            <p className="seo-label !text-[9px]" style={{ color: tone.dark ? "#a1a1aa" : undefined }}>
              {demo.capability === "dictate" ? "Typed at your cursor" : "Draft at your cursor"}
            </p>
            <p className="mt-1 whitespace-pre-line text-[12px] leading-[1.55]">{demo.output}</p>
            <span className="seo-caret" aria-hidden />
          </div>
        ) : null}
      </div>
    </div>
  );
}
