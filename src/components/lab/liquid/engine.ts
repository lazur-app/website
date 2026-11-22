/**
 * The liquid metal. Each frame:
 *   1. the shape is painted white on black into a tiny 2D canvas: the exact drawing while a shape is
 *      held, and a thousand small discs on their way from one shape to the next while it melts;
 *   2. the GPU blurs that picture (a tight blur for the outline, a wide one for the swell);
 *   3. a fragment shader cuts the outline where the tight blur crosses half (so near discs fuse and
 *      far ones pinch off as droplets), takes the wide blur as the height of the surface, and paints
 *      that surface as polished chrome: a sky / horizon / ground reflection looked up by the surface
 *      normal, a strip light, a glint, an ink edge and a soft shadow. The pointer moves the
 *      reflection and parts the liquid.
 *
 * Raw WebGL 1, no extensions, so it runs the same in Chrome, Safari and Firefox. `createLiquid`
 * returns null when WebGL is not there; the caller then shows the drawn fallback.
 */
import {
  CHECK,
  COUNT,
  CURSOR,
  DH,
  DROP,
  DW,
  LAZUR,
  LINE_LENGTH,
  PEN,
  PEN_HOLD,
  WAVE,
  barLevel,
  buildShapes,
  cursorNudge,
  hash,
  lineWobble,
  paintShape,
  penAlong,
  tickScale,
} from "./shapes";

const SIM_W = 512;
const SIM_H = Math.round((SIM_W * DH) / DW);
const UNIT = SIM_W / DW;

/** The loop: which shape, and how long it is held. The word is held longest. */
const LOOP = [
  { shape: LAZUR, hold: 3.8 },
  { shape: WAVE, hold: 2.4 },
  { shape: PEN, hold: PEN_HOLD },
  { shape: CHECK, hold: 2.1 },
  { shape: CURSOR, hold: 2.3 },
];
/** Seconds to melt from one shape into the next. */
const MELT = 1.45;

