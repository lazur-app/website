// FilmSpec: everything one film needs. A film agent only writes a spec file in src/films/.
// All boxes are in SOURCE pixels of the 2940x1912 recordings (top-left x,y + w,h).

export type Box = { x: number; y: number; w: number; h: number };

export type Ease = "even" | "slowInLand" | "whip" | "standard" | "soft" | "violentPush" | "linear";

/** A camera key: at SOURCE time `at` (seconds in the recording), frame `box`. */
export type CamKey = { at: number; box: Box; ease?: Ease };

export type Enter = "cut" | "punch" | "whip" | "flash" | "zoomThrough";

export type Shot = {
  rec: string; // "rec01"
  from: number; // source seconds
  to: number; // source seconds
  rate?: number; // playback speed, default 1 (2 = twice as fast)
  cam: CamKey[]; // at least one key; keys are in source seconds inside [from,to]
  enter?: Enter; // how this shot arrives (default "cut")
  punches?: number[]; // SOURCE seconds where a quick zoom-punch accent hits
  /** Spotlight: dim + soften the app and float this source box (e.g. the notch) big in the centre. */
  spot?: Box;
  blurs?: Box[]; // source-pixel boxes kept blurred for the whole shot (card numbers, amounts)
  /** Text that pops in on one source frame: reveal it smoothly, top to bottom, inside `box`. */
  reveal?: { at: number; dur: number; box: Box; beforeAt?: number; fill?: string }; // at = SOURCE seconds, dur = FILM seconds
};

/** A piece of the recording's real audio (the user's voice, Lazur's spoken reply). */
export type Voice = { rec: string; from: number; to: number; at: number; volume?: number };

export type CaptionKind =
  | "say" // what you say: grey lowercase quote, words pop in one by one
  | "result" // what Lazur hands back: white text on the black tilted ribbon (site style)
  | "label" // small pill label, e.g. the notch state
  | "title"; // big display headline, lowercase, optional serif-italic accent word

export type Caption = {
  at: number; // FILM seconds (from the start of the film, intro included)
  dur: number;
  text: string;
  kind: CaptionKind;
  accent?: string; // for "title": the one word set in the serif italic
  pos?: "top" | "bottom" | "center";
};

/** A sound cue at FILM seconds. `sound` is a file name in public/sfx without .mp3. */
export type Cue = { at: number; sound: string; volume?: number };

export type Card = { text: string; accent?: string; dur: number; sub?: string };

export type FilmSpec = {
  id: string; // composition id, letters/digits/hyphens
  width: number;
  height: number;
  intro?: Card; // optional title card before the footage
  shots: Shot[];
  outro?: Card; // optional end card (e.g. "lazur" + line)
  captions: Caption[];
  sfx: Cue[];
  music?: { volume: number; startAt?: number };
  voice?: Voice[];
};
