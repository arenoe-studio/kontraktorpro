"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addMaterialInAction } from "@/features/materials/actions";
import { addMaterialSchema } from "@/features/materials/schemas";
import { Button } from "./ui";
import { Plus } from "lucide-react";

export function MaterialInFormModal({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  type FormData = z.input<typeof addMaterialSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(addMaterialSchema),
    defaultValues: {
      projectId,
      name: "",
      quantity: "",
      supplier: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  function onSubmit(data: FormData) {
    startTransition(async () => {
      const res = await addMaterialInAction(data);
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
        Catat Material Masuk
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Catat Material Masuk</h3>
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
                <label className="text-sm font-semibold text-zinc-700">Nama Material</label>
                <input
                  {...form.register("name")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="Contoh: Semen Portland"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700">Jumlah (Termasuk Satuan)</label>
                <input
                  {...form.register("quantity")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="Contoh: 100 Sak"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700">Supplier (Opsional)</label>
                <input
                  {...form.register("supplier")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="Nama Toko Bangunan..."
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
