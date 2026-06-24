"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addPhotoAction } from "@/features/photos/actions";
import { addPhotoSchema } from "@/features/photos/schemas";
import { Button } from "./ui";
import { Upload } from "lucide-react";

export function PhotoFormModal({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  type FormData = z.input<typeof addPhotoSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(addPhotoSchema),
    defaultValues: {
      projectId,
      wbsItemName: "",
      angle: "",
      url: "",
    },
  });

  function onSubmit(data: FormData) {
    startTransition(async () => {
      const res = await addPhotoAction(data);
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
        <Upload className="size-4" />
        Upload Foto Manual
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Upload Foto Dokumentasi</h3>
            <p className="text-sm text-zinc-500 mb-4">
              (Mock flow: Untuk sementara masukkan URL gambar langsung)
            </p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-700">URL Gambar</label>
                <input
                  {...form.register("url")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="https://images.unsplash.com/..."
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
                <label className="text-sm font-semibold text-zinc-700">Keterangan / Sudut</label>
                <input
                  {...form.register("angle")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="Contoh: Tampak Depan"
                />
              </div>
              
              <div className="pt-4 flex gap-3 justify-end">
                <Button variant="ghost" type="button" onClick={() => setIsOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Mengunggah..." : "Unggah"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
