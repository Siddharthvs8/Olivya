import { PROCESS } from "@/lib/site";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";

export default function Process() {
  return (
    <section className="container-luxe py-24 sm:py-32">
      <SectionHeading
        eyebrow="Our process"
        title="From concept to completion"
        intro="A clear, collaborative journey — so building your home feels as rewarding as living in it."
        align="center"
      />

      <div className="relative mt-20">
        {/* connecting line */}
        <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-line to-transparent lg:block" />
        <div className="grid gap-12 lg:grid-cols-4">
          {PROCESS.map((item, i) => (
            <Reveal key={item.step} delay={i * 0.12} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-line bg-ink font-serif text-xl text-gold">
                {item.step}
              </div>
              <h3 className="mt-6 font-serif text-2xl text-cream">{item.title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted">
                {item.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
