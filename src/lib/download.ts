export const MAC_DOWNLOAD_URL =
  process.env.NEXT_PUBLIC_MAC_DOWNLOAD_URL?.trim() ?? "";

export const MAC_DOWNLOAD_FILENAME = "Lazur_0.1.0_universal.dmg";

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
