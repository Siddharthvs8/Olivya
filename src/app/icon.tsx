import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getSettings } from "@/lib/data";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Turn the admin logo into something <img> can render inside ImageResponse. */
async function resolveLogo(logoUrl: string): Promise<string | null> {
  // Absolute URL (e.g. Vercel Blob in production) — use directly.
  if (/^https?:\/\//.test(logoUrl)) return logoUrl;
  // Local upload under /public — inline it as a data URI.
  try {
    const file = path.join(process.cwd(), "public", logoUrl.replace(/^\//, ""));
    const buf = await readFile(file);
    const ext = path.extname(file).slice(1).toLowerCase();
    const mime = ext === "svg" ? "image/svg+xml" : ext === "jpg" ? "image/jpeg" : `image/${ext}`;
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Icon() {
  const settings = await getSettings();
  const logo = settings.logo_url ? await resolveLogo(settings.logo_url) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt=""
            width={58}
            height={58}
            style={{ width: 58, height: 58, objectFit: "contain" }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#c9a24b",
              fontSize: 42,
              fontWeight: 700,
              fontFamily: "Georgia, serif",
            }}
          >
            O
          </div>
        )}
      </div>
    ),
    { ...size },
  );
}
