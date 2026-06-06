export type Platform = "mac" | "windows" | "other";

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";

  const ua = navigator.userAgent;
  const platform = navigator.platform ?? "";

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
