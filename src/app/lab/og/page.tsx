import Image from "next/image";
import { MarketingBackdrop } from "@/components/MarketingBackdrop";
import { PuzzleWordmark } from "@/components/PuzzleWordmark";
import { HandUnderline } from "@/components/buddy/HandLoop";
import { Sticker } from "@/components/landing/Sticker";
import { FounderSticker } from "@/components/landing/FounderSticker";
import { AppleIcon } from "@/components/icons/AppleIcon";

export const metadata = { title: "Share cards", robots: { index: false } };

/**
 * The link-preview cards (Open Graph / X), drawn in the site's own look so they can be screenshotted into
 * public/og/ at each platform's size: /lab/og?v=home&w=1200&h=630. See scripts/og/render-cards.mjs (the older card, og-buddy.png, is scripts/og/render.mjs).
 *   v: home | team | download | pricing
 *   w, h: the card's size in px (1200x630 for Open Graph, 1200x675 for X, 1200x1200 square)
 */
type Variant = "home" | "team" | "download" | "pricing";

const INK = "#e11d48";

function Logo({ big = false }: { big?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Image src="/logo.png" alt="" width={big ? 48 : 40} height={big ? 48 : 40} />
      <span className={`${big ? "text-[44px]" : "text-[38px]"} font-bold leading-none tracking-[-0.03em] text-[var(--foreground)]`}>lazur</span>
    </div>
  );
}

function UrlPill() {
  return (
    <div className="flex items-center gap-3">
      <span className="rounded-full border-[2px] border-[#1c1917] bg-white px-6 py-2.5 text-[26px] font-bold tracking-[-0.02em] text-[#1c1917] shadow-[0_3px_0_rgba(28,25,23,0.9)]">
        lazur.app
      </span>
      <span className="inline-flex items-center gap-2 rounded-full bg-[#1c1917] px-5 py-2.5 text-[22px] font-bold text-white">
        <AppleIcon className="-mt-1 h-5 w-5" />
        for mac
      </span>
    </div>
  );
}

/** The footer's jigsaw wordmark with the three of us on it (same positions as the footer). */
function WordmarkWithUs() {
  return (
    <div className="relative">
      <PuzzleWordmark />
      <div className="pointer-events-none absolute inset-0 [container-type:inline-size]">
        <FounderSticker who="vaidik" pose="sitcross" size="11.21cqw" className="!absolute bottom-[calc(81.25%-1.3cqw)] left-[22.2%] -translate-x-1/2" />
        <FounderSticker who="ayush" pose="sitwave" size="12.1cqw" className="!absolute bottom-[calc(60.4%-3.3cqw)] left-[61.4%] -translate-x-1/2" />
        <FounderSticker who="veer" pose="lean" size="13.57cqw" className="!absolute bottom-[calc(4.7%-1.05cqw)] left-[calc(85.7%-2.74cqw)] -translate-x-1/2" />
      </div>
    </div>
  );
}

