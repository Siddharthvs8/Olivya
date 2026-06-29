import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createJob } from "@/app/admin/actions";
import JobForm from "@/components/admin/JobForm";

export default function NewJobPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/careers"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to careers
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-cream">Post a job</h1>
      <p className="mt-2 text-muted">Add an opening to your careers page.</p>

      <div className="mt-8">
        <JobForm action={createJob} />
      </div>
    </div>
  );
}
