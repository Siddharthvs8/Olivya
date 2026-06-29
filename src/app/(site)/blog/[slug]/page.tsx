import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getAllPostSlugs, getPublishedPosts } from "@/lib/data";
import { COMPANY } from "@/lib/site";
import { formatDate, readingTime } from "@/lib/utils";
import Markdown from "@/components/Markdown";
import PostCard from "@/components/ui/PostCard";
import Reveal from "@/components/motion/Reveal";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${COMPANY.url}/blog/${post.slug}`,
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = (await getPublishedPosts())
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image ? [post.cover_image] : undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: COMPANY.legalName,
    },
    mainEntityOfPage: `${COMPANY.url}/blog/${post.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Header */}
      <header className="relative overflow-hidden pb-12 pt-36 sm:pt-44">
        {post.cover_image && (
          <div className="absolute inset-0">
            <Image
              src={post.cover_image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/85 to-ink" />
          </div>
        )}
        <div className="container-luxe relative z-10 max-w-3xl">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" /> Back to journal
            </Link>
          </Reveal>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-[0.15em] text-gold"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-5 font-serif text-4xl leading-[1.05] text-cream sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center gap-3 text-sm text-faint">
            <span>{post.author}</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span>{formatDate(post.created_at)}</span>
            <span className="h-1 w-1 rounded-full bg-gold" />
            <span>{readingTime(post.content)} min read</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="container-luxe max-w-3xl pb-24">
        <Markdown content={post.content} />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-line bg-charcoal py-20">
          <div className="container-luxe">
            <h2 className="mb-12 font-serif text-3xl text-cream sm:text-4xl">
              Keep reading
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <PostCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
