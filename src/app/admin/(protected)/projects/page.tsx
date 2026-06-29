import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Star } from "lucide-react";
import { getAllProjects } from "@/lib/store";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectList() {
  const projects = await getAllProjects();

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-cream">Projects</h1>
          <p className="mt-2 text-muted">
            {projects.length} project{projects.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-gold-soft"
        >
          <Plus className="h-4 w-4" /> Add project
        </Link>
      </header>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {projects.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted">No projects yet.</p>
            <Link href="/admin/projects/new" className="mt-3 inline-block text-sm text-gold hover:underline">
              Add your first project →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {projects.map((project) => (
              <li key={project.id} className="flex items-center gap-4 p-4 sm:p-5">
                <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-charcoal sm:block">
                  {project.image && (
                    <Image src={project.image} alt="" fill className="object-cover" sizes="96px" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wide ${
                        project.published ? "bg-gold/15 text-gold" : "bg-stone text-muted"
                      }`}
                    >
                      {project.published ? "Published" : "Draft"}
                    </span>
                    {project.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-gold">
                        <Star className="h-3 w-3" /> Featured
                      </span>
                    )}
                    <span className="text-xs text-faint">{project.location}</span>
                  </div>
                  <p className="mt-1 truncate font-serif text-lg text-cream">{project.title}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    aria-label="Edit project"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <DeleteProjectButton id={project.id} title={project.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
