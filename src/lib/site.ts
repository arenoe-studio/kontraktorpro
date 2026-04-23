import type { Metadata } from "next";

export const siteConfig = {
  name: "KontraktorPro",
  shortName: "KontraktorPro",
  description:
    "Platform manajemen proyek untuk kontraktor Indonesia dengan laporan harian, monitoring owner, dan portofolio publik.",
  url: "https://kontraktorpro.local",
  locale: "id_ID",
  links: {
    whatsapp: "https://wa.me/6281234567890",
  },
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "kontraktor",
    "manajemen proyek",
    "laporan harian",
    "portofolio kontraktor",
    "monitoring proyek",
  ],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};
