"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  BUILD JOURNEY — isometric 3D build of a modern 2-storey home       */
/*  A pinned, scroll-scrubbed sequence. Parts assemble in 3D (slabs    */
/*  drop, walls rise, faces shade in) under a perspective camera that  */
/*  slowly orbits — excavate → foundation → ground floor → slab →      */
/*  upper floor → roof → glazing → finishing & handover.               */
/* ------------------------------------------------------------------ */

const GOLD = "url(#bj-gold)";
const sp = {
  stroke: GOLD,
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
  vectorEffect: "non-scaling-stroke" as const,
};

type Range = [number, number];
type Gate = [number, number, number, number];
type V3 = [number, number, number];

/* ---- isometric projection (model units → screen) ---- */
const S = 23;
const OX = 770;
const OY = 560;
const UX = Math.cos(Math.PI / 6) * S; // ≈ 19.9
const UY = Math.sin(Math.PI / 6) * S; // ≈ 11.5
const iso = (x: number, y: number, z: number): [number, number] => [
  OX + (x - y) * UX,
  OY + (x + y) * UY - z * S,
];
const pt = (p: V3) => {
  const [a, b] = iso(p[0], p[1], p[2]);
  return `${a.toFixed(1)} ${b.toFixed(1)}`;
};
const seg = (a: V3, b: V3) => `M ${pt(a)} L ${pt(b)}`;
const face = (pts: V3[]) => "M " + pts.map(pt).join(" L ") + " Z";

/** Visible faces (top + the two near verticals) of an axis-aligned box. */
function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  return {
    top: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]] as V3[],
    right: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]] as V3[],
    left: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]] as V3[],
  };
}

/** A drawn line group (rebar, glazing, rails) that draws over a range. */
function Draw({ p, d, range, width = 2 }: { p: MotionValue<number>; d: string; range: Range; width?: number }) {
  const pathLength = useTransform(p, range, [0, 1], { clamp: true });
  const opacity = useTransform(p, [range[0], range[0] + (range[1] - range[0]) * 0.25], [0, 1], { clamp: true });
  return <motion.path d={d} style={{ pathLength, opacity }} {...sp} strokeWidth={width} />;
}

/** A solid that assembles into place: faces shade in + slide, edges draw. */
function Solid({
  p,
  range,
  faces,
  rise = 16,
  lit,
}: {
  p: MotionValue<number>;
  range: Range;
  faces: ReturnType<typeof box>;
  rise?: number;
  lit?: MotionValue<number>;
}) {
  const [a, b] = range;
  const mid = a + (b - a) * 0.55;
  const opacity = useTransform(p, [a, a + (b - a) * 0.3], [0, 1], { clamp: true });
  const y = useTransform(p, [a, mid], [rise, 0], { clamp: true });
  const pl = useTransform(p, [a + (b - a) * 0.1, b], [0, 1], { clamp: true });
  // faces shade in; brighten ("render") at handover when `lit` is supplied
  const src = lit ?? p;
  const topFill = useTransform(src, [0, 1], lit ? ["rgba(227,201,134,0.1)", "rgba(227,201,134,0.22)"] : ["rgba(227,201,134,0.12)", "rgba(227,201,134,0.12)"]);
  const rightFill = useTransform(src, [0, 1], lit ? ["rgba(201,162,75,0.08)", "rgba(201,162,75,0.16)"] : ["rgba(201,162,75,0.1)", "rgba(201,162,75,0.1)"]);
  const leftFill = useTransform(src, [0, 1], lit ? ["rgba(120,92,38,0.06)", "rgba(120,92,38,0.12)"] : ["rgba(120,92,38,0.07)", "rgba(120,92,38,0.07)"]);
  return (
    <motion.g style={{ opacity, y }}>
      <motion.path d={face(faces.top)} stroke="none" style={{ fill: topFill }} />
      <motion.path d={face(faces.right)} stroke="none" style={{ fill: rightFill }} />
      <motion.path d={face(faces.left)} stroke="none" style={{ fill: leftFill }} />
      <motion.path d={face(faces.top)} style={{ pathLength: pl }} {...sp} />
      <motion.path d={face(faces.right)} style={{ pathLength: pl }} {...sp} />
      <motion.path d={face(faces.left)} style={{ pathLength: pl }} {...sp} />
    </motion.g>
  );
}

