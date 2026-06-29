"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

/**
 * Counts up to a target when scrolled into view. Keeps any non-numeric
 * prefix/suffix (e.g. "+", "%") from the original label.
 */
export default function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);

  const numeric = parseFloat(value.replace(/[^\d.]/g, "")) || 0;
  const prefix = value.match(/^[^\d]*/)?.[0] ?? "";
  const suffix = value.match(/[^\d]*$/)?.[0] ?? "";

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, numeric, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${Math.round(latest)}${suffix}`;
        }
      },
    });
    return () => controls.stop();
  }, [inView, numeric, motionValue, prefix, suffix]);

  return <span ref={ref}>{`${prefix}0${suffix}`}</span>;
}
