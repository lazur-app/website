import type { Box, FilmSpec } from "../engine/types";

// "it does." v3 — ask, then the result lands straight away. No Thinking shots.
// Vaidik's voice is muted in both parts (captions carry what he says); Lazur's spoken reply stays.
// Only card digits, amounts and the invoice number are blurred.

const NOTCH: Box = { x: 1116, y: 2, w: 708, h: 66 }; // the Lazur notch pill, floated big in the centre
const MAIL: Box = { x: 250, y: 300, w: 1700, h: 1250 }; // the Gmail draft
const DOC: Box = { x: 560, y: 520, w: 1800, h: 1324 }; // the Google Docs page

export const filmDoes: FilmSpec = {
  id: "does",
  width: 1440,
  height: 1080,
  shots: [
    // ---------- PART 1: Gmail ----------
    // 0.00-1.10  the notch: Listening
    { rec: "rec04", from: 1.0, to: 2.1, cam: [{ at: 1.0, box: MAIL }], spot: NOTCH },
    // 1.10-2.90  he circles the two recipients
    {
      rec: "rec04",
      from: 2.1,
      to: 3.9,
      cam: [
        { at: 2.1, box: { x: 290, y: 320, w: 1400, h: 1029 } },
        { at: 3.9, box: { x: 300, y: 330, w: 1200, h: 882 }, ease: "soft" },
      ],
      enter: "punch",
    },
    // 2.90-4.50  the ink keeps going (x2)
    {
      rec: "rec04",
      from: 4.0,
      to: 7.2,
      rate: 2,
      cam: [
        { at: 4.0, box: { x: 300, y: 330, w: 1200, h: 882 } },
        { at: 7.2, box: { x: 290, y: 340, w: 1300, h: 956 }, ease: "even" },
      ],
    },
    // 4.50-7.00  straight to the result: the email flows in, top to bottom
    {
      rec: "rec04",
      from: 25.0,
      to: 27.5,
      cam: [
        { at: 25.0, box: { x: 290, y: 340, w: 1300, h: 956 } },
        { at: 27.5, box: { x: 280, y: 330, w: 1500, h: 1103 }, ease: "soft" },
      ],
      reveal: { at: 25.1, dur: 1.3, box: { x: 300, y: 555, w: 1700, h: 380 }, fill: "#ffffff" },
    },
    // 7.00-8.20  the notch: Speaking
    { rec: "rec04", from: 24.2, to: 25.4, cam: [{ at: 24.2, box: MAIL }], spot: NOTCH },

    // ---------- PART 2: Google Docs ----------
    // 8.20-11.40  a blank doc and the ask
    {
      rec: "rec06",
      from: 3.0,
      to: 6.2,
      cam: [
        { at: 3.0, box: { x: 440, y: 440, w: 2040, h: 1500 } },
        { at: 6.2, box: DOC, ease: "soft" },
      ],
      enter: "whip",
    },
    // 11.40-15.20  straight to the result: the four summaries flow in
    {
      rec: "rec06",
      from: 25.7,
      to: 29.5,
      cam: [
        { at: 25.7, box: { x: 640, y: 600, w: 1560, h: 1147 } },
        { at: 29.5, box: { x: 700, y: 640, w: 1440, h: 1059 }, ease: "soft" },
      ],
      reveal: { at: 25.9, dur: 1.4, box: { x: 780, y: 770, w: 1340, h: 470 }, fill: "#ffffff" },
      blurs: [
        { x: 1300, y: 860, w: 118, h: 48 }, // Rs amount
        { x: 1820, y: 860, w: 96, h: 48 }, // card ending
        { x: 1400, y: 976, w: 100, h: 48 }, // bill amount
        { x: 1340, y: 1094, w: 100, h: 48 }, // bill amount
        { x: 1262, y: 1170, w: 192, h: 48 }, // invoice number
        { x: 1556, y: 1170, w: 104, h: 48 }, // amount
      ],
    },
  ],
  captions: [
    { at: 0.3, dur: 4.1, text: "Draft an email for these two guys, updating about our first user.", kind: "say" },
    { at: 5.9, dur: 2.3, text: "Done. The email is in the compose window.", kind: "result" },
    {
      at: 8.4,
      dur: 3.0,
      text: "Hey Lazur, please paste the summary of what my finance advisor wrote to me here in the last 7 days.",
      kind: "say",
    },
    { at: 12.8, dur: 2.3, text: "4 email summaries pasted", kind: "result" },
  ],
  voice: [
    { rec: "rec04", from: 24.3, to: 26.65, at: 5.85 }, // Lazur: "Done. The email is in the compose window."
    { rec: "rec06", from: 30.75, to: 33.0, at: 12.75 }, // Lazur: "Done. I pasted four finance mails"
  ],
  // only Lazur's text appearing gets a sound
  sfx: [
    { at: 4.6, sound: "text_pop", volume: 0.3 },
    { at: 11.6, sound: "text_pop", volume: 0.3 },
  ],
};
