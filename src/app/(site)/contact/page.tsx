import type { Metadata } from "next";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { getSettings } from "@/lib/data";
import { COMPANY } from "@/lib/site";
import PageHero from "@/components/sections/PageHero";
import Reveal from "@/components/motion/Reveal";
import SocialLinks from "@/components/ui/SocialLinks";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Begin your journey to luxurious living. Contact Oliviya Developers Pvt Ltd in Ernakulam, Kerala to build your bespoke dream home.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();

  const details = [
    { icon: Phone, label: "Call us", value: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: "Visit", value: settings.address, href: undefined },
  ];

  const place = settings.address || "Ernakulam, Kerala, India";
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
  // Admin-set Google Maps link (Settings → Contact) — falls back to the address.
  const mapUrl =
    settings.socials.map_url?.trim() ||
    `https://www.google.com/maps?q=${encodeURIComponent(place)}`;

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Let's begin your journey."
        intro="Message us today to start crafting your luxury dream home. We'd love to hear about your vision."
      />

      <section className="container-luxe py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Info */}
          <div>
            <Reveal>
              <h2 className="text-3xl sm:text-4xl">Talk to a luxury home consultant</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md leading-relaxed text-muted">
                Whether you have a plot ready or just a dream, our team will
                guide you from the very first conversation to the day you move
                in.
              </p>
            </Reveal>

            <div className="mt-10 space-y-5">
              {details.map((d, i) => (
                <Reveal key={d.label} delay={0.1 + i * 0.08}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line text-gold">
                      <d.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-faint">
                        {d.label}
                      </p>
                      {d.href ? (
                        <a
                          href={d.href}
                          className="mt-1 block text-lg text-cream transition-colors hover:text-gold"
                        >
                          {d.value}
                        </a>
                      ) : (
                        <p className="mt-1 text-lg text-cream">{d.value}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <p className="mt-10 text-xs uppercase tracking-[0.2em] text-faint">
                Follow our work
              </p>
              <div className="mt-4">
                <SocialLinks socials={settings.socials} />
              </div>
            </Reveal>

            <Reveal delay={0.35}>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${COMPANY.name} location in Google Maps`}
                className="group relative mt-10 block overflow-hidden rounded-2xl border border-line transition-colors hover:border-gold/40"
              >
                <iframe
                  title={`${COMPANY.name} location`}
                  src={mapEmbed}
                  width="100%"
                  height="260"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="pointer-events-none grayscale invert-[0.92] contrast-[0.9] transition-all duration-500 group-hover:grayscale-0 group-hover:invert-0"
                />
                <span className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-line bg-ink/80 px-4 py-2 text-xs font-medium text-cream backdrop-blur transition-colors group-hover:border-gold group-hover:text-gold">
                  <MapPin className="h-4 w-4 text-gold" /> Open in Google Maps
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal direction="left">
            <div className="rounded-3xl border border-line bg-charcoal/60 p-6 sm:p-10">
              <h3 className="font-serif text-2xl text-cream">Send us a message</h3>
              <p className="mt-2 text-sm text-muted">
                Fill in the form and we&apos;ll be in touch within one business
                day.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
