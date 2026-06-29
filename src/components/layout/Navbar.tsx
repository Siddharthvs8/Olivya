"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";

export default function Navbar({ logoUrl }: { logoUrl?: string | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    window.dispatchEvent(new Event(open ? "lenis:stop" : "lenis:start"));
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-line/70 bg-ink/80 py-3 backdrop-blur-xl"
            : "border-b border-transparent py-5",
        )}
      >
        <nav className="container-luxe flex items-center justify-between">
          <Logo logoUrl={logoUrl} />

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm tracking-wide transition-colors",
                      active ? "text-gold" : "text-muted hover:text-cream",
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-gold"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden lg:block">
            <Button href="/contact" className="px-6 py-3 text-xs">
              Start Your Project
            </Button>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-cream lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col bg-ink/98 px-6 pb-10 pt-28 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    className="block border-b border-line/60 py-4 font-serif text-3xl text-cream"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-auto"
            >
              <Button href="/contact" className="w-full justify-center">
                Start Your Project
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
