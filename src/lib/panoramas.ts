import type { Pano } from "./types";

export type { Pano };

// Example momento360 panorama (admin-replaceable). We vary the heading so the
// seeded rooms open at different angles of the same demo panorama.
const DEMO = (heading: number) =>
  `https://momento360.com/e/u/ee6aae4e18514e33b2248b98b5e15828?utm_campaign=embed&utm_source=other&heading=${heading}&pitch=-2.13&field-of-view=100&size=medium&display-plan=true`;

const T = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

/**
 * Seed 360° tours — shown until an admin adds their own from the dashboard.
 * (Fallback for the file/Postgres store, like SEED_VIDEOS.)
 */
export const SEED_PANOS: Pano[] = [
  seed("Grand Living", "Living & Gathering", DEMO(44.41), T("1618221195710-dd6b41faaea6")),
  seed("Master Suite", "Rest & Retreat", DEMO(180), T("1617103996702-96ff29b1c467")),
  seed("Courtyard Lounge", "Indoor–Outdoor", DEMO(300), T("1600607687939-ce8a6c25118c")),
];

function seed(title: string, room: string, embed_url: string, image: string): Pano {
  const at = "2026-01-01T00:00:00.000Z";
  return {
    id: title.toLowerCase().replace(/\s+/g, "-"),
    title,
    room,
    embed_url,
    image,
    published: true,
    created_at: at,
    updated_at: at,
  };
}
