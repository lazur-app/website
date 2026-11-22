import { FounderSticker, type Pose, type Who } from "@/components/landing/FounderSticker";

export const metadata = { title: "Founder stickers", robots: { index: false } };

const WHO: Who[] = ["vaidik", "veer", "ayush"];
const POSES: Pose[] = ["wave", "thumbs", "yay", "point", "laptop", "lying", "sitwave", "lean"];

/** Every founder in every pose, for checking the drawings. */
export default function StickersLab() {
  return (
    <main className="min-h-screen bg-[var(--background)] p-10">
      <div className="grid grid-cols-8 gap-8">
        {WHO.flatMap((w) =>
          POSES.map((p) => (
            <div key={w + p} className="flex flex-col items-center gap-2 rounded-2xl bg-white/60 p-4">
              <FounderSticker who={w} pose={p} size={p === "lying" ? 200 : 150} />
              <span className="font-mono text-xs text-[var(--foreground-faint)]">{w} · {p}</span>
            </div>
          )),
        )}
      </div>
    </main>
  );
}
