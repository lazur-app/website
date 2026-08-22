import { detectMacChip, type MacChip } from "@/lib/platform";

export const MAC_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_MAC_DOWNLOAD_URL?.trim() ?? "";

export const MAC_DOWNLOAD_URL_INTEL =
  process.env.NEXT_PUBLIC_MAC_DOWNLOAD_URL_INTEL?.trim() ?? "";

export const WINDOWS_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_WINDOWS_DOWNLOAD_URL?.trim() ?? "";

function filenameFromDownloadUrl(url: string): string | null {
  if (!url) return null;

  try {
    const segment = new URL(url).pathname.split("/").filter(Boolean).pop();
    return segment ? decodeURIComponent(segment) : null;
  } catch {
    const segment = url.split("/").filter(Boolean).pop()?.split("?")[0];
    return segment ? decodeURIComponent(segment) : null;
  }
}

/** Kept for release tooling. UI never shows these. */
export const MAC_DOWNLOAD_FILENAME =
  process.env.NEXT_PUBLIC_MAC_DOWNLOAD_FILENAME?.trim() ||
  filenameFromDownloadUrl(MAC_DOWNLOAD_URL) ||
  "Lazur.dmg";

export const MAC_DOWNLOAD_FILENAME_INTEL =
  process.env.NEXT_PUBLIC_MAC_DOWNLOAD_FILENAME_INTEL?.trim() ||
  filenameFromDownloadUrl(MAC_DOWNLOAD_URL_INTEL) ||
  "Lazur.dmg";

const SAVE_AS = "Lazur.dmg";
const SAVE_AS_WINDOWS = "Lazur.exe";

export function hasIntelMacBuild() {
  return Boolean(MAC_DOWNLOAD_URL_INTEL);
}

export function hasWindowsBuild() {
  return Boolean(WINDOWS_DOWNLOAD_URL);
}

export async function resolveMacDownloadUrl(
  chip?: MacChip,
): Promise<string> {
  const resolved = chip ?? (await detectMacChip());
  if (resolved === "intel" && MAC_DOWNLOAD_URL_INTEL) {
    return MAC_DOWNLOAD_URL_INTEL;
  }
  return MAC_DOWNLOAD_URL;
}

export function triggerFileDownload(url: string, saveAs: string) {
  if (!url) return false;

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = saveAs;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  return true;
}

export async function triggerMacDownload(
  urlOrChip?: string | MacChip,
) {
  let url = MAC_DOWNLOAD_URL;
  if (typeof urlOrChip === "string" && urlOrChip.startsWith("http")) {
    url = urlOrChip;
  } else if (urlOrChip === "intel" || urlOrChip === "apple-silicon") {
    url = await resolveMacDownloadUrl(urlOrChip);
  } else {
    url = await resolveMacDownloadUrl();
  }
  return triggerFileDownload(url, SAVE_AS);
}

export function triggerWindowsDownload() {
  return triggerFileDownload(WINDOWS_DOWNLOAD_URL, SAVE_AS_WINDOWS);
}
