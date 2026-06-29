import { getFeaturedProjects } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCard from "@/components/ui/ProjectCard";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";

export default async function FeaturedProjects() {
  const featured = await getFeaturedProjects(3);
  return (
    <section className="border-y border-line bg-charcoal py-24 sm:py-32">
      <div className="container-luxe">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Selected work"
            title="Homes that tell a story"
            intro="A glimpse into residences we've crafted across Kerala — each one uniquely its own."
          />
          <Reveal>
            <Button href="/projects" variant="ghost">
              View All Projects
            </Button>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