/** Droplets: small groups of neighbouring discs that leave the blob together during a melt and come back. */
const BEADS = 7;
const BEAD_SIZE = 36;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const BLUR = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uStep;
void main() {
  float s = texture2D(uTex, vUv).r * 0.2042;
  s += (texture2D(uTex, vUv + uStep).r + texture2D(uTex, vUv - uStep).r) * 0.1802;
  s += (texture2D(uTex, vUv + uStep * 2.0).r + texture2D(uTex, vUv - uStep * 2.0).r) * 0.1238;
  s += (texture2D(uTex, vUv + uStep * 3.0).r + texture2D(uTex, vUv - uStep * 3.0).r) * 0.0663;
  s += (texture2D(uTex, vUv + uStep * 4.0).r + texture2D(uTex, vUv - uStep * 4.0).r) * 0.0276;
  gl_FragColor = vec4(s, s, s, 1.0);
}`;

const CHROME = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uEdge;
uniform sampler2D uSwell;
uniform vec2 uTexel;
uniform float uScale;
uniform float uInk;
uniform float uTime;
uniform float uShake;
uniform vec2 uMouse;

float edgeAt(vec2 p) { return texture2D(uEdge, p).r; }
float swellAt(vec2 p) { return texture2D(uSwell, p).r; }

// What the metal reflects, from facing the light (0) to facing away (1): bright sky, a pale blue,
// the hard dark horizon, a lit ground with a little pink in it, and a bright lip.
vec3 world(float c) {
  c = clamp(c, 0.0, 1.0);
  vec3 col = vec3(1.0);
  col = mix(col, vec3(0.92, 0.945, 0.985), smoothstep(0.02, 0.2, c));
  col = mix(col, vec3(0.77, 0.825, 0.915), smoothstep(0.2, 0.4, c));
  col = mix(col, vec3(0.5, 0.58, 0.73), smoothstep(0.4, 0.56, c));
  col = mix(col, vec3(0.1, 0.12, 0.19), smoothstep(0.56, 0.62, c));
  col = mix(col, vec3(0.03, 0.035, 0.06), smoothstep(0.62, 0.71, c));
  col = mix(col, vec3(0.34, 0.36, 0.47), smoothstep(0.71, 0.79, c));
  col = mix(col, vec3(0.86, 0.86, 0.91), smoothstep(0.79, 0.9, c));
  col = mix(col, vec3(1.0), smoothstep(0.9, 1.0, c));
  float pink = smoothstep(0.74, 0.83, c) * (1.0 - smoothstep(0.85, 0.96, c));
  return mix(col, vec3(1.0, 0.5, 0.74), pink * 0.26);
}

void main() {
  // The surface never sits quite still, and shivers as a shape sets.
  vec2 uv = vUv + 0.0012 * vec2(sin(vUv.y * 27.0 + uTime * 1.15), sin(vUv.x * 15.0 - uTime * 0.9))
    + 0.0005 * (uShake - 1.0) * vec2(sin(vUv.y * 46.0 + uTime * 13.0), sin(vUv.x * 38.0 - uTime * 11.0));

  vec2 ex = vec2(uTexel.x * 1.5, 0.0);
  vec2 ey = vec2(0.0, uTexel.y * 1.5);
  float a = edgeAt(uv);
  vec2 ga = vec2(edgeAt(uv + ex) - edgeAt(uv - ex), edgeAt(uv + ey) - edgeAt(uv - ey)) / 3.0;
  float b = swellAt(uv);
  vec2 gb = vec2(swellAt(uv + ex * 2.0) - swellAt(uv - ex * 2.0), swellAt(uv + ey * 2.0) - swellAt(uv - ey * 2.0)) / 6.0;

  // Outline: where the tight blur crosses half, sharpened to one screen pixel. (Specks too small to read as a droplet are dropped.)
  float inside = (a - 0.5) / max(length(ga), 0.0025) * uScale;
  float alpha = clamp(inside + 0.5, 0.0, 1.0) * smoothstep(0.025, 0.06, b);

  // The surface: the wide blur is its height, so a stroke is a round tube and a broad shape a
  // soft-edged slab; the tight blur turns the last pixels over into the rim.
  vec2 slope = ga * 11.0 + gb * 44.0;
  vec3 n = normalize(vec3(-slope, 1.0));

  // Reflection, looked up by how far the surface leans towards the light (above, a little left);
  // a slow ripple and the pointer move it.
  vec2 up = normalize(vec2(-0.42 + uMouse.x * 0.4, 0.86));
  float lean = dot(n.xy, up);
  float ripple = 0.03 * sin(vUv.x * 13.0 + n.x * 3.0 + uTime * 0.55) + 0.02 * sin(vUv.y * 21.0 - uTime * 0.8);
  float c = 0.43 - lean * 0.54 + (0.5 - vUv.y) * 0.2 + (vUv.x - 0.5) * 0.07 + uMouse.y * 0.1 + ripple;
  vec3 col = world(c);

  // A strip light standing to one side, seen in whatever faces it.
  float strip = smoothstep(0.09, 0.0, abs(n.x - 0.34 + uMouse.x * 0.2)) * smoothstep(-0.2, 0.3, n.y);
  col += vec3(0.95, 0.97, 1.0) * strip * 0.35;

  // One hard glint from the key light.
  vec3 light = normalize(vec3(-0.42 + uMouse.x * 0.5, 0.5 - uMouse.y * 0.35, 0.78));
  float glint = pow(max(dot(n, normalize(light + vec3(0.0, 0.0, 1.0))), 0.0), 120.0);
  col += vec3(1.0) * glint * 0.85;

  // An ink edge, as on the chrome stickers.
  float ink = 1.0 - smoothstep(uInk * 0.45, uInk * 1.35, inside);
  col = mix(col, vec3(0.043, 0.047, 0.067), ink * 0.9);

  // A soft shadow on the page, below and a little wider than the metal.
  vec2 sp = uv + vec2(-0.004, 0.034);
  float sh = (swellAt(sp) + swellAt(sp + ex * 4.0) + swellAt(sp - ex * 4.0) + swellAt(sp + ey * 4.0) + swellAt(sp - ey * 4.0)) / 5.0;
  float shadow = smoothstep(0.03, 0.62, sh) * 0.2;

  float outA = alpha + shadow * (1.0 - alpha);
  vec3 outC = col * alpha + vec3(0.11, 0.1, 0.13) * shadow * (1.0 - alpha);
  gl_FragColor = vec4(clamp(outC, 0.0, 1.0), outA);
}`;

export type LiquidHandle = {
  destroy(): void;
  /** Start or stop the loop (stopped while off screen). */
  setRunning(on: boolean): void;
  /** Match the canvas to its box. */
  resize(): void;
  /** Pointer across the window (-1..1 each way, for the light) and over the stage in design units (to part the liquid), or null when away. */
  setPointer(nx: number, ny: number, stage: { x: number; y: number } | null): void;
};

export type LiquidOptions = {
  /** CSS font-family value for the word. */
  fontFamily: string;
  /** Draw the word once and stop. */
  still: boolean;
  /** Which shape of the loop is showing (index into the loop, 0 is the word), or -1 while it melts. */
  onPhase(index: number): void;
  onLost(): void;
};

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const smooth = (a: number, b: number, t: number) => {
  const u = clamp01((t - a) / (b - a));
  return u * u * (3 - 2 * u);
};

