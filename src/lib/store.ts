import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import { DEFAULT_SETTINGS } from "./site";
import { SEED_POSTS } from "./seed";
import { SEED_PROJECTS } from "./projects";
import { SEED_VIDEOS } from "./videos";
import { SEED_JOBS } from "./jobs";
import { SEED_PANOS } from "./panoramas";
import type { Post, Project, Video, Job, Pano, SiteSettings, Lead } from "./types";

/* ---------------------------------------------------------------------------
 * Backend selection
 *  - Postgres (Neon, provisioned via Vercel → Storage) when a connection
 *    string is present. This is what runs in production on Vercel.
 *  - A local JSON file otherwise, so the admin works instantly on your
 *    machine with no setup. (The local file isn't used on Vercel because the
 *    filesystem is read-only there — that's why production uses Postgres.)
 * ------------------------------------------------------------------------- */

const CONN =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  "";

export const isDbConfigured = Boolean(CONN);

type PostInput = Omit<Post, "id" | "created_at" | "updated_at">;
type ProjectInput = Omit<Project, "id" | "created_at" | "updated_at">;
type VideoInput = Omit<Video, "id" | "created_at" | "updated_at">;
type JobInput = Omit<Job, "id" | "created_at" | "updated_at">;
type PanoInput = Omit<Pano, "id" | "created_at" | "updated_at">;

/* --------------------------------- Mapping -------------------------------- */

function mapPost(row: Record<string, unknown>): Post {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    excerpt: String(row.excerpt ?? ""),
    content: String(row.content ?? ""),
    cover_image: (row.cover_image as string) ?? null,
    author: String(row.author ?? "Oliviya Developers"),
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    published: Boolean(row.published),
    created_at: new Date(row.created_at as string).toISOString(),
    updated_at: new Date(row.updated_at as string).toISOString(),
  };
}

function mapProject(row: Record<string, unknown>): Project {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    location: String(row.location ?? ""),
    category: String(row.category ?? ""),
    year: String(row.year ?? ""),
    area: String(row.area ?? ""),
    image: (row.image as string) ?? null,
    blurb: String(row.blurb ?? ""),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    created_at: new Date(row.created_at as string).toISOString(),
    updated_at: new Date(row.updated_at as string).toISOString(),
  };
}

function mapVideo(row: Record<string, unknown>): Video {
  return {
    id: String(row.id),
    title: String(row.title),
    youtube_id: String(row.youtube_id ?? ""),
    description: String(row.description ?? ""),
    category: String(row.category ?? ""),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    created_at: new Date(row.created_at as string).toISOString(),
    updated_at: new Date(row.updated_at as string).toISOString(),
  };
}

function mapPano(row: Record<string, unknown>): Pano {
  return {
    id: String(row.id),
    title: String(row.title),
    room: String(row.room ?? ""),
    embed_url: String(row.embed_url ?? ""),
    image: (row.image as string) ?? null,
    published: Boolean(row.published),
    created_at: new Date(row.created_at as string).toISOString(),
    updated_at: new Date(row.updated_at as string).toISOString(),
  };
}

function mapJob(row: Record<string, unknown>): Job {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    location: String(row.location ?? ""),
    type: String(row.type ?? ""),
    department: String(row.department ?? ""),
    description: String(row.description ?? ""),
    apply_email: String(row.apply_email ?? ""),
    published: Boolean(row.published),
    created_at: new Date(row.created_at as string).toISOString(),
    updated_at: new Date(row.updated_at as string).toISOString(),
  };
}

/* ============================ Postgres backend ============================ */

function db() {
  return neon(CONN);
}

async function pgGetPosts(includeDrafts: boolean): Promise<Post[]> {
  const sql = db();
  const rows = includeDrafts
    ? await sql`select * from posts order by created_at desc`
    : await sql`select * from posts where published = true order by created_at desc`;
  return rows.map(mapPost);
}

async function pgGetProjects(includeDrafts: boolean): Promise<Project[]> {
  const sql = db();
  const rows = includeDrafts
    ? await sql`select * from projects order by created_at desc`
    : await sql`select * from projects where published = true order by created_at desc`;
  return rows.map(mapProject);
}

