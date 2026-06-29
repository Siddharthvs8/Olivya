import type { Post } from "./types";

/**
 * Demo posts shown until Supabase is connected (or while the table is empty).
 * Once an admin publishes real posts they take over automatically.
 */
export const SEED_POSTS: Post[] = [
  {
    id: "seed-1",
    slug: "designing-a-luxury-home-in-kerala",
    title: "Designing a Luxury Home in Kerala: Where Tradition Meets Modernity",
    excerpt:
      "How we blend Kerala's timeless architectural soul with contemporary luxury to craft homes that last for generations.",
    cover_image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    author: "Tom George",
    tags: ["Design", "Architecture", "Kerala"],
    published: true,
    created_at: "2026-05-28T09:00:00.000Z",
    updated_at: "2026-05-28T09:00:00.000Z",
    content: `Kerala's architecture has always understood light, air and water. At Oliviya Developers we carry that intelligence forward — pairing the sloping roofs and shaded courtyards of the tradition with the clean lines, glass and open volumes of modern luxury living.

## Begin with the land

Every great home starts with listening to the site. Orientation, breeze, the path of the monsoon and the position of the sun all shape the first sketch long before a single wall is drawn.

## Materials that age beautifully

- Locally quarried stone and laterite for grounding warmth
- Seasoned teak and rosewood joinery
- Lime-based finishes that breathe in humid climates

> A luxury home is not the most expensive one. It is the one that feels inevitable — as if it could not have been any other way.

## Designed for generations

We design for the next forty years, not the next forty months. That means structural integrity, future-ready services, and interiors that can evolve with a family without losing their soul.`,
  },
  {
    id: "seed-2",
    slug: "5-signs-of-true-craftsmanship",
    title: "5 Signs of True Craftsmanship in Home Construction",
    excerpt:
      "Anyone can pour concrete. Here is how to recognise the craftsmanship that separates a house from a heirloom.",
    cover_image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    author: "Oliviya Studio",
    tags: ["Craftsmanship", "Quality"],
    published: true,
    created_at: "2026-05-12T09:00:00.000Z",
    updated_at: "2026-05-12T09:00:00.000Z",
    content: `Craftsmanship hides in the details most people never see — until they live with them every day.

## 1. Honest joinery
Doors that close with a quiet, weighted click. Drawers that glide. Edges that meet without a fight.

## 2. Considered transitions
Where stone meets wood, where wall meets ceiling — the transitions reveal whether a builder cared.

## 3. Services you never notice
Plumbing, wiring and HVAC laid out so cleanly that they simply disappear into the architecture.

## 4. Light that behaves
Layered, dimmable, intentional. Light is a material, and we treat it like one.

## 5. Finishing that survives time
The true test arrives in year five, not week one. We build for the long, quiet test of living.`,
  },
  {
    id: "seed-3",
    slug: "from-concept-to-completion",
    title: "From Concept to Completion: Our Process Explained",
    excerpt:
      "A transparent look at the journey from first conversation to handing over the keys to your bespoke home.",
    cover_image:
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=80",
    author: "Tom George",
    tags: ["Process", "Guide"],
    published: true,
    created_at: "2026-04-30T09:00:00.000Z",
    updated_at: "2026-04-30T09:00:00.000Z",
    content: `Building a home should feel exciting, not anxious. Our process is built around clarity at every stage.

## Consultation
We start by understanding you — how you live, what you love, and the future you are building toward.

## Design
Concepts become detailed drawings, 3D walkthroughs and material palettes you can see and touch.

## Craft
Master craftsmen bring the design to life with rigorous quality control and weekly progress you can follow.

## Handover
We hand over a home that is unmistakably yours — and stand beside you long after the keys change hands.`,
  },
];
