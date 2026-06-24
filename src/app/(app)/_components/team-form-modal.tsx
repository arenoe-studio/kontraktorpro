"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addTeamMemberAction } from "@/features/team/actions";
import { addTeamMemberSchema } from "@/features/team/schemas";
import { Button } from "./ui";
import { UserPlus } from "lucide-react";

export function TeamFormModal({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  type FormData = z.input<typeof addTeamMemberSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(addTeamMemberSchema),
    defaultValues: {
      projectId,
      name: "",
      role: "",
      phone: "",
    },
  });

  function onSubmit(data: FormData) {
    startTransition(async () => {
      const res = await addTeamMemberAction(data);
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
        <UserPlus className="size-4" />
        Tambah Anggota
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-zinc-900 mb-4">Tambah Anggota Tim</h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-zinc-700">Nama Lengkap</label>
                <input
                  {...form.register("name")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700">Peran / Posisi</label>
                <input
                  {...form.register("role")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="Contoh: Mandor"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-zinc-700">Nomor Telepon (Opsional)</label>
                <input
                  {...form.register("phone")}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  placeholder="0812..."
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
