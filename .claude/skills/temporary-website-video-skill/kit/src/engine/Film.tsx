import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Freeze,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Video } from "@remotion/media";
import { easings } from "../easings";
import { FONT_BODY, FONT_DISPLAY, FONT_SERIF } from "./fonts";
import { FPS, layout, shotSeconds, SRC_H, SRC_W } from "./timing";
import type { Box, Caption, Card, CamKey, Ease, FilmSpec, Shot } from "./types";

const INK = "#0c0b0a";
const PAPER = "#f1ede7"; // the backdrop the screen sits on
const LAZUR_RED = "#ff4a4a";
// A light, neutral-warm grade: a touch of warmth, no yellow cast.
const GRADE = "saturate(1.05) contrast(1.02) sepia(0.04)";

const PAD = 40; // backdrop margin around the screen
const RADIUS = 26;

const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.out(Easing.cubic);

const easeFn = (e: Ease | undefined) =>
  e === "linear" ? (x: number) => x : easings[(e ?? "even") as keyof typeof easings] ?? easings.even;

// ---------------------------------------------------------------- camera

type Cam = { cx: number; cy: number; s: number };

const boxToCam = (b: Box, W: number, H: number): Cam => {
  const minS = Math.max(W / SRC_W, H / SRC_H); // never show outside the recording
  const s = Math.max(minS, Math.min(W / b.w, H / b.h));
  return { cx: b.x + b.w / 2, cy: b.y + b.h / 2, s };
};

const clampCam = (c: Cam, W: number, H: number): Cam => {
  const hw = W / (2 * c.s);
  const hh = H / (2 * c.s);
  return {
    s: c.s,
    cx: Math.min(SRC_W - hw, Math.max(hw, c.cx)),
    cy: Math.min(SRC_H - hh, Math.max(hh, c.cy)),
  };
};

const camAt = (keys: CamKey[], t: number, W: number, H: number): Cam => {
  const ks = [...keys].sort((a, b) => a.at - b.at);
  if (t <= ks[0].at) return clampCam(boxToCam(ks[0].box, W, H), W, H);
  const last = ks[ks.length - 1];
  if (t >= last.at) return clampCam(boxToCam(last.box, W, H), W, H);
  let i = 0;
  while (i < ks.length - 1 && ks[i + 1].at < t) i++;
  const a = ks[i];
  const b = ks[i + 1];
  const p = easeFn(b.ease)((t - a.at) / Math.max(1e-6, b.at - a.at));
  const ca = boxToCam(a.box, W, H);
  const cb = boxToCam(b.box, W, H);
  // scale in log space so pushes feel even
  const s = Math.exp(Math.log(ca.s) + (Math.log(cb.s) - Math.log(ca.s)) * p);
  return clampCam({ s, cx: ca.cx + (cb.cx - ca.cx) * p, cy: ca.cy + (cb.cy - ca.cy) * p }, W, H);
};

// ---------------------------------------------------------------- one shot

const Footage: React.FC<{ shot: Shot; style?: React.CSSProperties; fromOverride?: number }> = ({ shot, style, fromOverride }) => (
  <Video
    src={staticFile(`cfr/${shot.rec}.mp4`)}
    trimBefore={Math.round((fromOverride ?? shot.from) * FPS)}
    playbackRate={shot.rate ?? 1}
    muted
    style={{ width: SRC_W, height: SRC_H, ...style }}
  />
);

