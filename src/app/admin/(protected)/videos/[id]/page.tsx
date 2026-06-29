import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getVideoById } from "@/lib/store";
import { updateVideo } from "@/app/admin/actions";
import VideoForm from "@/components/admin/VideoForm";

export const dynamic = "force-dynamic";

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = await getVideoById(id);
  if (!video) notFound();
  const action = updateVideo.bind(null, id);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/videos"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to videos
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-cream">Edit video</h1>
      <p className="mt-2 truncate text-muted">{video.title}</p>

      <div className="mt-8">
        <VideoForm action={action} video={video} />
      </div>
    </div>
  );
}
