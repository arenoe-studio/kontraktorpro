import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/harga", "/direktori", "/kontraktor/"],
        disallow: ["/pantau/"],
      },
    ],
    sitemap: "https://kontraktorpro.app/sitemap.xml",
  };
}

