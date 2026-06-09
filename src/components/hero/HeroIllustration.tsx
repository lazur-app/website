"use client";

import Image from "next/image";

const HERO_ART = "/vector/vector-art-hero.png";

export function HeroIllustration() {
  return (
    <div className="relative w-full max-w-[520px] lg:max-w-[580px] xl:max-w-[640px]">
      <Image
        src={HERO_ART}
        alt=""
        width={1536}
        height={1024}
        priority
        className="h-auto w-full"
        aria-hidden
      />
    </div>
  );
}
