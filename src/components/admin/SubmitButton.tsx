"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export default function SubmitButton({
  children = "Save",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-gold-soft disabled:opacity-70"
      }
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? "Saving…" : children}
    </button>
  );
}
