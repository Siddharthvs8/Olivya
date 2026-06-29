import { Sparkles, Hammer, Target, Award } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";

const VALUES = [
  {
    icon: Sparkles,
    title: "From concept to completion",
    desc: "A single, seamless team guiding every stage — no gaps, no compromises.",
  },
  {
    icon: Hammer,
    title: "Built with craftsmanship & care",
    desc: "Master craftsmen and premium materials, with quality audited at every step.",
  },
  {
    icon: Target,
    title: "Designed to reflect your lifestyle",
    desc: "Architecture and interiors shaped entirely around the way you live.",
  },
  {
    icon: Award,
    title: "Made to last for generations",
    desc: "Homes that are uniquely yours — and built to stand the test of time.",
  },
];

export default function ValueProps() {
  return (
    <section className="container-luxe py-24 sm:py-32">
      <SectionHeading
        eyebrow="Why Oliviya"
        title="A home that's uniquely yours"
        intro="Four promises that shape everything we build."
        align="center"
      />

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value, i) => (
          <Reveal
            key={value.title}
            delay={i * 0.1}
            className="group rounded-2xl border border-line p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:bg-charcoal"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-line text-gold transition-colors duration-500 group-hover:border-gold/50 group-hover:bg-gold/10">
              <value.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-6 font-serif text-xl text-cream">{value.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {value.desc}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
