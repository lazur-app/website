"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const FACES = [
  { src: "/veer-img.jpeg", name: "Veer" },
  { src: "/akshat-img.jpeg", name: "Akshat" },
  { src: "/sloane-img.jpeg", name: "Sloane" },
] as const;

export function HappyUsersBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href="/download"
          className="pointer-events-auto relative flex items-center rounded-[1.15rem] border border-white/80 bg-white/80 py-3 pl-[4.25rem] pr-5 shadow-[0_10px_36px_rgba(28,25,23,0.1)] backdrop-blur-xl transition-[transform,background-color] hover:bg-white/92 hover:scale-[1.01] md:pl-[4.5rem] md:pr-6"
        >
          <span className="absolute -left-1.5 top-1/2 flex -translate-y-1/2" aria-hidden>
            {FACES.map((face, i) => (
              <span
                key={face.name}
                className="relative h-10 w-10 overflow-hidden rounded-[0.7rem] border-2 border-white bg-[var(--background-deep)] shadow-[0_4px_12px_rgba(28,25,23,0.12)] md:h-11 md:w-11"
                style={{ marginLeft: i === 0 ? 0 : -10, zIndex: FACES.length - i }}
              >
                <Image
                  src={face.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </span>
            ))}
          </span>
          <p className="text-[13px] leading-snug text-[var(--foreground)] md:text-[14px]">
            125+ happy users and counting.{" "}
            <span className="underline decoration-[var(--foreground)]/40 underline-offset-[3px]">
              join them
            </span>
          </p>
        </Link>
      </motion.div>
    </div>
  );
}
