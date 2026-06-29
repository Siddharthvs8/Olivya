import Image from "next/image";
import { STATS } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";
import AnimatedText from "@/components/motion/AnimatedText";
import Counter from "@/components/motion/Counter";
import Button from "@/components/ui/Button";

export default function Welcome({ image }: { image: string }) {
  return (
    <section className="container-luxe py-24 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Text */}
        <div>
          <Reveal>
            <span className="eyebrow">Welcome to Oliviya Developers</span>
          </Reveal>
          <h2 className="mt-6 text-4xl leading-tight sm:text-5xl lg:text-[3.4rem]">
            <AnimatedText text="Your tailored luxury living starts here." />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-7 text-lg font-light italic text-gold-soft">
              Crafted Elegance. Impeccable Design. Lasting Value.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl leading-relaxed text-muted">
              Looking to build your dream home in Kerala? We specialise in
              bespoke luxury residences that perfectly blend modern comfort with
              timeless architecture — designed to reflect your lifestyle and
              made to last for generations.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9">
              <Button href="/about" variant="ghost">
                Discover Our Story
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Image */}
        <Reveal direction="left" className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line">
            <Parallax speed={-0.12} className="absolute inset-0 -top-[12%] h-[124%]">
              <Image
                src={image}
                alt="Interior of an Oliviya Developers luxury home"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </Parallax>
          </div>
          {/* Floating accent card */}
          <div className="absolute -bottom-8 -left-6 hidden rounded-2xl border border-gold/30 bg-ink/80 p-6 backdrop-blur sm:block">
            <p className="font-serif text-4xl text-gradient-gold">15+</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
              Years of craft
            </p>
          </div>
        </Reveal>
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
  );
}
