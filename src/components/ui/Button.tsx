"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/motion/Magnetic";

type Variant = "primary" | "ghost" | "light";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 overflow-hidden";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-ink hover:bg-gold-soft",
  ghost:
    "border border-line text-cream hover:border-gold hover:text-gold",
  light:
    "bg-cream text-ink hover:bg-white",
};

export default function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className,
  arrow = true,
  magnetic = true,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  className?: string;
  arrow?: boolean;
  magnetic?: boolean;
}) {
  const inner = (
    <span className="relative z-10 inline-flex items-center gap-2">
      {children}
      {arrow && (
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </span>
  );

  const classes = cn(base, variants[variant], className);

  const content = href ? (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  ) : (
    <button type={type} onClick={onClick} className={classes}>
      {inner}
    </button>
  );

  return magnetic ? <Magnetic strength={0.3}>{content}</Magnetic> : content;
}
