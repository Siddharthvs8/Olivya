"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import type { Pano } from "@/lib/types";
import ImageUploader from "./ImageUploader";
import SubmitButton from "./SubmitButton";

const field =
  "w-full rounded-xl border border-line bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-faint outline-none transition-colors focus:border-gold";
const labelCls = "mb-2 block text-sm font-medium text-cream";

export default function PanoForm({
  action,
  pano,
}: {
  action: (formData: FormData) => void | Promise<void>;
  pano?: Pano;
}) {
  const [url, setUrl] = useState(pano?.embed_url ?? "");
  const valid = /^https?:\/\//.test(url.trim());

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      {/* Main column */}
      <div className="space-y-5">
        <div>
          <label className={labelCls}>Title</label>
          <input
            name="title"
            required
            defaultValue={pano?.title}
            placeholder="Grand Living"
            className={`${field} font-serif text-lg`}
          />
        </div>

        <div>
          <label className={labelCls}>Room / area</label>
          <input
            name="room"
            defaultValue={pano?.room}
            placeholder="Living & Gathering"
            className={field}
          />
        </div>

        <div>
          <label className={labelCls}>360° embed URL</label>
          <input
            name="embed_url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://momento360.com/e/u/…"
            className={field}
          />
          <p className="mt-1 text-xs text-faint">
            Paste the share/embed link from momento360 (or any 360° viewer that
            supports iframe embedding).
          </p>
        </div>

        {/* live preview */}
        <div className="overflow-hidden rounded-2xl border border-line bg-charcoal/60">
          <div className="aspect-video bg-ink">
            {valid ? (
              <iframe
                src={url}
                title="360° preview"
                allow="accelerometer; gyroscope; fullscreen; xr-spatial-tracking"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-faint">
                <Compass className="h-8 w-8" />
              </div>
            )}
          </div>
          <p className="px-4 py-3 text-xs text-faint">
            {valid ? "Live preview — drag to look around" : "Paste a URL to preview the 360° view"}
          </p>
        </div>
      </div>

      {/* Sidebar column */}
      <div className="space-y-6">
        <div className="space-y-4 rounded-2xl border border-line bg-charcoal/60 p-5">
          <Toggle name="published" label="Published" defaultChecked={pano?.published ?? true} hint="Hidden from the 360° gallery when off." />
        </div>

        <ImageUploader name="image" label="Thumbnail (optional)" defaultValue={pano?.image} />

        <div className="flex items-center gap-3">
          <SubmitButton>{pano ? "Update tour" : "Add tour"}</SubmitButton>
          <Link
            href="/admin/panoramas"
            className="rounded-full border border-line px-5 py-3.5 text-sm text-muted transition-colors hover:text-cream"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
  hint,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
  hint: string;
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-center justify-between">
        <span className="text-sm font-medium text-cream">{label}</span>
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="relative h-5 w-9 cursor-pointer appearance-none rounded-full bg-stone transition-colors before:absolute before:left-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-cream before:transition-transform checked:bg-gold checked:before:translate-x-4"
        />
      </label>
      <p className="mt-1 text-xs text-faint">{hint}</p>
    </div>
  );
}
