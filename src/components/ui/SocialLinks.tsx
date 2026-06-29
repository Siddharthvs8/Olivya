import type { SocialLinks as Socials } from "@/lib/types";
import { cn } from "@/lib/utils";

/* Hand-rolled brand glyphs so we don't depend on deprecated icon packs. */
const Icons: Record<string, React.ReactNode> = {
  website: (
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c2.5 2.5 4 6.5 4 10s-1.5 7.5-4 10m0-20c-2.5 2.5-4 6.5-4 10s1.5 7.5 4 10M2 12h20" />
  ),
  facebook: (
    <path d="M14 9V7c0-1 .5-2 2-2h2V2h-3c-2.5 0-4 1.7-4 4v3H8v3h3v8h3v-8h2.5l.5-3H14z" />
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect x="2" y="6" width="20" height="12" rx="4" />
      <path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
    </>
  ),
  pinterest: (
    <path d="M12 2a10 10 0 00-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.6-.2 1 .5 1.9 1.6 1.9 1.9 0 3.2-2.4 3.2-5.3 0-2.2-1.5-3.8-4.1-3.8a4.7 4.7 0 00-4.9 4.7c0 .9.3 1.5.7 2 .2.2.2.3.1.6l-.2.9c-.1.3-.3.4-.6.2-1.2-.5-1.7-1.9-1.7-3.4 0-2.6 2.1-5.6 6.4-5.6 3.4 0 5.7 2.5 5.7 5.2 0 3.5-2 6.2-4.9 6.2-1 0-1.9-.5-2.2-1.2l-.6 2.4c-.2.8-.7 1.7-1 2.3A10 10 0 1012 2z" fill="currentColor" stroke="none" />
  ),
  linkedin: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 014 0v4" />
    </>
  ),
  twitter: (
    <path d="M4 4l7.5 9.5L4.5 20H7l5.3-5.8L16.5 20H20l-7.8-9.9L19.5 4H17l-4.9 5.3L8.2 4H4z" fill="currentColor" stroke="none" />
  ),
  kolo: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M9 8v8M9 12l4-4M9 12l4 4" />
    </>
  ),
};

const LABELS: Record<string, string> = {
  website: "Website",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  pinterest: "Pinterest",
  linkedin: "LinkedIn",
  twitter: "X (Twitter)",
  kolo: "Kolo App",
};

const ORDER = [
  "instagram",
  "facebook",
  "youtube",
  "pinterest",
  "linkedin",
  "twitter",
  "kolo",
  "website",
] as const;

export default function SocialLinks({
  socials,
  className,
  size = "md",
}: {
  socials: Socials;
  className?: string;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-9 w-9" : "h-11 w-11";

  return (
    <ul className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {ORDER.filter((key) => socials[key]).map((key) => (
        <li key={key}>
          <a
            href={socials[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={LABELS[key]}
            title={LABELS[key]}
            className={cn(
              "group flex items-center justify-center rounded-full border border-line text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold",
              dim,
            )}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[18px] w-[18px]"
            >
              {Icons[key]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
