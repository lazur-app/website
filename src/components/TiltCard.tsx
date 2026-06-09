"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  depth?: number;
};

export function TiltCard({
  children,
  className = "",
  delay = 0,
  depth = 24,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [10, -10]), {
    stiffness: 260,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 260,
    damping: 28,
  });

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  const style: MotionStyle = {
    rotateX,
    rotateY,
    transformStyle: "preserve-3d",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48, rotateX: 14 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      className={`card-3d ${className}`}
    >
      <div
        className="card-3d-inner demo-surface h-full"
        style={{ transform: `translateZ(${depth}px)` }}
      >
        {children}
      </div>
    </motion.div>
  );
}
