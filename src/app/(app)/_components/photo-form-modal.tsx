"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addPhotoAction } from "@/features/photos/actions";
import { addPhotoSchema } from "@/features/photos/schemas";
import { Button } from "./ui";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function PhotoFormModal({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const currentUrl = form.watch("url");

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Hanya file gambar yang diperbolehkan");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload gagal");

      form.setValue("url", data.url);
      toast.success("Foto berhasil diunggah");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setIsUploading(false);
    }
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  function onSubmit(data: FormData) {
    if (!data.url) {
      toast.error("Silakan unggah foto terlebih dahulu");
      return;
    }
    startTransition(async () => {
      const res = await addPhotoAction(data);
      if (res.success) {
        setIsOpen(false);
        form.reset();
        toast.success("Dokumentasi berhasil disimpan");
      } else {
        toast.error(res.error ?? "Gagal menyimpan dokumentasi");
      }
    });
  }

  function handleClose() {
    setIsOpen(false);
    form.reset();
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Upload className="size-4" />
        Upload Foto Dokumentasi
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-zinc-900">Upload Foto Dokumentasi</h3>
              <button
                onClick={handleClose}
                className="flex items-center justify-center rounded-full w-8 h-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Upload Area */}
              <div>
                <label className="text-sm font-semibold text-zinc-700 block mb-2">
                  Pilih Foto
                </label>

                {currentUrl ? (
                  /* Preview */
                  <div className="relative rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50 aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={currentUrl}
                      alt="Preview foto"
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => form.setValue("url", "")}
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Dropzone */
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`
                      relative flex flex-col items-center justify-center gap-3
                      rounded-2xl border-2 border-dashed py-10 px-6
                      cursor-pointer transition-colors select-none
                      ${isDragging
                        ? "border-orange-400 bg-orange-50"
                        : "border-zinc-300 bg-zinc-50 hover:border-orange-400 hover:bg-orange-50/40"
                      }
                      ${isUploading ? "cursor-not-allowed opacity-70" : ""}
                    `}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="size-9 text-orange-500 animate-spin" />
                        <p className="text-sm font-semibold text-zinc-700">Mengunggah...</p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-100">
                          <ImageIcon className="size-7 text-zinc-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-zinc-700">
                            Drag &amp; drop foto ke sini
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            atau <span className="text-orange-500 font-semibold">klik untuk memilih</span>
                          </p>
                          <p className="text-xs text-zinc-400 mt-2">PNG, JPG, WEBP · Maks. 5MB</p>
                        </div>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                        e.target.value = "";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* WBS Item */}
              <div>
                <label className="text-sm font-semibold text-zinc-700">
                  Item Pekerjaan (WBS)
                </label>
                <input
                  {...form.register("wbsItemName")}
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Contoh: Pengecoran Lantai 2"
                />
              </div>

              {/* Angle */}
              <div>
                <label className="text-sm font-semibold text-zinc-700">
                  Keterangan / Sudut <span className="text-red-500">*</span>
                </label>
                <input
                  {...form.register("angle")}
                  className="mt-1 w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Contoh: Tampak Depan"
                />
                {form.formState.errors.angle && (
                  <p className="mt-1 text-xs text-red-500">
                    {form.formState.errors.angle.message}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3 justify-end">
                <Button variant="ghost" type="button" onClick={handleClose}>
                  Batal
                </Button>
                <Button type="submit" disabled={isPending || !currentUrl || isUploading}>
                  {isPending ? "Menyimpan..." : "Simpan Dokumentasi"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
