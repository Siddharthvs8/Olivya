"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { X, Compass, Globe, ArrowDown, ChevronUp, ChevronDown } from "lucide-react";
import type { Pano } from "@/lib/types";
import Panorama360 from "./Panorama360";

/* ------------------------------------------------------------------ */
/*  EXPERIENZA                                                         */
/*  A floor selector → "Step Inside" → a scroll-driven cinematic       */
/*  interior tour with a magical 3D camera. Inspired by the ICG        */
/*  Gallery experience, rendered in the Oliviya dark + gold language.  */
/* ------------------------------------------------------------------ */

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1920&q=80`;

type Scene = { img: string; index: string; title: string; caption: string };
type Floor = {
  id: string;
  name: string;
  tag: string;
  cover: string;
  scenes: Scene[];
};

const FLOORS: Floor[] = [
  {
    id: "underground",
    name: "Underground",
    tag: "Wellness & Leisure",
    cover: u("1616486338812-3dadae4b4ace"),
    scenes: [
      { img: u("1583847268964-b28dc8f51f92"), index: "01", title: "Private Cinema", caption: "Acoustic walls, hidden lighting and a screen that drops at a touch." },
      { img: u("1616486338812-3dadae4b4ace"), index: "02", title: "The Cellar Lounge", caption: "A temperature-tuned reserve framed in smoked oak and brass." },
      { img: u("1556228453-efd6c1ff04f6"), index: "03", title: "Spa & Pool", caption: "An indoor pool wrapped in stone, steam and quiet light." },
    ],
  },
  {
    id: "ground",
    name: "Ground Floor",
    tag: "Living & Gathering",
    cover: u("1618221195710-dd6b41faaea6"),
    scenes: [
      { img: u("1600210492493-0946911123ea"), index: "01", title: "The Foyer", caption: "A double-height arrival, sculpted in light and Italian marble." },
      { img: u("1618221195710-dd6b41faaea6"), index: "02", title: "Grand Living", caption: "Seamless interiors that open fully to the Kerala courtyard." },
      { img: u("1600607687939-ce8a6c25118c"), index: "03", title: "Courtyard Lounge", caption: "Where the garden, water and living room become one room." },
    ],
  },
  {
    id: "first",
    name: "First Floor",
    tag: "Rest & Retreat",
    cover: u("1617103996702-96ff29b1c467"),
    scenes: [
      { img: u("1616594039964-ae9021a400a0"), index: "01", title: "The Landing", caption: "A gallery walk that frames the home from above." },
      { img: u("1617103996702-96ff29b1c467"), index: "02", title: "Master Suite", caption: "A private wing with dressing, lounge and a still, calm light." },
      { img: u("1613490493576-7fde63acd811"), index: "03", title: "Skyline Balcony", caption: "Floor-to-ceiling glass dissolving into the tropical horizon." },
    ],
  },
];

const GROUND_INDEX = FLOORS.findIndex((f) => f.id === "ground");

export default function Experienza({ panos = [] }: { panos?: Pano[] }) {
  const [activeIdx, setActiveIdx] = useState(GROUND_INDEX);
  const [entered, setEntered] = useState(false);
  const [show360, setShow360] = useState(false);
  const active = FLOORS[activeIdx];

  const prev = () => setActiveIdx((i) => (i - 1 + FLOORS.length) % FLOORS.length);
  const next = () => setActiveIdx((i) => (i + 1) % FLOORS.length);

  // Lock page scroll (Lenis + native) while the tour is open.
  useEffect(() => {
    if (!entered) return;
    window.dispatchEvent(new Event("lenis:stop"));
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setEntered(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.dispatchEvent(new Event("lenis:start"));
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [entered]);

  return (
    <section className="relative overflow-hidden border-y border-line bg-ink py-24 sm:py-32">
      {/* ambient gold wash */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,162,75,0.07),_transparent_65%)]" />

      <div className="container-luxe relative">
        <div className="text-center">
          <span className="eyebrow justify-center">Experienza</span>
          <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-light leading-tight sm:text-6xl">
            Walk your home <span className="text-gradient-gold italic">before</span> we build it
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted">
            Choose a floor and step inside a living, cinematic preview — then
            scroll to let the camera take you on the tour.
          </p>
        </div>

        {/* ---- floor stage ---- */}
        <div className="relative mt-16 flex items-center justify-center">
          {/* side floor labels (click to switch) */}
          <FloorLabel
            side="left"
            label={FLOORS[(activeIdx - 1 + FLOORS.length) % FLOORS.length].name}
            onClick={prev}
          />
          <FloorLabel
            side="right"
            label={FLOORS[(activeIdx + 1) % FLOORS.length].name}
            onClick={next}
          />

          <TiltCard key={active.id} floor={active} />
        </div>

        {/* ---- floor name + CTA ---- */}
        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">{active.tag}</p>
            <h3 className="mt-2 font-serif text-4xl text-cream sm:text-5xl">{active.name}</h3>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setEntered(true)}
              className="group relative inline-flex items-center gap-3 rounded-full bg-cream px-9 py-4 text-sm font-medium tracking-wide text-ink transition-colors duration-300 hover:bg-white"
            >
              <Compass className="h-4 w-4 transition-transform duration-500 group-hover:rotate-90" />
              Step Inside
            </button>

            {panos.length > 0 && (
              <button
                onClick={() => setShow360(true)}
                className="group relative inline-flex items-center gap-3 rounded-full border border-gold/40 px-9 py-4 text-sm font-medium tracking-wide text-gold transition-colors duration-300 hover:bg-gold hover:text-ink"
              >
                <Globe className="h-4 w-4 transition-transform duration-700 group-hover:rotate-180" />
                Explore in 360°
              </button>
            )}
          </div>

          {/* floor dots */}
          <div className="flex items-center gap-2">
            {FLOORS.map((f, i) => (
              <button
                key={f.id}
                aria-label={f.name}
                onClick={() => setActiveIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIdx ? "w-8 bg-gold" : "w-1.5 bg-line hover:bg-faint"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {entered && <Tour floor={active} onClose={() => setEntered(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {show360 && <Panorama360 panos={panos} onClose={() => setShow360(false)} />}
      </AnimatePresence>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Selector pieces                                                    */
/* ------------------------------------------------------------------ */

function FloorLabel({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 z-20 hidden -translate-y-1/2 items-center gap-2 text-[0.7rem] uppercase tracking-[0.35em] text-faint transition-colors hover:text-gold lg:flex ${
        side === "left" ? "left-0 -rotate-90" : "right-0 rotate-90"
      }`}
    >
      {label}
    </button>
  );
}

