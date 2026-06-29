import type { Job } from "./types";

export type { Job };

const APPLY = "careers@oliviyadevelopers.com";

/**
 * Seed job openings — shown until an admin adds their own from the dashboard.
 * (Fallback for the file/Postgres store, like SEED_POSTS / SEED_PROJECTS.)
 */
export const SEED_JOBS: Job[] = [
  seed(
    "senior-site-engineer",
    "Senior Site Engineer",
    "Kochi, Kerala",
    "Full-time",
    "Construction",
    "Lead on-site execution of premium residential projects — coordinating contractors, quality audits and timelines. You'll bring 5+ years in high-end residential construction and an obsession with finish quality.",
  ),
  seed(
    "architect",
    "Architect",
    "Ernakulam, Kerala",
    "Full-time",
    "Design",
    "Design bespoke luxury homes from concept to construction drawings. Strong portfolio, command of 3D visualisation, and a feel for how light, space and material shape a home.",
  ),
  seed(
    "interior-designer",
    "Interior Designer",
    "Kochi, Kerala",
    "Full-time",
    "Design",
    "Craft warm, considered interiors — bespoke joinery, lighting and styling. You translate a client's life into spaces that feel inevitable.",
  ),
  seed(
    "project-coordinator",
    "Project Coordinator",
    "Kochi, Kerala",
    "Full-time",
    "Operations",
    "Be the calm centre of every build — scheduling, approvals, client updates and vendor liaison. Exceptional organisation and warm communication essential.",
  ),
];

function seed(
  slug: string,
  title: string,
  location: string,
  type: string,
  department: string,
  description: string,
): Job {
  const at = "2026-01-01T00:00:00.000Z";
  return {
    id: slug,
    slug,
    title,
    location,
    type,
    department,
    description,
    apply_email: APPLY,
    published: true,
    created_at: at,
    updated_at: at,
  };
}
