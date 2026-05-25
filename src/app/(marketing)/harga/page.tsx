import type { Metadata } from "next";
import { HargaPage } from "../_components/HargaPage";

export const metadata: Metadata = {
  title: "Harga KontraktorPro",
  description: "Bandingkan paket Gratis, Pro, dan Bisnis untuk mengelola proyek kontraktor lebih rapi.",
};

export default function Page() {
  return <HargaPage />;
}
