"use client";

import { useCallback, useRef, useState, type DragEvent, type PointerEvent } from "react";
import { Btn, CopyBtn, Notice, Panel } from "./ui";
import { Sticker } from "@/components/landing/Sticker";

type RGB = [number, number, number];

const MAX_W = 1400;
const LOUPE = 120;

const hex = ([r, g, b]: RGB) => "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
const rgbStr = ([r, g, b]: RGB) => `rgb(${r}, ${g}, ${b})`;

function hslStr([r, g, b]: RGB) {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0, s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === R) h = ((G - B) / d) % 6;
    else if (max === G) h = (B - R) / d + 2;
    else h = (R - G) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return `hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function kmeans(px: RGB[], k: number): RGB[] {
  if (!px.length) return [];
  // Deterministic spread-out init: farthest-point seeding.
  const centers: RGB[] = [px[0]];
  const dist = (a: RGB, b: RGB) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
  while (centers.length < k) {
    let best = px[0], bestD = -1;
    for (const p of px) {
      const d = Math.min(...centers.map((c) => dist(p, c)));
      if (d > bestD) {
        bestD = d;
        best = p;
      }
    }
    if (bestD <= 0) break;
    centers.push(best);
  }
  let counts: number[] = [];
  for (let it = 0; it < 12; it++) {
    const sums = centers.map(() => [0, 0, 0, 0]);
    for (const p of px) {
      let bi = 0, bd = Infinity;
      for (let i = 0; i < centers.length; i++) {
        const d = dist(p, centers[i]);
        if (d < bd) {
          bd = d;
          bi = i;
        }
      }
      const s = sums[bi];
      s[0] += p[0]; s[1] += p[1]; s[2] += p[2]; s[3]++;
    }
    counts = sums.map((s) => s[3]);
    sums.forEach((s, i) => {
      if (s[3]) centers[i] = [Math.round(s[0] / s[3]), Math.round(s[1] / s[3]), Math.round(s[2] / s[3])];
    });
  }
  return centers.map((c, i) => ({ c, n: counts[i] })).sort((a, b) => b.n - a.n).map((x) => x.c);
}

/** Pick colours from any image you load. Everything stays on your device. */
export function ColorPicker(props: { page?: string }) {
  void props.page;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loupeRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [color, setColor] = useState<RGB | null>(null);
  const [history, setHistory] = useState<RGB[]>([]);
  const [palette, setPalette] = useState<RGB[]>([]);
  const [hover, setHover] = useState<{ x: number; y: number; rgb: RGB } | null>(null);
  const [copied, setCopied] = useState("");

  const loadFile = useCallback((file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That doesn't look like an image. Try a PNG, JPG, WebP or GIF.");
      return;
    }
    setError("");
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", { willReadFrequently: true });
      if (!canvas || !ctx) return;
      const scale = Math.min(1, MAX_W / img.naturalWidth);
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      setLoaded(true);
      setColor(null);
      setPalette([]);
      setHistory([]);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Couldn't open that image.");
    };
    img.src = url;
  }, []);

  // The canvas is mounted only once loaded flips, so we keep it always mounted and just hide it.
  const sample = (e: PointerEvent<HTMLCanvasElement>): { x: number; y: number; rgb: RGB; cx: number; cy: number } | null => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return null;
    const r = canvas.getBoundingClientRect();
    const x = Math.min(canvas.width - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * canvas.width)));
    const y = Math.min(canvas.height - 1, Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * canvas.height)));
    const d = ctx.getImageData(x, y, 1, 1).data;
    return { x: e.clientX - r.left, y: e.clientY - r.top, cx: x, cy: y, rgb: [d[0], d[1], d[2]] };
  };

  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const s = sample(e);
    if (!s) return;
    setHover({ x: s.x, y: s.y, rgb: s.rgb });
    const lc = loupeRef.current, src = canvasRef.current;
    const lctx = lc?.getContext("2d");
    if (lc && lctx && src) {
      const n = 11; // source pixels shown across the loupe
      lctx.imageSmoothingEnabled = false;
      lctx.clearRect(0, 0, LOUPE, LOUPE);
      lctx.drawImage(src, s.cx - (n >> 1), s.cy - (n >> 1), n, n, 0, 0, LOUPE, LOUPE);
      const cell = LOUPE / n;
      lctx.strokeStyle = "#fff";
      lctx.lineWidth = 2;
      lctx.strokeRect((n >> 1) * cell, (n >> 1) * cell, cell, cell);
      lctx.strokeStyle = "#000";
      lctx.lineWidth = 1;
      lctx.strokeRect((n >> 1) * cell - 1, (n >> 1) * cell - 1, cell + 2, cell + 2);
    }
  };

  const onPick = (e: PointerEvent<HTMLCanvasElement>) => {
    const s = sample(e);
    if (!s) return;
    pick(s.rgb);
  };

  const pick = (rgb: RGB) => {
    setColor(rgb);
    setHistory((h) => [rgb, ...h.filter((x) => hex(x) !== hex(rgb))].slice(0, 10));
  };

  const copyChip = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied((c) => (c === text ? "" : c)), 1200);
    } catch {
      /* clipboard blocked */
    }
  };

  const extract = () => {
    const src = canvasRef.current;
    if (!src) return;
    const w = 80;
    const h = Math.max(1, Math.round((src.height / src.width) * w));
    const tmp = document.createElement("canvas");
    tmp.width = w;
    tmp.height = h;
    const t = tmp.getContext("2d", { willReadFrequently: true });
    if (!t) return;
    t.drawImage(src, 0, 0, w, h);
    const data = t.getImageData(0, 0, w, h).data;
    const px: RGB[] = [];
    for (let i = 0; i < data.length; i += 4) if (data[i + 3] > 128) px.push([data[i], data[i + 1], data[i + 2]]);
    setPalette(kmeans(px, 6));
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const chips = color ? [hex(color), rgbStr(color), hslStr(color)] : [];

  return (
    <Panel className="space-y-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`rounded-3xl border-2 border-dashed p-4 text-center transition ${dragging ? "border-[var(--brand)] bg-[var(--brand-soft)]" : "border-[var(--border-strong)] bg-[var(--background-deep)]"}`}
      >
        {!loaded ? (
          <div className="py-8">
            <Sticker name="gem" size={64} className="mx-auto" />
            <p className="mt-2 text-[16px] font-medium">Drop an image here</p>
            <p className="text-[14px] text-[var(--foreground-muted)]">or choose one from your device</p>
          </div>
        ) : null}
        <div className={`relative mx-auto inline-block max-w-full ${loaded ? "" : "hidden"}`}>
          <canvas
            ref={canvasRef}
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
            onPointerDown={(e) => {
              onMove(e);
              onPick(e);
            }}
            className="block h-auto max-w-full cursor-crosshair touch-none rounded-2xl"
            aria-label="Image: click to pick a colour"
          />
          <div
            className="pointer-events-none absolute overflow-hidden rounded-full border-4 border-white shadow-lg"
            style={{
              width: LOUPE,
              height: LOUPE,
              left: (hover?.x ?? 0) - LOUPE / 2,
              top: (hover?.y ?? 0) - LOUPE - 18,
              display: hover ? "block" : "none",
            }}
          >
            <canvas ref={loupeRef} width={LOUPE} height={LOUPE} className="block" />
          </div>
        </div>
        <div className="mt-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#1c1917] px-5 py-3 text-[15px] font-bold text-white hover:bg-black">
             {loaded ? "Choose another image" : "Choose image"}
            <input type="file" accept="image/*" className="sr-only" onChange={(e) => loadFile(e.target.files?.[0])} />
          </label>
        </div>
      </div>

      {error ? <Notice tone="warn">{error}</Notice> : null}
      {loaded && !color ? <Notice> Tap or click anywhere on the image to read a colour. Hover to magnify.</Notice> : null}

      {color ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="h-24 w-full rounded-3xl border border-[var(--border-strong)] sm:w-32" style={{ background: hex(color) }} aria-label={`Swatch ${hex(color)}`} />
          <div className="flex flex-1 flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => copyChip(c)}
                className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 font-mono text-[15px] font-semibold hover:bg-[var(--background-deep)]"
              >
                {copied === c ? "✓ Copied" : c}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {history.length ? (
        <div>
          <h3 className="mb-2 text-[15px] font-semibold"> Recent colours (tap to copy HEX)</h3>
          <div className="flex flex-wrap gap-2">
            {history.map((h) => (
              <button
                key={hex(h)}
                type="button"
                title={hex(h)}
                onClick={() => {
                  setColor(h);
                  void copyChip(hex(h));
                }}
                className="h-10 w-10 rounded-full border border-[var(--border-strong)] shadow-sm"
                style={{ background: hex(h) }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {loaded ? (
        <div>
          <Btn tone="dark" onClick={extract}>
             Extract palette
          </Btn>
          {palette.length ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {palette.map((p) => (
                <button
                  key={hex(p)}
                  type="button"
                  onClick={() => {
                    pick(p);
                    void copyChip(hex(p));
                  }}
                  className="overflow-hidden rounded-2xl border border-[var(--border-strong)] text-left"
                >
                  <span className="block h-16" style={{ background: hex(p) }} />
                  <span className="block bg-white px-3 py-2 font-mono text-[13px] font-semibold">{copied === hex(p) ? "✓ Copied" : hex(p)}</span>
                </button>
              ))}
            </div>
          ) : null}
          {palette.length ? (
            <div className="mt-3">
              <CopyBtn text={palette.map(hex).join(", ")} label="Copy palette" />
            </div>
          ) : null}
        </div>
      ) : null}
    </Panel>
  );
}
