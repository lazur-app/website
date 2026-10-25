"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FACES = [
  { src: "/veer-img.jpeg", name: "Veer" },
  { src: "/akshat-img.jpeg", name: "Akshat" },
  { src: "/sloane-img.jpeg", name: "Sloane" },
] as const;

const DOCK_HEIGHT = 112;

function useCollidesWith(id: string) {
  const [collides, setCollides] = useState(false);

  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const dockTop = window.innerHeight - DOCK_HEIGHT;
      setCollides(rect.bottom > dockTop && rect.top < window.innerHeight);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [id]);

  return collides;
}

export function HappyUsersBar() {
  const hidesForQuotes = useCollidesWith("love");

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-5 pb-[max(0.85rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-[max(1.1rem,env(safe-area-inset-bottom))]">
      <AnimatePresence>
        {hidesForQuotes ? null : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/download"
              className="pointer-events-auto flex items-center gap-3 rounded-[1.15rem] border border-white/80 bg-white/90 py-2.5 pl-2.5 pr-4 shadow-[0_10px_36px_rgba(28,25,23,0.1)] backdrop-blur-xl transition-[transform,background-color] hover:bg-white hover:scale-[1.01] sm:gap-3.5 sm:py-2.5 sm:pr-5"
            >
              <span className="flex shrink-0" aria-hidden>
                {FACES.map((face, i) => (
                  <span
                    key={face.name}
                    className="relative h-8 w-8 overflow-hidden rounded-[0.6rem] border-2 border-white bg-[var(--background-deep)] sm:h-9 sm:w-9"
                    style={{
                      marginLeft: i === 0 ? 0 : -8,
                      zIndex: FACES.length - i,
                    }}
                  >
                    <Image
                      src={face.src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  </span>
                ))}
              </span>
              <p className="text-[13px] leading-snug text-[var(--foreground)] sm:text-[14px]">
                <span className="sm:hidden">125+ users. </span>
                <span className="hidden sm:inline">
                  125+ happy users and counting.{" "}
                </span>
                <span className="underline decoration-[var(--foreground)]/40 underline-offset-[3px]">
                  join them
                </span>
              </p>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