function compile(gl: WebGLRenderingContext, vert: string, frag: string): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  for (const [type, source] of [[gl.VERTEX_SHADER, vert], [gl.FRAGMENT_SHADER, frag]] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
    gl.attachShader(program, shader);
  }
  gl.bindAttribLocation(program, 0, "aPos");
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

export function createLiquid(canvas: HTMLCanvasElement, options: LiquidOptions): LiquidHandle | null {
  const shapes = buildShapes(options.fontFamily);
  if (!shapes) return null;

  const sim = document.createElement("canvas");
  sim.width = SIM_W;
  sim.height = SIM_H;
  const ctx = sim.getContext("2d");
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
  if (!ctx || !gl) return null;

  const blur = compile(gl, VERT, BLUR);
  const chrome = compile(gl, VERT, CHROME);
  if (!blur || !chrome) return null;

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.disable(gl.BLEND);
  gl.disable(gl.DEPTH_TEST);

  const texture = () => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  };
  const target = () => {
    const tex = texture();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIM_W, SIM_H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fbo };
  };
  const source = texture();
  const scratch = target();
  const edge = target();
  const swell = target();
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return null;

  const blurTex = gl.getUniformLocation(blur, "uTex");
  const blurStep = gl.getUniformLocation(blur, "uStep");
  const u = {
    edge: gl.getUniformLocation(chrome, "uEdge"),
    swell: gl.getUniformLocation(chrome, "uSwell"),
    texel: gl.getUniformLocation(chrome, "uTexel"),
    scale: gl.getUniformLocation(chrome, "uScale"),
    ink: gl.getUniformLocation(chrome, "uInk"),
    time: gl.getUniformLocation(chrome, "uTime"),
    shake: gl.getUniformLocation(chrome, "uShake"),
    mouse: gl.getUniformLocation(chrome, "uMouse"),
  };

  // ---- where every disc is ---------------------------------------------------------------

  const px = new Float32Array(COUNT);
  const py = new Float32Array(COUNT);
  const out = { x: 0, y: 0 };

  /** A point of a shape, with the shape's own small motion. `held` is seconds since the shape formed. */
  const pointOf = (k: number, i: number, held: number, time: number) => {
    const shape = shapes[k];
    let x = shape.x[i];
    let y = shape.y[i];
    if (k === WAVE) {
      y = shape.cy + (y - shape.cy) * barLevel(shape.tag[i], time);
    } else if (k === PEN) {
      const pen = penAlong(held);
      if (shape.tag[i] === 1) y += lineWobble(shape.aux[i], pen);
      else {
        x += pen * LINE_LENGTH;
        y += Math.sin(held * 9) * 1.4;
      }
    } else if (k === CHECK) {
      const scale = tickScale(held);
      x = shape.cx + (x - shape.cx) * scale;
      y = shape.cy + (y - shape.cy) * scale;
    } else if (k === CURSOR) {
      const nudge = cursorNudge(held);
      x -= nudge;
      y -= nudge;
    }
    out.x = x;
    out.y = y;
  };

  /** Per melt: where each droplet flies to. */
  const beadAt = new Float32Array(BEADS * 2);
  const aimBeads = (seed: number, cx: number, cy: number) => {
    for (let g = 0; g < BEADS; g++) {
      const angle = hash(seed * 7.3 + g * 3.1) * Math.PI * 2;
      const far = 105 + hash(seed * 1.9 + g * 5.7) * 85;
      beadAt[g * 2] = Math.min(DW - 60, Math.max(60, cx + Math.cos(angle) * far * 1.5));
      beadAt[g * 2 + 1] = Math.min(DH - 50, Math.max(40, cy + Math.sin(angle) * far * 0.62));
    }
  };

  let from = DROP;
  let to = LAZUR;
  /** Index into LOOP of the shape being held or formed. */
  let at = 0;
  let melting = !options.still;
  /** Seconds into the hold or the melt. */
  let clock = options.still ? 60 : 0;
  let time = 0;
  let announced = -2;
  let radius = shapes[LAZUR].r;
  const pointer = { x: 0, y: 0, on: 0, live: false, nx: 0, ny: 0, lx: 0, ly: 0 };
  aimBeads(1, DW / 2, DH / 2);

  const announce = (index: number) => {
    if (index !== announced) {
      announced = index;
      options.onPhase(index);
    }
  };

  /** Seconds the shape being left has been on stage. */
  const heldFrom = () => (from === DROP ? 0 : LOOP[(at + LOOP.length - 1) % LOOP.length].hold) + clock;

  /** Mid-melt: every disc on its way from the old shape to the new one. */
  const place = () => {
    const a = shapes[from];
    const b = shapes[to];
    const progress = clock / MELT;
    const cx = a.cx + (b.cx - a.cx) * ease(progress);
    const cy = a.cy + (b.cy - a.cy) * ease(progress);
    const pool = Math.sqrt((COUNT * ((a.r + b.r) / 2 / 0.68) ** 2) / Math.PI) * 0.6;
    const was = heldFrom();
    const group = Math.floor(COUNT / BEADS);
    radius = (a.r + (b.r - a.r) * ease(progress)) * (1 + 0.95 * Math.sin(Math.PI * progress));
    for (let i = 0; i < COUNT; i++) {
      pointOf(from, i, was, time);
      const ax = out.x;
      const ay = out.y;
      pointOf(to, i, 0, time);
      // The melt sweeps across from the left, and no two discs leave at quite the same moment.
      const wait = 0.24 * (i / COUNT) + 0.05 * hash(i * 2.3);
      const e = ease(clamp01((progress - wait) / 0.66));
      let x = ax + (out.x - ax) * e;
      let y = ay + (out.y - ay) * e;
      const mid = Math.sin(Math.PI * e);
      const bead = Math.floor(i / group);
      if (i % group < BEAD_SIZE && bead < BEADS) {
        // A droplet: these few fly out together and are drawn back in.
        const spin = hash(i * 9.1) * Math.PI * 2;
        const far = Math.sqrt(hash(i * 3.3)) * 13;
        const pull = Math.pow(mid, 0.5) * 0.95;
        x += (beadAt[bead * 2] + Math.cos(spin) * far - x) * pull;
        y += (beadAt[bead * 2 + 1] + Math.sin(spin) * far - y) * pull;
      } else {
        // Everything else pools into one bead on the way, sagging a little under its own weight.
        const spin = hash(i * 4.7) * Math.PI * 2;
        const reach = Math.sqrt(hash(i * 8.3)) * pool;
        x += (cx + Math.cos(spin) * reach * 1.3 - x) * mid * 0.72;
        y += (cy + 10 + Math.sin(spin) * reach * 0.78 - y) * mid * 0.72;
      }
      // A slow swell through the body while it is loose.
      x += 3 * mid * Math.sin(time * 2.1 + y * 0.021);
      y += 3 * mid * Math.sin(time * 1.7 + x * 0.013);
      // The pointer pushes the liquid aside.
      if (pointer.on > 0.01) {
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < 80 && d > 0.01) {
          const push = (1 - d / 80) ** 2 * 26 * pointer.on;
          x += (dx / d) * push;
          y += (dy / d) * push;
        }
      }
      px[i] = x;
      py[i] = y;
    }
  };

  /** A shape as drawn, at some strength: full while it is held, fading as the discs take over. */
  const paintHeld = (k: number, held: number, strength: number) => {
    if (strength < 0.004) return;
    ctx.globalAlpha = strength;
    ctx.setTransform(UNIT, 0, 0, UNIT, 0, 0);
    paintShape(ctx, k, options.fontFamily, held, time);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
  };

  const draw = () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, SIM_W, SIM_H);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#fff";
    let shake = 1;
    /** How loose the metal is: 0 held, 1 mid-melt. The outline is blurred wider then, so it stays one smooth skin. */
    let loose = 0;
    if (melting) {
      const progress = clock / MELT;
      place();
      ctx.beginPath();
      const r = Math.max(1.5, radius * UNIT);
      for (let i = 0; i < COUNT; i++) {
        const x = px[i] * UNIT;
        const y = py[i] * UNIT;
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      }
      ctx.fill();
      paintHeld(from, heldFrom(), 1 - smooth(0, 0.16, progress));
      paintHeld(to, 0, smooth(0.84, 1, progress));
      shake = 1 + 3.4 * smooth(0.6, 1, progress);
      loose = Math.pow(Math.sin(Math.PI * progress), 0.7);
    } else {
      paintHeld(to, clock, 1);
      shake = 1 + 3.4 * Math.exp(-clock * 3);
    }
    // The pointer parts the liquid: a soft hole where it is.
    if (pointer.on > 0.01) {
      const x = pointer.x * UNIT;
      const y = pointer.y * UNIT;
      const reach = 34 * UNIT;
      const hole = ctx.createRadialGradient(x, y, 0, x, y, reach);
      hole.addColorStop(0, `rgba(0,0,0,${pointer.on.toFixed(3)})`);
      hole.addColorStop(0.5, `rgba(0,0,0,${(0.85 * pointer.on).toFixed(3)})`);
      hole.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = hole;
      ctx.fillRect(x - reach, y - reach, reach * 2, reach * 2);
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, source);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sim);

    gl.useProgram(blur);
    gl.uniform1i(blurTex, 0);
    gl.viewport(0, 0, SIM_W, SIM_H);
    const pass = (input: WebGLTexture | null, output: WebGLFramebuffer | null, sx: number, sy: number) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, output);
      gl.bindTexture(gl.TEXTURE_2D, input);
      gl.uniform2f(blurStep, sx / SIM_W, sy / SIM_H);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    // Tight blur for the outline; then twice more, wider each time, for the swell.
    const tight = 1.05 + 1.75 * loose;
    pass(source, scratch.fbo, tight, 0);
    pass(scratch.tex, edge.fbo, 0, tight);
    pass(edge.tex, scratch.fbo, 2.4, 0);
    pass(scratch.tex, swell.fbo, 0, 2.4);
    pass(swell.tex, scratch.fbo, 3.6, 0);
    pass(scratch.tex, swell.fbo, 0, 3.6);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(chrome);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, edge.tex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, swell.tex);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(u.edge, 0);
    gl.uniform1i(u.swell, 1);
    gl.uniform2f(u.texel, 1 / SIM_W, 1 / SIM_H);
    gl.uniform1f(u.scale, canvas.width / SIM_W);
    gl.uniform1f(u.ink, Math.max(1.2, (canvas.width / Math.max(1, canvas.clientWidth)) * 1.5));
    gl.uniform1f(u.time, time);
    gl.uniform1f(u.shake, shake);
    gl.uniform2f(u.mouse, pointer.lx, pointer.ly);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  // ---- time ------------------------------------------------------------------------------

  const advance = (dt: number) => {
    time += dt;
    clock += dt;
    if (melting) {
      if (clock > MELT * 0.58) announce(at);
      if (clock >= MELT) {
        melting = false;
        clock = 0;
      }
    } else if (clock >= LOOP[at].hold) {
      melting = true;
      clock = 0;
      from = LOOP[at].shape;
      at = (at + 1) % LOOP.length;
      to = LOOP[at].shape;
      aimBeads(time, (shapes[from].cx + shapes[to].cx) / 2, (shapes[from].cy + shapes[to].cy) / 2);
      announce(-1);
    }
    // Ease the pointer, so the light and the hole glide.
    const k = 1 - Math.exp(-dt * 6);
    pointer.lx += (pointer.nx - pointer.lx) * k;
    pointer.ly += (pointer.ny - pointer.ly) * k;
    pointer.on += ((pointer.live ? 1 : 0) - pointer.on) * k;
  };

  let raf = 0;
  let running = false;
  let dead = false;
  let last = 0;

  const frame = (now: number) => {
    raf = 0;
    if (!running || dead) return;
    advance(Math.min(0.05, Math.max(0, (now - last) / 1000)));
    last = now;
    draw();
    raf = requestAnimationFrame(frame);
  };

  const resize = () => {
    const box = canvas.getBoundingClientRect();
    const density = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(2, Math.round(box.width * density));
    const h = Math.max(2, Math.round(box.height * density));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    if (!dead && (options.still || !running)) draw();
  };

  const lost = (event: Event) => {
    event.preventDefault();
    dead = true;
    if (raf) cancelAnimationFrame(raf);
    options.onLost();
  };
  canvas.addEventListener("webglcontextlost", lost);

  resize();
  announce(options.still ? 0 : -1);

  return {
    destroy() {
      dead = true;
      running = false;
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", lost);
      for (const t of [scratch, edge, swell]) {
        gl.deleteFramebuffer(t.fbo);
        gl.deleteTexture(t.tex);
      }
      gl.deleteTexture(source);
      gl.deleteBuffer(quad);
      gl.deleteProgram(blur);
      gl.deleteProgram(chrome);
    },
    setRunning(on) {
      if (options.still || dead || on === running) return;
      running = on;
      if (on && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    },
    resize,
    setPointer(nx, ny, stage) {
      pointer.nx = nx;
      pointer.ny = ny;
      pointer.live = stage !== null;
      if (stage) {
        // Jump to where the pointer comes in, glide while it stays.
        const k = pointer.on < 0.05 ? 1 : 0.35;
        pointer.x += (stage.x - pointer.x) * k;
        pointer.y += (stage.y - pointer.y) * k;
      }
    },
  };
}
