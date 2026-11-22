"""Bake the PII blur + warm grade into each recording -> public/clean/recNN.mp4.

Usage: python tools/clean.py [rec01 rec02 ...]   (default: every timeline/*.json)

Reads timeline/recNN.json "pii" boxes (source pixels, t0..t1) and blurs each box
for its time range (heavy box blur + pixelation so nothing is recoverable).
Then applies the warm grade below. Output keeps 60 fps, keyframe every 0.5 s
so Remotion can seek fast.
"""
import json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "public" / "raw"
OUT = ROOT / "public" / "clean"
TL = ROOT / "timeline"
W, H = 2940, 1912

GRADE = ("curves=r='0/0.05 0.5/0.55 1/1':g='0/0.03 0.5/0.5 1/0.955':b='0/0.01 0.5/0.43 1/0.86',"
         "eq=saturation=1.2:contrast=1.04,colorbalance=rm=0.04:bm=-0.03")


def even(v):
    v = int(round(v))
    return v - (v % 2)


def build(rec: str):
    tl = json.loads((TL / f"{rec}.json").read_text(encoding="utf-8"))
    boxes = tl.get("pii", [])
    parts, last = [], "[0:v]"
    for i, b in enumerate(boxes):
        x = max(0, even(b["x"])); y = max(0, even(b["y"]))
        w = min(even(b["w"]), W - x); h = min(even(b["h"]), H - y)
        if w < 8 or h < 8:
            continue
        t0, t1 = float(b.get("t0", 0)), float(b.get("t1", 9999))
        parts.append(f"{last}split[m{i}][s{i}]")
        # pixelate then blur: unreadable, still looks soft
        parts.append(f"[s{i}]crop={w}:{h}:{x}:{y},scale={max(2, w // 24)}:{max(2, h // 24)},"
                     f"scale={w}:{h}:flags=bilinear,boxblur=12:3[b{i}]")
        parts.append(f"[m{i}][b{i}]overlay={x}:{y}:enable='between(t,{t0:.2f},{t1:.2f})'[o{i}]")
        last = f"[o{i}]"
    parts.append(f"{last}{GRADE},format=yuv420p[v]")
    graph = ";".join(parts)
    OUT.mkdir(parents=True, exist_ok=True)
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", str(RAW / f"{rec}.mp4"), "-filter_complex", graph,
           "-map", "[v]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "17", "-g", "30",
           "-movflags", "+faststart", str(OUT / f"{rec}.mp4")]
    subprocess.run(cmd, check=True)
    print(rec, len(boxes), "pii boxes ->", OUT / f"{rec}.mp4")


if __name__ == "__main__":
    recs = sys.argv[1:] or sorted(p.stem for p in TL.glob("rec*.json"))
    for r in recs:
        build(r)
