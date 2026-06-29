"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Building2,
  Youtube,
  Compass,
  Briefcase,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { logout } from "@/app/admin/auth-actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: Building2 },
  { href: "/admin/videos", label: "YouTube", icon: Youtube },
  { href: "/admin/panoramas", label: "360° Tours", icon: Compass },
  { href: "/admin/careers", label: "Careers", icon: Briefcase },
  { href: "/admin/blogs", label: "Blog Posts", icon: Newspaper },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex shrink-0 flex-col border-b border-line bg-charcoal px-4 py-5 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r lg:px-5 lg:py-7">
      <Link href="/admin" className="flex flex-col leading-none">
        <span className="font-serif text-xl text-cream">Oliviya</span>
        <span className="mt-0.5 text-[0.55rem] uppercase tracking-[0.3em] text-gold">
          Admin Panel
        </span>
      </Link>

      <nav className="mt-7 flex gap-1 lg:mt-10 lg:flex-col">
        {LINKS.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors",
                active
                  ? "bg-gold/10 text-gold"
                  : "text-muted hover:bg-graphite hover:text-cream",
              )}
            >
              <link.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden flex-col gap-2 pt-6 lg:flex">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-muted transition-colors hover:bg-graphite hover:text-cream"
        >
          <ExternalLink className="h-4 w-4" /> View website
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-muted transition-colors hover:bg-graphite hover:text-red-400"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>
      </div>

      {/* mobile sign out */}
      <form action={logout} className="ml-auto lg:hidden">
        <button
          type="submit"
          aria-label="Sign out"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </form>
    </aside>
  );
}
