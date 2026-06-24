"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createWbsItemAction, updateWbsItemAction } from "@/features/wbs/actions";
import { wbsItemSchema } from "@/features/wbs/schemas";
import { Button } from "./ui";
import { Plus } from "lucide-react";
import { type Project } from "./mock-data";

type WbsItem = Project["wbs"][number];

export function WbsFormModal({ projectId, wbsItem }: { projectId: string; wbsItem?: WbsItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  type FormData = z.input<typeof wbsItemSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(wbsItemSchema),
    defaultValues: {
      projectId,
      name: wbsItem?.name || "",
      category: wbsItem?.category || "",
      weight: wbsItem?.weight || 0,
      progress: wbsItem?.progress || 0,
      status: wbsItem?.status || "Belum Dimulai",
    },
  });

  function onSubmit(data: FormData) {
    startTransition(async () => {
      if (wbsItem?.id) {
        const res = await updateWbsItemAction({ id: wbsItem.id, ...data });
        if (res.success) {
          setIsOpen(false);
          form.reset();
        } else {
          alert(res.error);
        }
      } else {
        const res = await createWbsItemAction(data as z.infer<typeof wbsItemSchema>);
        if (res.success) {
          setIsOpen(false);
          form.reset();
        } else {
          alert(res.error);
        }
      }
    });
  }

  // To prevent stale data when re-opening form for editing
  function handleOpen() {
    form.reset({
      projectId,
      name: wbsItem?.name || "",
      category: wbsItem?.category || "",
      weight: wbsItem?.weight || 0,
      progress: wbsItem?.progress || 0,
      status: wbsItem?.status || "Belum Dimulai",
    });
    setIsOpen(true);
  }

  return (
    <>
      {wbsItem ? (
        <Button variant="ghost" size="sm" onClick={handleOpen}>
          Edit
        </Button>
      ) : (
        <Button onClick={handleOpen}>
          <Plus className="size-4" />
          Tambah Item
        </Button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-zinc-900 mb-4">
              {wbsItem ? "Edit Item WBS" : "Tambah Item WBS"}
            </h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-700">Nama Pekerjaan</label>
                <input
                  {...form.register("name")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="Contoh: Pondasi Batu Kali"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700">Kategori</label>
                <input
                  {...form.register("category")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="Contoh: Pekerjaan Tanah"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-zinc-700">Bobot (%)</label>
                  <input
                    type="number"
                    {...form.register("weight", { valueAsNumber: true })}
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-zinc-700">Progress (%)</label>
                  <input
                    type="number"
                    {...form.register("progress", { valueAsNumber: true })}
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-zinc-700">Status</label>
                <select
                  {...form.register("status")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                >
                  <option value="Belum Dimulai">Belum Dimulai</option>
                  <option value="Dalam Pengerjaan">Dalam Pengerjaan</option>
                  <option value="Tertunda">Tertunda</option>
                  <option value="Selesai">Selesai</option>
                </select>
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