async function pgGetVideos(includeDrafts: boolean): Promise<Video[]> {
  const sql = db();
  const rows = includeDrafts
    ? await sql`select * from videos order by created_at desc`
    : await sql`select * from videos where published = true order by created_at desc`;
  return rows.map(mapVideo);
}

async function pgGetJobs(includeDrafts: boolean): Promise<Job[]> {
  const sql = db();
  const rows = includeDrafts
    ? await sql`select * from jobs order by created_at desc`
    : await sql`select * from jobs where published = true order by created_at desc`;
  return rows.map(mapJob);
}

async function pgGetPanos(includeDrafts: boolean): Promise<Pano[]> {
  const sql = db();
  const rows = includeDrafts
    ? await sql`select * from panoramas order by created_at desc`
    : await sql`select * from panoramas where published = true order by created_at desc`;
  return rows.map(mapPano);
}

/* ============================== File backend ============================== */

type FileStore = {
  posts: Post[];
  projects: Project[];
  videos: Video[];
  jobs: Job[];
  panoramas: Pano[];
  settings: SiteSettings;
  leads: Lead[];
};

const FILE = path.join(process.cwd(), ".data", "store.json");

/**
 * In-memory copy of the store. Loaded/seeded once per process, then kept in
 * sync on every write. This is what makes the file backend safe on read-only
 * / serverless filesystems (e.g. Vercel without a database): reads always
 * succeed from memory, and a failed disk write never crashes a page. For real
 * persistence in production, set DATABASE_URL so the Postgres backend is used.
 */
let memory: FileStore | null = null;

function seededStore(): FileStore {
  return {
    posts: SEED_POSTS.map((p) => ({ ...p })),
    projects: SEED_PROJECTS.map((p) => ({ ...p })),
    videos: SEED_VIDEOS.map((v) => ({ ...v })),
    jobs: SEED_JOBS.map((j) => ({ ...j })),
    panoramas: SEED_PANOS.map((p) => ({ ...p })),
    settings: { ...DEFAULT_SETTINGS },
    leads: [],
  };
}

async function readFile(): Promise<FileStore> {
  if (memory) return memory;
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const data = JSON.parse(raw) as Partial<FileStore>;
    memory = {
      posts: data.posts ?? [],
      projects: data.projects ?? SEED_PROJECTS.map((p) => ({ ...p })),
      videos: data.videos ?? SEED_VIDEOS.map((v) => ({ ...v })),
      jobs: data.jobs ?? SEED_JOBS.map((j) => ({ ...j })),
      panoramas: data.panoramas ?? SEED_PANOS.map((p) => ({ ...p })),
      settings: { ...DEFAULT_SETTINGS, ...(data.settings ?? {}) },
      leads: data.leads ?? [],
    };
  } catch {
    // No file yet (first local run) or a read-only filesystem (Vercel). Seed
    // in memory and best-effort persist — never throw, so reads can't 500.
    memory = seededStore();
    await persist(memory);
  }
  return memory;
}

/** Best-effort write to disk. Swallows errors on read-only filesystems. */
async function persist(data: FileStore): Promise<void> {
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // Read-only / serverless filesystem — keep running on the in-memory copy.
    // Configure DATABASE_URL to persist changes in production.
  }
}

async function writeFile(data: FileStore): Promise<void> {
  memory = data; // keep the in-memory copy authoritative for this process
  await persist(data);
}

/* ================================ Reads ================================== */

export async function getPublishedPosts(): Promise<Post[]> {
  if (isDbConfigured) {
    try {
      const posts = await pgGetPosts(false);
      return posts.length ? posts : SEED_POSTS;
    } catch {
      return SEED_POSTS;
    }
  }
  const { posts } = await readFile();
  const pub = posts.filter((p) => p.published);
  return (pub.length ? pub : SEED_POSTS).sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );
}

