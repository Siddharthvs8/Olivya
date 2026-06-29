"use client";

import { useState } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  FLOATING WHATSAPP                                                   */
/*  A site-wide chat button. The number is set in Admin → Settings;     */
/*  if none is set, the button simply doesn't render.                   */
/* ------------------------------------------------------------------ */

export default function FloatingWhatsApp({
  number,
  company,
}: {
  number?: string;
  company: string;
}) {
  const [hover, setHover] = useState(false);

  // wa.me needs digits only (country code, no "+", spaces or dashes).
  const digits = (number ?? "").replace(/\D/g, "");
  if (digits.length < 8) return null;

  const message = encodeURIComponent(
    `Hi ${company}, I'd love to know more about building my dream home.`,
  );
  const href = `https://wa.me/${digits}?text=${message}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group fixed bottom-6 right-6 z-[60] flex items-center sm:bottom-8 sm:right-8"
    >
      {/* hover label */}
      <motion.span
        initial={false}
        animate={{ opacity: hover ? 1 : 0, x: hover ? 0 : 8 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none mr-3 hidden whitespace-nowrap rounded-full border border-line bg-ink/90 px-4 py-2 text-sm text-cream shadow-lg backdrop-blur sm:block"
      >
        Chat with us
      </motion.span>

      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_30px_rgba(37,211,102,0.45)] transition-transform duration-300 group-hover:scale-110">
        {/* pulsing ring */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" />
        <span className="absolute inset-0 rounded-full bg-[#25D366]" />
        <WhatsAppGlyph className="relative h-7 w-7 text-white" />
      </span>
    </motion.a>
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}
