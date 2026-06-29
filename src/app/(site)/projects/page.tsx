import type { Metadata } from "next";
import { getSettings, getPublishedProjects } from "@/lib/data";
import PageHero from "@/components/sections/PageHero";
import ProjectCard from "@/components/ui/ProjectCard";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects — Luxury Homes in Kochi, Ernakulam & Kerala",
  description:
    "Explore luxury homes and villas built by Oliviya Developers — the best builders in Kochi, Ernakulam and across Kerala. Bespoke villas, waterfront homes, restorations and modern estates.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const [settings, projects] = await Promise.all([
    getSettings(),
    getPublishedProjects(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="A portfolio crafted to last."
        intro="Every home is a one-of-a-kind collaboration. Here is a selection of the residences we've brought to life across Kerala."
        image={settings.cta_image ?? undefined}
      />

      <section className="container-luxe py-24 sm:py-32">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>

        <Reveal className="mt-20 text-center">
          <p className="mx-auto max-w-xl font-serif text-2xl text-cream sm:text-3xl">
            Your home could be the next story we tell.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/contact">Begin Your Project</Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
