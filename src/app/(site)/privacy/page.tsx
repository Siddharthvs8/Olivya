import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import { COMPANY } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${COMPANY.legalName} collects and uses your information.`,
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="container-luxe max-w-3xl space-y-6 py-20 leading-relaxed text-muted">
        <p>
          {COMPANY.legalName} (&quot;we&quot;, &quot;us&quot;) respects your
          privacy. This policy explains what information we collect and how we
          use it.
        </p>
        <h2 className="font-serif text-2xl text-cream">Information we collect</h2>
        <p>
          When you contact us through our website we collect the details you
          provide — such as your name, email, phone number and message — solely
          to respond to your enquiry.
        </p>
        <h2 className="font-serif text-2xl text-cream">How we use it</h2>
        <p>
          We use your information only to communicate with you about your
          project. We never sell your data to third parties.
        </p>
        <h2 className="font-serif text-2xl text-cream">Contact</h2>
        <p>
          For any privacy questions, write to us and we&apos;ll be happy to
          help.
        </p>
      </section>
    </>
  );
}
