import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/politica-de-privacidade", "/termos-de-uso"].map(
    (path) => ({
      url: `${publicEnv.siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: path ? "monthly" : "weekly",
      priority: path ? 0.8 : 1,
    }),
  );
}
