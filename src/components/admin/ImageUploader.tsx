"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Loader2, X, Link as LinkIcon } from "lucide-react";

/**
 * Uploads an image to the Supabase `media` bucket and stores the public URL
 * in a hidden input named `name`, so it submits with the surrounding form.
 * Also supports pasting a URL directly.
 */
export default function ImageUploader({
  name,
  label,
  defaultValue,
  ratio = "aspect-[16/9]",
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  ratio?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setValue(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-cream">{label}</label>
      <input type="hidden" name={name} value={value} readOnly />

      <div
        className={`relative ${ratio} w-full overflow-hidden rounded-xl border border-line bg-charcoal`}
      >
        {value ? (
          <>
            <Image src={value} alt={label} fill className="object-cover" sizes="50vw" />
            <button
              type="button"
              onClick={() => setValue("")}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-cream hover:bg-ink"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted transition-colors hover:text-gold"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
            <span className="text-xs">
              {uploading ? "Uploading…" : "Click to upload"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onFile}
        className="hidden"
      />

      <div className="mt-2 flex items-center gap-2 rounded-lg border border-line bg-charcoal px-3 py-2">
        <LinkIcon className="h-3.5 w-3.5 shrink-0 text-faint" />
        <input
          type="text"
          inputMode="url"
          placeholder="…or paste an image URL"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent text-xs text-cream placeholder:text-faint outline-none"
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
