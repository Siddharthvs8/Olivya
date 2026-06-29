"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  VILLA — shared self-drawing luxury home                            */
/*  A set of architectural strokes whose `pathLength` is tied to a     */
/*  0→1 progress value. Used by the LogoForge intro — after the logo   */
/*  bursts into golden grains, this home draws itself.                 */
/* ------------------------------------------------------------------ */

export const VILLA_VIEWBOX = "0 0 1200 700";

export type Range = [number, number];
export type VillaPart = {
  d: string;
  range: Range;
  width?: number;
  delayDraw?: boolean;
};

/** The shared gold gradient. Give each SVG instance a unique `id`. */
export function GoldGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#e3c986" />
      <stop offset="50%" stopColor="#c9a24b" />
      <stop offset="100%" stopColor="#9c7a32" />
    </linearGradient>
  );
}

/** Warm interior-light gradients used when the home's windows switch on. */
export function WindowLightDefs({ id }: { id: string }) {
  return (
    <>
      <radialGradient id={`${id}-win`} cx="50%" cy="40%" r="68%">
        <stop offset="0%" stopColor="#fff3d2" />
        <stop offset="42%" stopColor="#f2cf7c" />
        <stop offset="100%" stopColor="#b07d2a" stopOpacity="0.12" />
      </radialGradient>
      <radialGradient id={`${id}-door`} cx="50%" cy="32%" r="78%">
        <stop offset="0%" stopColor="#ffe9b6" />
        <stop offset="48%" stopColor="#ecbb5e" />
        <stop offset="100%" stopColor="#8a5e1f" stopOpacity="0.08" />
      </radialGradient>
    </>
  );
}

/* Interior lights — one per opening. `on` is the progress point (0→1) at which
   that room's light flickers to life, sequenced so the home wakes room by room. */
type WindowLight = { x: number; y: number; w: number; h: number; on: number; door?: boolean };
const WINDOW_LIGHTS: WindowLight[] = [
  { x: 512, y: 295, w: 68, h: 77, on: 0.6 }, // upper-left
  { x: 720, y: 295, w: 68, h: 77, on: 0.63 }, // upper-right
  { x: 250, y: 432, w: 72, h: 74, on: 0.66 }, // left wing 1
  { x: 360, y: 432, w: 72, h: 74, on: 0.69 }, // left wing 2
  { x: 858, y: 452, w: 64, h: 72, on: 0.72 }, // right wing 1
  { x: 948, y: 452, w: 60, h: 72, on: 0.75 }, // right wing 2
  { x: 628, y: 462, w: 44, h: 98, on: 0.86, door: true }, // entrance (warmest, last)
];

/** Renders the warm glow inside each window/door, switching on in sequence. */
export function WindowLights({
  progress,
  gradientId,
  reduced = false,
}: {
  progress: MotionValue<number>;
  gradientId: string;
  reduced?: boolean;
}) {
  return (
    <g className="[filter:drop-shadow(0_0_9px_rgba(240,196,96,0.55))]">
      {WINDOW_LIGHTS.map((w, i) => (
        <Light key={i} w={w} progress={progress} gradientId={gradientId} reduced={reduced} />
      ))}
    </g>
  );
}

function Light({
  w,
  progress,
  gradientId,
  reduced,
}: {
  w: WindowLight;
  progress: MotionValue<number>;
  gradientId: string;
  reduced: boolean;
}) {
  // flicker on: 0 → full → settle slightly below full
  const opacity = useTransform(
    progress,
    [w.on, w.on + 0.025, w.on + 0.05, w.on + 0.09, 1],
    [0, 0.55, 1, 0.82, 0.9],
    { clamp: true },
  );
  const pad = 4;
  const fill = `url(#${gradientId}-${w.door ? "door" : "win"})`;
  if (reduced) {
    return (
      <rect x={w.x + pad} y={w.y + pad} width={w.w - 2 * pad} height={w.h - 2 * pad} rx={2} fill={fill} opacity={0.85} />
    );
  }
  return (
    <motion.rect
      x={w.x + pad}
      y={w.y + pad}
      width={w.w - 2 * pad}
      height={w.h - 2 * pad}
      rx={2}
      fill={fill}
      style={{ opacity }}
    />
  );
}

/** A single architectural stroke that "builds" across a slice of progress. */
export function VillaStroke({
  part,
  progress,
  gradientId,
}: {
  part: VillaPart;
  progress: MotionValue<number>;
  gradientId: string;
}) {
  const { d, range, width = 2, delayDraw = false } = part;
  const pathLength = useTransform(progress, range, [0, 1], { clamp: true });
  const opacity = useTransform(
    progress,
    [range[0], range[0] + (range[1] - range[0]) * (delayDraw ? 0.35 : 0.12)],
    [0, 1],
    { clamp: true },
  );
  return (
    <motion.path
      d={d}
      style={{ pathLength, opacity }}
      stroke={`url(#${gradientId})`}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      vectorEffect="non-scaling-stroke"
    />
  );
}

