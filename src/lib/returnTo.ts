/** Safe internal paths for post-login redirects (no open redirects). */
export function isSafeReturnPath(path: string | null | undefined): path is string {
  if (!path || !path.startsWith("/")) return false;
  if (path.startsWith("//") || path.includes("://")) return false;
  if (path.includes("?") || path.includes("#")) return false;
  return true;
}

export function loginPathWithReturn(returnTo?: string | null): string {
  if (returnTo && isSafeReturnPath(returnTo)) {
    return `/login?returnTo=${encodeURIComponent(returnTo)}`;
  }
  return "/login";
}
