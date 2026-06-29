import Link from "next/link";
import Image from "next/image";
import { COMPANY } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Brand lockup. Shows the uploaded logo when an admin sets one in settings,
 * otherwise a refined typographic mark.
 */
export default function Logo({
  logoUrl,
  className,
}: {
  logoUrl?: string | null;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${COMPANY.name} — home`}
      className={cn("group inline-flex items-center gap-3", className)}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={COMPANY.legalName}
          width={280}
          height={80}
          className="h-14 w-auto object-contain sm:h-16"
          priority
        />
      ) : (
        <span className="flex flex-col leading-none">
          <span className="font-serif text-xl tracking-tight text-cream transition-colors group-hover:text-gold sm:text-2xl">
            Oliviya
          </span>
          <span className="mt-0.5 text-[0.6rem] font-medium uppercase tracking-[0.34em] text-gold">
            Developers
          </span>
        </span>
      )}
    </Link>
  );
}
