import type { FilmSpec, Shot } from "./types";

export const FPS = 30;
export const SRC_W = 2940;
export const SRC_H = 1912;

export const shotSeconds = (s: Shot) => (s.to - s.from) / (s.rate ?? 1);

/** Film-second start of every shot, plus total length. */
export const layout = (spec: FilmSpec) => {
  let t = spec.intro?.dur ?? 0;
  const starts: number[] = [];
  for (const s of spec.shots) {
    starts.push(t);
    t += shotSeconds(s);
  }
  const footageEnd = t;
  const total = t + (spec.outro?.dur ?? 0);
  return { starts, footageEnd, total, frames: Math.round(total * FPS) };
};

/** Convert a source time inside shot i to film seconds (handy for spec authors). */
export const filmTime = (spec: FilmSpec, shotIndex: number, sourceT: number) => {
  const { starts } = layout(spec);
  const s = spec.shots[shotIndex];
  return starts[shotIndex] + (sourceT - s.from) / (s.rate ?? 1);
};