function Phase({ p, gate, children }: { p: MotionValue<number>; gate: Gate; children: React.ReactNode }) {
  const opacity = useTransform(p, gate, [0, 1, 1, 0], { clamp: true });
  return <motion.g style={{ opacity }}>{children}</motion.g>;
}

function Dust({ x, y, r = 9 }: { x: number; y: number; r?: number }) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={r}
      fill="rgba(201,162,75,0.4)"
      animate={{ scale: [0.4, 1.6, 0.4], opacity: [0.45, 0, 0.45] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    />
  );
}

/* ---------------------------- the home ---------------------------- */
// modern villa: 2-storey main block + single-storey garage wing + porch
const MAIN = { x0: 0, x1: 11, y0: 0, y1: 9 };
const SPLIT = 4; // floor height (ground)
const TOP = 8; // total wall height
const ROOFZ = 8.4;

function GlazingLeft(x0: number, x1: number, y1: number, z0: number, z1: number, n: number) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    d += seg([x, y1, z0], [x, y1, z1]);
  }
  d += seg([x0, y1, (z0 + z1) / 2], [x1, y1, (z0 + z1) / 2]);
  return d;
}
function GlazingRight(x1: number, y0: number, y1: number, z0: number, z1: number, n: number) {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const y = y0 + ((y1 - y0) * i) / n;
    d += seg([x1, y, z0], [x1, y, z1]);
  }
  d += seg([x1, y0, (z0 + z1) / 2], [x1, y1, (z0 + z1) / 2]);
  return d;
}

const STAGES: { at: Range; no: string; title: string; desc: string }[] = [
  { at: [0.0, 0.12], no: "01", title: "Excavation", desc: "The plot is cleared and excavated to firm ground." },
  { at: [0.12, 0.24], no: "02", title: "Foundation", desc: "A reinforced raft and plinth anchor the home." },
  { at: [0.24, 0.4], no: "03", title: "Ground Floor", desc: "Walls and columns rise around the living level." },
  { at: [0.4, 0.5], no: "04", title: "First Slab", desc: "The crane sets the upper-floor slab in place." },
  { at: [0.5, 0.64], no: "05", title: "Upper Floor", desc: "Bedrooms take shape with a cantilevered balcony." },
  { at: [0.64, 0.74], no: "06", title: "Roof", desc: "Flat roof, parapet and porch canopy complete the shell." },
  { at: [0.74, 0.86], no: "07", title: "Glazing", desc: "Floor-to-ceiling glass, doors and railings go in." },
  { at: [0.86, 1.0], no: "08", title: "Handover", desc: "Render, landscaping and lights — ready to live." },
];

