import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createVideo } from "@/app/admin/actions";
import VideoForm from "@/components/admin/VideoForm";

export default function NewVideoPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/videos"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to videos
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-cream">Add video</h1>
      <p className="mt-2 text-muted">Paste a YouTube link to feature it on your videos page.</p>

      <div className="mt-8">
        <VideoForm action={createVideo} />
      </div>
    </div>
  );
}
