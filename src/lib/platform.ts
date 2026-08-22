export type Platform = "mac" | "windows" | "ios" | "other";
export type MacChip = "apple-silicon" | "intel";

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";

  const ua = navigator.userAgent;
  const platform = navigator.platform ?? "";

  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";

  if (/Win(dows|32|64|CE)/i.test(ua) || /Win/i.test(platform)) {
    return "windows";
  }

  if (
    /Mac|Macintosh|MacIntel|MacPPC|Mac68K/i.test(platform) ||
    (/Mac OS X/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua))
  ) {
    return "mac";
  }

  return "other";
}

/**
 * Apple silicon vs Intel. Never use navigator.platform, it's "MacIntel"
 * on Apple silicon too. UA-CH first, then GPU renderer.
 */
export async function detectMacChip(): Promise<MacChip> {
  if (typeof navigator === "undefined") return "apple-silicon";

  const nav = navigator as Navigator & {
    userAgentData?: {
      getHighEntropyValues?: (
        hints: string[],
      ) => Promise<{ architecture?: string }>;
    };
  };

  try {
    const values = await nav.userAgentData?.getHighEntropyValues?.([
      "architecture",
    ]);
    if (values?.architecture === "x86") return "intel";
    if (values?.architecture === "arm") return "apple-silicon";
  } catch {
    // fall through
  }

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    const info = gl?.getExtension("WEBGL_debug_renderer_info");
    if (gl && info) {
      const renderer = String(
        gl.getParameter(info.UNMASKED_RENDERER_WEBGL) ?? "",
      );
      if (/Apple/i.test(renderer) && !/Intel/i.test(renderer)) {
        return "apple-silicon";
      }
      if (/Intel|AMD|NVIDIA|Radeon|GeForce/i.test(renderer)) {
        return "intel";
      }
    }
  } catch {
    // fall through
  }

  return "apple-silicon";
}
