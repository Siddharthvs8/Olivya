import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPanoById } from "@/lib/store";
import { updatePano } from "@/app/admin/actions";
import PanoForm from "@/components/admin/PanoForm";

export const dynamic = "force-dynamic";

export default async function EditPanoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pano = await getPanoById(id);
  if (!pano) notFound();
  const action = updatePano.bind(null, id);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/panoramas"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to 360° tours
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-cream">Edit 360° tour</h1>
      <p className="mt-2 truncate text-muted">{pano.title}</p>

      <div className="mt-8">
        <PanoForm action={action} pano={pano} />
      </div>
    </div>
  );
}
