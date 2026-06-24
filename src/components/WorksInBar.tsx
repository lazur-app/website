import { AppMarquee } from "./AppMarquee";

export function WorksInBar() {
  return (
    <div className="relative mt-14 w-full md:mt-16">
      <p className="mb-4 text-center text-[var(--text-xs)] font-medium uppercase tracking-[0.16em] text-[var(--foreground-faint)]">
        Works in the apps you already use
      </p>
      <AppMarquee />
    </div>
  );
}
