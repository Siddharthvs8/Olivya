"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Buttery inertia scrolling site-wide. Respects reduced-motion and pauses
 * itself when a `[data-lenis-stop]` element (e.g. mobile menu) is open.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);

    // Allow other components to stop/start scroll (modals, menus).
    const stop = () => lenis.stop();
    const start = () => lenis.start();
    window.addEventListener("lenis:stop", stop);
    window.addEventListener("lenis:start", start);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("lenis:stop", stop);
      window.removeEventListener("lenis:start", start);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
