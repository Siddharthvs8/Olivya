"use client";

import { Trash2 } from "lucide-react";
import { deleteVideo } from "@/app/admin/actions";

export default function DeleteVideoButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <form
      action={deleteVideo}
      onSubmit={(e) => {
        if (!confirm(`Delete “${title}”? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Delete video"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-red-400/50 hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
