"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/components/AuthProvider";
import { useNotchIntro, useNotchVoice, type NotchVoice } from "@/lib/notchVoice";

const navLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/blog", label: "Blog" },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const CORAL = "#ef5350";

function Bars() {
  return (
    <span className="flex h-3 items-end gap-[3px]" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <motion.span key={i} className="w-[2.5px] rounded-full bg-white"
          animate={{ height: ["30%", "100%", "45%", "85%", "30%"] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.1 }} />
      ))}
    </span>
  );
}

/** Little things the notch says when it peeks out on its own after the intro. */
const PEEKS = [
  "psst… hold ⌥ ⌘ to talk to me",
  "I can set timers, right up here",
  "Ask me where anything is. I'll circle it.",
  "Hold fn and I'll type for you",
];
const PEEK_EVERY_MS = 14_000;
const PEEK_FOR_MS = 3_200;

function Sparkle() {
  return (
    <motion.svg viewBox="0 0 24 24" className="h-3.5 w-3.5" animate={{ rotate: [0, 15, 0, -15, 0] }} transition={{ duration: 2.4, repeat: Infinity }} aria-hidden>
      <path d="M12 1.5 C12.6 7.4 16.6 11.4 22.5 12 C16.6 12.6 12.6 16.6 12 22.5 C11.4 16.6 7.4 12.6 1.5 12 C7.4 11.4 11.4 7.4 12 1.5 Z" fill={CORAL} />
    </motion.svg>
  );
}

type Shown = { key: string; label: string; right: React.ReactNode; line?: string };

/**
 * The notch, alone at the top centre. At rest a camera cutout. It talks during the homepage intro;
 * after that (or on any other page) it says hi on hover and peeks out now and then with a tip.
 * The intro always wins, so these never talk over each other.
 */
function Notch({ voice }: { voice: NotchVoice | null }) {
  const intro = useNotchIntro();
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const [peek, setPeek] = useState<number | null>(null);
  const free = !voice && (!intro || intro.done);

  // Peek out every so often on the homepage, once the intro is over and nobody is hovering.
  useEffect(() => {
    if (!intro?.done || hover) return;
    let n = 0;
    let hide: number | undefined;
    const every = window.setInterval(() => {
      setPeek(n++ % PEEKS.length);
      hide = window.setTimeout(() => setPeek(null), PEEK_FOR_MS);
    }, PEEK_EVERY_MS);
    return () => {
      window.clearInterval(every);
      window.clearTimeout(hide);
      setPeek(null);
    };
  }, [intro?.done, hover]);

  let shown: Shown | null = null;
  if (voice) {
    shown = {
      key: `${voice.state}-${voice.line ?? ""}`,
      label: voice.state === "listening" ? "Listening" : voice.state === "thinking" ? "Thinking" : "Speaking",
      right:
        voice.state === "listening" ? <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: CORAL }} />
        : voice.state === "thinking" ? <motion.span className="block h-3 w-3 rounded-full border-[1.5px] border-white/25 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
        : <Bars />,
      line: voice.line,
    };
  } else if (free && hover) {
    shown = { key: "hello", label: "Hi, I'm Lazur", right: <Sparkle />, line: intro ? "Click me to hear it again." : "Click to get me for your Mac." };
  } else if (free && peek !== null) {
    shown = { key: `peek-${peek}`, label: "Lazur", right: <Sparkle />, line: PEEKS[peek] };
  }

  const size = !shown ? { width: 176, height: 32 } : shown.line ? { width: "min(30rem, calc(100vw - 7rem))", height: 78 } : { width: 300, height: 38 };

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={intro ? "Replay Lazur's introduction" : "Get Lazur"}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (!free) return;
        setHover(false);
        if (intro) intro.replay();
        else router.push("/download");
      }}
      onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLElement).click()}
      className={`pointer-events-auto absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden bg-black text-white shadow-[0_12px_30px_rgba(0,0,0,0.22)] ${free ? "cursor-pointer" : ""}`}
      style={{ borderRadius: "0 0 18px 18px" }}
      initial={false}
      animate={size}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.08 }}
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        {shown ? (
          <motion.div
            key={shown.key}
            className="px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.22, duration: 0.18 } }}
            exit={{ opacity: 0, transition: { duration: 0.08 } }}
          >
            <div className="flex h-[38px] items-center justify-between text-[12.5px] font-medium text-white/60">
              {shown.label}
              {shown.right}
            </div>
            {shown.line ? <p className="truncate text-center text-[15px] font-medium">{shown.line}</p> : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

/** Top left: the logo. Click it for the menu (pricing, use cases, blog, log in, download). */
function LogoMenu() {
  const pathname = usePathname();
  const { user, loading, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <div ref={box} className="pointer-events-auto absolute left-4 top-4 md:left-6 md:top-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Menu"
        className="flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/80 py-2 pl-3 pr-2.5 shadow-[0_4px_16px_rgba(28,25,23,0.08)] backdrop-blur-xl transition-colors hover:bg-white"
      >
        <Image src="/logo.png" alt="" width={20} height={20} />
        <span className="text-[15px] font-bold tracking-[-0.03em] text-[var(--foreground)]">lazur</span>
        <ChevronDown className={`h-3.5 w-3.5 text-[var(--foreground-muted)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE }}
            style={{ transformOrigin: "top left" }}
            className="absolute left-0 top-[calc(100%+8px)] w-60 rounded-2xl border border-black/[0.06] bg-white/95 p-2 shadow-[0_18px_40px_rgba(28,25,23,0.14)] backdrop-blur-xl"
          >
            <Link href="/" className="block rounded-xl px-3 py-2 text-[14px] font-medium text-[var(--foreground)] hover:bg-black/[0.04]">Home</Link>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className={`block rounded-xl px-3 py-2 text-[14px] font-medium hover:bg-black/[0.04] ${pathname.startsWith(l.href) ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]"}`}>
                {l.label}
              </Link>
            ))}
            <div className="my-1.5 border-t border-black/[0.06]" />
            {loading ? null : isAuthenticated && user ? (
              <UserMenu user={user} variant="mobile" onNavigate={() => setOpen(false)} />
            ) : (
              <Link href="/login" className="block rounded-xl px-3 py-2 text-[14px] font-medium text-[var(--foreground-muted)] hover:bg-black/[0.04]">Log in</Link>
            )}
            <Link href="/download" className="mt-1 block rounded-xl bg-[var(--foreground)] px-3 py-2.5 text-center text-[14px] font-semibold text-white hover:opacity-90">
              Download for Mac
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * The whole header: the logo in the top-left corner (it opens the menu) and the notch, alone, at
 * the top centre. On the homepage the notch talks while Lazur introduces itself.
 */
export function Navbar() {
  const voice = useNotchVoice();
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0">
      <LogoMenu />
      <Notch voice={voice} />
    </header>
  );
}
