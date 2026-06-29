"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  GRAIN TEXT                                                         */
/*  The brand wordmark, drawn crisp on a full-viewport canvas, then    */
/*  sampled into thousands of golden grains that explode in 3D —       */
/*  some rushing toward the camera and off-screen, some receding —     */
/*  handing off to the home that draws beneath.                        */
/* ------------------------------------------------------------------ */

type Grain = {
  x: number;
  y: number; // origin (screen plane)
  dx: number;
  dy: number;
  dz: number; // 3D explosion offset
  grav: number;
  delay: number;
  size: number;
  ball: number; // which golden-sphere sprite
};

type Line = { text: string; scale: number; weight: number; ls: number };

const LINES: Line[] = [
  { text: "OLIVIYA", scale: 1, weight: 700, ls: 0.06 },
  { text: "DEVELOPERS PVT LTD", scale: 0.34, weight: 600, ls: 0.16 },
  { text: "THE LUXURY HOME BUILDER", scale: 0.3, weight: 500, ls: 0.14 },
];

const FOV = 720; // perspective focal length

// Pre-render a few shaded golden spheres once; cheap to drawImage thousands.
const BALL_TINTS = [
  { light: "#fff1c0", mid: "#e7c869", edge: "#9c7a32" },
  { light: "#fff7da", mid: "#f0d585", edge: "#b9923f" },
  { light: "#f3dd95", mid: "#caa23f", edge: "#7c5e26" },
];
function makeBall(tint: { light: string; mid: string; edge: string }) {
  const d = 48;
  const c = document.createElement("canvas");
  c.width = d;
  c.height = d;
  const g = c.getContext("2d")!;
  const r = d / 2;
  // off-centre radial = sphere lit from upper-left, soft transparent rim
  const grad = g.createRadialGradient(d * 0.36, d * 0.34, r * 0.06, r, r, r);
  grad.addColorStop(0, "#fff8e6");
  grad.addColorStop(0.18, tint.light);
  grad.addColorStop(0.55, tint.mid);
  grad.addColorStop(0.85, tint.edge);
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, d, d);
  // crisp specular highlight
  const hl = g.createRadialGradient(d * 0.34, d * 0.32, 0, d * 0.34, d * 0.32, r * 0.32);
  hl.addColorStop(0, "rgba(255,255,255,0.95)");
  hl.addColorStop(1, "rgba(255,255,255,0)");
  g.globalCompositeOperation = "lighter";
  g.fillStyle = hl;
  g.fillRect(0, 0, d, d);
  return c;
}

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export default function GrainText({
  progress,
  reduced,
}: {
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const balls = BALL_TINTS.map(makeBall);
    let W = 0;
    let H = 0;
    let cx = 0;
    let cy = 0;
    let grains: Grain[] = [];
    let layout: { y: number; size: number; line: Line }[] = [];
    let fam = "sans-serif";
    let raf = 0;
    let alive = true;

    function build() {
      fam =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--font-montserrat")
          .trim() || "sans-serif";
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      const base = Math.min(W * 0.085, 122); // OLIVIYA cap height (px)
      const sizes = LINES.map((l) => base * l.scale);
      const gaps = [base * 0.36, base * 0.3];
      const totalH = sizes[0] + gaps[0] + sizes[1] + gaps[1] + sizes[2];
      cx = W / 2;
      cy = H * 0.46;
      let y = cy - totalH / 2 + sizes[0] / 2;
      layout = [];
      LINES.forEach((line, i) => {
        layout.push({ y, size: sizes[i], line });
        if (i < 2) y += sizes[i] / 2 + gaps[i] + sizes[i + 1] / 2;
      });

      // Sample the text into grain positions via an offscreen canvas.
      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const o = off.getContext("2d")!;
      o.scale(dpr, dpr);
      o.textAlign = "center";
      o.textBaseline = "middle";
      o.fillStyle = "#fff";
      for (const { y: ly, size, line } of layout) {
        o.font = `${line.weight} ${size}px ${fam}`;
        if ("letterSpacing" in o) {
          (o as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${size * line.ls}px`;
        }
        o.fillText(line.text, W / 2, ly);
      }

      const data = o.getImageData(0, 0, off.width, off.height).data;
      const stride = Math.max(2, Math.round(3 * dpr));
      const maxDist = Math.max(W, H) * 0.7;
      const next: Grain[] = [];
      for (let py = 0; py < off.height; py += stride) {
        for (let px = 0; px < off.width; px += stride) {
          if (data[(py * off.width + px) * 4 + 3] > 110) {
            // random direction on a sphere → true 3D dispersal
            const ang = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = maxDist * (0.3 + Math.random() * 0.9);
            next.push({
              x: px / dpr,
              y: py / dpr,
              dx: r * Math.sin(phi) * Math.cos(ang),
              dy: r * Math.sin(phi) * Math.sin(ang) * 0.85,
              dz: r * Math.cos(phi), // toward (+) / away (−) from camera
              grav: 50 + Math.random() * 200,
              delay: Math.random() * 0.16,
              size: Math.random() * 1.6 + 0.8,
              ball: (Math.random() * BALL_TINTS.length) | 0,
            });
          }
        }
      }
      grains = next;
    }

    function draw() {
      const t = progress.get();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // crisp metallic text at rest, fading as the grains take over
      const textAlpha = 1 - smooth(0.0, 0.07, t);
      if (textAlpha > 0.01 && layout.length) {
        ctx.globalAlpha = textAlpha;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const { y, size, line } of layout) {
          const grad = ctx.createLinearGradient(0, y - size / 2, 0, y + size / 2);
          grad.addColorStop(0, "#f7e9b0");
          grad.addColorStop(0.45, "#e7c869");
          grad.addColorStop(0.7, "#caa23f");
          grad.addColorStop(1, "#9c7a32");
          ctx.fillStyle = grad;
          ctx.font = `${line.weight} ${size}px ${fam}`;
          if ("letterSpacing" in ctx) {
            (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${size * line.ls}px`;
          }
          ctx.fillText(line.text, W / 2, y);
        }
        if ("letterSpacing" in ctx) {
          (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";
        }
      }

      // golden grains: fade in as text fades, explode in 3D, then fade out
      const gGlobal = smooth(0.0, 0.08, t) * (1 - smooth(0.52, 0.66, t));
      if (gGlobal > 0.01) {
        const ang = t * 0.4; // gentle swirl of the whole field
        const ca = Math.cos(ang);
        const sa = Math.sin(ang);
        for (let i = 0; i < grains.length; i++) {
          const g = grains[i];
          const local = clamp((t - g.delay) / 0.5, 0, 1);
          const e = easeOutCubic(local);

          const wx = g.x + g.dx * e - cx;
          const wy = g.y + g.dy * e + g.grav * e * e - cy;
          const z = g.dz * e;
          const persp = clamp(FOV / (FOV - z), 0.2, 6);

          const sx = cx + (wx * ca - wy * sa) * persp;
          const sy = cy + (wx * sa + wy * ca) * persp;
          if (sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) continue;

          const depthA = clamp(0.25 + persp * 0.55, 0.15, 1);
          const a = (1 - smooth(0.62, 1, local)) * gGlobal * depthA;
          if (a <= 0.01) continue;
          ctx.globalAlpha = a;
          // shaded golden sphere (centred), bigger when near the camera
          const s = clamp(g.size * persp * 2.2, 1.6, 24);
          ctx.drawImage(balls[g.ball], sx - s / 2, sy - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (alive) build();
    });
    build();
    raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(() => build());
    ro.observe(wrap);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [progress, reduced]);

  if (reduced) {
    return (
      <div
        ref={wrapRef}
        className="flex h-full w-full flex-col items-center justify-center gap-3 text-center font-[family-name:var(--font-montserrat)]"
      >
        <span className="text-gradient-gold text-6xl font-bold tracking-[0.06em]">OLIVIYA</span>
        <span className="text-gradient-gold text-2xl font-semibold tracking-[0.18em]">DEVELOPERS PVT LTD</span>
        <span className="text-gradient-gold text-lg font-medium tracking-[0.16em]">THE LUXURY HOME BUILDER</span>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 h-full w-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 [filter:drop-shadow(0_0_10px_rgba(201,162,75,0.3))]"
      />
    </div>
  );
}
