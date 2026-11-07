import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { GAMES } from "@/lib/games";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Free browser games: Notch Catcher, Typo Hunt, Desk Tetris and more | Lazur",
  description: "Five quick free games that run in your browser: catch falling coffee, say tongue twisters out loud, guess Mac shortcuts, hunt typos and stack your desk. No sign-up.",
  alternates: { canonical: `${SITE_URL}/games` },
};

export default function GamesHub() {
  return (
    <MarketingPageShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Lazur games",
          itemListElement: GAMES.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/games/${g.slug}`, name: g.name })),
        }}
      />
      <Navbar />
      <main className="overflow-x-clip">
        <section className="relative overflow-hidden bg-[#0b0d17] pb-20 pt-32 text-white md:pt-40">
          {/* starfield + glow */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute left-1/2 top-0 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.35),transparent_60%)]" />
            {Array.from({ length: 40 }, (_, i) => (
              <span key={i} className="absolute h-[2px] w-[2px] rounded-full bg-white" style={{ left: `${(i * 37.7) % 100}%`, top: `${(i * 53.3) % 100}%`, opacity: 0.2 + ((i * 7) % 10) / 15 }} />
            ))}
          </div>

          <div className="landing-container relative text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[13px] font-semibold text-white/80">
              <span className="text-[#60a5fa]">✦</span> The Lazur arcade
            </p>
            <h1 className="mx-auto mt-5 max-w-3xl font-display text-[clamp(2.6rem,6vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.04em]">
              Take a break.{" "}
              <span className="bg-gradient-to-r from-[#60a5fa] via-[#a78bfa] to-[#f472b6] bg-clip-text text-transparent">Play something.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[17px] text-white/65">Five quick games that run right here in your browser. No sign-up, no downloads. Beat your best, then send it to a friend.</p>
          </div>

          <div className="landing-container relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GAMES.map((g, i) => (
              <Link
                key={g.slug}
                href={`/games/${g.slug}`}
                className={`group relative overflow-hidden rounded-[28px] p-[2px] transition duration-300 hover:-translate-y-1.5 ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
                style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color2})` }}
              >
                <div className="relative flex h-full flex-col overflow-hidden rounded-[26px] bg-[#11131f] p-6">
                  <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full opacity-40 blur-2xl transition group-hover:opacity-70" style={{ background: g.color }} aria-hidden />
                  <div className="relative mb-6 grid h-36 place-items-center rounded-2xl" style={{ background: `linear-gradient(135deg, ${g.color}33, ${g.color2}22)` }}>
                    <span className="games-bob text-7xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" style={{ animationDelay: `${i * 0.4}s` }} aria-hidden>
                      {g.emoji}
                    </span>
                  </div>
                  <h2 className="relative font-display text-2xl font-semibold tracking-tight">{g.name}</h2>
                  <p className="relative mt-1.5 flex-1 text-[15px] text-white/60">{g.tagline}</p>
                  <span
                    className="relative mt-5 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-bold text-white transition group-hover:gap-3"
                    style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color2})` }}
                  >
                    ▶ Play
                  </span>
                </div>
              </Link>
            ))}
            <div className="flex flex-col justify-center rounded-[28px] border border-dashed border-white/15 p-6 text-white/60">
              <p className="text-3xl" aria-hidden>✦</p>
              <p className="mt-3 font-display text-xl font-semibold text-white">Rather get work done?</p>
              <p className="mt-1.5 text-[15px]">Lazur is an AI buddy for your Mac. Hold a key, say what you need, and it does it in any app.</p>
              <Link href="/download" className="mt-4 w-fit rounded-full bg-white px-5 py-2.5 text-[14px] font-bold text-[#0b0d17] transition hover:scale-105">
                Try Lazur free
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
