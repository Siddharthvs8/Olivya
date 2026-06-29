import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createPano } from "@/app/admin/actions";
import PanoForm from "@/components/admin/PanoForm";

export default function NewPanoPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/panoramas"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
      >
        <ArrowLeft className="h-4 w-4" /> Back to 360° tours
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-cream">Add 360° tour</h1>
      <p className="mt-2 text-muted">Paste a momento360 (or any 360° viewer) embed link.</p>

      <div className="mt-8">
        <PanoForm action={createPano} />
      </div>
    </div>
  );
}
