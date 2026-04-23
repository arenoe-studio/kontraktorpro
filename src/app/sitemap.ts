import type { MetadataRoute } from "next";
import { contractors } from "./(marketing)/_components/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kontraktorpro.app";

  const marketingRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/harga`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/direktori`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const contractorRoutes: MetadataRoute.Sitemap = contractors
    .filter((contractor) => contractor.active)
    .map((contractor) => ({
      url: `${baseUrl}/kontraktor/${contractor.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: contractor.packageTier === "Bisnis" ? 0.85 : contractor.packageTier === "Pro" ? 0.8 : 0.7,
    }));

  return [...marketingRoutes, ...contractorRoutes];
}