export default function BuildJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // snappy enough to track scroll tightly, smoothed just enough to feel buttery
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.0005 });

  // active stage → single caption (no overlap)
  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    let i = 0;
    for (let k = 0; k < STAGES.length; k++) if (v >= STAGES[k].at[0]) i = k;
    setActive(i);
  });

  // 3D camera: a stronger orbit + tilt + zoom following the build
  const camRotY = useTransform(p, [0, 0.5, 1], [18, -3, -16]);
  const camRotX = useTransform(p, [0, 1], [10, 2]);
  const camScale = useTransform(p, [0, 0.45, 0.92, 1], [1.5, 1.08, 0.95, 1.02]);
  const lit = useTransform(p, [0.86, 0.97], [0, 1], { clamp: true });
  const litWin = useTransform(p, [0.88, 0.98], [0, 0.3], { clamp: true });
  const glowO = useTransform(p, [0.2, 0.9, 1], [0.05, 0.18, 0.26]);
  const sweepX = useTransform(p, [0.78, 0.99], ["-45%", "145%"]);
  const sweepO = useTransform(p, [0.78, 0.84, 0.97, 1], [0, 0.55, 0.55, 0]);
  const sunO = useTransform(p, [0.84, 0.95], [0, 1], { clamp: true });
  const barH = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative h-[560vh] bg-ink">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* title */}
        <div className="pointer-events-none absolute left-1/2 top-[7%] z-20 -translate-x-1/2 text-center">
          <span className="eyebrow justify-center">The build</span>
          <p className="mt-2 font-serif text-2xl text-cream/90 sm:text-3xl">A home, engineered from the ground up</p>
        </div>

        <div className="absolute right-6 top-1/2 z-20 hidden h-48 w-px -translate-y-1/2 bg-line sm:block">
          <motion.div style={{ height: barH }} className="w-px bg-gradient-to-b from-gold-soft via-gold to-gold-deep" />
        </div>

        {!reduced && (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -22 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-6 top-1/2 z-20 max-w-xs -translate-y-1/2 sm:left-12"
            >
              <p className="font-serif text-6xl text-gold/30 sm:text-7xl">{STAGES[active].no}</p>
              <h3 className="-mt-3 font-serif text-3xl text-cream sm:text-4xl">{STAGES[active].title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{STAGES[active].desc}</p>
            </motion.div>
          </AnimatePresence>
        )}

        {/* rising sun + horizon at handover (wow) */}
        <motion.div style={{ opacity: reduced ? 0 : sunO }} className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[34%] h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(243,221,149,0.5),_transparent_65%)] blur-2xl" />
          <div className="absolute inset-x-0 top-[52%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        </motion.div>

        {/* central warm glow that swells as it completes */}
        <motion.div
          style={{ opacity: reduced ? 0.1 : glowO }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(201,162,75,0.8),_transparent_60%)] blur-[80px]"
        />

        {/* diagonal light sweep across the build (wow) */}
        <motion.div
          style={{ x: reduced ? "-100%" : sweepX, opacity: reduced ? 0 : sweepO }}
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-gold/12 to-transparent mix-blend-screen blur-md"
        />

        <div className="pointer-events-none absolute inset-0">
          {DUST.map((d, i) => (
            <span key={i} className="oh-dust absolute rounded-full bg-gold/40" style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, animationDelay: `${d.d}s`, animationDuration: `${d.t}s` }} />
          ))}
        </div>

        {/* 3D camera rig */}
        <div className="absolute inset-0 [perspective:1600px]">
          <motion.div style={reduced ? undefined : { scale: camScale }} className="absolute inset-0">
            <motion.div style={reduced ? undefined : { rotateX: camRotX, rotateY: camRotY, transformStyle: "preserve-3d" }} className="absolute inset-0">
              <motion.div animate={reduced ? undefined : { rotateY: [-3, 3, -3] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 [transform-style:preserve-3d]">
                <svg viewBox="0 0 1540 1040" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 mx-auto h-full w-full [filter:drop-shadow(0_0_18px_rgba(201,162,75,0.35))]">
                  <defs>
                    <linearGradient id="bj-gold" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#e3c986" />
                      <stop offset="50%" stopColor="#c9a24b" />
                      <stop offset="100%" stopColor="#9c7a32" />
                    </linearGradient>
                  </defs>

                  {/* ground grid */}
                  {!reduced && (
                    <Phase p={p} gate={[0.0, 0.04, 0.9, 1]}>
                      <GroundGrid p={p} />
                    </Phase>
                  )}

                  {/* excavation pit */}
                  {!reduced && (
                    <Phase p={p} gate={[0.04, 0.08, 0.2, 0.26]}>
                      <Draw p={p} d={face(box(-1, 12, -1, 10, -1.4, 0).top)} range={[0.04, 0.12]} width={1.4} />
                      <Draw p={p} d={`${seg([-1, -1, 0], [-1, -1, -1.4])}${seg([12, -1, 0], [12, -1, -1.4])}${seg([12, 10, 0], [12, 10, -1.4])}`} range={[0.05, 0.13]} width={1.2} />
                    </Phase>
                  )}

                  {/* foundation */}
                  <Solid p={p} range={[0.13, 0.22]} faces={box(-0.6, 11.6, -0.6, 9.6, -0.6, 0)} rise={-14} lit={reduced ? undefined : lit} />
                  <Solid p={p} range={[0.16, 0.24]} faces={box(0, 11, 0, 9, 0, 0.6)} rise={10} lit={reduced ? undefined : lit} />

                  {/* ground-floor walls (main + garage) */}
                  <Solid p={p} range={[0.24, 0.4]} faces={box(MAIN.x0, MAIN.x1, MAIN.y0, MAIN.y1, 0.6, SPLIT)} rise={22} lit={reduced ? undefined : lit} />
                  <Solid p={p} range={[0.3, 0.42]} faces={box(11, 16, 3, 9, 0.6, 3.4)} rise={20} lit={reduced ? undefined : lit} />

                  {/* first-floor slab (drops in) */}
                  <Solid p={p} range={[0.4, 0.5]} faces={box(-0.4, 11.4, -0.4, 9.4, SPLIT, SPLIT + 0.5)} rise={-26} lit={reduced ? undefined : lit} />

                  {/* upper floor + cantilever balcony toward front (y<0) */}
                  <Solid p={p} range={[0.5, 0.64]} faces={box(0, 9, -1.6, 9, SPLIT + 0.5, TOP)} rise={22} lit={reduced ? undefined : lit} />

                  {/* roof slab + parapet frame + porch canopy */}
                  <Solid p={p} range={[0.64, 0.72]} faces={box(0, 9, -1.6, 9, TOP, ROOFZ)} rise={-18} lit={reduced ? undefined : lit} />
                  {!reduced && (
                    <>
                      <Draw p={p} d={`${seg([0, -1.6, ROOFZ + 0.7], [9, -1.6, ROOFZ + 0.7])}${seg([9, -1.6, ROOFZ + 0.7], [9, 9, ROOFZ + 0.7])}${seg([0, -1.6, ROOFZ], [0, -1.6, ROOFZ + 0.7])}${seg([9, -1.6, ROOFZ], [9, -1.6, ROOFZ + 0.7])}`} range={[0.68, 0.74]} width={1.4} />
                      {/* porch canopy over garage */}
                      <Solid p={p} range={[0.66, 0.74]} faces={box(11, 17, 2, 9, 3.4, 3.7)} rise={-12} lit={lit} />
                      {/* rooftop: solar array + skylight */}
                      <Draw p={p} d={solarPanels()} range={[0.72, 0.8]} width={1} />
                      <Draw p={p} d={face([[2, 1, ROOFZ], [4, 1, ROOFZ], [4, 3, ROOFZ], [2, 3, ROOFZ]])} range={[0.74, 0.8]} width={1.2} />
                    </>
                  )}

                  {/* glazing, door, balcony rail */}
                  {!reduced && (
                    <Phase p={p} gate={[0.74, 0.8, 0.99, 1]}>
                      <Draw p={p} d={GlazingLeft(0, 9, 9, 0.7, SPLIT - 0.3, 5)} range={[0.74, 0.82]} width={1.1} />
                      <Draw p={p} d={GlazingLeft(0, 9, 9, SPLIT + 0.8, TOP - 0.4, 5)} range={[0.76, 0.84]} width={1.1} />
                      <Draw p={p} d={GlazingRight(11, 0, 9, 0.7, SPLIT - 0.3, 4)} range={[0.78, 0.85]} width={1.1} />
                      {/* entrance door */}
                      <Draw p={p} d={`${seg([11, 5.6, 0], [11, 5.6, 2.6])}${seg([11, 7.4, 0], [11, 7.4, 2.6])}${seg([11, 5.6, 2.6], [11, 7.4, 2.6])}`} range={[0.8, 0.85]} width={1.6} />
                      {/* cantilever balcony rail */}
                      <Draw p={p} d={balconyRail()} range={[0.8, 0.86]} width={1} />
                    </Phase>
                  )}

                  {/* lit windows on handover (lights come on) */}
                  <motion.g style={{ opacity: reduced ? 0.24 : litWin }}>
                    <path d={face([[0.4, 9, 1], [8.6, 9, 1], [8.6, 9, 3.6], [0.4, 9, 3.6]])} fill="rgba(227,201,134,1)" stroke="none" />
                    <path d={face([[0.4, 9, 4.8], [8.6, 9, 4.8], [8.6, 9, 7.4], [0.4, 9, 7.4]])} fill="rgba(227,201,134,1)" stroke="none" />
                    <path d={face([[16, 3.6, 0.8], [16, 8.4, 0.8], [16, 8.4, 2.8], [16, 3.6, 2.8]])} fill="rgba(227,201,134,0.85)" stroke="none" />
                  </motion.g>

                  {/* landscaping & exterior detail */}
                  {!reduced && (
                    <Phase p={p} gate={[0.84, 0.9, 0.99, 1]}>
                      {/* pool deck + sunken pool with ripples */}
                      <Solid p={p} range={[0.85, 0.91]} faces={box(0.5, 9, -7, -1.7, 0, 0.12)} rise={-6} lit={lit} />
                      <Solid p={p} range={[0.86, 0.92]} faces={box(1.4, 7.6, -6.4, -2.4, -0.7, -0.12)} rise={-6} lit={lit} />
                      <Draw p={p} d={poolRipples()} range={[0.9, 0.96]} width={0.7} />
                      {/* driveway with centre stripe */}
                      <Solid p={p} range={[0.86, 0.92]} faces={box(11, 19, 1, 4.2, 0, 0.06)} rise={-4} lit={lit} />
                      <Draw p={p} d={seg([12, 2.6, 0.08], [18.4, 2.6, 0.08])} range={[0.9, 0.95]} width={0.8} />
                      {/* entrance steps */}
                      <Draw p={p} d={steps()} range={[0.88, 0.93]} width={1} />
                      {/* trees */}
                      <IsoTree x={-2.8} y={5} />
                      <IsoTree x={-3.2} y={-4} s={0.85} />
                      <IsoTree x={17.6} y={-3} />
                    </Phase>
                  )}

                  {/* machines */}
                  {!reduced && (
                    <>
                      <Phase p={p} gate={[0.03, 0.08, 0.2, 0.26]}>
                        <Excavator />
                        <Dust x={iso(11, 9, 0)[0]} y={iso(11, 9, 0)[1]} r={14} />
                      </Phase>
                      <Phase p={p} gate={[0.24, 0.3, 0.46, 0.52]}>
                        <Mixer />
                      </Phase>
                      <Phase p={p} gate={[0.34, 0.4, 0.82, 0.88]}>
                        <Crane p={p} />
                      </Phase>
                      <Phase p={p} gate={[0.5, 0.56, 0.82, 0.88]}>
                        <Worker x={iso(0, 9, SPLIT + 0.5)[0]} y={iso(0, 9, SPLIT + 0.5)[1]} />
                      </Phase>
                    </>
                  )}
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---- scene helpers using iso() ---- */
function GroundGrid({ p }: { p: MotionValue<number> }) {
  let d = "";
  for (let x = -4; x <= 18; x += 2) d += seg([x, -4, 0], [x, 12, 0]);
  for (let y = -4; y <= 12; y += 2) d += seg([-4, y, 0], [18, y, 0]);
  return <Draw p={p} d={d} range={[0.0, 0.06]} width={0.6} />;
}
function balconyRail() {
  let d = seg([0, -1.6, TOP], [9, -1.6, TOP]);
  d += seg([0, -1.6, TOP], [0, -1.6, TOP + 1]) + seg([9, -1.6, TOP], [9, -1.6, TOP + 1]);
  d += seg([0, -1.6, TOP + 1], [9, -1.6, TOP + 1]);
  for (let x = 0.5; x < 9; x += 0.9) d += seg([x, -1.6, TOP], [x, -1.6, TOP + 1]);
  return d;
}
function IsoTree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const [tx, ty] = iso(x, y, 0);
  const [hx, hy] = iso(x, y, 2.4 * s);
  return (
    <g>
      <path d={`M ${tx} ${ty} L ${hx} ${hy}`} {...sp} strokeWidth={1.4} />
      {[0, 1, 2].map((k) => {
        const [cxp, cyp] = iso(x, y, (2.6 + k * 1.05) * s);
        const r = (26 * s - k * 6);
        return <ellipse key={k} cx={cxp} cy={cyp - 6} rx={r} ry={r * 0.62} {...sp} strokeWidth={1.1} fill="rgba(201,162,75,0.05)" />;
      })}
    </g>
  );
}
function poolRipples() {
  let d = "";
  for (let yy = -6; yy <= -2.6; yy += 0.8) d += seg([1.6, yy, -0.18], [7.4, yy, -0.18]);
  return d;
}
function steps() {
  let d = "";
  for (let i = 0; i <= 3; i++) {
    const x = 11 + i * 0.55;
    const z = 0.6 - i * 0.2;
    d += seg([x, 5.4, z], [x, 7.6, z]);
    if (i < 3) d += seg([x, 5.4, z], [x + 0.55, 5.4, z - 0.2]) + seg([x, 7.6, z], [x + 0.55, 7.6, z - 0.2]);
  }
  return d;
}
function solarPanels() {
  let d = "";
  for (let yy = 4; yy < 8; yy += 1.6) {
    for (let xx = 4; xx < 8.4; xx += 1.3) {
      d += face([[xx, yy, ROOFZ], [xx + 1.1, yy, ROOFZ], [xx + 1.1, yy + 1.3, ROOFZ], [xx, yy + 1.3, ROOFZ]]);
      d += seg([xx + 0.55, yy, ROOFZ], [xx + 0.55, yy + 1.3, ROOFZ]);
    }
  }
  return d;
}

/* ---- iso machines ---- */
function Excavator() {
  const base = iso(14, 8, 0);
  return (
    <g transform={`translate(${base[0]},${base[1]})`}>
      <path d="M -34 0 L 30 0 L 38 -10 L -26 -10 Z" {...sp} />
      <circle cx={-24} cy={-2} r={6} {...sp} />
      <circle cx={20} cy={-2} r={6} {...sp} />
      <path d="M -20 -10 L 24 -10 L 24 -40 L -6 -40 L -20 -26 Z" {...sp} />
      <path d="M 0 -36 L 18 -36 L 18 -18 L 0 -18 Z" {...sp} strokeWidth={1} />
      <g transform="translate(24,-30)">
        <motion.g animate={{ rotate: [0, -12, 4, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
          <path d="M 0 0 L 56 -26" {...sp} />
          <g transform="translate(56,-26)">
            <motion.g animate={{ rotate: [0, 32, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
              <path d="M 0 0 L 22 28" {...sp} />
              <path d="M 22 28 L 38 22 L 32 46 L 14 40 Z" {...sp} />
            </motion.g>
          </g>
        </motion.g>
      </g>
    </g>
  );
}
function Mixer() {
  const base = iso(-3, 9, 0);
  return (
    <g transform={`translate(${base[0]},${base[1]})`}>
      <circle cx={-40} cy={-2} r={11} {...sp} />
      <circle cx={6} cy={-2} r={11} {...sp} />
      <path d="M -64 -12 L 36 -12" {...sp} />
      <path d="M 8 -12 L 8 -48 L 38 -48 L 50 -24 L 50 -12 Z" {...sp} />
      <path d="M 14 -42 L 34 -42 L 34 -26 L 14 -26 Z" {...sp} strokeWidth={1} />
      <g transform="translate(-30,-30)">
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>
          <ellipse cx={0} cy={0} rx={44} ry={26} {...sp} />
          <path d="M -38 -8 L 38 -8 M -42 6 L 42 6" {...sp} strokeWidth={1} />
        </motion.g>
      </g>
    </g>
  );
}
function Crane({ p }: { p: MotionValue<number> }) {
  const foot = iso(15, -3, 0);
  const head = iso(15, -3, 13);
  const tip = iso(4, -1, 13);
  const hookY = useTransform(p, [0.4, 0.82], [0, 200]);
  return (
    <g>
      <path d={`M ${foot[0] - 10} ${foot[1]} L ${head[0] - 10} ${head[1]} M ${foot[0] + 10} ${foot[1]} L ${head[0] + 10} ${head[1]}`} {...sp} />
      {(() => {
        let lat = "";
        for (let z = 1; z < 13; z += 1.4) {
          const lo = iso(15, -3, z);
          const hi = iso(15, -3, z + 1.4);
          lat += `M ${lo[0] - 10} ${lo[1]} L ${hi[0] + 10} ${hi[1]} M ${lo[0] + 10} ${lo[1]} L ${hi[0] - 10} ${hi[1]} `;
        }
        return <path d={lat} {...sp} strokeWidth={1} />;
      })()}
      <path d={`M ${head[0]} ${head[1]} L ${tip[0]} ${tip[1]}`} {...sp} />
      <path d={`M ${head[0]} ${head[1] - 26} L ${tip[0]} ${tip[1]} M ${head[0]} ${head[1] - 26} L ${head[0]} ${head[1]}`} {...sp} strokeWidth={1.2} />
      <motion.g style={{ y: hookY }}>
        <motion.g animate={{ y: [0, 14, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}>
          <path d={`M ${(head[0] + tip[0]) / 2} ${(head[1] + tip[1]) / 2} L ${(head[0] + tip[0]) / 2} ${(head[1] + tip[1]) / 2 + 90}`} {...sp} strokeWidth={1.2} />
          <path d={`M ${(head[0] + tip[0]) / 2 - 22} ${(head[1] + tip[1]) / 2 + 90} l 44 0 l 8 14 l -60 0 Z`} {...sp} />
        </motion.g>
      </motion.g>
    </g>
  );
}
function Worker({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(1.5,1.5)`}>
      <path d="M -5 0 L 0 -13 L 5 0 M 0 -13 L 0 -29" {...sp} />
      <circle cx={0} cy={-34} r={4.5} {...sp} />
      <path d="M -6.5 -36.5 A 6 5 0 0 1 6.5 -36.5 M -8 -36.5 L 8 -36.5" {...sp} />
      <g transform="translate(1,-26)">
        <motion.g animate={{ rotate: [0, -28, 0], y: [0, -4, 0] }} transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}>
          <path d="M 0 0 L 13 5 M 13 5 L 19 2 M 17 0 L 21 4" {...sp} />
        </motion.g>
      </g>
    </g>
  );
}

const DUST = [
  { x: 14, y: 28, s: 3, d: 0, t: 9 },
  { x: 26, y: 62, s: 2, d: 1.5, t: 11 },
  { x: 40, y: 20, s: 4, d: 0.6, t: 8 },
  { x: 54, y: 74, s: 2, d: 2.2, t: 12 },
  { x: 64, y: 40, s: 3, d: 0.3, t: 10 },
  { x: 72, y: 66, s: 2, d: 1.1, t: 9.5 },
  { x: 82, y: 24, s: 4, d: 1.9, t: 8.5 },
  { x: 88, y: 54, s: 2, d: 0.9, t: 11.5 },
  { x: 92, y: 36, s: 3, d: 2.6, t: 10.5 },
  { x: 8, y: 48, s: 2, d: 1.3, t: 12.5 },
];
