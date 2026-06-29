"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const offset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
  none: { x: 0, y: 0 },
};

/** Fades + slides content in as it scrolls into view. */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  once = true,
  className,
  as = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  as?: "div" | "span" | "li" | "section";
}) {
  const { x, y } = offset[direction];
  const variants: Variants = {
    hidden: { opacity: 0, x, y },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
    >
      {children}
    </MotionTag>
  );
}