function TiltCard({ floor }: { floor: Floor }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 14);
    rx.set(-py * 12);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      className="relative aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-2xl border border-gold/25 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] [transform-style:preserve-3d]"
    >
      <Image
        src={floor.cover}
        alt={`${floor.name} preview`}
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
      {/* gold sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-gold/5 to-gold/15" />
      <div
        style={{ transform: "translateZ(50px)" }}
        className="absolute bottom-5 left-6 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cream/90"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        Virtual walkthrough · {floor.scenes.length} rooms
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  The immersive tour                                                 */
/* ------------------------------------------------------------------ */

function Tour({ floor, onClose }: { floor: Floor; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const total = floor.scenes.length;

  // Portal to <body> so the overlay escapes the homepage's z-10 stacking
  // context and covers the fixed navbar for a fully immersive tour.
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[90] bg-ink"
    >
      {/* top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="pointer-events-auto">
          <p className="text-[0.6rem] uppercase tracking-[0.35em] text-gold">Experienza · {floor.tag}</p>
          <p className="font-serif text-xl text-cream">{floor.name}</p>
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-line bg-ink/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cream backdrop-blur transition-colors hover:border-gold hover:text-gold"
        >
          Close <X className="h-4 w-4" />
        </button>
      </div>

      {/* progress rail */}
      <div className="absolute left-0 top-0 z-30 h-1 w-full bg-line/40">
        <motion.div style={{ width: bar }} className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-soft" />
      </div>

      {/* scroll driver */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="h-full w-full overflow-y-auto overflow-x-hidden"
      >
        <div style={{ height: `${total * 100 + 70}vh` }} className="relative">
          {/* sticky camera stage */}
          <div className="sticky top-0 h-screen w-full overflow-hidden [perspective:1500px]">
            {floor.scenes.map((scene, i) => (
              <TourScene
                key={scene.index}
                scene={scene}
                i={i}
                total={total}
                progress={scrollYProgress}
              />
            ))}

            {/* cinematic vignette */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_45%,_rgba(0,0,0,0.7))]" />
            {/* gold light sweep */}
            <LightSweep progress={scrollYProgress} />

            {/* scroll cue */}
            <motion.div
              style={{ opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]) }}
              className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 text-faint"
            >
              <span className="text-[0.6rem] uppercase tracking-[0.3em]">Scroll to tour</span>
              <ArrowDown className="h-4 w-4 animate-bounce text-gold" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* floor switch hint */}
      <div className="pointer-events-none absolute bottom-5 right-6 z-30 hidden items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-faint sm:flex">
        <ChevronUp className="h-3 w-3" /> Scroll <ChevronDown className="h-3 w-3" />
      </div>
    </motion.div>,
    document.body,
  );
}

