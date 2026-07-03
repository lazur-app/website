/** Opens the Lazur desktop app (focuses if already running). */
export const LAZUR_APP_OPEN_URL = "lazur://open";

export function openLazurApp(): void {
  window.location.href = LAZUR_APP_OPEN_URL;
}
