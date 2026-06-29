import { getSettings, getPublishedPanos } from "@/lib/data";
import Hero from "@/components/sections/Hero";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import Welcome from "@/components/sections/Welcome";
import ServicesPreview from "@/components/sections/ServicesPreview";
import Quote from "@/components/sections/Quote";
import Process from "@/components/sections/Process";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import ValueProps from "@/components/sections/ValueProps";
import LatestPosts from "@/components/sections/LatestPosts";
import Experienza from "@/components/sections/Experienza";
import LogoForge from "@/components/sections/LogoForge";
import BuildJourney from "@/components/sections/BuildJourney";
import AreasFaq from "@/components/sections/AreasFaq";

export default async function HomePage() {
  const [settings, panos] = await Promise.all([getSettings(), getPublishedPanos()]);

  return (
    <>
      <div className="relative z-10">
        <Hero image={settings.hero_image ?? ""} />
        <LogoForge />
        <MarqueeStrip />
        <Welcome image={settings.about_image ?? ""} />
        <ServicesPreview />
        <Quote />
        <FeaturedProjects />
        <Experienza panos={panos} />
        <Process />
        <BuildJourney />
        <ValueProps />
        <AreasFaq />
        <LatestPosts />
      </div>
    </>
  );
}
