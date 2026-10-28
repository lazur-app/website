"use client";

import { useSyncExternalStore } from "react";

/**
 * "I am a …" on the homepage: the page speaks to one kind of person. Picked from the top-right
 * switcher or linked directly with ?for=founder (use these links in targeted ads and posts).
 */
export type PersonaId = "everyone" | "founder" | "developer" | "student" | "lawyer";

export type Persona = {
  id: PersonaId;
  /** In the switcher: "I am a founder". */
  label: string;
  /** Headline first line; the second is always "right in the notch." */
  title: string;
  sub: string;
  /** What the notch says about itself in the intro. */
  intro: string;
  /** The everyday commands section. */
  everyday: string[];
};

export const PERSONAS: Persona[] = [
  {
    id: "everyone",
    label: "Just curious",
    title: "Your AI buddy,",
    sub: "Hold a key and talk. Lazur sees your screen, points at things, answers out loud and gets things done, in any app.",
    intro: "I'm your AI buddy. I live up here, in the notch.",
    everyday: [
      "Set a timer for 10 minutes",
      "Remind me to call Mom at 6",
      "Lunch with Sam on Friday at 1",
      "Play something calm",
      "Turn it down a bit",
      "Open Figma",
      "Open my Linear inbox",
      "Search flights to Goa",
      "Note: try the new onboarding copy",
      "Run my Morning shortcut",
    ],
  },
  {
    id: "founder",
    label: "a founder",
    title: "Your chief of staff,",
    sub: "Hold a key and talk. Lazur drafts the reply, researches the market, books the meeting and keeps your day moving, in any app.",
    intro: "I'm your chief of staff. I live up here, in the notch.",
    everyday: [
      "Draft a reply to this investor",
      "Research our top 5 competitors",
      "Call with Priya on Friday at 3",
      "Remind me to send the deck at 5",
      "Sum up this thread",
      "Open my Stripe dashboard",
      "Note: ask about pricing on the call",
      "Timer for 25 minutes, deep work",
    ],
  },
  {
    id: "developer",
    label: "a developer",
    title: "Your pair programmer,",
    sub: "Hold a key and talk. Lazur reads the error on your screen, points at the fix and types the commit message, in any editor.",
    intro: "I'm your pair programmer. I live up here, in the notch.",
    everyday: [
      "What does this error mean?",
      "Write a commit message for this",
      "Where's the deploy button?",
      "Explain this function",
      "Search the docs for useEffect cleanup",
      "Open the PR in Chrome",
      "Timer for 25 minutes, focus",
      "Play some lo-fi",
    ],
  },
  {
    id: "student",
    label: "a student",
    title: "Your study buddy,",
    sub: "Hold a key and talk. Lazur explains what's on your screen, turns notes into lists and keeps your deadlines, in any app.",
    intro: "I'm your study buddy. I live up here, in the notch.",
    everyday: [
      "Explain this diagram simply",
      "What does this paragraph mean?",
      "Remind me the essay is due Friday",
      "Timer for 50 minutes, study",
      "Turn this into a list",
      "Search for sources on this",
      "Open my class notes",
      "Play something to focus",
    ],
  },
  {
    id: "lawyer",
    label: "a lawyer",
    title: "Your paralegal,",
    sub: "Hold a key and talk. Lazur sums up long documents, points at the clause you need and drafts the email, in any app.",
    intro: "I'm your paralegal. I live up here, in the notch.",
    everyday: [
      "Sum up this contract",
      "Where's the termination clause?",
      "Draft a reply to opposing counsel",
      "Remind me of the filing deadline Monday",
      "Call with the client Thursday at 11",
      "Note: request discovery documents",
      "Search for this case",
      "Timer for 6 minutes, billing",
    ],
  },
];

const byId = (id: string | null) => PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];

let current: Persona | null = null;
const listeners = new Set<() => void>();

function read(): Persona {
  if (!current) current = byId(new URLSearchParams(window.location.search).get("for"));
  return current;
}

/** Pick a persona; the URL follows (?for=…) so the view can be shared or linked from an ad. */
export function setPersona(id: PersonaId) {
  current = byId(id);
  const url = new URL(window.location.href);
  if (id === "everyone") url.searchParams.delete("for");
  else url.searchParams.set("for", id);
  window.history.replaceState(null, "", url);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePersona(): Persona {
  return useSyncExternalStore(subscribe, read, () => PERSONAS[0]);
}
