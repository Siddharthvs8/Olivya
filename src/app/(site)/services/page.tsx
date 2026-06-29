import type { Metadata } from "next";
import { getSettings } from "@/lib/data";
import { SERVICES } from "@/lib/site";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/motion/Reveal";
import Process from "@/components/sections/Process";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Architecture, luxury construction, interior design, renovation, landscaping and project consultancy — a complete luxury home experience under one roof.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Everything your dream home needs."
        intro="One team, one standard — from the first concept sketch to the moment you turn the key."
        image={settings.hero_image ?? undefined}
      />

      <section className="container-luxe py-24 sm:py-32">
        <div className="divide-y divide-line border-y border-line">
          {SERVICES.map((service, i) => (
            <Reveal
              key={service.no}
              delay={(i % 2) * 0.06}
              className="group grid gap-6 py-10 transition-colors duration-500 hover:bg-charcoal/50 md:grid-cols-[auto_1fr_1.2fr] md:items-start md:gap-12 md:px-6"
            >
              <span className="font-serif text-5xl text-stone transition-colors duration-500 group-hover:text-gold sm:text-6xl">
                {service.no}
              </span>
              <h2 className="font-serif text-3xl text-cream sm:text-4xl">
                {service.title}
              </h2>
              <div>
                <p className="leading-relaxed text-muted">{service.desc}</p>
                <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                  {service.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-2 text-sm text-faint"
                    >
                      <span className="h-1 w-1 rounded-full bg-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Process />

      {/* CTA */}
      <section className="container-luxe pb-28">
        <Reveal className="overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-charcoal to-graphite p-12 text-center sm:p-20">
          <h2 className="mx-auto max-w-3xl text-4xl sm:text-5xl">
            Have a project in mind?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted">
            Let&apos;s talk about your land, your lifestyle and the home you&apos;ve
            always pictured.
          </p>
          <div className="mt-9 flex justify-center">
            <Button href="/contact">Start Your Project</Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
