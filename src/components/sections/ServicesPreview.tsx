import { SERVICES } from "@/lib/site";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import Button from "@/components/ui/Button";

export default function ServicesPreview() {
  return (
    <section className="relative border-y border-line bg-charcoal py-24 sm:py-32">
      <div className="container-luxe">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="What we do"
            title="Services crafted around you"
            intro="From the first sketch to the final finish, we deliver a complete, considered experience under one roof."
          />
          <Reveal>
            <Button href="/services" variant="ghost">
              All Services
            </Button>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal
              key={service.no}
              delay={(i % 3) * 0.08}
              className="group relative bg-charcoal p-8 transition-colors duration-500 hover:bg-graphite"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-5xl text-stone transition-colors duration-500 group-hover:text-gold/40">
                  {service.no}
                </span>
              </div>
              <h3 className="mt-6 font-serif text-2xl text-cream">
                {service.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {service.desc}
              </p>
              <ul className="mt-5 space-y-1.5">
                {service.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2 text-xs text-faint"
                  >
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    {p}
                  </li>
                ))}
              </ul>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
