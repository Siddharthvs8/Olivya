import type { Project } from "./types";

export type { Project };

/**
 * Seed projects — shown until an admin adds their own in the dashboard.
 * (Used as the fallback in the file/Postgres store, like SEED_POSTS.)
 */
export const SEED_PROJECTS: Project[] = [
  seed("the-courtyard-villa", "The Courtyard Villa", "Kakkanad, Kochi", "Luxury Villa", "2025", "6,200 sq.ft",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    "A contemporary villa woven around a central courtyard, flooding every room with Kerala light.", true),
  seed("riverstone-residence", "Riverstone Residence", "Aluva, Ernakulam", "Waterfront Home", "2024", "8,400 sq.ft",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    "A serene riverside home where stone, teak and glass frame uninterrupted backwater views.", true),
  seed("the-glass-pavilion", "The Glass Pavilion", "Kottayam", "Modern Estate", "2024", "9,100 sq.ft",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
    "Floor-to-ceiling glass dissolves the line between a sculpted interior and tropical garden.", true),
  seed("heritage-reimagined", "Heritage Reimagined", "Fort Kochi", "Restoration", "2023", "5,500 sq.ft",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    "A century-old home sensitively restored with modern comfort and its soul fully intact.", false),
  seed("hilltop-retreat", "Hilltop Retreat", "Munnar", "Holiday Home", "2023", "4,800 sq.ft",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80",
    "A misty hillside retreat designed to disappear into the tea-clad landscape around it.", false),
  seed("the-monolith-house", "The Monolith House", "Thrissur", "Architectural Home", "2022", "7,300 sq.ft",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    "Bold monolithic forms in board-marked concrete, softened by warm interior craftsmanship.", false),
];

function seed(
  slug: string,
  title: string,
  location: string,
  category: string,
  year: string,
  area: string,
  image: string,
  blurb: string,
  featured: boolean,
): Project {
  const at = `${year}-01-01T00:00:00.000Z`;
  return {
    id: slug,
    slug,
    title,
    location,
    category,
    year,
    area,
    image,
    blurb,
    featured,
    published: true,
    created_at: at,
    updated_at: at,
  };
}

/** Back-compat alias for older imports. */
export const PROJECTS = SEED_PROJECTS;
