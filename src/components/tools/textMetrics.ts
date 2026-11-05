/** Shared scoring for the free tools. Pure functions, unit-testable. */

/** Standard WPM: every 5 characters typed correctly is one word. */
export function wpm(correctChars: number, ms: number) {
  if (ms <= 0) return 0;
  return Math.round(correctChars / 5 / (ms / 60000));
}

export function words(text: string) {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^\p{L}\p{N}'\s-]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export type Alignment = { op: "ok" | "sub" | "del" | "ins"; ref?: string; hyp?: string }[];

/** Word-level Levenshtein alignment; WER = (S + D + I) / N. */
export function wordErrorRate(reference: string, hypothesis: string) {
  const r = words(reference);
  const h = words(hypothesis);
  const d: number[][] = Array.from({ length: r.length + 1 }, (_, i) => Array.from({ length: h.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= r.length; i++) {
    for (let j = 1; j <= h.length; j++) {
      const cost = r[i - 1] === h[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
    }
  }
  const align: Alignment = [];
  let i = r.length;
  let j = h.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (r[i - 1] === h[j - 1] ? 0 : 1)) {
      align.unshift({ op: r[i - 1] === h[j - 1] ? "ok" : "sub", ref: r[i - 1], hyp: h[j - 1] });
      i--;
      j--;
    } else if (i > 0 && d[i][j] === d[i - 1][j] + 1) {
      align.unshift({ op: "del", ref: r[i - 1] });
      i--;
    } else {
      align.unshift({ op: "ins", hyp: h[j - 1] });
      j--;
    }
  }
  const count = (op: string) => align.filter((a) => a.op === op).length;
  const S = count("sub");
  const D = count("del");
  const I = count("ins");
  return { wer: r.length ? (S + D + I) / r.length : 0, S, D, I, N: r.length, align };
}
