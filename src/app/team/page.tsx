import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MarketingPageShell } from "@/components/MarketingPageShell";
import { HandUnderline } from "@/components/buddy/HandLoop";
import { Sticker } from "@/components/landing/Sticker";
import { FounderSticker, type Pose, type Who } from "@/components/landing/FounderSticker";
import { FOUNDER_LINKS } from "@/lib/founders";
import { SITE_URL } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Team | Lazur",
  description: "Meet Vaidik, Veer and Ayush, the three people building Lazur, your AI companion by your cursor.",
  alternates: { canonical: `${SITE_URL}/team` },
};

/**
 * DRAFT COPY: the stories and the mission below are placeholders, clearly marked on the page, until the founders send
 * their own words. Vaidik's and Ayush's photos are still to come; until then their cartoon stands in the photo frame.
 */
type Founder = {
  who: Who;
  name: string;
  role: string;
  photo: string | null;
  pose: Pose;
  story: string[];
};

const FOUNDERS: Founder[] = [
  {
    who: "vaidik",
    name: "Vaidik Sule",
    role: "Founder",
    photo: null,
    pose: "wave",
    story: [
      "Vaidik's story goes here: what got him building Lazur, what he was doing before, and the moment the idea clicked.",
      "A second short paragraph: what he works on day to day and what he cares about most in the product.",
    ],
  },
  {
    who: "veer",
    name: "Veer Adyani",
    role: "Co-founder",
    photo: "/veer-img.jpeg",
    pose: "thumbs",
    story: [
      "Veer's story goes here: how he met the others, what he brings to Lazur, and why he joined.",
      "A second short paragraph: the part of Lazur he looks after and what he hopes it does for people.",
    ],
  },
  {
    who: "ayush",
    name: "Ayush Agrawal",
    role: "Co-founder",
    photo: null,
    pose: "yay",
    story: [
      "Ayush's story goes here: his path to Lazur, what he built before, and what pulled him in.",
      "A second short paragraph: what he works on at Lazur and what he is most excited to ship.",
    ],
  },
];

const INK = "#e11d48";

/** A small red tag on every block of placeholder copy, so nobody mistakes it for the real thing. */
function DraftTag({ note = "placeholder text" }: { note?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#e11d48] bg-[#fff1f4] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#e11d48] [text-transform:uppercase]">
      draft · {note}
    </span>
  );
}

