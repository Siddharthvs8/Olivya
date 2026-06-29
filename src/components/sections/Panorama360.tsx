"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, Compass, ArrowLeft, Move } from "lucide-react";
import type { Pano } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  PANORAMA 360                                                       */
/*  A fullscreen gallery of admin-managed 360° tours. Pick a room to   */
/*  step into an interactive panorama (momento360 / any iframe embed). */
/* ------------------------------------------------------------------ */

export default function Panorama360({
  panos,
  onClose,
}: {
  panos: Pano[];
  onClose: () => void;
}) {
  const [active, setActive] = useState<Pano | null>(null);

  // Lock page scroll (Lenis + native) while the gallery is open.
  useEffect(() => {
    window.dispatchEvent(new Event("lenis:stop"));
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (active) setActive(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.dispatchEvent(new Event("lenis:start"));
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[95] flex flex-col bg-ink"
    >
      {/* top bar */}
      <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          {active && (
            <button
              onClick={() => setActive(null)}
              className="flex items-center gap-2 rounded-full border border-line px-3 py-2 text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:border-gold hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" /> All tours
            </button>
          )}
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.35em] text-gold">
              Experienza · 360° Tours
            </p>
            <p className="font-serif text-xl text-cream">
              {active ? active.title : "Step inside, in 360°"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close 360° gallery"
          className="flex items-center gap-2 rounded-full border border-line bg-ink/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cream backdrop-blur transition-colors hover:border-gold hover:text-gold"
        >
          Close <X className="h-4 w-4" />
        </button>
      </div>

      {/* body */}
      {active ? (
        <div className="relative flex-1">
          <iframe
            key={active.id}
            src={active.embed_url}
            title={active.title}
            allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
            allowFullScreen
            className="h-full w-full border-0"
          />
          <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-ink/70 px-4 py-2 text-[0.65rem] uppercase tracking-[0.25em] text-cream/80 backdrop-blur">
            <Move className="h-3.5 w-3.5 text-gold" /> Drag to look around
          </div>
        </div>
      ) : panos.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <Compass className="h-10 w-10 text-faint" />
          <p className="text-muted">No 360° tours yet — check back soon.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto" data-lenis-prevent>
          <div className="mx-auto grid max-w-6xl gap-6 p-6 sm:grid-cols-2 sm:p-10 lg:grid-cols-3">
            {panos.map((pano, i) => (
              <motion.button
                key={pano.id}
                onClick={() => setActive(pano)}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-2xl border border-line bg-charcoal text-left transition-colors hover:border-gold/50"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {pano.image ? (
                    <Image
                      src={pano.image}
                      alt={pano.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-graphite via-charcoal to-ink" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                  {/* 360 badge */}
                  <span className="absolute right-4 top-4 rounded-full border border-gold/40 bg-ink/50 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur">
                    360°
                  </span>
                  {/* hover compass */}
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/90 text-ink opacity-0 shadow-[0_8px_30px_rgba(201,162,75,0.45)] transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                      <Compass className="h-7 w-7" />
                    </span>
                  </span>
                </div>
                <div className="p-5">
                  {pano.room && (
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">{pano.room}</span>
                  )}
                  <h3 className="mt-1.5 font-serif text-xl text-cream">{pano.title}</h3>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>,
    document.body,
  );
}
