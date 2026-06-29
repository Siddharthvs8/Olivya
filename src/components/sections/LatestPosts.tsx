import { getPublishedPosts } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import PostCard from "@/components/ui/PostCard";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";

export default async function LatestPosts() {
  const posts = (await getPublishedPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="container-luxe py-24 sm:py-32">
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading
          eyebrow="Journal"
          title="Insights & inspiration"
          intro="Notes on design, craftsmanship and the art of building a home worth passing on."
        />
        <Reveal>
          <Button href="/blog" variant="ghost">
            Read the Journal
          </Button>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </div>
    </section>
  );
}
