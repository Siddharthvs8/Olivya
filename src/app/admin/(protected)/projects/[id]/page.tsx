import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProjectById } from "@/lib/store";
import { updateProject } from "@/app/admin/actions";
import ProjectForm from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();
  const action = updateProject.bind(null, id);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-cream">Edit project</h1>
      <p className="mt-2 truncate text-muted">{project.title}</p>

      <div className="mt-8">
        <ProjectForm action={action} project={project} />
      </div>
    </div>
  );
}
