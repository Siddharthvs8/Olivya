"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: (index % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-2xl border border-line bg-charcoal transition-colors duration-500 hover:border-gold/40"
    >
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`View ${project.title}`}
        className="relative block aspect-[4/5] overflow-hidden"
      >
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-graphite via-charcoal to-ink" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-90" />

        <span className="absolute left-5 top-5 rounded-full border border-gold/40 bg-ink/40 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-gold backdrop-blur">
          {project.category}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl text-cream">{project.title}</h3>
              <p className="mt-1 text-sm text-muted">{project.location}</p>
            </div>
            <span className="flex h-11 w-11 shrink-0 translate-y-2 items-center justify-center rounded-full border border-line text-cream opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-hover:border-gold group-hover:text-gold">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-4 flex gap-6 border-t border-line/60 pt-4 text-xs text-faint">
            <span>{project.year}</span>
            <span>{project.area}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
