import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow justify-center">Error 404</p>
      <h1 className="mt-6 font-serif text-6xl text-cream sm:text-8xl">
        Lost the blueprint.
      </h1>
      <p className="mt-5 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
        get you back home.
      </p>
      <Link
        href="/"
        className="mt-9 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-gold-soft"
      >
        Back to home
      </Link>
    </main>
  );
}
