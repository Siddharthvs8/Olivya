"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Youtube } from "lucide-react";
import type { Video } from "@/lib/types";
import { youtubeId } from "@/lib/utils";
import SubmitButton from "./SubmitButton";

const field =
  "w-full rounded-xl border border-line bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-faint outline-none transition-colors focus:border-gold";
const labelCls = "mb-2 block text-sm font-medium text-cream";

export default function VideoForm({
  action,
  video,
}: {
  action: (formData: FormData) => void | Promise<void>;
  video?: Video;
}) {
  const [url, setUrl] = useState(
    video ? `https://www.youtube.com/watch?v=${video.youtube_id}` : "",
  );
  const id = youtubeId(url);

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      {/* Main column */}
      <div className="space-y-5">
        <div>
          <label className={labelCls}>Video title</label>
          <input
            name="title"
            required
            defaultValue={video?.title}
            placeholder="Inside The Courtyard Villa — Full Walkthrough"
            className={`${field} font-serif text-lg`}
          />
        </div>

        <div>
          <label className={labelCls}>YouTube link or video ID</label>
          <input
            name="youtube_url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className={field}
          />
          <p className="mt-1 text-xs text-faint">
            Paste any YouTube link (watch, youtu.be, Shorts) — we&apos;ll detect the video.
          </p>
        </div>

        <div>
          <label className={labelCls}>Category</label>
          <input
            name="category"
            defaultValue={video?.category}
            placeholder="Walkthrough · Testimonial · Behind the Build"
            className={field}
          />
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={video?.description}
            placeholder="A short description shown beneath the video."
            className={`${field} resize-y`}
          />
        </div>
      </div>

      {/* Sidebar column */}
      <div className="space-y-6">
        {/* live preview */}
        <div className="overflow-hidden rounded-2xl border border-line bg-charcoal/60">
          <div className="relative aspect-video bg-ink">
            {id ? (
              <Image
                src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                alt="Video thumbnail"
                fill
                sizes="320px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center text-faint">
                <Youtube className="h-8 w-8" />
              </div>
            )}
          </div>
          <p className="px-4 py-3 text-xs text-faint">
            {id ? `Preview · ${id}` : "Paste a link to preview the thumbnail"}
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-line bg-charcoal/60 p-5">
          <Toggle name="published" label="Published" defaultChecked={video?.published ?? true} hint="Hidden from the site when off." />
          <Toggle name="featured" label="Featured" defaultChecked={video?.featured ?? false} hint="Shown large at the top of the videos page." />
        </div>

        <div className="flex items-center gap-3">
          <SubmitButton>{video ? "Update video" : "Add video"}</SubmitButton>
          <Link
            href="/admin/videos"
            className="rounded-full border border-line px-5 py-3.5 text-sm text-muted transition-colors hover:text-cream"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
  hint,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
  hint: string;
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-center justify-between">
        <span className="text-sm font-medium text-cream">{label}</span>
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="relative h-5 w-9 cursor-pointer appearance-none rounded-full bg-stone transition-colors before:absolute before:left-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-cream before:transition-transform checked:bg-gold checked:before:translate-x-4"
        />
      </label>
      <p className="mt-1 text-xs text-faint">{hint}</p>
    </div>
  );
}
