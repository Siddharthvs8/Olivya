import type { Video } from "./types";

export type { Video };

/**
 * Seed videos — shown until an admin adds their own from the dashboard.
 * (Fallback for the file/Postgres store, like SEED_POSTS / SEED_PROJECTS.)
 */
export const SEED_VIDEOS: Video[] = [
  seed(
    "67rbIgc50w8",
    "Oliviya Developers — Crafting Luxury Homes",
    "Walkthrough",
    "Step inside the world of Oliviya Developers and see how bespoke luxury homes come to life across Kerala.",
    true,
  ),
  seed(
    "aqz-KE-bpKQ",
    "The Build Journey — From Foundation to Finish",
    "Behind the Build",
    "A cinematic look at our end-to-end construction process — architecture, craft and the finishing touches.",
    false,
  ),
  seed(
    "ScMzIvxBSi4",
    "Client Story — A Home Made to Last",
    "Testimonial",
    "Our clients share what it felt like to watch their dream home take shape, room by room.",
    false,
  ),
];

function seed(
  youtube_id: string,
  title: string,
  category: string,
  description: string,
  featured: boolean,
): Video {
  const at = "2026-01-01T00:00:00.000Z";
  return {
    id: youtube_id,
    title,
    youtube_id,
    category,
    description,
    featured,
    published: true,
    created_at: at,
    updated_at: at,
  };
}
