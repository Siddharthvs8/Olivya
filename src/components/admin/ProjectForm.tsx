"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { slugify } from "@/lib/utils";
import ImageUploader from "./ImageUploader";
import SubmitButton from "./SubmitButton";

const field =
  "w-full rounded-xl border border-line bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-faint outline-none transition-colors focus:border-gold";
const labelCls = "mb-2 block text-sm font-medium text-cream";

export default function ProjectForm({
  action,
  project,
}: {
  action: (formData: FormData) => void | Promise<void>;
  project?: Project;
}) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      {/* Main column */}
      <div className="space-y-5">
        <div>
          <label className={labelCls}>Project name</label>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="The Courtyard Villa"
            className={`${field} font-serif text-lg`}
          />
        </div>

        <div>
          <label className={labelCls}>Slug</label>
          <input
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="url-friendly-slug"
            className={field}
          />
          <p className="mt-1 text-xs text-faint">/projects#{slug || "your-slug"}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Location</label>
            <input name="location" defaultValue={project?.location} placeholder="Kakkanad, Kochi" className={field} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <input name="category" defaultValue={project?.category} placeholder="Luxury Villa" className={field} />
          </div>
          <div>
            <label className={labelCls}>Year</label>
            <input name="year" defaultValue={project?.year} placeholder="2025" className={field} />
          </div>
          <div>
            <label className={labelCls}>Area</label>
            <input name="area" defaultValue={project?.area} placeholder="6,200 sq.ft" className={field} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            name="blurb"
            rows={4}
            defaultValue={project?.blurb}
            placeholder="A short, evocative description shown on the project card."
            className={`${field} resize-y`}
          />
        </div>
      </div>

      {/* Sidebar column */}
      <div className="space-y-6">
        <div className="space-y-4 rounded-2xl border border-line bg-charcoal/60 p-5">
          <Toggle name="published" label="Published" defaultChecked={project?.published ?? true} hint="Hidden from the site when off." />
          <Toggle name="featured" label="Featured on home" defaultChecked={project?.featured ?? false} hint="Shows in the homepage highlights." />
        </div>

        <ImageUploader name="image" label="Project image" defaultValue={project?.image} />

        <div className="flex items-center gap-3">
          <SubmitButton>{project ? "Update project" : "Create project"}</SubmitButton>
          <Link
            href="/admin/projects"
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
