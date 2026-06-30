export const MAC_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_MAC_DOWNLOAD_URL?.trim() ?? "";

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

export function triggerMacDownload() {
  if (!MAC_DOWNLOAD_URL) return false;

  const anchor = document.createElement("a");
  anchor.href = MAC_DOWNLOAD_URL;
  anchor.download = MAC_DOWNLOAD_FILENAME;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  return true;
}
