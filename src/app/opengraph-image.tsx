import { ImageResponse } from "next/og";
import { COMPANY } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${COMPANY.legalName} — ${COMPANY.tagline}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(circle at 30% 20%, #1b1b1f, #0a0a0b 70%)",
          color: "#f5f1e8",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#c9a24b",
          }}
        >
          {COMPANY.legalName}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.05, maxWidth: 900 }}>
            Crafting Luxury Dreams
          </div>
          <div style={{ fontSize: 84, lineHeight: 1.05, color: "#c9a24b" }}>
            Into Reality
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#9c968b" }}>
          Bespoke luxury residences across {COMPANY.region}
        </div>
      </div>
    ),
    { ...size },
  );
}
