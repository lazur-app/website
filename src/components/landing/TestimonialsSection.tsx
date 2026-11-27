"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { User } from "lucide-react";
import { useTrackInView } from "@/hooks/useTrackInView";
import { track } from "@/lib/productAnalytics";
import { Sticker } from "@/components/landing/Sticker";
import { FounderSticker } from "@/components/landing/FounderSticker";

export type Testimonial = {
  quote: string;
  highlight?: string;
  name: string;
  role: string;
  company?: { label: string; href: string };
  image?: string;
  /** Pins the card to a column on the wall (0 to 3). Otherwise cards are dealt out in turn. */
  column?: number;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "using lazur for 3 months now. it's one of those tools that quietly becomes part of your daily workflow. it feels like having a smart teammate in every app.",
    highlight: "smart teammate in every app",
    name: "Akshat Thakur",
    role: "Founder",
    company: { label: "SafeExam", href: "https://safexam.in" },
    image: "/akshat-img.jpeg",
  },
  {
    quote:
      "i keep lazur running while i code. i point at a broken layout, ask what's wrong, and it tells me exactly what to change. no more pasting screenshots into a chat window.",
    highlight: "no more pasting screenshots",
    name: "Kushagra Gangrade",
    role: "Web Developer",
    image: "/kushagra-img.jpeg",
  },
  {
    quote:
      "i hold two keys and ask how to do something in figma, and it shows me right there on the screen. it's like sitting next to someone who never minds a silly question.",
    highlight: "never minds a silly question",
    name: "Vince DSouza",
    role: "Lead Designer",
  },
  {
    quote:
      "I use Lazur every day for 95% of what I do. It feels like having a second brain across my work apps.",
    highlight: "second brain",
    name: "Kai",
    role: "Engineer",
  },
];

