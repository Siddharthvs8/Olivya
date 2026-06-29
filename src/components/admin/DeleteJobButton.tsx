"use client";

import { Trash2 } from "lucide-react";
import { deleteJob } from "@/app/admin/actions";

export default function DeleteJobButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <form
      action={deleteJob}
      onSubmit={(e) => {
        if (!confirm(`Delete “${title}”? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Delete job"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-red-400/50 hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