export async function getAllPosts(): Promise<Post[]> {
  if (isDbConfigured) {
    try {
      return await pgGetPosts(true);
    } catch {
      return [];
    }
  }
  const { posts } = await readFile();
  return posts.sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isDbConfigured) {
    try {
      const sql = db();
      const rows = await sql`select * from posts where slug = ${slug} and published = true limit 1`;
      return rows[0] ? mapPost(rows[0]) : (SEED_POSTS.find((p) => p.slug === slug) ?? null);
    } catch {
      return SEED_POSTS.find((p) => p.slug === slug) ?? null;
    }
  }
  const { posts } = await readFile();
  return posts.find((p) => p.slug === slug && p.published)
    ?? SEED_POSTS.find((p) => p.slug === slug)
    ?? null;
}

export async function getPostById(id: string): Promise<Post | null> {
  if (isDbConfigured) {
    const sql = db();
    const rows = await sql`select * from posts where id = ${id} limit 1`;
    return rows[0] ? mapPost(rows[0]) : null;
  }
  const { posts } = await readFile();
  return posts.find((p) => p.id === id) ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return posts.map((p) => p.slug);
}

/* -------------------------------- Projects -------------------------------- */

export async function getPublishedProjects(): Promise<Project[]> {
  if (isDbConfigured) {
    try {
      const rows = await pgGetProjects(false);
      return rows.length ? rows : SEED_PROJECTS;
    } catch {
      return SEED_PROJECTS;
    }
  }
  const { projects } = await readFile();
  const pub = projects.filter((p) => p.published);
  return (pub.length ? pub : SEED_PROJECTS).sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const all = await getPublishedProjects();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getAllProjects(): Promise<Project[]> {
  if (isDbConfigured) {
    try {
      return await pgGetProjects(true);
    } catch {
      return [];
    }
  }
  const { projects } = await readFile();
  return projects.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isDbConfigured) {
    try {
      const sql = db();
      const rows = await sql`select * from projects where slug = ${slug} and published = true limit 1`;
      return rows[0] ? mapProject(rows[0]) : (SEED_PROJECTS.find((p) => p.slug === slug) ?? null);
    } catch {
      return SEED_PROJECTS.find((p) => p.slug === slug) ?? null;
    }
  }
  const { projects } = await readFile();
  return projects.find((p) => p.slug === slug && p.published)
    ?? SEED_PROJECTS.find((p) => p.slug === slug)
    ?? null;
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await getPublishedProjects();
  return projects.map((p) => p.slug);
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (isDbConfigured) {
    const sql = db();
    const rows = await sql`select * from projects where id = ${id} limit 1`;
    return rows[0] ? mapProject(rows[0]) : null;
  }
  const { projects } = await readFile();
  return projects.find((p) => p.id === id) ?? null;
}

export async function countProjects(): Promise<{ total: number; published: number }> {
  const projects = await getAllProjects();
  return { total: projects.length, published: projects.filter((p) => p.published).length };
}

/* -------------------------------- Videos --------------------------------- */

export async function getPublishedVideos(): Promise<Video[]> {
  if (isDbConfigured) {
    try {
      const rows = await pgGetVideos(false);
      return rows.length ? rows : SEED_VIDEOS;
    } catch {
      return SEED_VIDEOS;
    }
  }
  const { videos } = await readFile();
  const pub = videos.filter((v) => v.published);
  return (pub.length ? pub : SEED_VIDEOS).sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );
}

export async function getAllVideos(): Promise<Video[]> {
  if (isDbConfigured) {
    try {
      return await pgGetVideos(true);
    } catch {
      return [];
    }
  }
  const { videos } = await readFile();
  return videos.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

export async function getVideoById(id: string): Promise<Video | null> {
  if (isDbConfigured) {
    const sql = db();
    const rows = await sql`select * from videos where id = ${id} limit 1`;
    return rows[0] ? mapVideo(rows[0]) : null;
  }
  const { videos } = await readFile();
  return videos.find((v) => v.id === id) ?? null;
}

export async function countVideos(): Promise<{ total: number; published: number }> {
  const videos = await getAllVideos();
  return { total: videos.length, published: videos.filter((v) => v.published).length };
}

/* --------------------------------- Jobs ---------------------------------- */

export async function getPublishedJobs(): Promise<Job[]> {
  if (isDbConfigured) {
    try {
      const rows = await pgGetJobs(false);
      return rows.length ? rows : SEED_JOBS;
    } catch {
      return SEED_JOBS;
    }
  }
  const { jobs } = await readFile();
  const pub = jobs.filter((j) => j.published);
  return (pub.length ? pub : SEED_JOBS).sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );
}