const ShotView: React.FC<{ shot: Shot; W: number; H: number }> = ({ shot, W, H }) => {
  const frame = useCurrentFrame(); // local to the shot's Sequence
  const rate = shot.rate ?? 1;
  const srcT = shot.from + (frame / FPS) * rate;
  const cam = camAt(shot.cam, srcT, W, H);
  const toFrame = (srcSeconds: number) => ((srcSeconds - shot.from) / rate) * FPS;

  // small zoom-punch accents
  let punch = 1;
  for (const p of shot.punches ?? []) {
    const pf = toFrame(p);
    const up = interpolate(frame, [pf - 2, pf + 5], [0, 1], { ...clampOpts, easing: easeOut });
    const down = interpolate(frame, [pf + 5, pf + 36], [0, 1], { ...clampOpts, easing: easings.soft });
    punch *= 1 + 0.035 * up - 0.035 * down;
  }

  // entrance
  const enter = shot.enter ?? "cut";
  let enterScale = 1;
  let enterX = 0;
  let blur = 0;
  if (enter === "punch" || enter === "zoomThrough") {
    const k = enter === "zoomThrough" ? 1.22 : 1.07;
    enterScale = interpolate(frame, [0, 12], [k, 1], { ...clampOpts, easing: easings.slowInLand });
    blur = interpolate(frame, [0, 8], [enter === "zoomThrough" ? 12 : 5, 0], clampOpts);
  } else if (enter === "whip") {
    enterX = interpolate(frame, [0, 10], [W * 0.22, 0], { ...clampOpts, easing: easings.slowInLand });
    blur = interpolate(frame, [0, 8], [14, 0], clampOpts);
  }

  const S = cam.s * punch * enterScale;
  const tx = W / 2 - cam.cx * S + enterX;
  const ty = H / 2 - cam.cy * S;

  // smooth reveal: a frozen "before" frame sits on top and is wiped away top to bottom
  const rv = shot.reveal;
  let revealLayer: React.ReactNode = null;
  if (rv) {
    const fa = toFrame(rv.at);
    const durF = rv.dur * FPS;
    if (frame >= fa - 1 && frame <= fa + durF + 1) {
      const soft = 80;
      const edge = interpolate(frame, [fa, fa + durF], [-soft, rv.box.h + soft * 2], { ...clampOpts, easing: Easing.inOut(Easing.cubic) });
      const mask = `linear-gradient(to bottom, transparent 0px, transparent ${edge - soft}px, black ${edge}px)`;
      // the "before" picture, only inside the box, wiped away top to bottom
      const before = rv.beforeAt ?? rv.at - 0.12;
      revealLayer = (
        <div
          style={{ position: "absolute", left: rv.box.x, top: rv.box.y, width: rv.box.w, height: rv.box.h, overflow: "hidden", WebkitMaskImage: mask, maskImage: mask }}
        >
          {rv.fill ? (
            <div style={{ position: "absolute", inset: 0, background: rv.fill }} />
          ) : (
            <Freeze frame={0}>
              <Footage shot={shot} fromOverride={before} style={{ position: "absolute", left: -rv.box.x, top: -rv.box.y, maxWidth: "none" }} />
            </Freeze>
          )}
        </div>
      );
    }
  }

  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SRC_W,
          height: SRC_H,
          transformOrigin: "0 0",
          transform: `translate(${tx}px, ${ty}px) scale(${S})`,
          filter: shot.spot
            ? `${GRADE} blur(${5 / S}px) brightness(0.62)`
            : blur > 0.2
              ? `${GRADE} blur(${blur / S}px)`
              : GRADE,
        }}
      >
        <Footage shot={shot} />
        {(shot.blurs ?? []).map((b, i) => (
          <div
            key={i}
            style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, overflow: "hidden", borderRadius: 10 }}
          >
            <Footage shot={shot} style={{ position: "absolute", left: -b.x, top: -b.y, filter: "blur(13px)", maxWidth: "none" }} />
          </div>
        ))}
        {revealLayer}
      </div>
      {shot.spot
        ? (() => {
            const sp = shot.spot!;
            const p = interpolate(frame, [0, 12], [0, 1], { ...clampOpts, easing: easings.slowInLand });
            const k = ((W * 0.8) / sp.w) * (0.86 + 0.14 * p) * (1 + 0.02 * (frame / 45));
            const w = sp.w * k;
            const h = sp.h * k;
            return (
              <div
                style={{
                  position: "absolute",
                  left: (W - w) / 2,
                  top: (H - h) / 2 - H * 0.04,
                  width: w,
                  height: h,
                  overflow: "hidden",
                  borderRadius: h * 0.42,
                  opacity: Math.min(1, p * 1.6),
                  boxShadow: "0 30px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
                  background: "black",
                }}
              >
                <div style={{ position: "absolute", left: -sp.x * k, top: -sp.y * k, width: SRC_W, height: SRC_H, transformOrigin: "0 0", transform: `scale(${k})` }}>
                  <Footage shot={shot} />
                </div>
              </div>
            );
          })()
        : null}
      {enter === "flash" ? (
        <AbsoluteFill style={{ background: "white", opacity: interpolate(frame, [0, 9], [0.55, 0], clampOpts) }} />
      ) : null}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- captions (all straight, no tilt)

