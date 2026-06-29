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
    // Production (Vercel): store in Blob.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`media/${name}`, file, {
        access: "public",
        contentType: file.type || undefined,
      });
      return NextResponse.json({ url: blob.url });
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
