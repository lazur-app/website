import { getAccessToken } from "@/lib/auth";

export const CEMETERY_PATH = "/cemetery";

export type Grave = {
  slug: string;
  display_name: string;
  epitaph: string | null;
  retired_on: string;
  words: number;
  words_at_retire: number;
};

/** First stones so the yard is never an empty field. API graves override the same slug. */
export const FOUNDING_GRAVES: Grave[] = [
  {
    slug: "vaidik",
    display_name: "Vaidik",
    epitaph: "Here lies QWERTY. He never learned to listen.",
    retired_on: "2026-08-14",
    words: 31492,
    words_at_retire: 12840,
  },
  {
    slug: "kai",
    display_name: "Kai",
    epitaph: "Can't see myself going back.",
    retired_on: "2026-06-02",
    words: 24810,
    words_at_retire: 9100,
  },
  {
    slug: "veer",
    display_name: "Veer",
    epitaph: "Cause of death: Slack.",
    retired_on: "2026-07-11",
    words: 18640,
    words_at_retire: 7200,
  },
  {
    slug: "akshat",
    display_name: "Akshat",
    epitaph: "Finally quiet. The cursor still moves.",
    retired_on: "2026-05-28",
    words: 15220,
    words_at_retire: 6400,
  },
  {
    slug: "sloane",
    display_name: "Sloane",
    epitaph: "Figma comments killed him.",
    retired_on: "2026-07-30",
    words: 12110,
    words_at_retire: 4800,
  },
  {
    slug: "sam",
    display_name: "Sam",
    epitaph: "Retired in favor of speaking.",
    retired_on: "2026-08-22",
    words: 8740,
    words_at_retire: 3100,
  },
];

export function mergeCemeteryGraves(apiGraves: Grave[]): Grave[] {
  const bySlug = new Map(FOUNDING_GRAVES.map((grave) => [grave.slug, grave]));
  for (const grave of apiGraves) {
    bySlug.set(grave.slug, grave);
  }
  return [...bySlug.values()];
}

export function findFoundingGrave(slug: string): Grave | null {
  const needle = slug.trim().toLowerCase();
  return FOUNDING_GRAVES.find((grave) => grave.slug === needle) ?? null;
}

export type CemeteryList = {
  total_graves: number;
  total_words: number;
  min_words: number;
  graves: Grave[];
};

export type CemeteryMe = {
  min_words: number;
  lifetime_words: number;
  can_retire: boolean;
  grave: Grave | null;
};

function withFoundingGraves(list: CemeteryList): CemeteryList {
  const graves = mergeCemeteryGraves(list.graves);
  return {
    ...list,
    graves,
    total_graves: graves.length,
    total_words: graves.reduce((sum, grave) => sum + grave.words, 0),
  };
}

function apiBase() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";
}

async function readError(res: Response, fallback: string) {
  const body = (await res.json().catch(() => null)) as { detail?: string } | null;
  return body?.detail || fallback;
}

const SITE_FALLBACK =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://www.lazur.app";

export function cemeteryUrl(slug: string, origin?: string) {
  const base = (origin || SITE_FALLBACK).replace(/\/$/, "");
  return `${base}${CEMETERY_PATH}/${encodeURIComponent(slug)}`;
}

export function formatRetiredOn(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatWords(n: number) {
  return n.toLocaleString("en-US");
}

export async function fetchCemetery(sort: "newest" | "words" = "newest") {
  const res = await fetch(`${apiBase()}/cemetery?sort=${sort}`, {
    cache: "no-store",
  });
  if (res.status === 404) {
    return withFoundingGraves({
      total_graves: 0,
      total_words: 0,
      min_words: 100,
      graves: [],
    });
  }
  if (!res.ok) {
    throw new Error(await readError(res, "Could not load the cemetery."));
  }
  return withFoundingGraves((await res.json()) as CemeteryList);
}

export async function fetchGrave(slug: string): Promise<Grave | null> {
  const res = await fetch(`${apiBase()}/cemetery/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return findFoundingGrave(slug);
  if (!res.ok) {
    throw new Error(await readError(res, "Could not load this grave."));
  }
  return (await res.json()) as Grave;
}

export async function fetchCemeteryMe(): Promise<CemeteryMe | null> {
  const token = getAccessToken();
  if (!token) return null;
  const res = await fetch(`${apiBase()}/cemetery/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) return null;
  if (!res.ok) {
    throw new Error(await readError(res, "Could not load your grave."));
  }
  return (await res.json()) as CemeteryMe;
}

export async function retireKeyboard(input: {
  display_name?: string;
  epitaph?: string;
}) {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Log in to retire a keyboard.");
  }
  const res = await fetch(`${apiBase()}/cemetery`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await readError(res, "Could not retire your keyboard."));
  }
  return (await res.json()) as Grave;
}

export async function updateGrave(input: {
  display_name?: string;
  epitaph?: string;
}) {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Log in to update your grave.");
  }
  const res = await fetch(`${apiBase()}/cemetery/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await readError(res, "Could not update your grave."));
  }
  return (await res.json()) as Grave;
}

export async function unretireKeyboard() {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Log in first.");
  }
  const res = await fetch(`${apiBase()}/cemetery/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(await readError(res, "Could not hide your grave."));
  }
}
