import type { ReactNode } from "react";

type SectionVariant =
  | "speed"
  | "speech"
  | "transform"
  | "personas"
  | "social"
  | "apps"
  | "cta";

type SectionShellProps = {
  children: ReactNode;
  variant: SectionVariant;
  /** Pull up into the previous section for overlap */
  overlap?: boolean;
};

const CONFIG: Record<
  SectionVariant,
  {
    bg: string;
    glow?: string;
    inset?: string;
    curveTop?: string;
    curveBottom?: string;
    padY: string;
    offset?: string;
  }
> = {
  speed: {
    bg: "linear-gradient(180deg, #1c1917 0%, #262220 55%, #1c1917 100%)",
    glow: "radial-gradient(ellipse 55% 60% at 50% 0%, rgba(107, 75, 252, 0.22), transparent 72%)",
    curveTop: "#1c1917",
    curveBottom: "#f7f2ec",
    padY: "pt-8 pb-6 md:pt-12 md:pb-10",
  },
  speech: {
    bg: "linear-gradient(145deg, rgba(107, 75, 252, 0.09) 0%, rgba(168, 85, 247, 0.04) 42%, rgba(250, 204, 21, 0.05) 100%)",
    glow: "radial-gradient(ellipse 60% 55% at 88% 18%, rgba(107, 75, 252, 0.12), transparent 70%)",
    curveTop: "#f7f2ec",
    curveBottom: "#f0ebe4",
    padY: "py-4 md:py-8",
    offset: "md:pl-[3%]",
  },
  transform: {
    bg: "linear-gradient(160deg, #f0ebe4 0%, #ebe6de 48%, rgba(52, 211, 153, 0.08) 100%)",
    glow: "radial-gradient(ellipse 50% 60% at 8% 72%, rgba(52, 211, 153, 0.14), transparent 68%)",
    curveTop: "#f0ebe4",
    curveBottom: "#f8f6f2",
    padY: "py-6 md:py-10",
    offset: "md:pr-[2.5%]",
  },
  personas: {
    bg: "linear-gradient(180deg, #f8f6f2 0%, rgba(107, 75, 252, 0.06) 55%, rgba(124, 58, 237, 0.05) 100%)",
    glow: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(107, 75, 252, 0.1), transparent 72%)",
    inset: "rgba(255, 253, 251, 0.45)",
    curveTop: "#f8f6f2",
    curveBottom: "#faf3eb",
    padY: "py-8 md:py-12",
  },
  social: {
    bg: "linear-gradient(135deg, rgba(251, 146, 60, 0.08) 0%, rgba(250, 204, 21, 0.06) 50%, rgba(255, 252, 248, 0.9) 100%)",
    glow: "radial-gradient(ellipse 45% 55% at 92% 35%, rgba(250, 204, 21, 0.16), transparent 70%)",
    curveTop: "#faf3eb",
    curveBottom: "#f5f1ea",
    padY: "py-6 md:py-10",
    offset: "md:pl-[1.5%]",
  },
  apps: {
    bg: "linear-gradient(180deg, #f5f1ea 0%, #f0ece6 100%)",
    curveTop: "#f5f1ea",
    curveBottom: "#1c1917",
    padY: "py-4 md:py-6",
  },
  cta: {
    bg: "linear-gradient(180deg, #1c1917 0%, #262220 55%, #1c1917 100%)",
    glow: "radial-gradient(ellipse 55% 60% at 50% 0%, rgba(107, 75, 252, 0.22), transparent 72%)",
    curveTop: "#1c1917",
    padY: "pt-10 pb-16 md:pt-14 md:pb-24",
  },
};

function SectionCurve({
  flip,
  fill,
  className = "",
}: {
  flip?: boolean;
  fill: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute left-0 h-[3.25rem] w-full md:h-[5rem] lg:h-[5.75rem] ${flip ? "top-0 rotate-180" : "bottom-0"} ${className}`}
      aria-hidden
    >
      <path
        d="M0,68 C480,18 960,92 1440,52 L1440,100 L0,100 Z"
        fill={fill}
      />
    </svg>
  );
}

function SectionCurveAlt({ fill, className = "" }: { fill: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute top-0 left-0 h-[3.25rem] w-full rotate-180 md:h-[5rem] lg:h-[5.75rem] ${className}`}
      aria-hidden
    >
      <path
        d="M0,48 C520,88 920,12 1440,62 L1440,100 L0,100 Z"
        fill={fill}
      />
    </svg>
  );
}

export function SectionShell({ children, variant, overlap = false }: SectionShellProps) {
  const cfg = CONFIG[variant];
  const useAltTop = variant === "transform" || variant === "social";

  return (
    <div
      className={`landing-section-shell landing-section-shell--${variant} relative ${cfg.padY} ${
        overlap ? "-mt-10 md:-mt-16" : ""
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{ background: cfg.bg }}
        />
        {cfg.glow && (
          <div
            className="absolute inset-0 opacity-90"
            style={{ background: cfg.glow }}
          />
        )}
        {cfg.inset && (
          <div
            className="absolute inset-x-[4%] inset-y-[10%] rounded-[2rem] md:rounded-[2.75rem] md:inset-x-[6%]"
            style={{ background: cfg.inset, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)" }}
          />
        )}
      </div>

      {cfg.curveTop &&
        (useAltTop ? (
          <SectionCurveAlt fill={cfg.curveTop} />
        ) : (
          <SectionCurve flip fill={cfg.curveTop} />
        ))}

      {cfg.curveBottom && <SectionCurve fill={cfg.curveBottom} />}

      <div className={`relative z-10 ${cfg.offset ?? ""}`}>{children}</div>
    </div>
  );
}
