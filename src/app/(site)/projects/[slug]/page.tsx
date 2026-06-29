import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Layers, CalendarDays, Ruler } from "lucide-react";
import {
  getProjectBySlug,
  getAllProjectSlugs,
  getPublishedProjects,
} from "@/lib/data";
import { COMPANY } from "@/lib/site";
import ProjectCard from "@/components/ui/ProjectCard";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  const title = `${project.title} — ${project.category} in ${project.location}`;
  const description = `${project.blurb} A bespoke ${project.category.toLowerCase()} in ${project.location}, designed and built by Oliviya Developers — among the best luxury home builders in Kochi, Ernakulam & Kerala.`;

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${COMPANY.url}/projects/${project.slug}`,
      images: project.image ? [{ url: project.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = (await getPublishedProjects())
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  const specs = [
    { icon: MapPin, label: "Location", value: project.location },
    { icon: Layers, label: "Typology", value: project.category },
    { icon: CalendarDays, label: "Completed", value: project.year },
    { icon: Ruler, label: "Built-up area", value: project.area },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.blurb,
    image: project.image ? [project.image] : undefined,
    dateCreated: project.year,
    locationCreated: { "@type": "Place", name: project.location },
    creator: { "@type": "Organization", name: COMPANY.legalName, url: COMPANY.url },
    about: project.category,
    url: `${COMPANY.url}/projects/${project.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Cinematic hero */}
      <header className="relative flex min-h-[78vh] items-end overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-graphite via-charcoal to-ink" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 to-transparent" />

        <div className="container-luxe relative z-10 pb-16 pt-40 sm:pb-20">
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" /> Back to projects
            </Link>
          </Reveal>
          <Reveal delay={0.05}>
            <span className="mt-6 inline-block rounded-full border border-gold/40 bg-ink/40 px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.25em] text-gold backdrop-blur">
              {project.category}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[1.02] text-cream sm:text-6xl lg:text-7xl">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 inline-flex items-center gap-2 text-lg text-muted">
              <MapPin className="h-4 w-4 text-gold" /> {project.location}
            </p>
          </Reveal>
        </div>
      </header>

      {/* Spec sheet */}
      <section className="border-y border-line bg-charcoal">
        <div className="container-luxe grid grid-cols-2 divide-x divide-line lg:grid-cols-4">
          {specs.map(({ icon: Icon, label, value }) => (
            <div key={label} className="px-2 py-10 text-center sm:px-6">
              <Icon className="mx-auto h-5 w-5 text-gold" />
              <p className="mt-4 text-[0.65rem] uppercase tracking-[0.25em] text-faint">
                {label}
              </p>
              <p className="mt-2 font-serif text-xl text-cream sm:text-2xl">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="container-luxe max-w-4xl py-24 sm:py-32">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">The vision</p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-6 font-serif text-3xl leading-snug text-cream sm:text-4xl">
            {project.blurb}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 leading-relaxed text-muted">
            Set in {project.location}, {project.title} is a {project.area} bespoke{" "}
            {project.category.toLowerCase()} delivered end-to-end by Oliviya Developers —
            from architecture and interiors to landscaping and turnkey handover. Every
            material, line and detail was chosen to feel inevitable, and built to last for
            generations.
          </p>
        </Reveal>

        {project.image && (
          <Reveal delay={0.15} className="mt-14">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line">
              <Image
                src={project.image}
                alt={`${project.title} — ${project.category} in ${project.location}`}
                fill
                sizes="(max-width: 1024px) 100vw, 56rem"
                className="object-cover"
              />
            </div>
          </Reveal>
        )}

        <Reveal delay={0.1} className="mt-16 flex flex-wrap items-center gap-4">
          <Button href="/contact">Start a project like this</Button>
          <Button href="/projects" variant="ghost" arrow={false}>
            View all projects
          </Button>
        </Reveal>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-line bg-charcoal py-20 sm:py-28">
          <div className="container-luxe">
            <h2 className="mb-12 font-serif text-3xl text-cream sm:text-4xl">
              More of our work
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
