import AnimatedText from "@/components/motion/AnimatedText";
import Reveal from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className={cn("eyebrow", align === "center" && "justify-center")}>
            {eyebrow}
          </span>
        </Reveal>
      )}
      <h2
        className={cn(
          "mt-5 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl",
          light ? "text-ink" : "text-cream",
        )}
      >
        <AnimatedText text={title} />
      </h2>
      {intro && (
        <Reveal delay={0.15}>
          <p
            className={cn(
              "mt-6 text-base leading-relaxed sm:text-lg",
              light ? "text-ink/70" : "text-muted",
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
