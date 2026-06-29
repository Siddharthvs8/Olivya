import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { COMPANY, NAV_LINKS } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";
import Logo from "@/components/ui/Logo";
import SocialLinks from "@/components/ui/SocialLinks";
import Button from "@/components/ui/Button";
import AnimatedText from "@/components/motion/AnimatedText";
import Reveal from "@/components/motion/Reveal";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-charcoal">
      {/* CTA band */}
      <div className="container-luxe border-b border-line py-20 sm:py-28">
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="eyebrow">Let&apos;s build together</span>
            <h2 className="mt-5 max-w-2xl text-4xl sm:text-5xl lg:text-6xl">
              <AnimatedText text="Let's bring your dream home to life." />
            </h2>
          </div>
          <Reveal direction="up" className="lg:justify-self-end">
            <Button href="/contact" variant="primary">
              Begin Your Journey
            </Button>
          </Reveal>
        </div>
      </div>

      {/* Columns */}
      <div className="container-luxe grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.3fr]">
        <div>
          <Logo logoUrl={settings.logo_url} />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
            {COMPANY.legalName} — crafting bespoke luxury residences across{" "}
            {COMPANY.region}. From concept to completion, built with
            craftsmanship and care.
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-gold">
            {COMPANY.tagline}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.28em] text-faint">
            Explore
          </h3>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-medium uppercase tracking-[0.28em] text-faint">
            Get in touch
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-muted">
            <li>
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="group inline-flex items-center gap-3 transition-colors hover:text-gold"
              >
                <Phone className="h-4 w-4 text-gold" />
                {settings.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${settings.email}`}
                className="group inline-flex items-center gap-3 transition-colors hover:text-gold"
              >
                <Mail className="h-4 w-4 text-gold" />
                {settings.email}
              </a>
            </li>
            <li className="inline-flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {settings.address}
            </li>
          </ul>
          <div className="mt-7">
            <SocialLinks socials={settings.socials} size="sm" />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="container-luxe flex flex-col items-center justify-between gap-3 py-6 text-xs text-faint sm:flex-row">
          <p>
            © {year} {COMPANY.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-gold">
              Privacy
            </Link>
            <Link href="/admin" className="transition-colors hover:text-gold">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
