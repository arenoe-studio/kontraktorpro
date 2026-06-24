"use client";

import { useState } from "react";
import Link from "next/link";
import { FileStack, Loader2 } from "lucide-react";
import { Button } from "./ui";
import { generateProjectPdf, type PdfOptions } from "@/lib/services/pdf-client-service";
import { formatDate } from "./mock-data";

export function PdfModal({ project }: { project: any }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<PdfOptions>({
    includeWbs: true,
    includeTeam: true,
    includeContractValue: true,
    selectedReportIds: project.reports?.map((r: any) => r.id) || [],
  });

  const toggleReport = (reportId: string) => {
    setOptions((prev) => ({
      ...prev,
      selectedReportIds: prev.selectedReportIds.includes(reportId)
        ? prev.selectedReportIds.filter((id) => id !== reportId)
        : [...prev.selectedReportIds, reportId],
    }));
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateProjectPdf(project, options);
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-[28px] bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-zinc-900">Buat Laporan PDF</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Pengaturan ekspor untuk {project.name}
            </p>
          </div>
          <Link href={`/projects/${project.id}`} className="text-sm font-semibold text-zinc-500 hover:text-zinc-800">
            Tutup
          </Link>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Langkah 1 · Pilih Laporan
              </p>
              <div className="mt-4 space-y-2">
                {project.reports?.length > 0 ? (
                  project.reports.map((report: any) => (
                    <label
                      key={report.id}
                      className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-300"
                    >
                      <div>
                        <p className="font-semibold text-zinc-900">{formatDate(report.date)}</p>
                        <p className="text-sm text-zinc-500">
                          {report.photos} foto · {report.author}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={options.selectedReportIds.includes(report.id)}
                        onChange={() => toggleReport(report.id)}
                        className="size-4 accent-orange-500 cursor-pointer"
                      />
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500">Belum ada laporan harian.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Langkah 2 · Preview
              </p>
              <div className="mt-4 flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white text-center">
                <div className="space-y-2 px-6">
                  <FileStack className="mx-auto size-10 text-zinc-400" />
                  <p className="font-semibold text-zinc-900">Siap Diekspor</p>
                  <p className="text-sm text-zinc-500">
                    Dokumen PDF akan dibuat berdasarkan opsi yang Anda pilih.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-5 h-fit">
            <h4 className="font-semibold text-zinc-900">Opsi Tambahan</h4>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3 hover:bg-zinc-100">
                <span className="text-sm text-zinc-700">Sertakan ringkasan WBS</span>
                <input
                  type="checkbox"
                  checked={options.includeWbs}
                  onChange={(e) => setOptions(o => ({ ...o, includeWbs: e.target.checked }))}
                  className="size-4 accent-orange-500 cursor-pointer"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3 hover:bg-zinc-100">
                <span className="text-sm text-zinc-700">Sertakan daftar tim</span>
                <input
                  type="checkbox"
                  checked={options.includeTeam}
                  onChange={(e) => setOptions(o => ({ ...o, includeTeam: e.target.checked }))}
                  className="size-4 accent-orange-500 cursor-pointer"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3 hover:bg-zinc-100">
                <span className="text-sm text-zinc-700">Tampilkan nilai kontrak</span>
                <input
                  type="checkbox"
                  checked={options.includeContractValue}
                  onChange={(e) => setOptions(o => ({ ...o, includeContractValue: e.target.checked }))}
                  className="size-4 accent-orange-500 cursor-pointer"
                />
              </label>
            </div>
            
            <div className="pt-2">
              <Button className="w-full" onClick={handleDownload} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Membuat PDF...
                  </>
                ) : (
                  "Unduh PDF"
                )}
              </Button>
            </div>
            <Button variant="outline" className="w-full" disabled={isGenerating}>
              Salin Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