const Words: React.FC<{ text: string; frame: number; stagger?: number; accent?: string }> = ({ text, frame, stagger = 2, accent }) => {
  const words = text.split(" ");
  return (
    <span>
      {words.map((w, i) => {
        const p = interpolate(frame - i * stagger, [0, 9], [0, 1], { ...clampOpts, easing: easeOut });
        const isAccent = accent && w.replace(/[^\w']/g, "").toLowerCase() === accent.toLowerCase();
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.26em",
              opacity: p,
              transform: `translateY(${(1 - p) * 0.28}em)`,
              ...(isAccent ? { fontFamily: FONT_SERIF, fontStyle: "italic", fontWeight: 400, fontSize: "1.12em" } : null),
            }}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
};

const CaptionView: React.FC<{ c: Caption }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const durF = Math.round(c.dur * FPS);
  const inP = interpolate(frame, [0, 11], [0, 1], { ...clampOpts, easing: easeOut });
  const outP = interpolate(frame, [durF - 9, durF], [1, 0], { ...clampOpts, easing: Easing.in(Easing.cubic) });
  const u = Math.min(W, H) / 1080;
  const pos = c.pos ?? (c.kind === "title" ? "center" : c.kind === "label" ? "top" : "bottom");
  const place: React.CSSProperties =
    pos === "top"
      ? { justifyContent: "flex-start", paddingTop: 96 * u }
      : pos === "bottom"
        ? { justifyContent: "flex-end", paddingBottom: 96 * u }
        : { justifyContent: "center" };
  const shell: React.CSSProperties = {
    opacity: inP * outP,
    transform: `translateY(${(1 - inP) * 18 * u + (1 - outP) * -8 * u}px) scale(${0.97 + 0.03 * inP})`,
  };

  let inner: React.ReactNode = null;
  if (c.kind === "say") {
    inner = (
      <div
        style={{
          ...shell,
          maxWidth: W * 0.8,
          padding: `${18 * u}px ${32 * u}px`,
          borderRadius: 28 * u,
          background: "rgba(255,255,255,0.97)",
          boxShadow: "0 12px 44px rgba(20,14,8,0.22), 0 0 0 1px rgba(20,14,8,0.06)",
          color: "#1c1917",
          fontFamily: FONT_BODY,
          fontSize: 36 * u,
          fontWeight: 500,
          lineHeight: 1.3,
          textAlign: "center",
        }}
      >
        <span style={{ fontWeight: 700, color: "#8a8178", marginRight: "0.35em" }}>User:</span>
        <Words text={`“${c.text}”`} frame={frame} stagger={3} />
      </div>
    );
  } else if (c.kind === "result") {
    inner = (
      <div
        style={{
          ...shell,
          display: "flex",
          alignItems: "center",
          gap: 16 * u,
          background: INK,
          color: "white",
          borderRadius: 999,
          padding: `${18 * u}px ${34 * u}px ${18 * u}px ${28 * u}px`,
          fontFamily: FONT_BODY,
          fontWeight: 600,
          fontSize: 38 * u,
          boxShadow: "0 16px 50px rgba(20,14,8,0.35)",
          maxWidth: W * 0.84,
        }}
      >
        <span style={{ width: 16 * u, height: 16 * u, borderRadius: 99, background: LAZUR_RED, flexShrink: 0 }} />
        <span>
          <span style={{ fontWeight: 700, color: "#b9b2ab", marginRight: "0.35em" }}>Lazur:</span>
          {c.text}
        </span>
      </div>
    );
  } else if (c.kind === "label") {
    inner = (
      <div
        style={{
          ...shell,
          background: INK,
          color: "white",
          borderRadius: 999,
          padding: `${10 * u}px ${24 * u}px`,
          fontFamily: FONT_BODY,
          fontWeight: 600,
          fontSize: 28 * u,
          display: "flex",
          alignItems: "center",
          gap: 12 * u,
        }}
      >
        <span style={{ width: 11 * u, height: 11 * u, borderRadius: 99, background: LAZUR_RED, opacity: 0.55 + 0.45 * Math.sin(frame / 4) }} />
        {c.text}
      </div>
    );
  } else {
    inner = (
      <div
        style={{
          ...shell,
          color: "white",
          fontFamily: FONT_DISPLAY,
          fontWeight: 500,
          fontSize: 110 * u,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          textTransform: "lowercase",
          textAlign: "center",
          textShadow: "0 8px 40px rgba(0,0,0,0.5)",
          maxWidth: W * 0.9,
        }}
      >
        <Words text={c.text} frame={frame} stagger={3} accent={c.accent} />
      </div>
    );
  }

  return <AbsoluteFill style={{ alignItems: "center", ...place }}>{inner}</AbsoluteFill>;
};

// ---------------------------------------------------------------- cards

const CardView: React.FC<{ card: Card }> = ({ card }) => {
  const frame = useCurrentFrame();
  const { width: W, height: H } = useVideoConfig();
  const u = Math.min(W, H) / 1080;
  const durF = Math.round(card.dur * FPS);
  const out = interpolate(frame, [durF - 6, durF], [1, 0], clampOpts);
  const subP = interpolate(frame, [10, 22], [0, 1], { ...clampOpts, easing: easeOut });
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div style={{ opacity: out, textAlign: "center" }}>
        <div
          style={{
            color: INK,
            fontFamily: FONT_DISPLAY,
            fontWeight: 500,
            fontSize: 124 * u,
            lineHeight: 0.98,
            letterSpacing: "-0.045em",
            textTransform: "lowercase",
          }}
        >
          <Words text={card.text} frame={frame} stagger={3} accent={card.accent} />
        </div>
        {card.sub ? (
          <div
            style={{
              marginTop: 34 * u,
              display: "inline-block",
              opacity: subP,
              transform: `translateY(${(1 - subP) * 14}px)`,
              background: INK,
              color: "white",
              borderRadius: 999,
              padding: `${14 * u}px ${30 * u}px`,
              fontFamily: FONT_BODY,
              fontWeight: 600,
              fontSize: 34 * u,
            }}
          >
            {card.sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- the film

export const Film: React.FC<{ spec: FilmSpec; sound: boolean }> = ({ spec, sound }) => {
  const { width, height } = useVideoConfig();
  const { starts, footageEnd, frames } = layout(spec);
  const introF = Math.round((spec.intro?.dur ?? 0) * FPS);
  const W = width - PAD * 2;
  const H = height - PAD * 2;
  const footF = Math.round(footageEnd * FPS);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 100% at 50% 0%, #f7f4ef 0%, ${PAPER} 60%, #e7e1d8 100%)` }}>
      {spec.intro ? (
        <Sequence durationInFrames={introF} layout="none">
          <CardView card={spec.intro} />
        </Sequence>
      ) : null}
      {/* the screen: a rounded window on the backdrop; every shot plays inside it */}
      <Sequence from={introF} durationInFrames={Math.max(1, footF - introF)} layout="none">
        <div
          style={{
            position: "absolute",
            left: PAD,
            top: PAD,
            width: W,
            height: H,
            borderRadius: RADIUS,
            overflow: "hidden",
            boxShadow: "0 30px 80px rgba(30,20,10,0.28), 0 0 0 1px rgba(30,20,10,0.10)",
            background: INK,
          }}
        >
          {spec.shots.map((s, i) => (
            <Sequence key={i} from={Math.round(starts[i] * FPS) - introF} durationInFrames={Math.max(1, Math.round(shotSeconds(s) * FPS))}>
              <ShotView shot={s} W={W} H={H} />
            </Sequence>
          ))}
        </div>
      </Sequence>
      {spec.outro ? (
        <Sequence from={footF} durationInFrames={Math.max(1, frames - footF)}>
          <CardView card={spec.outro} />
        </Sequence>
      ) : null}
      {spec.captions.map((c, i) => (
        <Sequence key={`c${i}`} from={Math.round(c.at * FPS)} durationInFrames={Math.round(c.dur * FPS)}>
          <CaptionView c={c} />
        </Sequence>
      ))}
      {sound
        ? (spec.voice ?? []).map((v, i) => (
            <Sequence key={`v${i}`} from={Math.round(v.at * FPS)} durationInFrames={Math.max(1, Math.round((v.to - v.from) * FPS))} layout="none">
              <Audio
                src={staticFile(`voice/${v.rec}.m4a`)}
                trimBefore={Math.round(v.from * FPS)}
                volume={(f) => {
                  const n = Math.round((v.to - v.from) * FPS);
                  return (v.volume ?? 1) * interpolate(f, [0, 3, n - 4, n], [0, 1, 1, 0], clampOpts);
                }}
              />
            </Sequence>
          ))
        : null}
      {sound
        ? spec.sfx.map((q, i) => (
            <Sequence key={`s${i}`} from={Math.max(0, Math.round(q.at * FPS))} layout="none">
              <Audio src={staticFile(`sfx/${q.sound}.mp3`)} volume={q.volume ?? 0.5} />
            </Sequence>
          ))
        : null}
      {sound && spec.music ? (
        <Audio
          src={staticFile("sfx/music_warm.mp3")}
          trimBefore={Math.round((spec.music.startAt ?? 0) * FPS)}
          volume={(f) => spec.music!.volume * interpolate(f, [0, 12, frames - 24, frames], [0, 1, 1, 0], clampOpts)}
        />
      ) : null}
    </AbsoluteFill>
  );
};
