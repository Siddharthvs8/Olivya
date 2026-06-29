"use client";

import { motion, type Variants } from "framer-motion";

/**
 * Reveals a headline word-by-word with a clip-up motion as it enters view.
 * Renders real text (good for SEO + screen readers).
 */
export default function AnimatedText({
  text,
  className,
  delay = 0,
  stagger = 0.08,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const child: Variants = {
    hidden: { y: "110%" },
    show: {
      y: "0%",
      transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      style={{ display: "inline-block" }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}
        >
          <motion.span variants={child} style={{ display: "inline-block" }}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
