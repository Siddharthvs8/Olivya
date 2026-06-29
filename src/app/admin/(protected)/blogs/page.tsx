import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { getAllPosts } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import DeletePostButton from "@/components/admin/DeletePostButton";

export const dynamic = "force-dynamic";

export default async function AdminBlogList() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-cream">Blog Posts</h1>
          <p className="mt-2 text-muted">{posts.length} post{posts.length === 1 ? "" : "s"}</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-gold-soft"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </header>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted">No posts yet.</p>
            <Link href="/admin/blogs/new" className="mt-3 inline-block text-sm text-gold hover:underline">
              Write your first post →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {posts.map((post) => (
              <li key={post.id} className="flex items-center gap-4 p-4 sm:p-5">
                <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-charcoal sm:block">
                  {post.cover_image && (
                    <Image src={post.cover_image} alt="" fill className="object-cover" sizes="96px" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wide ${
                        post.published
                          ? "bg-gold/15 text-gold"
                          : "bg-stone text-muted"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-faint">{formatDate(post.created_at)}</span>
                  </div>
                  <p className="mt-1 truncate font-serif text-lg text-cream">{post.title}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {post.published && (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      aria-label="View post"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-gold/50 hover:text-gold"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/blogs/${post.id}`}
                    aria-label="Edit post"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <DeletePostButton id={post.id} title={post.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
