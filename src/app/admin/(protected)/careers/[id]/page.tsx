import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getJobById } from "@/lib/store";
import { updateJob } from "@/app/admin/actions";
import JobForm from "@/components/admin/JobForm";

export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();
  const action = updateJob.bind(null, id);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/careers"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to careers
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-cream">Edit job</h1>
      <p className="mt-2 truncate text-muted">{job.title}</p>

      <div className="mt-8">
        <JobForm action={action} job={job} />
      </div>
    </div>
  );
}