export async function getAllJobs(): Promise<Job[]> {
  if (isDbConfigured) {
    try {
      return await pgGetJobs(true);
    } catch {
      return [];
    }
  }
  const { jobs } = await readFile();
  return jobs.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

export async function getJobById(id: string): Promise<Job | null> {
  if (isDbConfigured) {
    const sql = db();
    const rows = await sql`select * from jobs where id = ${id} limit 1`;
    return rows[0] ? mapJob(rows[0]) : null;
  }
  const { jobs } = await readFile();
  return jobs.find((j) => j.id === id) ?? null;
}

export async function countJobs(): Promise<{ total: number; published: number }> {
  const jobs = await getAllJobs();
  return { total: jobs.length, published: jobs.filter((j) => j.published).length };
}

/* ------------------------------ 360° tours ------------------------------- */

export async function getPublishedPanos(): Promise<Pano[]> {
  if (isDbConfigured) {
    try {
      const rows = await pgGetPanos(false);
      return rows.length ? rows : SEED_PANOS;
    } catch {
      return SEED_PANOS;
    }
  }
  const { panoramas } = await readFile();
  const pub = panoramas.filter((p) => p.published);
  return (pub.length ? pub : SEED_PANOS).sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  );
}

export async function getAllPanos(): Promise<Pano[]> {
  if (isDbConfigured) {
    try {
      return await pgGetPanos(true);
    } catch {
      return [];
    }
  }
  const { panoramas } = await readFile();
  return panoramas.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
}

export async function getPanoById(id: string): Promise<Pano | null> {
  if (isDbConfigured) {
    const sql = db();
    const rows = await sql`select * from panoramas where id = ${id} limit 1`;
    return rows[0] ? mapPano(rows[0]) : null;
  }
  const { panoramas } = await readFile();
  return panoramas.find((p) => p.id === id) ?? null;
}

export async function countPanos(): Promise<{ total: number; published: number }> {
  const panoramas = await getAllPanos();
  return { total: panoramas.length, published: panoramas.filter((p) => p.published).length };
}

export async function getSettings(): Promise<SiteSettings> {
  if (isDbConfigured) {
    try {
      const sql = db();
      const rows = await sql`select * from site_settings where id = 1 limit 1`;
      if (!rows[0]) return DEFAULT_SETTINGS;
      const r = rows[0] as Record<string, unknown>;
      return {
        ...DEFAULT_SETTINGS,
        ...r,
        socials: { ...DEFAULT_SETTINGS.socials, ...((r.socials as object) ?? {}) },
      } as SiteSettings;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  const { settings } = await readFile();
  return { ...DEFAULT_SETTINGS, ...settings, socials: { ...DEFAULT_SETTINGS.socials, ...settings.socials } };
}

export async function countPosts(): Promise<{ total: number; published: number }> {
  const posts = await getAllPosts();
  return { total: posts.length, published: posts.filter((p) => p.published).length };
}

export async function getRecentLeads(limit = 5): Promise<Lead[]> {
  if (isDbConfigured) {
    try {
      const sql = db();
      const rows = await sql`select * from leads order by created_at desc limit ${limit}`;
      return rows.map((r) => ({
        id: String(r.id),
        name: String(r.name),
        email: String(r.email),
        phone: (r.phone as string) ?? null,
        location: (r.location as string) ?? null,
        message: String(r.message),
        created_at: new Date(r.created_at as string).toISOString(),
      }));
    } catch {
      return [];
    }
  }
  const { leads } = await readFile();
  return leads.slice(-limit).reverse();
}

/* ================================ Writes ================================= */

export async function createPost(input: PostInput): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`
      insert into posts (slug, title, excerpt, content, cover_image, author, tags, published)
      values (${input.slug}, ${input.title}, ${input.excerpt}, ${input.content},
              ${input.cover_image}, ${input.author}, ${JSON.stringify(input.tags)}::jsonb, ${input.published})`;
    return;
  }
  const store = await readFile();
  const now = new Date().toISOString();
  store.posts.unshift({ ...input, id: randomUUID(), created_at: now, updated_at: now });
  await writeFile(store);
}

