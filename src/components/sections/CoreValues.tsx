import {
  ShieldCheck,
  GraduationCap,
  Gem,
  Users,
  Zap,
  HeartHandshake,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";

/* The six core values that shape life and work at Oliviya Developers. */
const VALUES = [
  {
    no: "01",
    icon: ShieldCheck,
    title: "Always Be Accountable",
    desc: "An accountable employee takes ownership of their responsibilities, actions and outcomes. We lead with integrity, reliability and transparency — meeting commitments and addressing challenges proactively to build trust and a culture of excellence.",
  },
  {
    no: "02",
    icon: GraduationCap,
    title: "Always Be Coachable",
    desc: "A coachable employee is open to feedback and constructive criticism, with a genuine willingness to learn and adapt. We nurture a growth mindset and the continuous pursuit of personal and professional development.",
  },
  {
    no: "03",
    icon: Gem,
    title: "Always Be Talented",
    desc: "A talented employee consistently applies skill, creativity and expertise to deliver high-quality results. We champion continuous skill enhancement, innovation and excellence in execution — every task performed with professionalism.",
  },
  {
    no: "04",
    icon: Users,
    title: "Always Be United",
    desc: "A united team shares a common vision and collaborates effectively toward shared goals. We value solidarity and teamwork, where every member supports each other and works together for the success of the organisation.",
  },
  {
    no: "05",
    icon: Zap,
    title: "Always Be Action-Oriented",
    desc: "Being action-oriented is about taking initiative and being proactive in identifying and solving problems. We transform ideas into tangible results, demonstrating decisiveness and a strong commitment to achieving our objectives.",
  },
  {
    no: "06",
    icon: HeartHandshake,
    title: "Always Be Loyal",
    desc: "A loyal employee demonstrates commitment, trust and dedication to the organisation's vision and values. We lead with honesty, respect and long-term responsibility — standing by our team and contributing wholeheartedly to shared success.",
  },
];

export default function CoreValues() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-ink py-24 sm:py-32">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,75,0.07),_transparent_55%)]" />

      <div className="container-luxe relative">
        <SectionHeading
          eyebrow="What we stand for"
          title="The core values of Oliviya Developers"
          intro="Six principles that guide how we work, build and grow together — the foundation behind every home we craft."
          align="center"
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {VALUES.map((value, i) => (
            <Reveal
              key={value.no}
              delay={(i % 3) * 0.1}
              className="group relative h-full overflow-hidden rounded-2xl border border-line bg-charcoal/40 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/40 hover:bg-charcoal"
            >
              {/* watermark number */}
              <span className="pointer-events-none absolute -right-2 -top-4 select-none font-serif text-8xl leading-none text-gold/5 transition-colors duration-500 group-hover:text-gold/10">
                {value.no}
              </span>
              {/* hover sheen */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-line text-gold transition-colors duration-500 group-hover:border-gold/50 group-hover:bg-gold/10">
                    <value.icon className="h-6 w-6" />
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.25em] text-faint">
                    {value.no}
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-2xl text-cream">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{value.desc}</p>
              </div>

              {/* gold underline grows on hover */}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gold-deep via-gold to-gold-soft transition-all duration-500 group-hover:w-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
