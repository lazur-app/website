import type { BlogCoverTone } from "@/lib/blog/types";

type BlogCoverProps = {
  tone: BlogCoverTone;
  className?: string;
  /** Light canvas so the art reads against a dark featured panel. */
  light?: boolean;
};

export function BlogCover({ tone, className = "", light = false }: BlogCoverProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      aria-hidden
    >
      {tone === "waveform" ? <WaveformArt light={light} /> : null}
      {tone === "apps" ? <AppsArt /> : null}
      {tone === "compare" ? <CompareArt /> : null}
      {tone === "mail" ? <MailArt /> : null}
      {tone === "code" ? <CodeArt /> : null}
      {tone === "privacy" ? <PrivacyArt /> : null}
    </div>
  );
}

function WaveformArt({ light }: { light: boolean }) {
  const bg = light ? "#ece8df" : "#1c1917";
  const wave = light ? "#1c1917" : "#fbfaf8";

  return (
    <svg
      viewBox="0 0 640 400"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="640" height="400" fill={bg} />
      <circle cx="470" cy="200" r="150" fill="none" stroke="#6b4bfc" strokeOpacity="0.28" strokeWidth="1.5" />
      <circle cx="470" cy="200" r="96" fill="none" stroke="#a855f7" strokeOpacity="0.4" strokeWidth="1.5" />
      <circle cx="470" cy="200" r="48" fill="#6b4bfc" fillOpacity="0.22" />
      <circle cx="470" cy="200" r="14" fill="#f97316" />
      <path
        d="M40 248 C90 248 90 132 140 132 C190 132 190 268 240 268 C290 268 290 176 340 176"
        fill="none"
        stroke={wave}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M40 248 C90 248 90 132 140 132 C190 132 190 268 240 268 C290 268 290 176 340 176"
        fill="none"
        stroke="#6b4bfc"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.22"
      />
      <circle cx="86" cy="86" r="5" fill="#f97316" />
      <circle cx="118" cy="64" r="3" fill="#fbbf24" />
      <circle cx="580" cy="72" r="4" fill="#a855f7" />
    </svg>
  );
}

function AppsArt() {
  return (
    <svg
      viewBox="0 0 640 400"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="640" height="400" fill="#ece8df" />
      <circle cx="92" cy="320" r="110" fill="#f97316" fillOpacity="0.14" />
      <circle cx="560" cy="70" r="90" fill="#6b4bfc" fillOpacity="0.16" />
      <rect x="86" y="88" width="280" height="176" rx="22" fill="#fffcf8" stroke="rgba(28,25,23,0.08)" />
      <rect x="108" y="118" width="160" height="10" rx="5" fill="#1c1917" fillOpacity="0.18" />
      <rect x="108" y="142" width="220" height="10" rx="5" fill="#1c1917" fillOpacity="0.1" />
      <rect x="108" y="166" width="188" height="10" rx="5" fill="#1c1917" fillOpacity="0.1" />
      <rect x="248" y="148" width="250" height="176" rx="22" fill="#1c1917" />
      <rect x="276" y="182" width="140" height="10" rx="5" fill="#fbfaf8" fillOpacity="0.45" />
      <rect x="276" y="206" width="186" height="10" rx="5" fill="#fbfaf8" fillOpacity="0.22" />
      <rect x="276" y="230" width="118" height="10" rx="5" fill="#6b4bfc" fillOpacity="0.7" />
      <circle cx="520" cy="286" r="7" fill="#f97316" />
      <circle cx="546" cy="268" r="4" fill="#fbbf24" />
    </svg>
  );
}

function CompareArt() {
  return (
    <svg
      viewBox="0 0 640 400"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="640" height="400" fill="#f3f1ec" />
      <rect x="70" y="78" width="220" height="244" rx="24" fill="#fffcf8" stroke="rgba(28,25,23,0.08)" />
      <rect x="350" y="78" width="220" height="244" rx="24" fill="#1c1917" />
      <circle cx="180" cy="150" r="22" fill="#6b4bfc" fillOpacity="0.2" />
      <circle cx="460" cy="150" r="22" fill="#6b4bfc" />
      <rect x="108" y="196" width="144" height="10" rx="5" fill="#1c1917" fillOpacity="0.16" />
      <rect x="388" y="196" width="144" height="10" rx="5" fill="#fbfaf8" fillOpacity="0.4" />
      <rect x="108" y="222" width="108" height="10" rx="5" fill="#1c1917" fillOpacity="0.1" />
      <rect x="388" y="222" width="108" height="10" rx="5" fill="#f97316" fillOpacity="0.85" />
    </svg>
  );
}

function PrivacyArt() {
  return (
    <svg
      viewBox="0 0 640 400"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="640" height="400" fill="#1c1917" />
      <circle cx="320" cy="188" r="78" fill="none" stroke="#6b4bfc" strokeOpacity="0.45" strokeWidth="3" />
      <rect x="268" y="168" width="104" height="86" rx="18" fill="#fffcf8" />
      <path d="M286 168 V148 C286 128 354 128 354 148 V168" fill="none" stroke="#6b4bfc" strokeWidth="8" strokeLinecap="round" />
      <circle cx="96" cy="86" r="5" fill="#f97316" />
      <circle cx="548" cy="300" r="70" fill="#6b4bfc" fillOpacity="0.16" />
    </svg>
  );
}

function MailArt() {
  return (
    <svg
      viewBox="0 0 640 400"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="640" height="400" fill="#ece8df" />
      <circle cx="520" cy="80" r="90" fill="#f97316" fillOpacity="0.12" />
      <rect x="118" y="96" width="404" height="220" rx="28" fill="#fffcf8" stroke="rgba(28,25,23,0.08)" />
      <path d="M118 150 L320 248 L522 150" fill="none" stroke="#6b4bfc" strokeWidth="4" strokeLinejoin="round" />
      <rect x="168" y="188" width="180" height="10" rx="5" fill="#1c1917" fillOpacity="0.14" />
      <rect x="168" y="214" width="240" height="10" rx="5" fill="#1c1917" fillOpacity="0.08" />
    </svg>
  );
}

function CodeArt() {
  return (
    <svg
      viewBox="0 0 640 400"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="640" height="400" fill="#1c1917" />
      <rect x="86" y="72" width="468" height="256" rx="22" fill="#262220" />
      <circle cx="122" cy="106" r="6" fill="#f97316" />
      <circle cx="144" cy="106" r="6" fill="#fbbf24" />
      <circle cx="166" cy="106" r="6" fill="#34d399" />
      <rect x="118" y="148" width="72" height="10" rx="5" fill="#6b4bfc" />
      <rect x="200" y="148" width="220" height="10" rx="5" fill="#fbfaf8" fillOpacity="0.28" />
      <rect x="140" y="180" width="300" height="10" rx="5" fill="#fbfaf8" fillOpacity="0.16" />
      <rect x="140" y="212" width="248" height="10" rx="5" fill="#fbfaf8" fillOpacity="0.12" />
      <rect x="118" y="244" width="56" height="10" rx="5" fill="#f97316" fillOpacity="0.8" />
    </svg>
  );
}
