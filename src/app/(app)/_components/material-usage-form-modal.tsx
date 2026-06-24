"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addMaterialUsageAction } from "@/features/materials/actions";
import { useMaterialSchema } from "@/features/materials/schemas";
import { Button } from "./ui";
import { Plus } from "lucide-react";

export function MaterialUsageFormModal({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  type FormData = z.input<typeof useMaterialSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(useMaterialSchema),
    defaultValues: {
      projectId,
      wbsItemName: "",
      materialName: "",
      quantity: "",
      note: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  function onSubmit(data: FormData) {
    startTransition(async () => {
      const res = await addMaterialUsageAction(data);
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
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="size-4" />
        Catat Pemakaian
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Catat Pemakaian Material</h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-700">Tanggal</label>
                <input
                  type="date"
                  {...form.register("date")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700">Item Pekerjaan (WBS)</label>
                <input
                  {...form.register("wbsItemName")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="Contoh: Pengecoran Lantai 2"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700">Nama Material</label>
                <input
                  {...form.register("materialName")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="Contoh: Semen Portland"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700">Jumlah Terpakai</label>
                <input
                  {...form.register("quantity")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="Contoh: 15 Sak"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700">Catatan (Opsional)</label>
                <input
                  {...form.register("note")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="Tambahan keterangan..."
                />
              </div>
              
              <div className="pt-4 flex gap-3 justify-end">
                <Button variant="ghost" type="button" onClick={() => setIsOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
