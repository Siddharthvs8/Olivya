import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Compass } from "lucide-react";
import { getAllPanos } from "@/lib/store";
import DeletePanoButton from "@/components/admin/DeletePanoButton";

export const dynamic = "force-dynamic";

export default async function AdminPanoList() {
  const panos = await getAllPanos();

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-cream">360° Tours</h1>
          <p className="mt-2 text-muted">
            {panos.length} tour{panos.length === 1 ? "" : "s"} · shown in the Experienza 360° gallery
          </p>
        </div>
        <Link
          href="/admin/panoramas/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-gold-soft"
        >
          <Plus className="h-4 w-4" /> Add tour
        </Link>
      </header>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {panos.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted">No 360° tours yet.</p>
            <Link href="/admin/panoramas/new" className="mt-3 inline-block text-sm text-gold hover:underline">
              Add your first 360° tour →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {panos.map((pano) => (
              <li key={pano.id} className="flex items-center gap-4 p-4 sm:p-5">
                <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-charcoal sm:block">
                  {pano.image ? (
                    <Image src={pano.image} alt="" fill className="object-cover" sizes="96px" />
                  ) : (
                    <Compass className="absolute inset-0 m-auto h-5 w-5 text-faint" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wide ${
                        pano.published ? "bg-gold/15 text-gold" : "bg-stone text-muted"
                      }`}
                    >
                      {pano.published ? "Published" : "Draft"}
                    </span>
                    {pano.room && <span className="text-xs text-faint">{pano.room}</span>}
                  </div>
                  <p className="mt-1 truncate font-serif text-lg text-cream">{pano.title}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/panoramas/${pano.id}`}
                    aria-label="Edit tour"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <DeletePanoButton id={pano.id} title={pano.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
