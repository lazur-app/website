"use client";

import { HERO_CLIPS } from "./heroClips";
import { HeroClipWindow } from "./HeroClipWindow";

type Props = {
  focusedId: string | null;
  onFocus: (id: string) => void;
  onClear: () => void;
};

/** Side float windows only — showreel is in-flow via HeroShowreel. */
export function HeroFloatingClipsDesktop({
  focusedId,
  onFocus,
  onClear,
}: Props) {
  const floats = HERO_CLIPS.filter((c) => c.role === "float");

  return (
    <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
      <div className="pointer-events-auto absolute inset-0">
        {floats.map((clip) => (
          <HeroClipWindow
            key={clip.id}
            clip={clip}
            layout="absolute"
            focused={focusedId === clip.id}
            dimmed={focusedId !== null && focusedId !== clip.id}
            onFocus={() => onFocus(clip.id)}
            onBlur={onClear}
          />
        ))}
      </div>
    </div>
  );
}

export function HeroFloatingClipsMobile({
  focusedId,
  onFocus,
  onClear,
}: Props) {
  const floats = HERO_CLIPS.filter((c) => c.role === "float");

  return (
    <div className="relative z-20 mt-10 w-full lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 px-1 sm:gap-4">
        {floats.map((clip) => (
          <HeroClipWindow
            key={clip.id}
            clip={clip}
            layout="flow"
            focused={focusedId === clip.id}
            dimmed={focusedId !== null && focusedId !== clip.id}
            onFocus={() => onFocus(clip.id)}
            onBlur={onClear}
            className={
              focusedId === clip.id
                ? "col-span-2 max-w-sm justify-self-center"
                : undefined
            }
          />
        ))}
      </div>
      {focusedId ? (
        <button
          type="button"
          className="mx-auto mt-3 block text-[12px] text-[var(--foreground-faint)] underline-offset-2 hover:text-[var(--foreground-muted)] hover:underline"
          onClick={onClear}
        >
          Clear focus
        </button>
      ) : null}
    </div>
  );
}
