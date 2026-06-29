import type { Metadata } from "next";
import { getPublishedVideos } from "@/lib/data";
import PageHero from "@/components/sections/PageHero";
import VideoGallery from "@/components/sections/VideoGallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Videos — Luxury Home Tours & Build Journeys in Kerala",
  description:
    "Watch home tours, client stories and behind-the-build films from Oliviya Developers — luxury home builders in Kochi, Ernakulam and across Kerala.",
  alternates: { canonical: "/youtube" },
};

export default async function YoutubePage() {
  const videos = await getPublishedVideos();

  return (
    <>
      <PageHero
        eyebrow="Watch"
        title="Films from our world."
        intro="Step inside our homes, hear from the families who live in them, and follow the craft behind every build."
      />
      <VideoGallery videos={videos} />
    </>
  );
}
