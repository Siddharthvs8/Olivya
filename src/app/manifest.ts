import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COMPANY.legalName,
    short_name: COMPANY.name,
    description: COMPANY.shortPitch,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    icons: [{ src: "/icon", sizes: "64x64", type: "image/png" }],
  };
}
