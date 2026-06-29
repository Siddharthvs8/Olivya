import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPostById } from "@/lib/store";
import { updatePost } from "@/app/admin/actions";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();
  const action = updatePost.bind(null, id);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/blogs"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to posts
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-cream">Edit post</h1>
      <p className="mt-2 truncate text-muted">{post.title}</p>

      <div className="mt-8">
        <PostForm action={action} post={post} />
      </div>
    </div>
  );
}
