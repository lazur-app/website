"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReferralCapture } from "@/components/ReferralCapture";
import { GraveStone } from "@/components/cemetery/GraveStone";
import { useAuth } from "@/components/AuthProvider";
import { loginPathWithReturn } from "@/lib/returnTo";
import {
  CEMETERY_PATH,
  cemeteryUrl,
  fetchCemetery,
  fetchCemeteryMe,
  formatWords,
  retireKeyboard,
  unretireKeyboard,
  updateGrave,
  type CemeteryList,
  type CemeteryMe,
  type Grave,
} from "@/lib/cemetery";

const MAX_NAME = 32;
const MAX_EPITAPH = 80;

function sortGraves(graves: Grave[], sort: "newest" | "words") {
  const rows = [...graves];
  if (sort === "words") {
    rows.sort((a, b) => b.words - a.words || a.display_name.localeCompare(b.display_name));
  } else {
    rows.sort(
      (a, b) =>
        b.retired_on.localeCompare(a.retired_on) ||
        a.display_name.localeCompare(b.display_name),
    );
  }
  return rows;
}

export function CemeteryPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [list, setList] = useState<CemeteryList | null>(null);
  const [me, setMe] = useState<CemeteryMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<"newest" | "words">("words");
  const [query, setQuery] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [epitaph, setEpitaph] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [plotOpen, setPlotOpen] = useState(false);

  const defaultName = user?.name?.trim().split(/\s+/)[0] || "";

  useEffect(() => {
    if (!displayName && defaultName) setDisplayName(defaultName);
  }, [defaultName, displayName]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCemetery(sort)
      .then((data) => {
        if (!cancelled) setList(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load the cemetery.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sort]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setMe(null);
      return;
    }
    fetchCemeteryMe()
      .then((data) => {
        setMe(data);
        if (data?.grave) {
          setDisplayName(data.grave.display_name);
          setEpitaph(data.grave.epitaph || "");
        }
      })
      .catch(() => {
        setMe(null);
      });
  }, [authLoading, isAuthenticated]);

  const ordered = useMemo(() => {
    const rows = sortGraves(list?.graves ?? [], sort);
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((g) => g.display_name.toLowerCase().includes(q));
  }, [list, query, sort]);

  async function refreshAll() {
    const [nextList, nextMe] = await Promise.all([
      fetchCemetery(sort),
      isAuthenticated ? fetchCemeteryMe() : Promise.resolve(null),
    ]);
    setList(nextList);
    setMe(nextMe);
    if (nextMe?.grave) {
      setDisplayName(nextMe.grave.display_name);
      setEpitaph(nextMe.grave.epitaph || "");
    }
  }

  async function onRetire(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const grave = await retireKeyboard({
        display_name: displayName.trim() || undefined,
        epitaph: epitaph.trim() || undefined,
      });
      await refreshAll();
      router.replace(`${CEMETERY_PATH}/${grave.slug}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not retire your keyboard.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await updateGrave({
        display_name: displayName.trim() || undefined,
        epitaph: epitaph.trim() || undefined,
      });
      await refreshAll();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not update your grave.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onUnretire() {
    setFormError(null);
    setSubmitting(true);
    try {
      await unretireKeyboard();
      await refreshAll();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not hide your grave.");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyShareLink() {
    if (!me?.grave) return;
    const url = cemeteryUrl(me.grave.slug, window.location.origin);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const minWords = me?.min_words ?? list?.min_words ?? 100;

  return (
    <div className="cemetery-page relative min-h-screen">
      <ReferralCapture />
      <Navbar />
      <main className="relative mx-auto w-full max-w-6xl px-5 pb-24 pt-24 md:px-8 md:pt-28">
        <header className="text-center">
          <p className="text-[28px] leading-none" aria-hidden>
            ⚰️
          </p>
          <h1 className="mt-3 font-display text-[2.25rem] font-semibold tracking-[-0.04em] text-[var(--foreground)] md:text-[3rem]">
            Keyboard Cemetery
          </h1>
          {list ? (
            <p className="mt-3 font-mono text-[13px] tabular-nums text-[var(--foreground-muted)]">
              {formatWords(list.total_graves)}
              <span className="mx-1.5 text-[var(--foreground-faint)]">·</span>
              {formatWords(list.total_words)}
            </p>
          ) : null}
        </header>

        <div className="mt-6 flex items-center justify-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name"
            aria-label="Find a name"
            className="cemetery-chip h-9 w-36 px-3 text-[13px] outline-none"
          />
          <div className="cemetery-chip flex p-0.5 text-[12px]" role="group" aria-label="Sort">
            {(
              [
                ["words", "Words"],
                ["newest", "New"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSort(value)}
                className={`rounded-full px-3 py-1 ${
                  sort === value
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "text-[var(--foreground-muted)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <section className="cemetery-yard mt-10 px-4 py-10 md:px-8 md:py-12" aria-label="Cemetery">
          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--foreground-faint)]" />
            </div>
          ) : error ? (
            <p className="py-16 text-center text-[14px] text-red-700">{error}</p>
          ) : !ordered.length ? (
            <p className="py-16 text-center text-[14px] text-[var(--foreground-muted)]">
              {query.trim() ? "No grave with that name." : "Empty plot."}
            </p>
          ) : (
            <div className="cemetery-plots">
              {ordered.map((grave, i) => (
                <div
                  key={grave.slug}
                  className={`cemetery-plot ${i % 2 === 1 ? "cemetery-plot--offset" : ""}`}
                >
                  <GraveStone
                    grave={grave}
                    featured={i === 0 && !query.trim()}
                    href={`${CEMETERY_PATH}/${grave.slug}`}
                  />
                </div>
              ))}
              <div className={`cemetery-plot ${ordered.length % 2 === 1 ? "cemetery-plot--offset" : ""}`}>
                <EmptyPlot
                  authLoading={authLoading}
                  isAuthenticated={isAuthenticated}
                  me={me}
                  minWords={minWords}
                  plotOpen={plotOpen}
                  setPlotOpen={setPlotOpen}
                  displayName={displayName}
                  setDisplayName={setDisplayName}
                  epitaph={epitaph}
                  setEpitaph={setEpitaph}
                  submitting={submitting}
                  formError={formError}
                  copied={copied}
                  onRetire={onRetire}
                  onSave={onSave}
                  onUnretire={onUnretire}
                  copyShareLink={copyShareLink}
                />
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function EmptyPlot({
  authLoading,
  isAuthenticated,
  me,
  minWords,
  plotOpen,
  setPlotOpen,
  displayName,
  setDisplayName,
  epitaph,
  setEpitaph,
  submitting,
  formError,
  copied,
  onRetire,
  onSave,
  onUnretire,
  copyShareLink,
}: {
  authLoading: boolean;
  isAuthenticated: boolean;
  me: CemeteryMe | null;
  minWords: number;
  plotOpen: boolean;
  setPlotOpen: (open: boolean) => void;
  displayName: string;
  setDisplayName: (value: string) => void;
  epitaph: string;
  setEpitaph: (value: string) => void;
  submitting: boolean;
  formError: string | null;
  copied: boolean;
  onRetire: (event: FormEvent) => void;
  onSave: (event: FormEvent) => void;
  onUnretire: () => void;
  copyShareLink: () => void;
}) {
  if (!authLoading && !isAuthenticated) {
    return (
      <Link href={loginPathWithReturn(CEMETERY_PATH)} className="monument monument--empty monument--0 block">
        <EmptyMonumentFace name="You" date="Retire yours" />
      </Link>
    );
  }

  if (me?.grave && !plotOpen) {
    return (
      <button type="button" className="monument monument--empty monument--0" onClick={() => setPlotOpen(true)}>
        <EmptyMonumentFace name={me.grave.display_name} date="Your plot" />
      </button>
    );
  }

  if (!plotOpen && !me?.grave) {
    return (
      <button type="button" className="monument monument--empty monument--0" onClick={() => setPlotOpen(true)}>
        <EmptyMonumentFace
          name="You"
          date={`${formatWords(me?.lifetime_words ?? 0)} / ${formatWords(minWords)}`}
        />
      </button>
    );
  }

  return (
    <div className="monument monument--empty monument--form">
      <div className="monument__tablet">
        <div className="monument__face monument__face--form">
            {me?.grave ? (
              <form onSubmit={onSave} className="space-y-3 text-left">
                <Field
                  id="cemetery-name"
                  label="Name"
                  value={displayName}
                  onChange={setDisplayName}
                  maxLength={MAX_NAME}
                />
                <Field
                  id="cemetery-epitaph"
                  label="Epitaph"
                  value={epitaph}
                  onChange={setEpitaph}
                  maxLength={MAX_EPITAPH}
                  placeholder="Here lies QWERTY."
                />
                {formError && <p className="text-[12px] text-red-700">{formError}</p>}
                <button type="submit" disabled={submitting} className="btn-dark w-full px-4 py-2.5 text-[13px]">
                  {submitting ? "Saving…" : "Update"}
                </button>
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="inline-flex w-full items-center justify-center gap-1.5 text-[13px] text-[var(--foreground-muted)]"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button type="button" onClick={onUnretire} className="w-full text-[12px] text-[var(--foreground-faint)]">
                  Remove
                </button>
              </form>
            ) : (
              <form onSubmit={onRetire} className="space-y-3 text-left">
                <p className="text-center font-mono text-[11px] tabular-nums text-[var(--foreground-muted)]">
                  {formatWords(me?.lifetime_words ?? 0)} / {formatWords(minWords)}
                </p>
                <Field
                  id="cemetery-name"
                  label="Name"
                  value={displayName}
                  onChange={setDisplayName}
                  maxLength={MAX_NAME}
                />
                <Field
                  id="cemetery-epitaph"
                  label="Epitaph"
                  value={epitaph}
                  onChange={setEpitaph}
                  maxLength={MAX_EPITAPH}
                  placeholder="Here lies QWERTY."
                />
                {formError && <p className="text-[12px] text-red-700">{formError}</p>}
                <button
                  type="submit"
                  disabled={submitting || !me?.can_retire}
                  className="btn-dark w-full px-4 py-2.5 text-[13px] disabled:opacity-50"
                >
                  {submitting ? "…" : "Retire"}
                </button>
              </form>
            )}
        </div>
      </div>
      <div className="monument__plinth" aria-hidden>
        <span className="monument__plinth-cap" />
        <span className="monument__plinth-base" />
      </div>
    </div>
  );
}

function EmptyMonumentFace({ name, date }: { name: string; date: string }) {
  return (
    <>
      <div className="monument__tablet">
        <div className="monument__face">
          <p className="monument__name">{name}</p>
          <p className="monument__date">{date}</p>
        </div>
      </div>
      <div className="monument__plinth" aria-hidden>
        <span className="monument__plinth-cap" />
        <span className="monument__plinth-base" />
      </div>
    </>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  maxLength,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="sr-only">{label}</span>
      <input
        id={id}
        value={value}
        maxLength={maxLength}
        placeholder={label}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        className="cemetery-chip h-10 w-full px-3 text-[13px] outline-none"
      />
    </label>
  );
}
