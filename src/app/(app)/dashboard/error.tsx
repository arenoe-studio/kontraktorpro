"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { SurfaceCard } from "../_components/ui";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error ke console untuk debugging (tidak ditampilkan ke user)
    console.error("[Dashboard Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <SurfaceCard className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="rounded-full bg-red-50 p-4 text-red-500">
          <AlertTriangle className="size-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-zinc-900">
            Gagal Memuat Dashboard
          </h2>
          <p className="text-sm leading-6 text-zinc-500">
            Terjadi kesalahan saat mengambil data dashboard Anda. Ini mungkin
            disebabkan oleh gangguan koneksi atau masalah sementara pada server.
          </p>
          {error.digest ? (
            <p className="font-mono text-xs text-zinc-400">
              Kode error: {error.digest}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-95"
        >
          Coba Lagi
        </button>
      </SurfaceCard>
    </div>
  );
}
