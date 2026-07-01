"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as store from "@/lib/store";
import { DEFAULT_SETTINGS } from "@/lib/site";
import { slugify, youtubeId } from "@/lib/utils";

function str(v: FormDataEntryValue | null) {
  return (v ? String(v) : "").trim();
}

function refreshPublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

function readPostForm(formData: FormData) {
  const title = str(formData.get("title"));
  if (!title) throw new Error("Title is required");
  return {
    title,
    slug: str(formData.get("slug")) || slugify(title),
    excerpt: str(formData.get("excerpt")),
    content: str(formData.get("content")),
    cover_image: str(formData.get("cover_image")) || null,
    author: str(formData.get("author")) || "Oliviya Developers",
    tags: str(formData.get("tags"))
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    published: formData.get("published") === "on",
  };
}

/* -------------------------------- Posts -------------------------------- */

export async function createPost(formData: FormData) {
  const input = readPostForm(formData);
  await store.createPost(input);
  refreshPublic(input.slug);
  revalidatePath("/admin/blogs");
  redirect("/admin/blogs");
}

export async function updatePost(id: string, formData: FormData) {
  const input = readPostForm(formData);
  await store.updatePost(id, input);
  refreshPublic(input.slug);
  revalidatePath("/admin/blogs");
  redirect("/admin/blogs");
}

export async function deletePost(formData: FormData) {
  await store.deletePost(str(formData.get("id")));
  refreshPublic();
  revalidatePath("/admin/blogs");
}

/* ------------------------------- Projects ------------------------------ */

function refreshProjects() {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
}

function readProjectForm(formData: FormData) {
  const title = str(formData.get("title"));
  if (!title) throw new Error("Title is required");
  return {
    title,
    slug: str(formData.get("slug")) || slugify(title),
    location: str(formData.get("location")),
    category: str(formData.get("category")) || "Luxury Home",
    year: str(formData.get("year")),
    area: str(formData.get("area")),
    image: str(formData.get("image")) || null,
    blurb: str(formData.get("blurb")),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };
}

export async function createProject(formData: FormData) {
  await store.createProject(readProjectForm(formData));
  refreshProjects();
  redirect("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  await store.updateProject(id, readProjectForm(formData));
  refreshProjects();
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData) {
  await store.deleteProject(str(formData.get("id")));
  refreshProjects();
}

/* ------------------------------- Videos -------------------------------- */

function refreshVideos() {
  revalidatePath("/");
  revalidatePath("/youtube");
  revalidatePath("/admin/videos");
  revalidatePath("/admin");
}

function readVideoForm(formData: FormData) {
  const title = str(formData.get("title"));
  if (!title) throw new Error("Title is required");
  const youtube_id = youtubeId(str(formData.get("youtube_url")));
  if (!youtube_id) throw new Error("A valid YouTube URL or video ID is required");
  return {
    title,
    youtube_id,
    description: str(formData.get("description")),
    category: str(formData.get("category")) || "Video",
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  };
}

export async function createVideo(formData: FormData) {
  await store.createVideo(readVideoForm(formData));
  refreshVideos();
  redirect("/admin/videos");
}

export async function updateVideo(id: string, formData: FormData) {
  await store.updateVideo(id, readVideoForm(formData));
  refreshVideos();
  redirect("/admin/videos");
}

export async function deleteVideo(formData: FormData) {
  await store.deleteVideo(str(formData.get("id")));
  refreshVideos();
}

/* -------------------------------- Jobs --------------------------------- */

function refreshJobs() {
  revalidatePath("/");
  revalidatePath("/careers");
  revalidatePath("/admin/careers");
  revalidatePath("/admin");
}

function readJobForm(formData: FormData) {
  const title = str(formData.get("title"));
  if (!title) throw new Error("Title is required");
  return {
    title,
    slug: str(formData.get("slug")) || slugify(title),
    location: str(formData.get("location")),
    type: str(formData.get("type")) || "Full-time",
    department: str(formData.get("department")),
    description: str(formData.get("description")),
    apply_email: str(formData.get("apply_email")),
    published: formData.get("published") === "on",
  };
}

export async function createJob(formData: FormData) {
  await store.createJob(readJobForm(formData));
  refreshJobs();
  redirect("/admin/careers");
}

export async function updateJob(id: string, formData: FormData) {
  await store.updateJob(id, readJobForm(formData));
  refreshJobs();
  redirect("/admin/careers");
}

export async function deleteJob(formData: FormData) {
  await store.deleteJob(str(formData.get("id")));
  refreshJobs();
}

/* ------------------------------ 360° tours ----------------------------- */

function refreshPanos() {
  revalidatePath("/");
  revalidatePath("/admin/panoramas");
  revalidatePath("/admin");
}

function readPanoForm(formData: FormData) {
  const title = str(formData.get("title"));
  if (!title) throw new Error("Title is required");
  const embed_url = str(formData.get("embed_url"));
  if (!embed_url) throw new Error("A 360° embed URL is required");
  return {
    title,
    room: str(formData.get("room")),
    embed_url,
    image: str(formData.get("image")) || null,
    published: formData.get("published") === "on",
  };
}

export async function createPano(formData: FormData) {
  await store.createPano(readPanoForm(formData));
  refreshPanos();
  redirect("/admin/panoramas");
}

export async function updatePano(id: string, formData: FormData) {
  await store.updatePano(id, readPanoForm(formData));
  refreshPanos();
  redirect("/admin/panoramas");
}

export async function deletePano(formData: FormData) {
  await store.deletePano(str(formData.get("id")));
  refreshPanos();
}

/* ------------------------------ Settings ------------------------------ */

export async function updateSettings(formData: FormData) {
  await store.saveSettings({
    id: 1,
    logo_url: str(formData.get("logo_url")) || null,
    hero_image: str(formData.get("hero_image")) || null,
    about_image: str(formData.get("about_image")) || null,
    cta_image: str(formData.get("cta_image")) || null,
    phone: str(formData.get("phone")),
    email: str(formData.get("email")),
    address: str(formData.get("address")),
    socials: {
      website: str(formData.get("website")) || undefined,
      facebook: str(formData.get("facebook")) || undefined,
      instagram: str(formData.get("instagram")) || undefined,
      youtube: str(formData.get("youtube")) || undefined,
      pinterest: str(formData.get("pinterest")) || undefined,
      linkedin: str(formData.get("linkedin")) || undefined,
      twitter: str(formData.get("twitter")) || undefined,
      kolo: str(formData.get("kolo")) || undefined,
      whatsapp: str(formData.get("whatsapp")) || undefined,
    },
    // About page — consultant. Blank fields fall back to the defaults so the
    // section never renders empty.
    consultant_image: str(formData.get("consultant_image")) || DEFAULT_SETTINGS.consultant_image,
    consultant_name: str(formData.get("consultant_name")) || DEFAULT_SETTINGS.consultant_name,
    consultant_title: str(formData.get("consultant_title")) || DEFAULT_SETTINGS.consultant_title,
    consultant_bio: str(formData.get("consultant_bio")) || DEFAULT_SETTINGS.consultant_bio,
    consultant_cta_label:
      str(formData.get("consultant_cta_label")) || DEFAULT_SETTINGS.consultant_cta_label,
    consultant_cta_href:
      str(formData.get("consultant_cta_href")) || DEFAULT_SETTINGS.consultant_cta_href,
  });

  // Settings touch every public page.
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/admin/settings");
}
