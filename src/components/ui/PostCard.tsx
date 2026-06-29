"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate, readingTime } from "@/lib/utils";

export default function PostCard({
  post,
  index = 0,
}: {
  post: Post;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-line">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-graphite" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        <div className="mt-5">
          <div className="flex items-center gap-3 text-xs text-faint">
            <span>{formatDate(post.created_at)}</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span>{readingTime(post.content)} min read</span>
          </div>
          <h3 className="mt-3 font-serif text-2xl leading-snug text-cream transition-colors group-hover:text-gold">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
            {post.excerpt}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-gold">
            Read article
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
