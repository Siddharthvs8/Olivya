import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { COMPANY } from "@/lib/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Geometric display face for the brand wordmark (GrainText / logo).
const display = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.url),
  title: {
    default:
      "Oliviya Developers — Best Luxury Home Builders in Kochi, Ernakulam & Kerala",
    template: `%s — ${COMPANY.name}`,
  },
  description:
    "Oliviya Developers Pvt Ltd — among the best builders in Kochi, Ernakulam and across Kerala. Bespoke luxury villas and custom homes, designed and built end-to-end with premium craftsmanship.",
  keywords: [
    "best builders in Kochi",
    "best builders in Ernakulam",
    "best builders in Kerala",
    "best home builders Kerala",
    "luxury home builders Kochi",
    "luxury villa builders Ernakulam",
    "luxury home builders Kerala",
    "bespoke villa construction Kochi",
    "custom home builders Kerala",
    "construction company Kochi",
    "best construction company in Ernakulam",
    "Oliviya Developers",
    "luxury residences Kerala",
    "architecture Kochi",
  ],
  authors: [{ name: COMPANY.legalName }],
  creator: COMPANY.legalName,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: COMPANY.url,
    siteName: COMPANY.legalName,
    title:
      "Oliviya Developers — Best Luxury Home Builders in Kochi, Ernakulam & Kerala",
    description:
      "Bespoke luxury villas and custom homes across Kochi, Ernakulam and Kerala — designed and built end-to-end by Oliviya Developers.",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Oliviya Developers — Best Luxury Home Builders in Kochi, Ernakulam & Kerala",
    description:
      "Bespoke luxury villas and custom homes across Kochi, Ernakulam and Kerala.",
    site: "@oliviyabuilders",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${display.variable}`}>
      <body className="bg-grain antialiased">
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
