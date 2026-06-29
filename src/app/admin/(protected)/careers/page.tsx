import Link from "next/link";
import { Plus, Pencil, MapPin, Briefcase } from "lucide-react";
import { getAllJobs } from "@/lib/store";
import DeleteJobButton from "@/components/admin/DeleteJobButton";

export const dynamic = "force-dynamic";

export default async function AdminJobList() {
  const jobs = await getAllJobs();

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-cream">Careers</h1>
          <p className="mt-2 text-muted">
            {jobs.length} job post{jobs.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/careers/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-gold-soft"
        >
          <Plus className="h-4 w-4" /> Post job
        </Link>
      </header>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {jobs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted">No job posts yet.</p>
            <Link href="/admin/careers/new" className="mt-3 inline-block text-sm text-gold hover:underline">
              Post your first job →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {jobs.map((job) => (
              <li key={job.id} className="flex items-center gap-4 p-4 sm:p-5">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wide ${
                        job.published ? "bg-gold/15 text-gold" : "bg-stone text-muted"
                      }`}
                    >
                      {job.published ? "Published" : "Draft"}
                    </span>
                    {job.type && (
                      <span className="inline-flex items-center gap-1 text-xs text-faint">
                        <Briefcase className="h-3 w-3" /> {job.type}
                      </span>
                    )}
                    {job.location && (
                      <span className="inline-flex items-center gap-1 text-xs text-faint">
                        <MapPin className="h-3 w-3" /> {job.location}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate font-serif text-lg text-cream">{job.title}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/careers/${job.id}`}
                    aria-label="Edit job"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <DeleteJobButton id={job.id} title={job.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
