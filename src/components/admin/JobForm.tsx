"use client";

import { useState } from "react";
import Link from "next/link";
import type { Job } from "@/lib/types";
import { slugify } from "@/lib/utils";
import SubmitButton from "./SubmitButton";

const field =
  "w-full rounded-xl border border-line bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-faint outline-none transition-colors focus:border-gold";
const labelCls = "mb-2 block text-sm font-medium text-cream";

const TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];

export default function JobForm({
  action,
  job,
}: {
  action: (formData: FormData) => void | Promise<void>;
  job?: Job;
}) {
  const [title, setTitle] = useState(job?.title ?? "");
  const [slug, setSlug] = useState(job?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(job));

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      {/* Main column */}
      <div className="space-y-5">
        <div>
          <label className={labelCls}>Job title</label>
          <input
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="Senior Site Engineer"
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
            placeholder="senior-site-engineer"
            className={field}
          />
          <p className="mt-1 text-xs text-faint">/careers#{slug || "your-slug"}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Location</label>
            <input name="location" defaultValue={job?.location} placeholder="Kochi, Kerala" className={field} />
          </div>
          <div>
            <label className={labelCls}>Employment type</label>
            <select name="type" defaultValue={job?.type ?? "Full-time"} className={field}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Department</label>
            <input name="department" defaultValue={job?.department} placeholder="Construction · Design · Operations" className={field} />
          </div>
          <div>
            <label className={labelCls}>Apply email</label>
            <input name="apply_email" type="email" defaultValue={job?.apply_email} placeholder="careers@oliviyadevelopers.com" className={field} />
          </div>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            name="description"
            rows={8}
            defaultValue={job?.description}
            placeholder="Describe the role, responsibilities and what you're looking for."
            className={`${field} resize-y`}
          />
        </div>
      </div>

      {/* Sidebar column */}
      <div className="space-y-6">
        <div className="space-y-4 rounded-2xl border border-line bg-charcoal/60 p-5">
          <Toggle name="published" label="Published" defaultChecked={job?.published ?? true} hint="Hidden from the careers page when off." />
        </div>

        <div className="flex items-center gap-3">
          <SubmitButton>{job ? "Update job" : "Post job"}</SubmitButton>
          <Link
            href="/admin/careers"
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