function Polaroid({ src, name, rotate, className = "" }: { src: string; name: string; rotate: number; className?: string }) {
  return (
    <div
      className={`w-[230px] rounded-[20px] border-[2px] border-[#1c1917] bg-white p-2.5 shadow-[0_3px_0_rgba(28,25,23,0.9),0_18px_40px_-16px_rgba(28,25,23,0.35)] ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <Image src={src} alt="" width={460} height={520} className="aspect-[22/25] w-full rounded-[13px] object-cover" />
      <p className="pt-2 text-center font-[family-name:var(--font-caveat)] text-[30px] font-semibold leading-none text-[#1c1917]">{name}</p>
    </div>
  );
}

function TeamArt() {
  return (
    <div className="relative h-[400px] w-[560px]">
      <Polaroid src="/veer-img.jpeg" name="veer" rotate={-8} className="absolute left-0 top-10" />
      <Polaroid src="/vaidik-img.jpg" name="vaidik" rotate={2} className="absolute left-[165px] top-0 z-10" />
      <Polaroid src="/ayush-img.jpg" name="ayush" rotate={9} className="absolute left-[330px] top-12" />
      <FounderSticker who="vaidik" pose="thumbs" size={120} className="!absolute -bottom-6 left-[230px] z-20" />
      <Sticker name="heart" size={70} rotate={-12} className="absolute -left-4 -top-6 z-20" />
    </div>
  );
}

function DownloadArt() {
  return (
    <div className="relative flex h-[360px] w-[560px] items-center justify-end pr-6">
      <div className="relative">
        <FounderSticker who="vaidik" pose="point" size={170} className="!absolute bottom-[-24px] right-full mr-1" />
        <span className="inline-flex h-[110px] items-center gap-4 rounded-[44px] border-[2px] border-[#1c1917] bg-white px-11 text-[34px] font-bold tracking-[-0.03em] text-[#1c1917] shadow-[0_3px_0_rgba(28,25,23,0.9),0_16px_30px_-10px_rgba(28,25,23,0.24)]">
          <AppleIcon className="-mt-1 h-9 w-9" />
          download
        </span>
        <p className="mt-5 text-center text-[22px] text-[var(--foreground-muted)]">free 3-day pro trial · no card</p>
      </div>
      <Sticker name="cursor" size={80} rotate={-14} className="absolute right-6 top-6" />
      <Sticker name="star" size={60} rotate={10} className="absolute bottom-4 right-0" />
    </div>
  );
}

function PricingArt() {
  return (
    <div className="relative flex h-[380px] w-[500px] items-center justify-center">
      <div className="relative w-[300px] rounded-[18px] border-[2px] border-[#0c0b0a] bg-white text-center shadow-[0_3px_0_rgba(28,25,23,0.9),0_18px_40px_-16px_rgba(28,25,23,0.3)]">
        <div className="flex h-11 items-center gap-2 rounded-t-[16px] border-b-[2px] border-[#0c0b0a] bg-[#0c0b0a] px-4">
          {[0, 1, 2].map((d) => (
            <span key={d} className="h-3 w-3 rounded-full bg-white/70" />
          ))}
        </div>
        <div className="px-6 pb-8 pt-6">
          <p className="font-display text-[38px] font-medium leading-none tracking-[-0.04em]">pro</p>
          <p className="mt-2 text-[20px] text-[var(--foreground-muted)]">speak all day. no word math.</p>
          <p className="mt-5 font-display text-[88px] font-medium leading-none tracking-[-0.05em]">$18</p>
          <p className="mt-2 text-[18px] text-[var(--foreground-muted)]">a month, after 3 free days</p>
        </div>
        <Sticker name="crown" size={86} rotate={14} className="absolute -right-10 -top-8" />
      </div>
      <FounderSticker who="veer" pose="thumbs" size={150} className="!absolute bottom-0 left-0" />
    </div>
  );
}

const COPY: Record<Variant, { title: React.ReactNode; sub: string }> = {
  home: {
    title: (
      <>
        your{" "}
        <span className="relative inline-block whitespace-nowrap">
          ai companion
          <HandUnderline show color={INK} delay={0} duration={0.01} offset={2} />
        </span>
        ,<br />
        right by your cursor.
      </>
    ),
    sub: "hold two keys and talk. it sees your screen, points at things and gets it done, in any app.",
  },
  team: {
    title: (
      <>
        the three of us
        <br />
        behind{" "}
        <span className="relative inline-block whitespace-nowrap">
          lazur.
          <HandUnderline show color={INK} delay={0} duration={0.01} offset={2} />
        </span>
      </>
    ),
    sub: "vaidik, veer and ayush, building the companion that sits by your cursor.",
  },
  download: {
    title: (
      <>
        get{" "}
        <span className="relative inline-block whitespace-nowrap">
          lazur
          <HandUnderline show color={INK} delay={0} duration={0.01} offset={2} />
        </span>{" "}
        on
        <br />
        your mac.
      </>
    ),
    sub: "one download. hold two keys and talk, in any app.",
  },
  pricing: {
    title: (
      <>
        3 days free.
        <br />
        then{" "}
        <span className="relative inline-block whitespace-nowrap">
          $18
          <HandUnderline show color={INK} delay={0} duration={0.01} offset={2} />
        </span>{" "}
        a month.
      </>
    ),
    sub: "three simple plans. no credit card to start. cancel anytime.",
  },
};

export default async function OgLab({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const v = (["home", "team", "download", "pricing"].includes(q.v ?? "") ? q.v : "home") as Variant;
  const w = Number(q.w) || 1200;
  const h = Number(q.h) || 630;
  const square = w / h < 1.4;
  const copy = COPY[v];
  const art = v === "team" ? <TeamArt /> : v === "download" ? <DownloadArt /> : v === "pricing" ? <PricingArt /> : null;

  return (
    <main className="fixed left-0 top-0 overflow-hidden bg-[var(--background)]" style={{ width: w, height: h }}>
      {/* Hide the dev-only Next.js badge in the screenshots. */}
      <style>{`nextjs-portal{display:none!important}`}</style>
      <MarketingBackdrop />

      {v === "home" ? (
        // The homepage card: the headline over the jigsaw wordmark with the three of us on it.
        <div className="relative flex h-full flex-col px-14 pt-12" style={{ paddingTop: square ? 90 : 44 }}>
          <div className={`flex ${square ? "flex-col items-center gap-10 text-center" : "items-start justify-between"}`}>
            <div className={square ? "flex flex-col items-center" : ""}>
              <Logo big={square} />
              <h1 className={`mt-7 font-sans font-bold leading-[1.02] tracking-[-0.05em] text-[var(--foreground)] ${square ? "text-[92px]" : "text-[70px]"}`}>{copy.title}</h1>
              {square ? <p className="mx-auto mt-6 max-w-[880px] text-[32px] font-medium leading-snug text-[var(--foreground-muted)]">{copy.sub}</p> : null}
            </div>
            <div className={square ? "" : "mt-2"}>
              <UrlPill />
            </div>
          </div>
          <div className="absolute inset-x-10" style={{ bottom: square ? 70 : h > 650 ? 30 : 14 }}>
            <Sticker name="smiley" size={square ? 110 : 84} rotate={-8} className="absolute -top-10 right-6 z-10" />
            <div style={{ width: square ? "100%" : "92%", marginLeft: "auto", marginRight: "auto" }}>
              <WordmarkWithUs />
            </div>
          </div>
        </div>
      ) : (
        <div className={`relative flex h-full ${square ? "flex-col items-center justify-center gap-14 text-center" : "items-center justify-between"} px-16`}>
          <div className={`flex flex-col ${square ? "max-w-[1060px] items-center" : v === "download" ? "max-w-[520px]" : "max-w-[600px]"}`}>
            <Logo big={square} />
            <h1 className={`mt-8 font-sans font-bold leading-[1.02] tracking-[-0.05em] text-[var(--foreground)] ${square ? "text-[96px]" : "text-[72px]"}`}>{copy.title}</h1>
            <p className={`mt-6 font-medium leading-snug text-[var(--foreground-muted)] ${square ? "max-w-[860px] text-[32px]" : "text-[26px]"}`}>{copy.sub}</p>
            <div className="mt-9">
              <UrlPill />
            </div>
          </div>
          <div className={square ? "scale-[1.15]" : "-mr-4"}>{art}</div>
        </div>
      )}
    </main>
  );
}
