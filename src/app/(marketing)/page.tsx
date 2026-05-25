import type { Metadata } from "next";
import { LandingPage } from "./_components/LandingPage";

export const metadata: Metadata = {
  title: "KontraktorPro — Kelola Proyek Lebih Rapi",
  description: "Platform manajemen proyek untuk kontraktor Indonesia dengan laporan harian, link pantau owner, dan profil publik terverifikasi.",
};

export default function Page() {
  return <LandingPage />;
}
