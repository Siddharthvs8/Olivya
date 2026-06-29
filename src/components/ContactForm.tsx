"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

const fieldClass =
  "w-full rounded-xl border border-line bg-charcoal px-4 py-3.5 text-sm text-cream placeholder:text-faint outline-none transition-colors focus:border-gold";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-gold/30 bg-charcoal p-10 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-ink">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="mt-6 font-serif text-3xl text-cream">Thank you</h3>
            <p className="mt-3 max-w-sm text-muted">
              Your message is on its way. Our team will reach out shortly to
              begin your journey to luxurious living.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-7 text-sm text-gold underline-offset-4 hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={onSubmit}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="name" required placeholder="Full name" className={fieldClass} />
              <input name="phone" placeholder="Phone" className={fieldClass} />
            </div>
            <input
              name="email"
              type="email"
              required
              placeholder="Email address"
              className={fieldClass}
            />
            <input name="location" placeholder="Project location (e.g. Kochi)" className={fieldClass} />
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Tell us about your dream home…"
              className={`${fieldClass} resize-none`}
            />

            {status === "error" && (
              <p className="text-sm text-red-400">
                Something went wrong. Please try again or reach us directly.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 text-sm font-medium text-ink transition-colors hover:bg-gold-soft disabled:opacity-70 sm:w-auto"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