/** Static (fully drawn) variant for reduced-motion / fallbacks. */
export function VillaStaticStroke({
  part,
  gradientId,
}: {
  part: VillaPart;
  gradientId: string;
}) {
  return (
    <path
      d={part.d}
      stroke={`url(#${gradientId})`}
      strokeWidth={part.width ?? 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      vectorEffect="non-scaling-stroke"
    />
  );
}

/* Build order is encoded in each stroke's progress range (0 → 1). */
export const VILLA_PARTS: VillaPart[] = [
  // ---- ground line + plinth -------------------------------------------------
  { d: "M 70 560 L 1130 560", range: [0.0, 0.1], width: 2 },
  { d: "M 150 575 L 1050 575", range: [0.02, 0.12], width: 1 },

  // ---- main blocks (outlines) ----------------------------------------------
  { d: "M 470 250 L 470 560 M 830 250 L 830 560 M 470 250 L 830 250", range: [0.08, 0.26] }, // central tower
  { d: "M 200 380 L 200 560 M 470 380 L 470 560 M 200 380 L 470 380", range: [0.12, 0.3] }, // left wing
  { d: "M 830 410 L 830 560 M 1030 410 L 1030 560 M 830 410 L 1030 410", range: [0.16, 0.34] }, // right wing

  // ---- roof slabs / parapets ------------------------------------------------
  { d: "M 452 250 L 848 250 M 460 238 L 840 238", range: [0.26, 0.38] },
  { d: "M 188 380 L 482 380", range: [0.28, 0.39] },
  { d: "M 818 410 L 1042 410", range: [0.3, 0.41] },

  // ---- storey divider + balcony railing -------------------------------------
  { d: "M 470 392 L 830 392", range: [0.34, 0.43] },
  {
    d:
      "M 215 380 L 215 360 M 245 380 L 245 360 M 275 380 L 275 360 M 305 380 L 305 360 " +
      "M 335 380 L 335 360 M 365 380 L 365 360 M 395 380 L 395 360 M 425 380 L 425 360 M 455 380 L 455 360",
    range: [0.38, 0.5],
    width: 1.5,
  },

  // ---- entrance portico (columns + beam) ------------------------------------
  { d: "M 525 430 L 525 560 M 585 430 L 585 560 M 715 430 L 715 560 M 775 430 L 775 560", range: [0.42, 0.56] },
  { d: "M 510 430 L 790 430 M 515 420 L 785 420", range: [0.5, 0.6] },

  // ---- windows --------------------------------------------------------------
  { d: "M 512 295 L 580 295 L 580 372 L 512 372 Z", range: [0.54, 0.64], delayDraw: true }, // upper-left
  { d: "M 720 295 L 788 295 L 788 372 L 720 372 Z", range: [0.56, 0.66], delayDraw: true }, // upper-right
  { d: "M 250 432 L 322 432 L 322 506 L 250 506 Z", range: [0.58, 0.68], delayDraw: true }, // left wing 1
  { d: "M 360 432 L 432 432 L 432 506 L 360 506 Z", range: [0.6, 0.7], delayDraw: true }, // left wing 2
  { d: "M 858 452 L 922 452 L 922 524 L 858 524 Z", range: [0.62, 0.72], delayDraw: true }, // right wing 1
  { d: "M 948 452 L 1008 452 L 1008 524 L 948 524 Z", range: [0.64, 0.74], delayDraw: true }, // right wing 2

  // ---- window mullions ------------------------------------------------------
  { d: "M 546 295 L 546 372 M 512 333 L 580 333 M 754 295 L 754 372 M 720 333 L 788 333", range: [0.66, 0.74], width: 1 },

  // ---- door + steps ---------------------------------------------------------
  { d: "M 628 462 L 628 560 M 672 462 L 672 560 M 628 462 L 672 462", range: [0.7, 0.8] },
  { d: "M 650 478 L 650 552", range: [0.78, 0.84], width: 1 },
  { d: "M 600 560 L 700 560 M 588 575 L 712 575 M 576 590 L 724 590", range: [0.76, 0.86], width: 1.5 },

  // ---- landscaping ----------------------------------------------------------
  {
    d: "M 1090 560 L 1090 482 M 1090 482 C 1058 478 1058 426 1090 414 C 1122 426 1122 478 1090 482",
    range: [0.86, 0.96],
    width: 1.5,
    delayDraw: true,
  },
  {
    d: "M 110 560 L 110 506 M 110 506 C 88 502 88 470 110 462 C 132 470 132 502 110 506",
    range: [0.9, 0.99],
    width: 1.5,
    delayDraw: true,
  },

  // ---- final flourish: sun / halo accent ------------------------------------
  { d: "M 560 196 A 130 130 0 0 1 740 196", range: [0.92, 1.0], width: 1.5, delayDraw: true },
];