export function TestimonialAvatar({
  testimonial,
  size = 40,
}: {
  testimonial: Testimonial;
  size?: number;
}) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--background-deep)]"
      style={{ width: size, height: size }}
    >
      {testimonial.image ? (
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <User className="h-4 w-4 text-[var(--foreground-faint)]" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}

/** Card colours, in order. The quote sits on the colour; the photo (if any) is inset beside it. */
/**
 * How each card on the wall is dressed. The wall walks through these in order, so it looks thrown
 * together however many testimonials there are: different pastel, photo above or below the words,
 * different photo shape, bigger or smaller type, a slight tilt.
 */
type Look = {
  color: string;
  photo: "top" | "bottom";
  /** Photo shape (Tailwind aspect class). */
  shape: string;
  big: boolean;
  tilt: number;
};

const LOOKS: Look[] = [
  { color: "#c9f2dc", photo: "top", shape: "aspect-[4/3]", big: true, tilt: -1.2 },
  { color: "#ffd9b8", photo: "bottom", shape: "aspect-square", big: false, tilt: 0.9 },
  { color: "#d9d0ff", photo: "top", shape: "aspect-[3/4]", big: false, tilt: -0.6 },
  { color: "#f4efc9", photo: "bottom", shape: "aspect-[4/3]", big: true, tilt: 1.1 },
  { color: "#ffd1dc", photo: "bottom", shape: "aspect-[5/4]", big: false, tilt: -0.9 },
  { color: "#cfe8ff", photo: "top", shape: "aspect-square", big: true, tilt: 0.7 },
  { color: "#d7f0c2", photo: "top", shape: "aspect-[4/3]", big: false, tilt: 1.3 },
];

function Company({ t }: { t: Testimonial }) {
  if (!t.company) return null;
  return (
    <>
      {" "}
      of{" "}
      <Link
        href={t.company.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          track("outbound_link_clicked", {
            location: "testimonials",
            label: t.company!.label,
            url: t.company!.href,
          })
        }
        className="underline underline-offset-2 hover:opacity-70"
      >
        {t.company.label}
      </Link>
    </>
  );
}

function Card({ t, look }: { t: Testimonial; look: Look }) {
  const photo = t.image ? (
    <div className={`relative w-full overflow-hidden rounded-[16px] ${look.shape}`}>
      <Image src={t.image} alt={t.name} fill className="object-cover" sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 92vw" />
    </div>
  ) : null;
  return (
    <blockquote
      className="relative flex flex-col gap-4 rounded-[22px] p-2.5 text-[#1c1917]"
      style={{ background: look.color, transform: `rotate(${look.tilt}deg)` }}
    >
      {look.photo === "top" ? photo : null}
      <div className={`flex flex-col gap-4 px-2.5 ${photo && look.photo === "top" ? "pb-2.5" : photo ? "pt-3" : "py-4"}`}>
        <p className={`font-display font-medium lowercase leading-[1.2] tracking-[-0.02em] ${look.big || !photo ? "text-[1.1rem] md:text-[1.2rem]" : "text-[0.98rem] md:text-[1.02rem]"}`}>
          &ldquo;{t.quote}&rdquo;
        </p>
        <footer>
          <p className="text-[13px] font-semibold lowercase">{t.name}</p>
          <p className="text-[12.5px] lowercase opacity-70">
            {t.role}
            <Company t={t} />
          </p>
        </footer>
      </div>
      {look.photo === "bottom" ? photo : null}
    </blockquote>
  );
}

/**
 * An empty card holding a place on the wall for a testimonial that hasn't come in yet: a blank
 * photo frame and blank lines, no words. Set EMPTY_SLOTS to 0 once the real ones fill the wall.
 */
const EMPTY_SLOTS = 0;

function EmptyCard({ look, lines }: { look: Look; lines: number }) {
  const photo = <div className={`w-full rounded-[16px] bg-black/[0.07] ${look.shape}`} />;
  return (
    <div
      className="flex flex-col gap-4 rounded-[22px] p-2.5"
      style={{ background: look.color, transform: `rotate(${look.tilt}deg)` }}
      aria-hidden
    >
      {look.photo === "top" ? photo : null}
      <div className="flex flex-col gap-2 px-2.5 py-3">
        {Array.from({ length: lines }, (_, i) => (
          <span key={i} className="h-2.5 rounded-full bg-black/[0.09]" style={{ width: `${i === lines - 1 ? 55 : 92 - ((i * 13) % 20)}%` }} />
        ))}
        <span className="mt-3 h-2 w-1/3 rounded-full bg-black/[0.14]" />
      </div>
      {look.photo === "bottom" ? photo : null}
    </div>
  );
}

/**
 * The last card on the wall: not a review, an invitation to send one. Same paper-card look, dashed ink border so it
 * reads as an open slot. It also fills the gap the short columns leave.
 */
function AddYoursCard() {
  return (
    <div
      className="relative flex flex-col items-start gap-4 rounded-[22px] border-[1.5px] border-dashed border-[#1c1917]/40 bg-white/70 p-5 text-[#1c1917]"
      style={{ transform: "rotate(-0.8deg)" }}
    >
      <Sticker name="heart" size={58} rotate={-12} className="absolute -right-3 -top-5" />
      <p className="font-display text-[1.1rem] font-medium lowercase leading-[1.2] tracking-[-0.02em] md:text-[1.2rem]">
        using lazur? your words could go here.
      </p>
      <p className="text-[14px] lowercase leading-snug text-[#1c1917]/70">tell us what it does for you, good or bad. we read every one.</p>
      <a
        href="mailto:hello@lazur.app?subject=My%20Lazur%20review"
        onClick={() => track("cta_clicked", { location: "testimonials", label: "Send us yours", destination: "mailto" })}
        className="inline-flex min-h-[44px] items-center rounded-full border-[1.5px] border-[#1c1917] bg-white px-5 text-[15px] font-bold lowercase text-[#1c1917] shadow-[0_2px_0_rgba(28,25,23,0.9)] transition-transform hover:-translate-y-0.5"
      >
        send us yours →
      </a>
      <FounderSticker who="vaidik" pose="wave" size={88} className="!absolute -bottom-3 -right-3" />
    </div>
  );
}

const COLUMNS = 4;

/**
 * What early users say: a wall of small pastel cards in mixed sizes. Plain scrolling, nothing
 * pinned. Add a testimonial to TESTIMONIALS and it takes the next look and a place on the wall;
 * empty cards hold the remaining places until then.
 */
export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  useTrackInView(ref, "section_viewed", { section: "testimonials" });
  const convinced = "ok, I'm convinced";
  // Real ones first, spread across the columns, then the empty places.
  const slots: (Testimonial | null)[] = [...TESTIMONIALS, ...Array.from({ length: EMPTY_SLOTS }, () => null)];

  return (
    <section ref={ref} data-guide-section="love" className="relative py-20 md:py-28">
      {/* "Trust" links land here. */}
      <div id="love" className="absolute top-0" aria-hidden />
      <div className="landing-container">
        <div className="text-center">
          <h2 className="font-display text-[clamp(2.1rem,4.4vw,3.6rem)] font-medium lowercase leading-[1] tracking-[-0.04em] text-[var(--foreground)]">
            straight from the <span className="font-[family-name:var(--font-garamond)] text-[1.12em] font-normal italic tracking-[-0.02em]">group chat</span>.
          </h2>
        </div>

        {/* Uneven columns, dealt out one card at a time; one column on phones, two on tablets. */}
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 items-start gap-4 sm:grid-cols-2 md:mt-20 lg:grid-cols-4 lg:gap-5">
          {Array.from({ length: COLUMNS }, (_, column) => (
            <div key={column} className={`flex flex-col gap-4 lg:gap-5 ${column % 2 === 1 ? "lg:mt-12" : ""}`}>
              {slots.map((slot, i) => {
                if ((slot?.column ?? i % COLUMNS) !== column) return null;
                const look = LOOKS[(i * 3 + column) % LOOKS.length];
                return slot ? <Card key={slot.name} t={slot} look={LOOKS[i % LOOKS.length]} /> : <EmptyCard key={i} look={look} lines={2 + ((i * 7) % 4)} />;
              })}
              {/* Last on phones too, after every review. */}
              {column === COLUMNS - 1 ? <AddYoursCard /> : null}
            </div>
          ))}
        </div>

        <p className="mt-12 text-center md:mt-16">
          <Link
            href="/download"
            onClick={() => track("cta_clicked", { location: "testimonials", label: convinced, destination: "/download" })}
            className="text-[15px] font-medium text-[var(--foreground-muted)] underline decoration-black/25 underline-offset-4 transition-colors hover:text-[var(--foreground)]"
          >
            {convinced} →
          </Link>
        </p>
      </div>
    </section>
  );
}
