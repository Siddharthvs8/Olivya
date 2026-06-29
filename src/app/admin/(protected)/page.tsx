import Link from "next/link";
import { Newspaper, Building2, Youtube, Compass, Briefcase, Inbox, Plus, Settings, Phone, Mail, MapPin } from "lucide-react";
import { countPosts, countProjects, countVideos, countJobs, countPanos, getRecentLeads } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [{ total }, projectCount, videoCount, panoCount, jobCount, recentLeads] = await Promise.all([
    countPosts(),
    countProjects(),
    countVideos(),
    countPanos(),
    countJobs(),
    getRecentLeads(5),
  ]);

  const stats = [
    { label: "Projects", value: projectCount.total, icon: Building2 },
    { label: "Videos", value: videoCount.total, icon: Youtube },
    { label: "360° Tours", value: panoCount.total, icon: Compass },
    { label: "Jobs", value: jobCount.total, icon: Briefcase },
    { label: "Enquiries", value: recentLeads.length, icon: Inbox },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-cream">Dashboard</h1>
          <p className="mt-2 text-muted">Welcome back. Here&apos;s your site at a glance.</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-gold-soft"
        >
          <Plus className="h-4 w-4" /> New post
        </Link>
      </header>

      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-line bg-charcoal p-6"
          >
            <s.icon className="h-5 w-5 text-gold" />
            <p className="mt-4 font-serif text-4xl text-cream">{s.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.15em] text-faint">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLink href="/admin/projects/new" icon={Plus} title="Add a project" desc="Showcase a finished home" />
        <QuickLink href="/admin/videos/new" icon={Youtube} title="Add a video" desc="Feature a YouTube video" />
        <QuickLink href="/admin/panoramas/new" icon={Compass} title="Add a 360° tour" desc="Embed a panorama" />
        <QuickLink href="/admin/careers/new" icon={Briefcase} title="Post a job" desc="Open a new role" />
        <QuickLink href="/admin/projects" icon={Building2} title="Manage projects" desc="Edit & feature your work" />
        <QuickLink href="/admin/blogs" icon={Newspaper} title="Manage blog" desc="Create, edit & delete posts" />
        <QuickLink href="/admin/settings" icon={Settings} title="Site settings" desc="Logo, images & socials" />
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-2xl text-cream">Recent enquiries</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-line">
          {recentLeads.length > 0 ? (
            <ul className="divide-y divide-line">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-cream">{lead.name}</p>

                    {/* contact details — click to call / email */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center gap-1.5 text-gold transition-colors hover:text-gold-soft"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          {lead.phone}
                        </a>
                      )}
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-gold"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {lead.email}
                        </a>
                      )}
                      {lead.location && (
                        <span className="inline-flex items-center gap-1.5 text-faint">
                          <MapPin className="h-3.5 w-3.5" />
                          {lead.location}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm text-faint">{lead.message}</p>
                  </div>
                  <span className="shrink-0 text-xs text-faint">
                    {formatDate(lead.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-6 text-sm text-muted">No enquiries yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-line bg-charcoal p-6 transition-colors hover:border-gold/40"
    >
      <Icon className="h-5 w-5 text-gold" />
      <p className="mt-4 font-medium text-cream group-hover:text-gold">{title}</p>
      <p className="mt-1 text-sm text-muted">{desc}</p>
    </Link>
  );
}
