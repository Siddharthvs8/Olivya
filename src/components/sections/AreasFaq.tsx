"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Minus } from "lucide-react";
import { AREAS, FAQS } from "@/lib/site";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AreasFaq() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,75,0.06),_transparent_60%)]" />

      <div className="container-luxe relative">
        <SectionHeading
          eyebrow="Areas we serve"
          title="The best builders in Kochi, Ernakulam & across Kerala"
          intro="From the heart of Kochi to every district of Kerala, Oliviya Developers builds bespoke luxury homes — designed, engineered and finished with the same uncompromising craft."
          align="center"
        />

        {/* Location cards */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {AREAS.map((area, i) => (
            <motion.article
              key={area.city}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-line bg-charcoal/60 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/40"
            >
              {/* glow on hover */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors group-hover:bg-gold group-hover:text-ink">
                  <MapPin className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-serif text-3xl text-cream">
                  {`Builders in ${area.city}`}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{area.note}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {area.spots.map((spot) => (
                    <span
                      key={spot}
                      className="rounded-full border border-line px-3 py-1 text-[0.7rem] tracking-wide text-faint transition-colors group-hover:border-gold/30 group-hover:text-gold/80"
                    >
                      {spot}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-24 max-w-3xl">
          <div className="text-center">
            <span className="eyebrow justify-center">Frequently asked</span>
            <h3 className="mt-5 font-serif text-3xl text-cream sm:text-4xl">
              Questions, answered
            </h3>
          </div>

          <div className="mt-12 divide-y divide-line border-y border-line">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        aria-expanded={open}
      >
        <span className={`font-serif text-lg transition-colors sm:text-xl ${open ? "text-gold" : "text-cream group-hover:text-gold"}`}>
          {q}
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-gold transition-colors group-hover:border-gold/50">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 leading-relaxed text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