export async function updatePost(id: string, input: PostInput): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`
      update posts set
        slug = ${input.slug}, title = ${input.title}, excerpt = ${input.excerpt},
        content = ${input.content}, cover_image = ${input.cover_image},
        author = ${input.author}, tags = ${JSON.stringify(input.tags)}::jsonb,
        published = ${input.published}, updated_at = now()
      where id = ${id}`;
    return;
  }
  const store = await readFile();
  const idx = store.posts.findIndex((p) => p.id === id);
  if (idx >= 0) {
    store.posts[idx] = {
      ...store.posts[idx],
      ...input,
      updated_at: new Date().toISOString(),
    };
    await writeFile(store);
  }
}

export async function deletePost(id: string): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`delete from posts where id = ${id}`;
    return;
  }
  const store = await readFile();
  store.posts = store.posts.filter((p) => p.id !== id);
  await writeFile(store);
}

export async function createProject(input: ProjectInput): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`
      insert into projects (slug, title, location, category, year, area, image, blurb, featured, published)
      values (${input.slug}, ${input.title}, ${input.location}, ${input.category}, ${input.year},
              ${input.area}, ${input.image}, ${input.blurb}, ${input.featured}, ${input.published})`;
    return;
  }
  const store = await readFile();
  const now = new Date().toISOString();
  store.projects.unshift({ ...input, id: randomUUID(), created_at: now, updated_at: now });
  await writeFile(store);
}

export async function updateProject(id: string, input: ProjectInput): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`
      update projects set
        slug = ${input.slug}, title = ${input.title}, location = ${input.location},
        category = ${input.category}, year = ${input.year}, area = ${input.area},
        image = ${input.image}, blurb = ${input.blurb}, featured = ${input.featured},
        published = ${input.published}, updated_at = now()
      where id = ${id}`;
    return;
  }
  const store = await readFile();
  const idx = store.projects.findIndex((p) => p.id === id);
  if (idx >= 0) {
    store.projects[idx] = { ...store.projects[idx], ...input, updated_at: new Date().toISOString() };
    await writeFile(store);
  }
}

export async function deleteProject(id: string): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`delete from projects where id = ${id}`;
    return;
  }
  const store = await readFile();
  store.projects = store.projects.filter((p) => p.id !== id);
  await writeFile(store);
}

/* -------------------------------- Videos --------------------------------- */

export async function createVideo(input: VideoInput): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`
      insert into videos (title, youtube_id, description, category, featured, published)
      values (${input.title}, ${input.youtube_id}, ${input.description},
              ${input.category}, ${input.featured}, ${input.published})`;
    return;
  }
  const store = await readFile();
  const now = new Date().toISOString();
  store.videos.unshift({ ...input, id: randomUUID(), created_at: now, updated_at: now });
  await writeFile(store);
}

export async function updateVideo(id: string, input: VideoInput): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`
      update videos set
        title = ${input.title}, youtube_id = ${input.youtube_id},
        description = ${input.description}, category = ${input.category},
        featured = ${input.featured}, published = ${input.published}, updated_at = now()
      where id = ${id}`;
    return;
  }
  const store = await readFile();
  const idx = store.videos.findIndex((v) => v.id === id);
  if (idx >= 0) {
    store.videos[idx] = { ...store.videos[idx], ...input, updated_at: new Date().toISOString() };
    await writeFile(store);
  }
}

