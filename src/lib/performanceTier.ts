export type PerformanceTier = "full" | "reduced";

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
  userAgentData?: { platform?: string };
};

function isWindows(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as NavigatorWithHints;
  if (nav.userAgentData?.platform === "Windows") return true;
  return /Windows/i.test(navigator.userAgent);
}

/** Client-only capability probe — returns a lighter rendering path when needed. */
export function detectPerformanceTier(): PerformanceTier {
  if (typeof window === "undefined") return "full";

  const params = new URLSearchParams(window.location.search);
  if (params.get("perf") === "full") return "full";
  if (params.get("lite") === "1" || params.get("perf") === "reduced") {
    return "reduced";
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "reduced";
  }

  const nav = navigator as NavigatorWithHints;

  if (nav.connection?.saveData) return "reduced";
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) {
    return "reduced";
  }
  if (nav.hardwareConcurrency > 0 && nav.hardwareConcurrency <= 4) {
    return "reduced";
  }

  // Soft signal: many Windows laptops struggle with backdrop-filter + blend modes.
  if (isWindows() && nav.hardwareConcurrency > 0 && nav.hardwareConcurrency <= 8) {
    return "reduced";
  }

  return "full";
}
