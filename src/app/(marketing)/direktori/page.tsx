import type { Metadata } from "next";
import { DirectoriPage } from "../_components/DirectoriPage";

export const metadata: Metadata = {
  title: "Direktori Kontraktor",
  description: "Temukan kontraktor terpercaya berdasarkan kota, spesialisasi, dan rating.",
};

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string; specialty?: string; sort?: string; page?: string }>;
}) {
  return <DirectoriPage searchParams={searchParams} />;
}
