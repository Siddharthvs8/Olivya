-- =============================================================================
--  OLIVIYA DEVELOPERS — Postgres schema (Vercel / Neon)
--  Apply with:  npm run db:setup
--  (or paste into the Neon SQL editor in your Vercel → Storage dashboard)
-- =============================================================================

create table if not exists posts (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  excerpt     text not null default '',
  content     text not null default '',
  cover_image text,
  author      text not null default 'Oliviya Developers',
  tags        jsonb not null default '[]'::jsonb,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists posts_published_created_idx
  on posts (published, created_at desc);

create table if not exists projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  location    text not null default '',
  category    text not null default '',
  year        text not null default '',
  area        text not null default '',
  image       text,
  blurb       text not null default '',
  featured    boolean not null default false,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists projects_published_created_idx
  on projects (published, created_at desc);

create table if not exists videos (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  youtube_id  text not null,
  description text not null default '',
  category    text not null default '',
  featured    boolean not null default false,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists videos_published_created_idx
  on videos (published, created_at desc);

create table if not exists jobs (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  location    text not null default '',
  type        text not null default '',
  department  text not null default '',
  description text not null default '',
  apply_email text not null default '',
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists jobs_published_created_idx
  on jobs (published, created_at desc);

create table if not exists panoramas (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  room        text not null default '',
  embed_url   text not null,
  image       text,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists panoramas_published_created_idx
  on panoramas (published, created_at desc);

create table if not exists site_settings (
  id          int primary key default 1,
  logo_url    text,
  hero_image  text,
  about_image text,
  cta_image   text,
  phone       text not null default '',
  email       text not null default '',
  address     text not null default '',
  socials     jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

create table if not exists leads (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  location   text,
  message    text not null,
  created_at timestamptz not null default now()
);
