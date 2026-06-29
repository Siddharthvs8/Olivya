import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Star, Youtube } from "lucide-react";
import { getAllVideos } from "@/lib/store";
import DeleteVideoButton from "@/components/admin/DeleteVideoButton";

export const dynamic = "force-dynamic";

export default async function AdminVideoList() {
  const videos = await getAllVideos();

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-cream">YouTube</h1>
          <p className="mt-2 text-muted">
            {videos.length} video{videos.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/videos/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-gold-soft"
        >
          <Plus className="h-4 w-4" /> Add video
        </Link>
      </header>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {videos.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted">No videos yet.</p>
            <Link href="/admin/videos/new" className="mt-3 inline-block text-sm text-gold hover:underline">
              Add your first video →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {videos.map((video) => (
              <li key={video.id} className="flex items-center gap-4 p-4 sm:p-5">
                <div className="relative hidden h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-charcoal sm:block">
                  {video.youtube_id ? (
                    <Image
                      src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="112px"
                      unoptimized
                    />
                  ) : (
                    <Youtube className="absolute inset-0 m-auto h-5 w-5 text-faint" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wide ${
                        video.published ? "bg-gold/15 text-gold" : "bg-stone text-muted"
                      }`}
                    >
                      {video.published ? "Published" : "Draft"}
                    </span>
                    {video.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-gold">
                        <Star className="h-3 w-3" /> Featured
                      </span>
                    )}
                    {video.category && <span className="text-xs text-faint">{video.category}</span>}
                  </div>
                  <p className="mt-1 truncate font-serif text-lg text-cream">{video.title}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/videos/${video.id}`}
                    aria-label="Edit video"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <DeleteVideoButton id={video.id} title={video.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
