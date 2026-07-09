"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import GrainText from "@/components/motion/GrainText";
import {
  GoldGradient,
  VILLA_PARTS,
  VILLA_VIEWBOX,
  VillaStaticStroke,
  VillaStroke,
  WindowLightDefs,
  WindowLights,
} from "@/components/motion/villa";

/* ------------------------------------------------------------------ */
/*  LOGO FORGE                                                         */
/*  The gold brand wordmark explodes into golden grains that scatter   */
/*  in 3D as a luxury home draws itself onto a holographic blueprint   */
/*  floor — then its windows ignite, embers rise and the night blooms. */
/*  Every beat is tied to scroll.                                      */
/* ------------------------------------------------------------------ */

export default function LogoForge() {
  const ref = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(rm.matches);
    sync();
    rm.addEventListener("change", sync);
    return () => rm.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 26,
    restDelta: 0.0005,
  });

  // The home forms as the grains fall, then completes.
  const build = useTransform(p, [0.24, 0.95], [0, 1], { clamp: true });

  // Layered cinematics, all driven by the build progress.
  const glow = useTransform(build, [0, 0.6, 1], [0.03, 0.16, 0.3]);
  const gridOpacity = useTransform(build, [0, 0.12, 0.6, 1], [0, 0.5, 0.42, 0.08]);
  const scanY = useTransform(build, [0, 1], ["86%", "13%"]);
  const scanOpacity = useTransform(build, [0, 0.05, 0.88, 1], [0, 0.85, 0.7, 0]);
  const floorOpacity = useTransform(build, [0.35, 1], [0, 0.55]);
  const emberOpacity = useTransform(build, [0.5, 0.8, 1], [0, 0.55, 1]);
  const flash = useTransform(build, [0.84, 0.92, 1], [0, 0.6, 0]);
  const villaY = useTransform(p, [0, 1], ["6%", "-2%"]);
  const villaScale = useTransform(build, [0, 1], [0.955, 1]);

  const eyebrowOpacity = useTransform(p, [0, 0.08, 0.22], [0, 1, 0]);
  const taglineOpacity = useTransform(p, [0, 0.07], [1, 0]);
  const cueOpacity = useTransform(p, [0, 0.08], [1, 0]);
  const signOpacity = useTransform(p, [0.7, 0.9], [0, 1]);

  /* Reduced-motion only: skip the pinned scroll canvas and show a clean,
     stacked composition — the finished home on top, the wordmark clearly
     beneath it. (The animated version runs on mobile too.) */
  if (reduced) {
    return (
      <section className="relative overflow-hidden bg-ink py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,162,75,0.12),_transparent_62%)]" />
        <div className="container-luxe relative flex flex-col items-center gap-10 text-center">
          <span className="eyebrow justify-center">From our name, your home</span>

          {/* the finished home */}
          <div className="w-full max-w-[560px]" style={{ aspectRatio: "1200 / 700" }}>
            <svg
              viewBox={VILLA_VIEWBOX}
              preserveAspectRatio="xMidYMid meet"
              className="h-full w-full [filter:drop-shadow(0_0_12px_rgba(201,162,75,0.4))]"
            >
              <defs>
                <GoldGradient id="forge-gold" />
                <WindowLightDefs id="forge" />
              </defs>
              <WindowLights progress={build} gradientId="forge" reduced />
              {VILLA_PARTS.map((part, i) => (
                <VillaStaticStroke key={i} part={part} gradientId="forge-gold" />
              ))}
            </svg>
          </div>

          {/* the wordmark, sitting beneath the home */}
          <div className="flex flex-col items-center gap-1.5 font-[family-name:var(--font-montserrat)]">
            <span className="text-gradient-gold text-4xl font-bold tracking-[0.06em] sm:text-6xl">
              OLIVIYA
            </span>
            <span className="text-gradient-gold text-base font-semibold tracking-[0.2em] sm:text-2xl">
              DEVELOPERS PVT LTD
            </span>
            <span className="text-gradient-gold text-[0.7rem] font-medium tracking-[0.18em] sm:text-base">
              THE LUXURY HOME BUILDER
            </span>
          </div>

          {/* discipline tagline */}
          <div className="flex items-center gap-x-3 whitespace-nowrap text-[0.6rem] font-medium uppercase tracking-[0.32em] text-cream/85 sm:gap-x-4 sm:text-xs">
            {["Design", "Build", "Decor", "Care"].map((word, i, arr) => (
              <Fragment key={word}>
                <span>{word}</span>
                {i < arr.length - 1 && <span className="text-gold">|</span>}
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[260vh] bg-ink">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* warm glow that swells as the home completes */}
        <motion.div
          style={{ opacity: reduced ? 0.18 : glow }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(201,162,75,0.9),_transparent_62%)] blur-[70px]"
        />

        {/* holographic blueprint floor — the plot the home rises from */}
        <motion.div
          style={{ opacity: reduced ? 0.12 : gridOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] [perspective:900px]"
        >
          <div className="absolute inset-0 origin-bottom [transform:rotateX(62deg)] [background-image:linear-gradient(rgba(201,162,75,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(201,162,75,0.5)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:radial-gradient(ellipse_at_center,black_8%,transparent_70%)]" />
        </motion.div>

        {/* reflective floor sheen beneath the home */}
        <motion.div
          style={{ opacity: reduced ? 0.4 : floorOpacity }}
          className="pointer-events-none absolute bottom-[7%] left-1/2 h-[16vh] w-[72%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(201,162,75,0.5),_transparent_70%)] blur-2xl"
        />

        {/* floating gold dust */}
        <div className="pointer-events-none absolute inset-0">
          {DUST.map((d, i) => (
            <span
              key={i}
              className="oh-dust absolute rounded-full bg-gold/40"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: d.s,
                height: d.s,
                animationDelay: `${d.d}s`,
                animationDuration: `${d.t}s`,
              }}
            />
          ))}
        </div>

        {/* eyebrow */}
        <motion.span
          style={{ opacity: reduced ? 1 : eyebrowOpacity }}
          className="eyebrow absolute top-[16%] left-1/2 -translate-x-1/2"
        >
          From our name, your home
        </motion.span>

        {/* the home, drawing itself, lighting up room by room */}
        <motion.svg
          viewBox={VILLA_VIEWBOX}
          preserveAspectRatio="xMidYMax meet"
          style={{ y: reduced ? undefined : villaY, scale: reduced ? undefined : villaScale }}
          /* On phones the house is width-limited to a short band; lift it off the
             bottom so the signature has clear room beneath it. Desktop stays
             bottom-anchored. */
          className="pointer-events-none absolute inset-x-0 bottom-[17%] z-10 mx-auto h-[80vh] w-full max-w-[1300px] [filter:drop-shadow(0_0_14px_rgba(201,162,75,0.4))] sm:bottom-0"
        >
          <defs>
            <GoldGradient id="forge-gold" />
            <WindowLightDefs id="forge" />
          </defs>

          {/* interior lights sit behind the strokes so frames/mullions read on top */}
          {reduced ? (
            <WindowLights progress={build} gradientId="forge" reduced />
          ) : (
            <WindowLights progress={build} gradientId="forge" />
          )}

          {VILLA_PARTS.map((part, i) =>
            reduced ? (
              <VillaStaticStroke key={i} part={part} gradientId="forge-gold" />
            ) : (
              <VillaStroke key={i} part={part} progress={build} gradientId="forge-gold" />
            ),
          )}
        </motion.svg>

        {/* rising construction light-beam that "prints" the home into being */}
        {!reduced && (
          <motion.div
            style={{ top: scanY, opacity: scanOpacity }}
            className="pointer-events-none absolute inset-x-[7%] z-10 h-[2px] -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(231,200,105,0.95),transparent)] [box-shadow:0_0_22px_6px_rgba(231,200,105,0.45)]"
          />
        )}

        {/* embers rising off the home as it ignites */}
        {!reduced && (
          <motion.div style={{ opacity: emberOpacity }} className="pointer-events-none absolute inset-0 z-10">
            {EMBERS.map((e, i) => (
              <span
                key={i}
                className="oh-ember absolute rounded-full bg-gold-soft"
                style={
                  {
                    left: `${e.x}%`,
                    bottom: `${e.y}%`,
                    width: e.s,
                    height: e.s,
                    animationDelay: `${e.d}s`,
                    animationDuration: `${e.t}s`,
                    "--ox": `${e.ox}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </motion.div>
        )}

        {/* the wordmark, exploding into golden grains across the full stage */}
        <div className="absolute inset-0 z-20">
          <GrainText progress={p} reduced={reduced} />
        </div>

        {/* discipline tagline, seated just beneath the wordmark; it dissolves
            with the wordmark as the grains take flight. The top offset mirrors
            GrainText's layout math (block centre at 46% + half the 2.3·base
            stack) so it tracks the last line across viewport sizes. */}
        <motion.div
          style={{
            opacity: reduced ? 1 : taglineOpacity,
            top: "calc(46vh + min(9.78vw, 140px) + 1.3rem)",
          }}
          className="pointer-events-none absolute left-1/2 z-20 flex -translate-x-1/2 items-center gap-x-3 whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.34em] text-cream/85 sm:gap-x-4 sm:text-xs"
        >
          {["Design", "Build", "Decor", "Care"].map((word, i, arr) => (
            <Fragment key={word}>
              <span>{word}</span>
              {i < arr.length - 1 && <span className="text-gold">|</span>}
            </Fragment>
          ))}
        </motion.div>

        {/* reformed signature once the home stands — seated in the clear band
            below the house so it never overlaps the base/steps */}
        <motion.span
          style={{ opacity: reduced ? 0 : signOpacity }}
          className="absolute bottom-[5%] left-1/2 z-20 -translate-x-1/2 text-[0.7rem] uppercase tracking-[0.5em] text-gold"
        >
          Oliviya Developers
        </motion.span>

        {/* completion bloom — the night blooms warm as the last light flickers on */}
        {!reduced && (
          <motion.div
            style={{ opacity: flash }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,245,220,0.9),_rgba(231,200,105,0.25)_40%,_transparent_68%)] blur-2xl"
          />
        )}

        {/* cinematic vignette */}
        <div className="pointer-events-none absolute inset-0 z-40 [background:radial-gradient(ellipse_at_center,_transparent_55%,_rgba(0,0,0,0.55))]" />

        {/* scroll cue */}
        <motion.div
          style={{ opacity: reduced ? 0 : cueOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2 text-faint"
        >
          <span className="text-[0.6rem] uppercase tracking-[0.3em]">Scroll to build</span>
          <ArrowDown className="h-4 w-4 animate-bounce text-gold" />
        </motion.div>
      </div>
    </section>
  );
}

/* Deterministic dust field (avoids hydration mismatch). */
const DUST = [
  { x: 14, y: 28, s: 3, d: 0, t: 9 },
  { x: 26, y: 62, s: 2, d: 1.4, t: 11 },
  { x: 38, y: 20, s: 4, d: 0.6, t: 8 },
  { x: 50, y: 74, s: 2, d: 2.1, t: 12 },
  { x: 60, y: 38, s: 3, d: 0.3, t: 10 },
  { x: 70, y: 68, s: 2, d: 1.1, t: 9.5 },
  { x: 80, y: 26, s: 4, d: 1.8, t: 8.5 },
  { x: 88, y: 56, s: 2, d: 0.9, t: 11.5 },
  { x: 8, y: 48, s: 3, d: 2.4, t: 10.5 },
  { x: 94, y: 40, s: 2, d: 1.3, t: 12.5 },
];

/* Deterministic ember field rising from the home's footprint. */
const EMBERS = [
  { x: 34, y: 16, s: 3, d: 0.0, t: 5.5, ox: 18 },
  { x: 42, y: 12, s: 2, d: 0.8, t: 6.2, ox: -14 },
  { x: 48, y: 20, s: 4, d: 1.6, t: 5.0, ox: 10 },
  { x: 53, y: 14, s: 2, d: 0.4, t: 6.8, ox: 22 },
  { x: 58, y: 18, s: 3, d: 1.2, t: 5.6, ox: -18 },
  { x: 64, y: 13, s: 2, d: 2.0, t: 6.0, ox: 12 },
  { x: 30, y: 22, s: 2, d: 1.0, t: 6.5, ox: -10 },
  { x: 70, y: 21, s: 3, d: 0.6, t: 5.3, ox: 16 },
  { x: 46, y: 26, s: 2, d: 2.4, t: 6.6, ox: -22 },
  { x: 60, y: 28, s: 3, d: 1.8, t: 5.8, ox: 8 },
];
