import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { GAMES, gameBySlug } from "@/lib/games";
import { SITE_NAME, SITE_URL } from "@/lib/seo/constants";
import { GamePlayer } from "@/components/games/GamePlayer";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = gameBySlug((await params).slug);
  if (!g) return {};
  return {
    title: `${g.name}: free online game | Lazur`,
    description: g.description,
    alternates: { canonical: `${SITE_URL}/games/${g.slug}` },
    openGraph: { title: `${g.name} · play free in your browser`, description: g.tagline, url: `${SITE_URL}/games/${g.slug}` },
  };
}

export default async function GamePage({ params }: Props) {
  const g = gameBySlug((await params).slug);
  if (!g) notFound();
  const others = GAMES.filter((o) => o.slug !== g.slug);
  return (
    <MarketingPageShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "VideoGame",
            name: g.name,
            description: g.description,
            url: `${SITE_URL}/games/${g.slug}`,
            genre: "Casual",
            gamePlatform: "Web browser",
            applicationCategory: "Game",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              { "@type": "ListItem", position: 2, name: "Games", item: `${SITE_URL}/games` },
              { "@type": "ListItem", position: 3, name: g.name, item: `${SITE_URL}/games/${g.slug}` },
            ],
          },
        ]}
      />
      <Navbar />
      <main className="overflow-x-clip bg-[#0b0d17] text-white">
        <section className="relative pb-14 pt-28 md:pt-32">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full opacity-40 blur-3xl" style={{ background: `radial-gradient(circle, ${g.color}, transparent 65%)` }} aria-hidden />
          <div className="relative mx-auto max-w-5xl px-4">
            <nav className="mb-4 flex items-center gap-2 text-[13px] text-white/50" aria-label="Breadcrumb">
              <Link href="/games" className="hover:text-white">← All games</Link>
            </nav>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-none tracking-[-0.03em]">{g.name}</h1>
                <p className="mt-2 text-[16px] text-white/60">{g.tagline}</p>
              </div>
            </div>

            <GamePlayer slug={g.slug} />

            <div className="mt-8 grid gap-4 md:grid-cols-[1.2fr_1fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="font-display text-lg font-semibold">How to play</h2>
                <ul className="mt-3 space-y-2">
                  {g.controls.map((c) => (
                    <li key={c} className="flex gap-2.5 text-[15px] text-white/70">
                      <span style={{ color: g.color }} aria-hidden>✦</span>
                      {c}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[13px] text-white/40">Your best score is saved in this browser only.</p>
              </div>
              <div className="rounded-3xl p-[2px]" style={{ background: `linear-gradient(135deg, ${g.color}, ${g.color2})` }}>
                <div className="h-full rounded-[22px] bg-[#11131f] p-6">
                  <p className="text-2xl" aria-hidden>✦</p>
                  <h2 className="mt-2 font-display text-lg font-semibold">Made by Lazur</h2>
                  <p className="mt-1.5 text-[15px] text-white/65">An AI buddy that lives in your Mac&apos;s notch. Hold a key, say what you need, and it does it in any app.</p>
                  <Link href="/download" className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 text-[14px] font-bold text-[#0b0d17] transition hover:scale-105">
                    Try it free
                  </Link>
                </div>
              </div>
            </div>

            <h2 className="mt-12 font-display text-xl font-semibold">More games</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {others.map((o) => (
                <Link key={o.slug} href={`/games/${o.slug}`} className="group rounded-2xl p-[2px] transition hover:-translate-y-1" style={{ background: `linear-gradient(135deg, ${o.color}, ${o.color2})` }}>
                  <div className="flex h-full items-center gap-3 rounded-[14px] bg-[#11131f] p-4">
                    <span className="text-3xl transition group-hover:scale-110" aria-hidden>{o.emoji}</span>
                    <span className="font-semibold leading-tight">{o.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