export async function deleteVideo(id: string): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`delete from videos where id = ${id}`;
    return;
  }
  const store = await readFile();
  store.videos = store.videos.filter((v) => v.id !== id);
  await writeFile(store);
}

/* --------------------------------- Jobs ---------------------------------- */

export async function createJob(input: JobInput): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`
      insert into jobs (slug, title, location, type, department, description, apply_email, published)
      values (${input.slug}, ${input.title}, ${input.location}, ${input.type},
              ${input.department}, ${input.description}, ${input.apply_email}, ${input.published})`;
    return;
  }
  const store = await readFile();
  const now = new Date().toISOString();
  store.jobs.unshift({ ...input, id: randomUUID(), created_at: now, updated_at: now });
  await writeFile(store);
}

export async function updateJob(id: string, input: JobInput): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`
      update jobs set
        slug = ${input.slug}, title = ${input.title}, location = ${input.location},
        type = ${input.type}, department = ${input.department},
        description = ${input.description}, apply_email = ${input.apply_email},
        published = ${input.published}, updated_at = now()
      where id = ${id}`;
    return;
  }
  const store = await readFile();
  const idx = store.jobs.findIndex((j) => j.id === id);
  if (idx >= 0) {
    store.jobs[idx] = { ...store.jobs[idx], ...input, updated_at: new Date().toISOString() };
    await writeFile(store);
  }
}

export async function deleteJob(id: string): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`delete from jobs where id = ${id}`;
    return;
  }
  const store = await readFile();
  store.jobs = store.jobs.filter((j) => j.id !== id);
  await writeFile(store);
}

/* ------------------------------ 360° tours ------------------------------- */

export async function createPano(input: PanoInput): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`
      insert into panoramas (title, room, embed_url, image, published)
      values (${input.title}, ${input.room}, ${input.embed_url}, ${input.image}, ${input.published})`;
    return;
  }
  const store = await readFile();
  const now = new Date().toISOString();
  store.panoramas.unshift({ ...input, id: randomUUID(), created_at: now, updated_at: now });
  await writeFile(store);
}

export async function updatePano(id: string, input: PanoInput): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`
      update panoramas set
        title = ${input.title}, room = ${input.room}, embed_url = ${input.embed_url},
        image = ${input.image}, published = ${input.published}, updated_at = now()
      where id = ${id}`;
    return;
  }
  const store = await readFile();
  const idx = store.panoramas.findIndex((p) => p.id === id);
  if (idx >= 0) {
    store.panoramas[idx] = { ...store.panoramas[idx], ...input, updated_at: new Date().toISOString() };
    await writeFile(store);
  }
}

export async function deletePano(id: string): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`delete from panoramas where id = ${id}`;
    return;
  }
  const store = await readFile();
  store.panoramas = store.panoramas.filter((p) => p.id !== id);
  await writeFile(store);
}

export async function saveSettings(s: SiteSettings): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`
      insert into site_settings (id, logo_url, hero_image, about_image, cta_image, phone, email, address, socials, updated_at)
      values (1, ${s.logo_url}, ${s.hero_image}, ${s.about_image}, ${s.cta_image},
              ${s.phone}, ${s.email}, ${s.address}, ${JSON.stringify(s.socials)}::jsonb, now())
      on conflict (id) do update set
        logo_url = excluded.logo_url, hero_image = excluded.hero_image,
        about_image = excluded.about_image, cta_image = excluded.cta_image,
        phone = excluded.phone, email = excluded.email, address = excluded.address,
        socials = excluded.socials, updated_at = now()`;
    return;
  }
  const store = await readFile();
  store.settings = s;
  await writeFile(store);
}

export async function createLead(
  lead: Omit<Lead, "id" | "created_at">,
): Promise<void> {
  if (isDbConfigured) {
    const sql = db();
    await sql`
      insert into leads (name, email, phone, location, message)
      values (${lead.name}, ${lead.email}, ${lead.phone}, ${lead.location}, ${lead.message})`;
    return;
  }
  const store = await readFile();
  store.leads.push({ ...lead, id: randomUUID(), created_at: new Date().toISOString() });
  await writeFile(store);
}
