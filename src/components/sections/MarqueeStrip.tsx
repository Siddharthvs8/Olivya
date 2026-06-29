import Marquee from "@/components/motion/Marquee";

const ITEMS = [
  "Bespoke Architecture",
  "Luxury Interiors",
  "Turnkey Construction",
  "Timeless Design",
  "Crafted for Generations",
];

export default function MarqueeStrip() {
  return (
    <div className="border-y border-line bg-charcoal py-6">
      <Marquee speed={28}>
        {ITEMS.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="px-8 font-serif text-2xl text-cream/80 sm:text-3xl">
              {item}
            </span>
            <span className="text-2xl text-gold">✦</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