function FounderRow({ founder, index }: { founder: Founder; index: number }) {
  const flip = index % 2 === 1;
  const links = FOUNDER_LINKS[founder.who].links;
  return (
    <article className={`grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14 ${flip ? "md:[&>*:first-child]:order-2" : ""}`}>
      {/* The photo, in a polaroid-ish ink frame, with their cartoon leaning on its corner. */}
      <div className="relative mx-auto w-full max-w-[340px]">
        <div
          className={`overflow-hidden rounded-[24px] border-[1.5px] border-[#1c1917] bg-white p-3 shadow-[0_2px_0_rgba(28,25,23,0.9),0_18px_40px_-18px_rgba(28,25,23,0.3)] ${flip ? "rotate-[2deg]" : "rotate-[-2deg]"}`}
        >
          {founder.photo ? (
            <Image
              src={founder.photo}
              alt={`${founder.name}, ${founder.role.toLowerCase()} of Lazur`}
              width={460}
              height={460}
              className="aspect-square w-full rounded-[16px] object-cover"
            />
          ) : (
            <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-[16px] bg-[#f3f1ec]">
              <FounderSticker who={founder.who} pose="sitcross" size={170} />
              <span className="font-[family-name:var(--font-caveat)] text-[22px] font-semibold text-[var(--foreground-muted)]">real photo coming soon</span>
            </div>
          )}
          <p className="pt-3 text-center font-[family-name:var(--font-caveat)] text-[24px] font-semibold leading-none text-[#1c1917]">{founder.name.split(" ")[0]}</p>
        </div>
        {founder.photo ? (
          <FounderSticker
            who={founder.who}
            pose={founder.pose}
            size={128}
            className={`!absolute -bottom-6 ${flip ? "-left-8 sm:-left-14" : "-right-8 sm:-right-14"}`}
          />
        ) : null}
      </div>

      <div className="text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
          <h2 className="font-display text-[clamp(2rem,3.6vw,2.9rem)] font-bold leading-none tracking-[-0.04em] text-[var(--foreground)]">{founder.name}</h2>
          <span className="rounded-full bg-[#1c1917] px-3 py-1 text-[13px] font-bold text-white">{founder.role}</span>
        </div>
        <div className="mt-4">
          <DraftTag note="their story, in their words, soon" />
        </div>
        <div className="mx-auto mt-4 max-w-[36rem] space-y-3 text-[17px] leading-relaxed text-[var(--foreground-muted)] md:mx-0">
          {founder.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <ul className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-2.5 md:justify-start">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[#1c1917] bg-white px-4 text-[14px] sm:px-5 sm:text-[15px] font-bold text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9)] transition-transform hover:-translate-y-0.5"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** The team: who we are, each of our stories, and what we are building Lazur for. */
export default function TeamPage() {
  return (
    <MarketingPageShell>
      <Navbar />
      <main className="relative overflow-x-clip px-4 pb-24 pt-32 sm:px-6 md:pt-40">
        <div className="landing-container">
          <header className="relative mx-auto max-w-3xl text-center">
            <Sticker name="puzzle" size={64} rotate={-12} className="absolute -left-1 -top-14 origin-bottom-left scale-[0.75] sm:-left-10 sm:-top-6 sm:scale-100" />
            <Sticker name="star" size={58} rotate={10} className="absolute -right-1 -top-14 origin-bottom-right scale-[0.75] sm:-right-10 sm:-top-4 sm:scale-100" />
            <h1 className="font-sans text-[clamp(2.4rem,5.4vw,4.6rem)] font-bold leading-[1.04] tracking-[-0.05em] text-[var(--foreground)]">
              The three of us
              <br />
              behind{" "}
              <span className="relative inline-block whitespace-nowrap">
                Lazur.
                <HandUnderline show color={INK} delay={0.4} duration={0.9} offset={2} />
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-[32rem] text-[clamp(1rem,1.4vw,1.12rem)] font-medium leading-snug text-[var(--foreground-muted)]">
              Vaidik, Veer and Ayush. We build the companion that sits by your cursor, and we answer every email ourselves.
            </p>
            <div className="mt-8 flex items-end justify-center gap-4 sm:gap-8" aria-hidden>
              <FounderSticker who="veer" pose="wave" size={110} />
              <FounderSticker who="vaidik" pose="yay" size={124} />
              <FounderSticker who="ayush" pose="wave" size={110} />
            </div>
          </header>

          <div className="mx-auto mt-20 max-w-5xl space-y-24 md:mt-28 md:space-y-32">
            {FOUNDERS.map((founder, i) => (
              <FounderRow key={founder.who} founder={founder} index={i} />
            ))}
          </div>

          {/* What we are building it for. */}
          <section className="relative mx-auto mt-28 max-w-4xl md:mt-36">
            <Sticker name="heart" size={80} rotate={-12} className="absolute -left-3 -top-8 z-10 md:-left-8" />
            <div className="rounded-[28px] border-[1.5px] border-[#1c1917] bg-white px-6 pb-0 pt-12 text-center shadow-[0_2px_0_rgba(28,25,23,0.9),0_18px_40px_-18px_rgba(28,25,23,0.25)] sm:px-10 md:pt-16">
              <p className="text-[13px] font-bold tracking-[0.12em] text-[var(--foreground-faint)] [text-transform:uppercase]">our mission</p>
              <div className="mt-3">
                <DraftTag note="our own words, soon" />
              </div>
              <h2 className="mx-auto mt-5 max-w-2xl font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--foreground)]">
                Our shared mission goes here, in{" "}
                <span className="font-[family-name:var(--font-garamond)] text-[1.12em] font-normal italic tracking-[-0.02em]">one</span> line.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--foreground-muted)]">
                A short paragraph on why the three of us are building Lazur together, and what we want it to change for the people who use it.
              </p>
              <div className="mt-10 flex items-end justify-center gap-6 sm:gap-12" aria-hidden>
                <FounderSticker who="veer" pose="yay" size={120} />
                <FounderSticker who="vaidik" pose="thumbs" size={130} />
                <FounderSticker who="ayush" pose="yay" size={120} />
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </MarketingPageShell>
  );
}
