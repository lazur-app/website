/** Four panes: a generic Windows-style mark for "on Windows" buttons. */
export function WindowsIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M3 5.1 10.4 4v7.3H3V5.1Zm8.5-1.3L21 2.4v8.9h-9.5V3.8ZM3 12.7h7.4V20L3 18.9v-6.2Zm8.5 0H21v8.9l-9.5-1.4v-7.5Z" />
    </svg>
  );
}
