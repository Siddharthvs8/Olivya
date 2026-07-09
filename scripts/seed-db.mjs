// One-time data seeding for Vercel/Neon Postgres.
//   node --env-file=.env.local scripts/seed-db.mjs   (or any env file with DATABASE_URL)
//
// Loads the built-in SEED_* content (the same data the public site falls back
// to when the DB is empty) into the database so it shows up in /admin as real,
// editable/deletable rows. Idempotent: only seeds a table when it is empty and
// uses ON CONFLICT, so it is safe to run more than once.

import { neon } from "@neondatabase/serverless";
import { readFile } from "node:fs/promises";
import { SEED_PROJECTS } from "../src/lib/projects.ts";
import { SEED_POSTS } from "../src/lib/seed.ts";
import { SEED_VIDEOS } from "../src/lib/videos.ts";
import { SEED_JOBS } from "../src/lib/jobs.ts";
import { SEED_PANOS } from "../src/lib/panoramas.ts";
import { DEFAULT_SETTINGS } from "../src/lib/site.ts";

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

if (!url) {
  console.error("\n✗ No database URL found (DATABASE_URL / POSTGRES_URL).\n");
  process.exit(1);
}

const sql = neon(url);
const TABLES = ["projects", "posts", "videos", "jobs", "panoramas", "site_settings", "leads"];
const ts = (v) => v || new Date().toISOString();

async function counts() {
  const out = {};
  for (const t of TABLES) {
    try {
      const r = await sql(`select count(*)::int as n from ${t}`);
      out[t] = r[0].n;
    } catch (e) {
      out[t] = `ERR(${String(e.message).split("\n")[0]})`;
    }
  }
  return out;
}
async function isEmpty(t) {
  const r = await sql(`select count(*)::int as n from ${t}`);
  return r[0].n === 0;
}

try {
  // 1) Ensure tables exist (idempotent DDL).
  const ddl = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
  for (const st of ddl.split(";").map((s) => s.replace(/--.*$/gm, "").trim()).filter(Boolean)) {
    await sql(st);
  }

  console.log("BEFORE:", JSON.stringify(await counts()));

  // 2) Seed each content table only when it is empty.
  if (await isEmpty("projects"))
    for (const p of SEED_PROJECTS)
      await sql`insert into projects (slug,title,location,category,year,area,image,blurb,featured,published,created_at,updated_at)
        values (${p.slug},${p.title},${p.location},${p.category},${p.year},${p.area},${p.image},${p.blurb},${p.featured},${p.published},${ts(p.created_at)},${ts(p.updated_at)})
        on conflict (slug) do nothing`;

  if (await isEmpty("posts"))
    for (const p of SEED_POSTS)
      await sql`insert into posts (slug,title,excerpt,content,cover_image,author,tags,published,created_at,updated_at)
        values (${p.slug},${p.title},${p.excerpt},${p.content},${p.cover_image},${p.author},${JSON.stringify(p.tags ?? [])}::jsonb,${p.published},${ts(p.created_at)},${ts(p.updated_at)})
        on conflict (slug) do nothing`;

  if (await isEmpty("videos"))
    for (const v of SEED_VIDEOS)
      await sql`insert into videos (title,youtube_id,description,category,featured,published,created_at,updated_at)
        values (${v.title},${v.youtube_id},${v.description},${v.category},${v.featured},${v.published},${ts(v.created_at)},${ts(v.updated_at)})`;

  if (await isEmpty("jobs"))
    for (const j of SEED_JOBS)
      await sql`insert into jobs (slug,title,location,type,department,description,apply_email,published,created_at,updated_at)
        values (${j.slug},${j.title},${j.location},${j.type},${j.department},${j.description},${j.apply_email},${j.published},${ts(j.created_at)},${ts(j.updated_at)})
        on conflict (slug) do nothing`;

  if (await isEmpty("panoramas"))
    for (const p of SEED_PANOS)
      await sql`insert into panoramas (title,room,embed_url,image,published,created_at,updated_at)
        values (${p.title},${p.room},${p.embed_url},${p.image},${p.published},${ts(p.created_at)},${ts(p.updated_at)})`;

  // 3) Site settings: fill row 1 with the bundled defaults only if still blank.
  const s = (await sql`select phone, email, address from site_settings where id = 1`)[0];
  if (!s || (!s.phone && !s.email && !s.address)) {
    const d = DEFAULT_SETTINGS;
    await sql`insert into site_settings (id, logo_url, hero_image, about_image, cta_image, phone, email, address, socials)
      values (1, ${d.logo_url}, ${d.hero_image}, ${d.about_image}, ${d.cta_image}, ${d.phone}, ${d.email}, ${d.address}, ${JSON.stringify(d.socials)}::jsonb)
      on conflict (id) do update set
        hero_image = excluded.hero_image, about_image = excluded.about_image, cta_image = excluded.cta_image,
        phone = excluded.phone, email = excluded.email, address = excluded.address, socials = excluded.socials`;
  }

  console.log("AFTER: ", JSON.stringify(await counts()));
  console.log("\n✓ Seed complete.\n");
} catch (err) {
  console.error("\n✗ Seed failed:", err.message, "\n");
  process.exit(1);
}
