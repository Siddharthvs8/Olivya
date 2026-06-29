import type { SiteSettings } from "./types";

export const COMPANY = {
  name: "Oliviya Developers",
  legalName: "Oliviya Developers Pvt Ltd",
  tagline: "Crafting Luxury Dreams Into Reality",
  shortPitch:
    "Bespoke luxury residences across Kerala — where modern comfort meets timeless architecture.",
  consultant: "Tom George — The Luxury Home Consultant",
  region: "Kerala, India",
  // Used for SEO canonical + sitemap. Override with NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://oliviyadevelopers.com",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Videos", href: "/youtube" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Default site settings. These render everywhere until an admin overrides
 * them in Supabase (logo, images, contact details, social links).
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  logo_url: null,
  hero_image:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=80",
  about_image:
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
  cta_image:
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=80",
  phone: "+91 00000 00000",
  email: "hello@oliviyadevelopers.com",
  address: "Ernakulam, Kerala, India",
  socials: {
    website: "https://oliviyadevelopers.com/",
    facebook: "https://www.facebook.com/share/19W7VPZ4qc/",
    instagram:
      "https://www.instagram.com/oliviyadevelopers?utm_source=qr&igsh=MWdvZ2g1aTlzcG5odw==",
    youtube: "https://www.youtube.com/watch?v=67rbIgc50w8",
    pinterest: "https://in.pinterest.com/oliviyadevlopers/",
    kolo: "https://koloapp.in/kerala/contractors/oliviya-developerspvtltd--ernakulam",
    linkedin:
      "https://www.linkedin.com/in/tom-george-the-luxury-home-consultant-69b0171b2/?originalSubdomain=in",
    twitter: "https://x.com/oliviyabuilders",
  },
};

export const SERVICES = [
  {
    no: "01",
    title: "Architectural Design",
    desc: "Bespoke architecture tailored to your land, lifestyle and aspirations — drawn to last for generations.",
    points: ["Concept & masterplanning", "3D visualisation", "Vaastu-aware layouts"],
  },
  {
    no: "02",
    title: "Luxury Home Construction",
    desc: "End-to-end construction with premium materials, master craftsmen and uncompromising quality control.",
    points: ["Turnkey delivery", "Premium materials", "On-site quality audits"],
  },
  {
    no: "03",
    title: "Interior Design",
    desc: "Curated interiors that balance warmth and grandeur — every finish considered, every detail intentional.",
    points: ["Bespoke joinery", "Lighting design", "Furnishing & styling"],
  },
  {
    no: "04",
    title: "Renovation & Restoration",
    desc: "Breathe new life into existing homes with sensitive, structurally-sound transformations.",
    points: ["Structural upgrades", "Modern retrofits", "Heritage care"],
  },
  {
    no: "05",
    title: "Landscape & Exteriors",
    desc: "Gardens, courtyards and facades designed as a seamless extension of the living space.",
    points: ["Landscape architecture", "Facade detailing", "Outdoor living"],
  },
  {
    no: "06",
    title: "Project Consultancy",
    desc: "Expert guidance from feasibility to handover, led by The Luxury Home Consultant.",
    points: ["Feasibility & budgeting", "Approvals & liaison", "Site supervision"],
  },
] as const;

export const PROCESS = [
  { step: "01", title: "Consultation", desc: "We listen — to your vision, your land and the way you want to live." },
  { step: "02", title: "Design", desc: "Concepts evolve into detailed architecture and curated interiors." },
  { step: "03", title: "Craft", desc: "Master craftsmen build with precision, care and premium materials." },
  { step: "04", title: "Handover", desc: "A home that is uniquely yours — delivered to last for generations." },
] as const;

export const STATS = [
  { value: "15+", label: "Years of craft" },
  { value: "120+", label: "Homes delivered" },
  { value: "98%", label: "Client referrals" },
  { value: "24", label: "Awards & features" },
] as const;

/** Locations we serve — drives the "Areas we serve" section + SEO. */
export const AREAS = [
  {
    city: "Kochi",
    note: "Bespoke luxury villas and modern homes across Kochi — Kakkanad, Edappally, Fort Kochi and the Marine Drive belt.",
    spots: ["Kakkanad", "Edappally", "Fort Kochi", "Vyttila"],
  },
  {
    city: "Ernakulam",
    note: "Custom residences throughout Ernakulam district — from Aluva and Tripunithura to Kaloor and beyond.",
    spots: ["Aluva", "Tripunithura", "Kaloor", "Thripunithura"],
  },
  {
    city: "Kerala",
    note: "Trusted home builders statewide — Thrissur, Kottayam, Munnar and every corner of God's Own Country.",
    spots: ["Thrissur", "Kottayam", "Munnar", "Calicut"],
  },
] as const;

/** FAQ — rendered on the homepage and emitted as FAQPage structured data. */
export const FAQS = [
  {
    q: "Who are the best builders in Kochi for luxury homes?",
    a: "Oliviya Developers Pvt Ltd is a leading luxury home builder in Kochi, delivering bespoke villas and residences with end-to-end architecture and construction, premium materials and meticulous craftsmanship.",
  },
  {
    q: "Do you build luxury homes in Ernakulam?",
    a: "Yes. We design and build custom luxury homes across Ernakulam district — from Aluva and Kakkanad to Tripunithura — handling everything from architecture and approvals to turnkey handover.",
  },
  {
    q: "Are you among the best builders in Kerala?",
    a: "With 15+ years of craft and 120+ homes delivered, Oliviya Developers is recognised among the best home builders in Kerala, with a 98% client-referral rate.",
  },
  {
    q: "What services does Oliviya Developers offer?",
    a: "Architectural design, luxury home construction, interior design, renovation & restoration, landscaping and project consultancy — all delivered under one roof.",
  },
  {
    q: "How do I start a project with Oliviya Developers?",
    a: "Begin with a free consultation. We listen to your vision, study your land, and craft a tailored design and budget before construction begins.",
  },
] as const;
