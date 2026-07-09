import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import {
  verifySessionToken,
  isAuthConfigured,
  SESSION_COOKIE,
} from "@/lib/auth";

export async function POST(request: Request) {
  // Auth gate — only a signed-in admin may upload.
  if (isAuthConfigured) {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const name = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;

  try {
    // Production (Vercel): store in Blob. Authenticates with either a
    // read-write token (BLOB_READ_WRITE_TOKEN) or OIDC (BLOB_STORE_ID +
    // VERCEL_OIDC_TOKEN) — both are auto-injected on Vercel when a Blob
    // store is connected to the project. put() picks up whichever is set.
    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) {
      const blob = await put(`media/${name}`, file, {
        access: "public",
        contentType: file.type || undefined,
      });
      return NextResponse.json({ url: blob.url });
    }

    // On Vercel the filesystem is read-only, so Blob is required there.
    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "Image storage isn't configured. Add a Vercel Blob store (BLOB_READ_WRITE_TOKEN) to enable uploads in production, or paste an image URL instead.",
        },
        { status: 503 },
      );
    }

    // Local dev: write to /public/uploads so it's served statically.
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, name), buffer);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 },
    );
  }
}
