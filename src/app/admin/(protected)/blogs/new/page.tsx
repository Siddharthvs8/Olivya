import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createPost } from "@/app/admin/actions";
import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/blogs"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to posts
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-cream">New post</h1>
      <p className="mt-2 text-muted">Write and publish a new article.</p>

      <div className="mt-8">
        <PostForm action={createPost} />
      </div>
    </div>
  );
}
