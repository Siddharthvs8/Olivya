import { getSettings } from "@/lib/data";
import { COMPANY, FAQS } from "@/lib/site";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": `${COMPANY.url}/#organization`,
    name: COMPANY.legalName,
    alternateName: COMPANY.name,
    description:
      "Among the best luxury home builders in Kochi, Ernakulam and across Kerala — bespoke villas and custom homes, designed and built end-to-end.",
    url: COMPANY.url,
    telephone: settings.phone,
    email: settings.email,
    slogan: COMPANY.tagline,
    priceRange: "₹₹₹",
    knowsAbout: [
      "Luxury home construction",
      "Villa construction",
      "Architectural design",
      "Interior design",
      "Home renovation",
    ],
    areaServed: [
      { "@type": "City", name: "Kochi" },
      { "@type": "City", name: "Ernakulam" },
      { "@type": "City", name: "Thrissur" },
      { "@type": "City", name: "Kottayam" },
      { "@type": "State", name: "Kerala" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Ernakulam",
      addressRegion: "Kerala",
      addressCountry: "IN",
    },
    sameAs: Object.entries(settings.socials)
      .filter(([key, value]) => value && key !== "whatsapp")
      .map(([, value]) => value),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar logoUrl={settings.logo_url} />
      <main>{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp number={settings.socials.whatsapp} company={COMPANY.name} />
    </>
  );
}
