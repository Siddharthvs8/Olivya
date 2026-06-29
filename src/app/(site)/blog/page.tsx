import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/data";
import { formatDate, readingTime } from "@/lib/utils";
import PageHero from "@/components/sections/PageHero";
import PostCard from "@/components/ui/PostCard";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "The Oliviya Developers journal — insights on luxury home design, craftsmanship, architecture and building in Kerala.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="The journal"
        title="Insights & inspiration."
        intro="Notes on design, craftsmanship and the art of building a home worth passing on for generations."
      />

      <section className="container-luxe py-20 sm:py-28">
        {featured && (
          <Reveal className="mb-16">
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid gap-8 lg:grid-cols-2 lg:gap-12"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-line">
                {featured.cover_image && (
                  <Image
                    src={featured.cover_image}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                )}
                <span className="absolute left-5 top-5 rounded-full border border-gold/40 bg-ink/50 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-gold backdrop-blur">
                  Featured
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-faint">
                  <span>{formatDate(featured.created_at)}</span>
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  <span>{readingTime(featured.content)} min read</span>
                </div>
                <h2 className="mt-4 font-serif text-3xl leading-tight text-cream transition-colors group-hover:text-gold sm:text-4xl lg:text-5xl">
                  {featured.title}
                </h2>
                <p className="mt-5 max-w-xl leading-relaxed text-muted">
                  {featured.excerpt}
                </p>
                <span className="mt-7 inline-flex items-center gap-2 text-sm text-gold">
                  Read article →
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        {rest.length > 0 && (
          <div className="grid gap-8 border-t border-line pt-16 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
