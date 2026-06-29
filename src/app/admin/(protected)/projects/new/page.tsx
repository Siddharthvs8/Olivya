import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createProject } from "@/app/admin/actions";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-cream">Add project</h1>
      <p className="mt-2 text-muted">Add a completed home to your portfolio.</p>

      <div className="mt-8">
        <ProjectForm action={createProject} />
      </div>
    </div>
  );
}
