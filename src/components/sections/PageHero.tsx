import Image from "next/image";
import AnimatedText from "@/components/motion/AnimatedText";
import Reveal from "@/components/motion/Reveal";

export default function PageHero({
  eyebrow,
  title,
  intro,
  image,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  image?: string;
}) {
  return (
    <section className="relative flex min-h-[60vh] items-end overflow-hidden pb-16 pt-40">
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/50" />
        </div>
      )}
      <div className="container-luxe relative z-10">
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <h1 className="mt-6 max-w-4xl text-5xl leading-[1] sm:text-7xl lg:text-[5rem]">
          <AnimatedText text={title} />
        </h1>
        {intro && (
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
              {intro}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
