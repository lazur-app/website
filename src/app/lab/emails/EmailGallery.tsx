"use client";

import { useState } from "react";

export type GalleryTheme = { id: string; name: string; swatch: string };
export type GalleryEmail = {
  id: string;
  name: string;
  when: string;
  fromName: string;
  fromAddress: string;
  via: "resend" | "mailbox";
  subject: string;
  preheader: string;
  /** The email's HTML in each theme, by theme id. */
  html: Record<string, string>;
};

/** Every email, with buttons to redraw them all in another colour theme. */
export function EmailGallery({ themes, emails, initial }: { themes: GalleryTheme[]; emails: GalleryEmail[]; initial: string }) {
  const [theme, setTheme] = useState(initial);
  return (
    <>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-[14px] font-semibold text-[var(--foreground)]">Colour:</span>
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            className={`inline-flex items-center gap-2 rounded-full border-[1.5px] px-3.5 py-1.5 text-[14px] font-semibold transition-colors ${
              theme === t.id ? "border-[#1c1917] bg-white text-[#1c1917]" : "border-transparent bg-white/60 text-[var(--foreground-muted)] hover:bg-white"
            }`}
          >
            <span className="h-4 w-4 rounded-full border border-black/20" style={{ background: t.swatch }} />
            {t.name}
            {t.id === initial ? <span className="text-[11px] font-medium text-[var(--foreground-faint)]">(sent now)</span> : null}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        {emails.map((e) => (
          <section key={e.id} id={e.id}>
            <h3 className="text-[16px] font-semibold text-[var(--foreground)]">{e.name}</h3>
            <p className="mt-0.5 text-[13px] text-[var(--foreground-muted)]">{e.when}</p>
            <div className="mt-2 rounded-t-xl border border-b-0 border-black/15 bg-white px-4 py-2.5 text-[13px]">
              <p className="flex items-center gap-2">
                <span className="font-semibold text-[var(--foreground)]">{e.fromName}</span>
                <span className="text-[var(--foreground-faint)]">&lt;{e.fromAddress}&gt;</span>
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    e.via === "resend" ? "bg-black/[0.06] text-[var(--foreground)]" : "bg-black/[0.06] text-[var(--foreground-muted)]"
                  }`}
                >
                  {e.via === "resend" ? "Resend, branded" : "their mailbox, personal"}
                </span>
              </p>
              <p className="mt-1">
                <span className="font-semibold text-[var(--foreground)]">{e.subject}</span> <span className="text-[var(--foreground-faint)]">{e.preheader}</span>
              </p>
            </div>
            <iframe title={e.name} srcDoc={e.html[theme]} className="h-[900px] w-full rounded-b-xl border border-black/15 bg-white" />
          </section>
        ))}
      </div>
    </>
  );
}
