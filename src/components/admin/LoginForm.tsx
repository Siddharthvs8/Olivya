"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, Lock } from "lucide-react";
import { login, type LoginState } from "@/app/admin/auth-actions";

const field =
  "w-full rounded-xl border border-line bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-faint outline-none transition-colors focus:border-gold";

export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-10 block text-center">
          <span className="font-serif text-2xl text-cream">Oliviya</span>
          <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.34em] text-gold">
            Developers · Admin
          </span>
        </Link>

        <div className="rounded-3xl border border-line bg-charcoal/60 p-8 sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-line text-gold">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl text-cream">Admin sign in</h1>
              <p className="text-xs text-faint">Manage your website content</p>
            </div>
          </div>

          {!configured ? (
            <div className="mt-8 rounded-xl border border-gold/30 bg-gold/5 p-5 text-sm leading-relaxed text-muted">
              <p className="font-medium text-gold">Set an admin password first</p>
              <p className="mt-2">
                Add <code className="text-cream">ADMIN_PASSWORD</code> and{" "}
                <code className="text-cream">AUTH_SECRET</code> to your
                environment variables, then reload. See{" "}
                <code className="text-cream">README.md</code>.
              </p>
            </div>
          ) : (
            <form action={formAction} className="mt-8 space-y-4">
              <input
                type="password"
                name="password"
                required
                autoFocus
                placeholder="Admin password"
                className={field}
              />
              {state.error && (
                <p className="text-sm text-red-400">{state.error}</p>
              )}
              <button
                type="submit"
                disabled={pending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-gold-soft disabled:opacity-70"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-faint">
          <Link href="/" className="hover:text-gold">
            ← Back to website
          </Link>
        </p>
      </div>
    </main>
  );
}
