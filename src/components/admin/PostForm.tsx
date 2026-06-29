"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import type { Post } from "@/lib/types";
import { slugify } from "@/lib/utils";
import ImageUploader from "./ImageUploader";
import SubmitButton from "./SubmitButton";
import Markdown from "@/components/Markdown";

const field =
  "w-full rounded-xl border border-line bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-faint outline-none transition-colors focus:border-gold";

export default function PostForm({
  action,
  post,
}: {
  action: (formData: FormData) => void | Promise<void>;
  post?: Post;
}) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [content, setContent] = useState(post?.content ?? "");
  const [preview, setPreview] = useState(false);

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      {/* Main column */}
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-cream">Title</label>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="An elegant headline"
            className={`${field} font-serif text-lg`}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-cream">Slug</label>
          <input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="url-friendly-slug"
            className={field}
          />
          <p className="mt-1 text-xs text-faint">/blog/{slug || "your-slug"}</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-cream">Excerpt</label>
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={post?.excerpt}
            placeholder="A short summary shown on cards and search results."
            className={`${field} resize-none`}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-cream">
              Content <span className="text-faint">(Markdown)</span>
            </label>
            <button
              type="button"
              onClick={() => setPreview((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-soft"
            >
              {preview ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {preview ? "Edit" : "Preview"}
            </button>
          </div>
          {preview ? (
            <div className="min-h-[300px] rounded-xl border border-line bg-charcoal p-5">
              {content ? (
                <Markdown content={content} />
              ) : (
                <p className="text-sm text-faint">Nothing to preview yet.</p>
              )}
            </div>
          ) : (
            <textarea
              name="content"
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={"Write your article…\n\n## A heading\n\nA paragraph. Use **bold**, lists and > quotes."}
              className={`${field} resize-y font-mono text-[13px] leading-relaxed`}
            />
          )}
          {/* keep content in the form even while previewing */}
          {preview && <input type="hidden" name="content" value={content} />}
        </div>
      </div>

      {/* Sidebar column */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-line bg-charcoal/60 p-5">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm font-medium text-cream">Published</span>
            <input
              type="checkbox"
              name="published"
              defaultChecked={post?.published ?? false}
              className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-stone transition-colors checked:bg-gold relative before:absolute before:left-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-cream before:transition-transform checked:before:translate-x-4"
            />
          </label>
          <p className="mt-2 text-xs text-faint">
            Draft posts are hidden from the public site.
          </p>
        </div>

        <ImageUploader name="cover_image" label="Cover image" defaultValue={post?.cover_image} />

        <div>
          <label className="mb-2 block text-sm font-medium text-cream">Author</label>
          <input
            name="author"
            defaultValue={post?.author ?? "Oliviya Developers"}
            className={field}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-cream">Tags</label>
          <input
            name="tags"
            defaultValue={post?.tags?.join(", ")}
            placeholder="Design, Architecture, Kerala"
            className={field}
          />
          <p className="mt-1 text-xs text-faint">Comma separated.</p>
        </div>

        <div className="flex items-center gap-3">
          <SubmitButton>{post ? "Update post" : "Create post"}</SubmitButton>
          <Link
            href="/admin/blogs"
            className="rounded-full border border-line px-5 py-3.5 text-sm text-muted transition-colors hover:text-cream"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
