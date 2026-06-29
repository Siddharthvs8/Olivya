"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import type { Video } from "@/lib/types";

const thumb = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export default function VideoGallery({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState<Video | null>(null);

  // lock background scroll while the player is open
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  if (videos.length === 0) {
    return (
      <p className="container-luxe py-24 text-center text-muted">
        No videos yet — check back soon.
      </p>
    );
  }

  const featured = videos.find((v) => v.featured) ?? videos[0];
  const rest = videos.filter((v) => v.id !== featured.id);

  return (
    <section className="container-luxe py-20 sm:py-28">
      {/* Featured player */}
      <button
        onClick={() => setActive(featured)}
        className="group relative block w-full overflow-hidden rounded-3xl border border-line"
        aria-label={`Play ${featured.title}`}
      >
        <div className="relative aspect-video">
          <Image
            src={thumb(featured.youtube_id)}
            alt={featured.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          <PlayBadge large />
          <div className="absolute inset-x-0 bottom-0 p-6 text-left sm:p-10">
            {featured.category && (
              <span className="rounded-full border border-gold/40 bg-ink/40 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-gold backdrop-blur">
                {featured.category}
              </span>
            )}
            <h2 className="mt-4 max-w-3xl font-serif text-3xl text-cream sm:text-4xl lg:text-5xl">
              {featured.title}
            </h2>
            {featured.description && (
              <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">{featured.description}</p>
            )}
          </div>
        </div>
      </button>

      {/* Grid */}
      {rest.length > 0 && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((video, i) => (
            <motion.button
              key={video.id}
              onClick={() => setActive(video)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group overflow-hidden rounded-2xl border border-line bg-charcoal text-left transition-colors hover:border-gold/40"
              aria-label={`Play ${video.title}`}
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={thumb(video.youtube_id)}
                  alt={video.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <PlayBadge />
              </div>
              <div className="p-5">
                {video.category && (
                  <span className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">{video.category}</span>
                )}
                <h3 className="mt-1.5 font-serif text-xl text-cream">{video.title}</h3>
                {video.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{video.description}</p>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Lightbox player */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm sm:p-8"
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close video"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-ink/60 text-cream transition-colors hover:border-gold hover:text-gold"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-line bg-black shadow-2xl"
            >
              <iframe
                src={`https://www.youtube.com/embed/${active.youtube_id}?autoplay=1&rel=0`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function PlayBadge({ large = false }: { large?: boolean }) {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span
        className={`flex items-center justify-center rounded-full bg-gold/90 text-ink shadow-[0_8px_30px_rgba(201,162,75,0.45)] transition-transform duration-300 group-hover:scale-110 ${
          large ? "h-20 w-20" : "h-14 w-14"
        }`}
      >
        <Play className={large ? "h-8 w-8 translate-x-0.5" : "h-6 w-6 translate-x-0.5"} fill="currentColor" />
      </span>
    </span>
  );
}
