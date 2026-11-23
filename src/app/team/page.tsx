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
 * The founders, in their own stories (written from what each of them told us; edit freely). `does` is what each
 * one looks after at Lazur.
 */
type Founder = {
  who: Who;
  name: string;
  role: string;
  photo: string;
  pose: Pose;
  story: string[];
  does: string;
};

const FOUNDERS: Founder[] = [
  {
    who: "vaidik",
    name: "Vaidik Sule",
    role: "Founder",
    photo: "/vaidik-img.jpg",
    pose: "wave",
    story: [
      "I've always been the curious one. I play music, I love art, and I could never leave something alone until I knew how it worked. In 9th grade I found Python and game development, and something clicked: I could build fixes for my own everyday problems, with code and an Arduino on my desk.",
      "That habit never left. It grew into real products: a tool for YouTubers, then one for podcast hosts, four ventures before this one. Each taught me something, and all of them led here. With Lazur, I believe we can change how people use their computers.",
    ],
    does: "I look after the overall direction of the product and where it's headed.",
  },
  {
    who: "veer",
    name: "Veer Adyani",
    role: "Co-founder",
    photo: "/veer-img.jpeg",
    pose: "thumbs",
    story: [
      "I'm the youngest in my family, and the youngest is always running to keep up. Maybe that's why I never stopped trying things: hackathons (I've won a few international ones), trading, side projects, and Preffer.me, the company I founded before this.",
      "Not everything worked, and I'm proud of that part too. Every try taught me something. I want to build something big that pays off, and I joined Lazur because it's where I grow the fastest.",
    ],
    does: "I handle growth and operations: getting Lazur to the people who need it, and keeping everything running.",
  },
  {
    who: "ayush",
    name: "Ayush Agrawal",
    role: "Co-founder",
    photo: "/ayush-img.jpg",
    pose: "yay",
    story: [
      "I grew up in a business family, around talk of running something of your own. So from early on I knew I wanted to own something one day.",
      "Tech pulled me in because it was exciting, and because it gave me the freedom to make something real: something people actually use and pay for. I kept picking the complex projects, the hard ones, and that road led me to co-founding Lazur.",
    ],
    does: "I handle the tech: everything that lets Lazur hear you, see your screen and get things done.",
  },
];

const INK = "#e11d48";

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
          <Image
            src={founder.photo}
            alt={`${founder.name}, ${founder.role.toLowerCase()} of Lazur`}
            width={704}
            height={800}
            sizes="(min-width: 768px) 340px, 90vw"
            className="aspect-[22/25] w-full rounded-[16px] object-cover"
          />
          <p className="pt-3 text-center font-[family-name:var(--font-caveat)] text-[24px] font-semibold leading-none text-[#1c1917]">{founder.name.split(" ")[0]}</p>
        </div>
        <FounderSticker
          who={founder.who}
          pose={founder.pose}
          size={128}
          className={`!absolute -bottom-6 ${flip ? "-left-6 sm:-left-14" : "-right-6 sm:-right-14"}`}
        />
      </div>

      <div className="text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
          <h2 className="font-display text-[clamp(2rem,3.6vw,2.9rem)] font-bold leading-none tracking-[-0.04em] text-[var(--foreground)]">{founder.name}</h2>
          <span className="rounded-full bg-[#1c1917] px-3 py-1 text-[13px] font-bold text-white">{founder.role}</span>
        </div>
        <div className="mx-auto mt-5 max-w-[36rem] space-y-3 text-[17px] leading-relaxed text-[var(--foreground-muted)] md:mx-0">
          {founder.story.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <p className="mx-auto mt-5 max-w-[36rem] rounded-[16px] border-[1.5px] border-dashed border-[#1c1917]/30 bg-white/70 px-4 py-3 text-left text-[16px] leading-snug text-[var(--foreground)] md:mx-0">
          <span className="mr-1.5 font-[family-name:var(--font-caveat)] text-[22px] font-semibold leading-none text-[#e11d48]">at lazur:</span>
          {founder.does}
        </p>
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
              Vaidik, Veer and Ayush. Three different roads, one idea: your computer should feel like a friend sitting right next to you.
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
              <h2 className="mx-auto mt-4 max-w-2xl font-display text-[clamp(1.9rem,3.8vw,3.1rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[var(--foreground)]">
                Make your computer feel like a{" "}
                <span className="font-[family-name:var(--font-garamond)] text-[1.12em] font-normal italic tracking-[-0.02em]">friend</span> sitting next to you.
              </h2>
              <div className="mx-auto mt-5 max-w-xl space-y-3 text-[17px] leading-relaxed text-[var(--foreground-muted)]">
                <p>
                  Computers get faster every year, yet using one still means hunting through menus, digging for settings and typing out
                  everything by hand. We think you should be able to just say what you want, and have it done, or be shown how.
                </p>
                <p>
                  That&apos;s what we&apos;re building, together: a companion that sees what you see, listens when you ask, and helps
                  in any app. Not another app to learn. One that learns you.
                </p>
              </div>
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
