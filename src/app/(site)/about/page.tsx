import type { Metadata } from "next";
import Image from "next/image";
import { getSettings } from "@/lib/data";
import { COMPANY, STATS, DEFAULT_SETTINGS } from "@/lib/site";
import PageHero from "@/components/sections/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import Counter from "@/components/motion/Counter";
import ValueProps from "@/components/sections/ValueProps";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Oliviya Developers Pvt Ltd crafts bespoke luxury residences across Kerala, led by Tom George — The Luxury Home Consultant.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getSettings();

  // Consultant content is admin-editable via Settings; fall back to the
  // defaults so the section never renders blank (e.g. on a freshly migrated DB).
  const consultant = {
    image: settings.consultant_image || DEFAULT_SETTINGS.consultant_image || "",
    name: settings.consultant_name || DEFAULT_SETTINGS.consultant_name,
    title: settings.consultant_title || DEFAULT_SETTINGS.consultant_title,
    bio: settings.consultant_bio || DEFAULT_SETTINGS.consultant_bio,
    ctaLabel: settings.consultant_cta_label || DEFAULT_SETTINGS.consultant_cta_label,
    ctaHref: settings.consultant_cta_href || DEFAULT_SETTINGS.consultant_cta_href,
  };

  return (
    <>
      <PageHero
        eyebrow="About Oliviya"
        title="Crafting homes, not just houses."
        intro="We are a team of architects, craftsmen and dreamers building Kerala's most considered luxury residences — from concept to completion."
        image={settings.cta_image ?? undefined}
      />

      {/* Story */}
      <section className="container-luxe py-24 sm:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal direction="right" className="order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line">
              <Parallax speed={-0.12} className="absolute inset-0 -top-[12%] h-[124%]">
                <Image
                  src={settings.about_image ?? ""}
                  alt="An Oliviya Developers home under craftsmanship"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </Parallax>
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="Our story"
              title="Built on craft, defined by trust"
            />
            <div className="mt-7 space-y-5 leading-relaxed text-muted">
              <Reveal delay={0.1}>
                <p>
                  {COMPANY.legalName} was founded on a simple belief: a home
                  should be as unique as the family who lives in it. For over a
                  decade we have specialised in bespoke luxury residences that
                  blend modern comfort with timeless architecture.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p>
                  Every project begins with listening — to your vision, your
                  land and the way you want to live. From there, our architects,
                  interior designers and master craftsmen work as one to bring
                  it to life with uncompromising care.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="font-light italic text-gold-soft">
                  Crafted elegance. Impeccable design. Lasting value.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-y-10 border-t border-line pt-12 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className="text-center lg:text-left">
              <p className="font-serif text-5xl text-cream sm:text-6xl">
                <Counter value={stat.value} />
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Consultant */}
      <section className="border-y border-line bg-charcoal py-24 sm:py-32">
        <div className="container-luxe grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <Reveal>
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-line">
              <Image
                src={consultant.image}
                alt={`${consultant.name}, ${consultant.title}`}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div>
            <span className="eyebrow">Meet your consultant</span>
            <h2 className="mt-6 text-4xl sm:text-5xl">{consultant.name}</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-gold">
              {consultant.title}
            </p>
            <p className="mt-7 max-w-xl whitespace-pre-line leading-relaxed text-muted">
              {consultant.bio}
            </p>
            <div className="mt-9">
              <Button href={consultant.ctaHref}>{consultant.ctaLabel}</Button>
            </div>
          </div>
        </div>
      </section>

      <ValueProps />
    </>
  );
}
