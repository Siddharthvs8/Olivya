import type { Metadata } from "next";
import { MapPin, Briefcase, Building2, ArrowUpRight } from "lucide-react";
import { getPublishedJobs, getSettings } from "@/lib/data";
import { COMPANY } from "@/lib/site";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers — Join Oliviya Developers in Kochi & Kerala",
  description:
    "Build a career with Oliviya Developers — one of the best luxury home builders in Kochi, Ernakulam and Kerala. Explore openings in design, construction and operations.",
  alternates: { canonical: "/careers" },
};

export default async function CareersPage() {
  const [jobs, settings] = await Promise.all([getPublishedJobs(), getSettings()]);

  const jsonLd = jobs.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.created_at,
    employmentType: job.type,
    hiringOrganization: {
      "@type": "Organization",
      name: COMPANY.legalName,
      sameAs: COMPANY.url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location || "Kochi",
        addressRegion: "Kerala",
        addressCountry: "IN",
      },
    },
  }));

  return (
    <>
      {jsonLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <PageHero
        eyebrow="Careers"
        title="Build something that lasts."
        intro="We're a team of architects, engineers and craftspeople shaping Kerala's finest homes. If you care about detail the way we do, we'd love to meet you."
      />

      <section className="container-luxe py-20 sm:py-28">
        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-line bg-charcoal/40 p-12 text-center">
            <p className="font-serif text-2xl text-cream">No openings right now</p>
            <p className="mx-auto mt-3 max-w-md text-muted">
              We&apos;re always glad to meet talented people. Send your portfolio and we&apos;ll
              be in touch when something opens up.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href={`mailto:${settings.email}`}>Introduce yourself</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {jobs.map((job, i) => (
              <Reveal key={job.id} delay={(i % 4) * 0.06}>
                <article className="group rounded-2xl border border-line bg-charcoal/40 p-6 transition-colors hover:border-gold/40 sm:p-8">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-faint">
                        {job.department && (
                          <span className="inline-flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-gold" /> {job.department}
                          </span>
                        )}
                        {job.type && (
                          <span className="inline-flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 text-gold" /> {job.type}
                          </span>
                        )}
                        {job.location && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-gold" /> {job.location}
                          </span>
                        )}
                      </div>
                      <h2 className="mt-3 font-serif text-2xl text-cream sm:text-3xl">{job.title}</h2>
                      <p className="mt-3 max-w-2xl leading-relaxed text-muted">{job.description}</p>
                    </div>

                    <div className="shrink-0">
                      <a
                        href={`mailto:${job.apply_email || settings.email}?subject=${encodeURIComponent(
                          `Application: ${job.title}`,
                        )}`}
                        className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-gold-soft"
                      >
                        Apply now
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
