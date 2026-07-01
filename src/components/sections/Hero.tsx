"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { COMPANY } from "@/lib/site";
import Button from "@/components/ui/Button";

export default function Hero({ image }: { image: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };
  const line = {
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
  };
  const fade = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      ref={ref}
      className="relative flex min-h-[max(100svh,640px)] items-end overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={image}
          alt="A luxury Oliviya Developers residence in Kerala"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 to-transparent" />
      </motion.div>

      {/* Side label */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-90 text-[0.65rem] uppercase tracking-[0.4em] text-muted lg:block"
      >
        {COMPANY.region}
      </motion.span>

      <motion.div
        style={{ opacity }}
        variants={container}
        initial="hidden"
        animate="show"
        className="container-luxe relative z-10 pt-28 pb-20 sm:pt-32 sm:pb-28"
      >
        <div className="overflow-hidden">
          <motion.span
            variants={fade}
            className="eyebrow"
          >
            {COMPANY.legalName}
          </motion.span>
        </div>

        <h1 className="mt-6 max-w-5xl text-5xl font-light leading-[0.98] sm:text-7xl lg:text-[5.5rem]">
          <span className="block overflow-hidden">
            <motion.span variants={line} className="block">
              Crafting Luxury
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span variants={line} className="block text-gradient-gold italic">
              Dreams
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span variants={line} className="block">
              Into Reality
            </motion.span>
          </span>
        </h1>

        <motion.div
          variants={fade}
          className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-[0.3em] text-cream/85 sm:text-sm"
        >
          {["Design", "Build", "Decor", "Care"].map((word, i, arr) => (
            <Fragment key={word}>
              <span>{word}</span>
              {i < arr.length - 1 && <span className="text-gold">|</span>}
            </Fragment>
          ))}
        </motion.div>

        <motion.p
          variants={fade}
          className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          Bespoke luxury residences across Kerala — where modern comfort meets
          timeless architecture. From concept to completion, built with
          craftsmanship and care.
        </motion.p>

        <motion.div variants={fade} className="mt-10 flex flex-wrap gap-4">
          <Button href="/contact">Start Your Project</Button>
          <Button href="/projects" variant="ghost">
            Explore Our Work
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-faint"
        >
          <span className="text-[0.6rem] uppercase tracking-[0.3em]">Scroll</span>
          <ArrowDown className="h-4 w-4 text-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
