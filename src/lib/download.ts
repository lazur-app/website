export const MAC_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_MAC_DOWNLOAD_URL?.trim() ?? "";

export const MAC_DOWNLOAD_URL_INTEL =
  process.env.NEXT_PUBLIC_MAC_DOWNLOAD_URL_INTEL?.trim() ?? "";

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

export const MAC_DOWNLOAD_FILENAME =
  process.env.NEXT_PUBLIC_MAC_DOWNLOAD_FILENAME?.trim() ||
  filenameFromDownloadUrl(MAC_DOWNLOAD_URL) ||
  "Lazur.dmg";

export const MAC_DOWNLOAD_FILENAME_INTEL =
  process.env.NEXT_PUBLIC_MAC_DOWNLOAD_FILENAME_INTEL?.trim() ||
  filenameFromDownloadUrl(MAC_DOWNLOAD_URL_INTEL) ||
  "Lazur-Intel.dmg";

/** Pick Apple Silicon vs Intel DMG URL on macOS. */
export async function resolveMacDownloadUrl(): Promise<string> {
  if (typeof navigator === "undefined") return MAC_DOWNLOAD_URL;

  if (MAC_DOWNLOAD_URL_INTEL && (await isIntelMac())) {
    return MAC_DOWNLOAD_URL_INTEL;
  }

  return MAC_DOWNLOAD_URL;
}

async function isIntelMac(): Promise<boolean> {
  const nav = navigator as Navigator & {
    userAgentData?: {
      getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }>;
    };
  };

  try {
    const values = await nav.userAgentData?.getHighEntropyValues?.(["architecture"]);
    if (values?.architecture === "x86") return true;
    if (values?.architecture === "arm") return false;
  } catch {
    // fall through
  }

  return false;
}

export function triggerMacDownload(url?: string) {
  const downloadUrl = url ?? MAC_DOWNLOAD_URL;
  if (!downloadUrl) return false;

  const filename =
    downloadUrl === MAC_DOWNLOAD_URL_INTEL
      ? MAC_DOWNLOAD_FILENAME_INTEL
      : MAC_DOWNLOAD_FILENAME;

  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  return true;
}
