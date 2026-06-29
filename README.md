# Oliviya Developers — Luxury Builder Website + Admin CMS

A premium, fully responsive website for **Oliviya Developers Pvt Ltd** with a
dark-and-gold luxury aesthetic, cinematic scroll animations, and a built-in
admin panel for managing blog posts, images, the logo, and social links.

> _Crafting Luxury Dreams Into Reality._

---

## ✨ Features

- **6 pages** — Home, About Us, Services, Projects, Blog, Contact
- **Cinematic animations** — smooth inertia scrolling (Lenis), scroll-reveals,
  parallax, animated headlines, magnetic buttons, counters, marquee, scroll
  progress bar (Framer Motion)
- **Admin panel** at `/admin` — create / edit / delete blog posts (live Markdown
  preview), upload images, change the logo, edit contact details & social links
- **Dynamic blog** with SEO metadata, JSON-LD, related posts, reading time
- **Contact form** that stores enquiries (viewable in the dashboard)
- **SEO-ready** — metadata, OG/Twitter cards, `sitemap.xml`, `robots.txt`,
  JSON-LD, generated favicon + OG image
- **No third-party accounts to develop locally** — see below

## 🧱 Tech stack

| Concern        | Choice                                                |
| -------------- | ----------------------------------------------------- |
| Framework      | Next.js 15 (App Router) + TypeScript                  |
| Styling        | Tailwind CSS v4                                        |
| Animation      | Framer Motion + Lenis                                 |
| Database       | Vercel Postgres (Neon) — `@neondatabase/serverless`   |
| Image storage  | Vercel Blob — `@vercel/blob`                          |
| Admin auth     | Password + signed cookie (no external auth service)   |
| Hosting        | Vercel                                                |

### How storage works

The app uses a single store layer with two backends:

- **Locally** (no `DATABASE_URL` set) → content is saved to a JSON file in
  `.data/` and uploaded images to `public/uploads/`. **The admin works fully
  out of the box — no accounts, no setup.**
- **In production on Vercel** (with the database + blob linked) → content is
  saved to **Vercel Postgres** and images to **Vercel Blob**, editable live.

---

## 🚀 Local development

```bash
npm install
npm run dev
```

Open <http://localhost:4000>.

**Admin works immediately:** go to **`/admin`**, sign in with the password in
`.env.local` (default `ADMIN_PASSWORD=oliviya2026`), and create posts / change
the logo, images and socials. Everything persists locally in `.data/`.

> Change `ADMIN_PASSWORD` and `AUTH_SECRET` in `.env.local` to your own values.
> Generate a secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## ☁️ Deploy to Vercel

1. **Push** this project to a Git repo and **import** it at
   <https://vercel.com/new> (Vercel auto-detects Next.js).

2. **Add storage** (Vercel dashboard → your project → **Storage**):
   - **Create Database → Neon (Postgres)** → connect it to the project. Vercel
     injects `DATABASE_URL` automatically.
   - **Create → Blob** store → connect it. Vercel injects
     `BLOB_READ_WRITE_TOKEN` automatically.

3. **Add env vars** (Settings → Environment Variables):
   ```
   ADMIN_PASSWORD       = your-strong-password
   AUTH_SECRET          = a-long-random-string
   NEXT_PUBLIC_SITE_URL = https://your-domain.com
   ```
   (`DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` are added for you in step 2.)

4. **Create the database tables** — pull the env locally and run the setup once:
   ```bash
   npx vercel link        # link this folder to your Vercel project
   npx vercel env pull .env.local
   npm run db:setup       # creates posts / site_settings / leads tables
   ```
   (Alternatively, paste `db/schema.sql` into the Neon SQL editor in the Vercel
   Storage dashboard.)

5. **Redeploy.** Visit `/admin`, sign in, and you're managing the live site.

---

## 🔐 Using the admin panel

Go to **`/admin`** (linked in the footer) and sign in with `ADMIN_PASSWORD`.

- **Dashboard** — stats + latest contact enquiries
- **Blog Posts** — create / edit / publish / delete; Markdown with live preview;
  upload a cover image
- **Site Settings** — upload your **logo**, change **hero / about / feature
  images**, edit **phone / email / address**, set every **social link**

## 🎨 Customising content

- Company info, nav, services, process, stats — [`src/lib/site.ts`](src/lib/site.ts)
- Portfolio projects — [`src/lib/projects.ts`](src/lib/projects.ts)
- Demo blog posts (shown before any are created) — [`src/lib/seed.ts`](src/lib/seed.ts)
- Colours, fonts, motion — [`src/app/globals.css`](src/app/globals.css)

---

Built with care. Designed to last for generations.
