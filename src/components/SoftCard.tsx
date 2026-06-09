"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

type SoftCardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  /** Richer hover — lift, border glow, inner shine */
  interactive?: boolean;
} & Omit<HTMLMotionProps<"div">, "children">;

export function SoftCard({
  children,
  className = "",
  hover = true,
  interactive = false,
  ...props
}: SoftCardProps) {
  const canHover = hover || interactive;

  return (
    <motion.div
      whileHover={
        canHover
          ? {
              scale: interactive ? 1.018 : 1.022,
              y: interactive ? -5 : -3,
              transition: { type: "spring", stiffness: 400, damping: 26 },
            }
          : undefined
      }
      className={`soft-card ${interactive ? "soft-card--interactive" : ""} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
