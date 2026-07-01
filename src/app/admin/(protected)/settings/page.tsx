import { getSettings } from "@/lib/data";
import { updateSettings } from "@/app/admin/actions";
import ImageUploader from "@/components/admin/ImageUploader";
import SubmitButton from "@/components/admin/SubmitButton";

export const dynamic = "force-dynamic";

const field =
  "w-full rounded-xl border border-line bg-charcoal px-4 py-3 text-sm text-cream placeholder:text-faint outline-none transition-colors focus:border-gold";

const SOCIALS: { name: keyof typeof PLACEHOLDERS; label: string }[] = [
  { name: "website", label: "Website" },
  { name: "instagram", label: "Instagram" },
  { name: "facebook", label: "Facebook" },
  { name: "youtube", label: "YouTube" },
  { name: "pinterest", label: "Pinterest" },
  { name: "linkedin", label: "LinkedIn" },
  { name: "twitter", label: "X (Twitter)" },
  { name: "kolo", label: "Kolo App" },
];

const PLACEHOLDERS = {
  website: "https://oliviyadevelopers.com",
  instagram: "https://instagram.com/…",
  facebook: "https://facebook.com/…",
  youtube: "https://youtube.com/…",
  pinterest: "https://pinterest.com/…",
  linkedin: "https://linkedin.com/…",
  twitter: "https://x.com/…",
  kolo: "https://koloapp.in/…",
} as const;

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <h1 className="font-serif text-4xl text-cream">Site Settings</h1>
        <p className="mt-2 text-muted">
          Update your logo, images, contact details and social links. Changes go
          live immediately.
        </p>
      </header>

      <form action={updateSettings} className="mt-10 space-y-10">
        {/* Brand */}
        <section className="rounded-2xl border border-line bg-charcoal/40 p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-cream">Brand</h2>
          <p className="mt-1 text-sm text-muted">
            Upload a logo (transparent PNG works best). Leave empty to use the
            text logo.
          </p>
          <div className="mt-6 max-w-md">
            <ImageUploader
              name="logo_url"
              label="Logo"
              defaultValue={settings.logo_url}
              ratio="aspect-[3/1]"
            />
          </div>
        </section>

        {/* Images */}
        <section className="rounded-2xl border border-line bg-charcoal/40 p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-cream">Page images</h2>
          <p className="mt-1 text-sm text-muted">
            Hero, welcome and feature imagery used across the site.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <ImageUploader name="hero_image" label="Hero background" defaultValue={settings.hero_image} />
            <ImageUploader name="about_image" label="Welcome / about" defaultValue={settings.about_image} />
            <ImageUploader name="cta_image" label="Feature / banner" defaultValue={settings.cta_image} />
          </div>
        </section>

        {/* About page — consultant */}
        <section className="rounded-2xl border border-line bg-charcoal/40 p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-cream">About page — consultant</h2>
          <p className="mt-1 text-sm text-muted">
            The “Meet your consultant” section on the About Us page.
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr]">
            <ImageUploader
              name="consultant_image"
              label="Consultant photo"
              defaultValue={settings.consultant_image}
              ratio="aspect-square"
            />
            <div className="grid content-start gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-cream">Name</label>
                  <input
                    name="consultant_name"
                    defaultValue={settings.consultant_name}
                    placeholder="Tom George"
                    className={field}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-cream">Title</label>
                  <input
                    name="consultant_title"
                    defaultValue={settings.consultant_title}
                    placeholder="The Luxury Home Consultant"
                    className={field}
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm text-cream">Bio</label>
                <textarea
                  name="consultant_bio"
                  defaultValue={settings.consultant_bio}
                  rows={5}
                  placeholder="A short introduction to your consultant…"
                  className={`${field} resize-y leading-relaxed`}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-cream">Button label</label>
                  <input
                    name="consultant_cta_label"
                    defaultValue={settings.consultant_cta_label}
                    placeholder="Talk to Tom"
                    className={field}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-cream">Button link</label>
                  <input
                    name="consultant_cta_href"
                    defaultValue={settings.consultant_cta_href}
                    placeholder="/contact"
                    className={field}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-2xl border border-line bg-charcoal/40 p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-cream">Contact details</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-cream">Phone</label>
              <input name="phone" defaultValue={settings.phone} className={field} />
            </div>
            <div>
              <label className="mb-2 block text-sm text-cream">Email</label>
              <input name="email" type="email" defaultValue={settings.email} className={field} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 flex items-center gap-2 text-sm text-cream">
                WhatsApp number
                <span className="rounded-full bg-[#25D366]/15 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-[#25D366]">
                  Floating chat button
                </span>
              </label>
              <input
                name="whatsapp"
                defaultValue={settings.socials.whatsapp ?? ""}
                placeholder="+91 98470 12345"
                className={field}
              />
              <p className="mt-1.5 text-xs text-faint">
                Shown as a floating WhatsApp button on every page. Include the
                country code. Leave empty to hide the button.
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm text-cream">Address</label>
              <input name="address" defaultValue={settings.address} className={field} />
            </div>
          </div>
        </section>

        {/* Socials */}
        <section className="rounded-2xl border border-line bg-charcoal/40 p-6 sm:p-8">
          <h2 className="font-serif text-2xl text-cream">Social links</h2>
          <p className="mt-1 text-sm text-muted">
            Leave a field empty to hide that icon from the website.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {SOCIALS.map((s) => (
              <div key={s.name}>
                <label className="mb-2 block text-sm text-cream">{s.label}</label>
                <input
                  name={s.name}
                  type="url"
                  defaultValue={settings.socials[s.name] ?? ""}
                  placeholder={PLACEHOLDERS[s.name]}
                  className={field}
                />
              </div>
            ))}
          </div>
        </section>

        <div className="sticky bottom-4 flex justify-end">
          <SubmitButton>Save settings</SubmitButton>
        </div>
      </form>
    </div>
  );
}
