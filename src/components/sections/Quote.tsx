"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { COMPANY } from "@/lib/site";

const WORDS =
  "A luxury home is not the most expensive one. It is the one that feels inevitable — crafted to reflect you, and made to last for generations.".split(
    " ",
  );

export default function Quote() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.25"],
  });

  return (
    <section className="border-y border-line bg-charcoal py-28 sm:py-40">
      <div ref={ref} className="container-luxe max-w-5xl text-center">
        <span className="font-serif text-7xl text-gold/30">“</span>
        <p className="-mt-6 flex flex-wrap justify-center gap-x-3 gap-y-1 font-serif text-3xl leading-snug sm:text-4xl lg:text-5xl">
          {WORDS.map((word, i) => {
            const start = i / WORDS.length;
            const end = start + 1 / WORDS.length;
            return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>;
          })}
        </p>
        <p className="mt-10 text-xs uppercase tracking-[0.3em] text-gold">
          {COMPANY.consultant}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}
