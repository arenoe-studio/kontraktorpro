"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createDailyReportAction } from "@/features/reports/actions";
import { dailyReportSchema } from "@/features/reports/schemas";
import { Button } from "./ui";
import { Plus } from "lucide-react";

export function ReportFormModal({ 
  projectId, 
  trigger 
}: { 
  projectId: string;
  trigger?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  type FormData = z.input<typeof dailyReportSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(dailyReportSchema),
    defaultValues: {
      projectId,
      status: "submitted",
      weather: "Cerah",
      hasIssue: false,
      notes: "",
      reportDate: new Date().toISOString().split("T")[0],
    },
  });

  function onSubmit(data: FormData) {
    startTransition(async () => {
      const res = await createDailyReportAction(data as z.infer<typeof dailyReportSchema>);
      if (res.success) {
        setIsOpen(false);
        form.reset();
      } else {
        alert(res.error);
      }
    });
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)} className="inline-block w-full">
          {trigger}
        </div>
      ) : (
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="size-4" />
          Buat Laporan Hari Ini
        </Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Buat Laporan Harian</h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-700">Tanggal Laporan</label>
                <input
                  type="date"
                  {...form.register("reportDate")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700">Cuaca</label>
                <select
                  {...form.register("weather")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white"
                >
                  <option value="Cerah">Cerah</option>
                  <option value="Berawan">Berawan</option>
                  <option value="Hujan">Hujan</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 mt-2">
                  <input type="checkbox" {...form.register("hasIssue")} />
                  <span className="text-sm font-semibold text-zinc-700">Ada kendala lapangan</span>
                </label>
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700">Catatan Pekerjaan</label>
                <textarea
                  {...form.register("notes")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm min-h-24"
                  placeholder="Jelaskan pekerjaan hari ini..."
                />
              </div>
              
              <div className="pt-4 flex gap-3 justify-end">
                <Button variant="ghost" type="button" onClick={() => setIsOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Menyimpan..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