function TourScene({
  scene,
  i,
  total,
  progress,
}: {
  scene: Scene;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const seg = 1 / total;
  const start = i * seg;
  const end = (i + 1) * seg;
  const dir = i % 2 === 0 ? 1 : -1;

  // crossfade between rooms
  const opacity = useTransform(
    progress,
    [start - seg * 0.5, start + seg * 0.22, end - seg * 0.22, end + seg * 0.5],
    [0, 1, 1, 0],
    { clamp: true },
  );
  // magical camera: push in + parallax pan + slight 3D rotate
  const scale = useTransform(progress, [start - seg * 0.5, end + seg * 0.5], [1.12, 1.36]);
  const x = useTransform(progress, [start - seg * 0.5, end + seg * 0.5], [`${5 * dir}%`, `${-5 * dir}%`]);
  const rotateY = useTransform(progress, [start - seg * 0.5, end + seg * 0.5], [3.5 * dir, -3.5 * dir]);
  const rotateX = useTransform(progress, [start - seg * 0.5, end + seg * 0.5], [2, -2]);

  // caption drifts with the camera
  const capY = useTransform(progress, [start, end], [60, -60]);
  const capOpacity = useTransform(
    progress,
    [start - seg * 0.1, start + seg * 0.25, end - seg * 0.25, end + seg * 0.1],
    [0, 1, 1, 0],
    { clamp: true },
  );

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 [transform-style:preserve-3d]">
      <motion.div style={{ scale, x, rotateY, rotateX }} className="absolute inset-0">
        <Image
          src={scene.img}
          alt={scene.title}
          fill
          priority={i === 0}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/15 to-ink/35" />
      </motion.div>

      <motion.div
        style={{ y: capY, opacity: capOpacity }}
        className="absolute bottom-[12vh] left-6 max-w-md sm:left-12"
      >
        <p className="font-serif text-7xl text-gold/30">{scene.index}</p>
        <h3 className="-mt-4 font-serif text-4xl text-cream sm:text-5xl">{scene.title}</h3>
        <p className="mt-3 text-muted">{scene.caption}</p>
      </motion.div>
    </motion.div>
  );
}

function LightSweep({ progress }: { progress: MotionValue<number> }) {
  const x = useTransform(progress, [0, 1], ["-30%", "130%"]);
  return (
    <motion.div
      style={{ x }}
      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-gold/10 to-transparent blur-2xl"
    />
  );
}
