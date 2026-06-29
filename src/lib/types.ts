export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown
  cover_image: string | null;
  author: string;
  tags: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: string;
  year: string;
  area: string;
  image: string | null;
  blurb: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Video = {
  id: string;
  title: string;
  youtube_id: string; // canonical 11-char YouTube id
  description: string;
  category: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Pano = {
  id: string;
  title: string;
  room: string; // area / label, e.g. "Living Room"
  embed_url: string; // 360° viewer iframe URL (e.g. momento360)
  image: string | null; // optional gallery thumbnail
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Job = {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: string; // employment type, e.g. "Full-time"
  department: string;
  description: string;
  apply_email: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type SocialLinks = {
  website?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  pinterest?: string;
  kolo?: string;
  linkedin?: string;
  twitter?: string;
  /** WhatsApp number (any format) powering the floating chat button. */
  whatsapp?: string;
};

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  message: string;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  logo_url: string | null;
  hero_image: string | null;
  about_image: string | null;
  cta_image: string | null;
  phone: string;
  email: string;
  address: string;
  socials: SocialLinks;
  updated_at?: string;
};
