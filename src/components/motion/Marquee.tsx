"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Seamless infinite marquee. Duplicates content for a continuous loop. */
export default function Marquee({
  children,
  speed = 30,
  reverse = false,
  className,
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative flex overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="flex shrink-0 items-center"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
