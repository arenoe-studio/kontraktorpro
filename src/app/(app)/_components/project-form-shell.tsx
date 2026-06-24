"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CalendarDays, CircleDollarSign, MapPin, UserRound } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { projectSchema } from "@/features/projects/schemas";
import { createProjectAction, updateProjectAction } from "@/features/projects/actions";
import { Button, ProjectMetaList, SectionHeader, SurfaceCard, palette } from "./ui";

// Mock data project type from mock-data, wait actually we shouldn't rely on mock-data if it's the actual DB project.
// We'll define a quick local type or import from db.
type ProjectData = {
  id: string;
  name: string;
  type: string;
  owner: string; // Wait, DB is ownerName
  location: string;
  status: string;
  targetDate?: string;
  contractValue?: number;
};

const templates = [
  {
    title: "Rumah 1 Lantai",
    description: "Fondasi, struktur, atap, MEP, dan finishing hunian standar.",
  },
  {
    title: "Renovasi",
    description: "Pembongkaran, perbaikan struktur ringan, finishing, dan MEP.",
  },
  {
    title: "Ruko",
    description: "Struktur bertingkat, fasad, partisi, dan utilitas komersial.",
  },
  {
    title: "Mulai dari Kosong",
    description: "Siapkan proyek tanpa template WBS awal.",
  },
];

type FormData = z.infer<typeof projectSchema>;

function Field({
  label,
  placeholder,
  icon,
  as = "input",
  error,
  ...props
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  as?: "input" | "textarea" | "select";
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  const baseClassName =
    "mt-2 min-h-11 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-400";
  
  const borderClass = error ? "border-red-500" : "border-zinc-200 focus:border-zinc-400";

  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      <div className="relative mt-2">
        <div className="pointer-events-none absolute left-4 top-3.5 text-zinc-400">{icon}</div>
        {as === "textarea" ? (
          <textarea
            {...(props as any)}
            placeholder={placeholder}
            className={`${baseClassName} ${borderClass} min-h-28 pl-11`}
          />
        ) : as === "select" ? (
          <select {...(props as any)} className={`${baseClassName} ${borderClass} pl-11`}>
            <option value="Rumah Tinggal Baru">Rumah Tinggal Baru</option>
            <option value="Renovasi">Renovasi</option>
            <option value="Ruko">Ruko</option>
            <option value="Gedung">Gedung</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        ) : (
          <input {...(props as any)} placeholder={placeholder} className={`${baseClassName} ${borderClass} pl-11`} />
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </label>
  );
}

export function ProjectFormShell({
  mode,
  project,
}: {
  mode: "create" | "edit";
  project?: ProjectData;
}) {
  const isEdit = mode === "edit";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      type: project?.type || "Renovasi",
      ownerName: project?.owner || "",
      location: project?.location || "",
      contractValue: project?.contractValue || 0,
      targetDate: project?.targetDate || "",
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      let result;
      if (isEdit && project) {
        result = await updateProjectAction(project.id, data);
      } else {
        result = await createProjectAction(data);
      }

      if (result.success) {
        toast.success(isEdit ? "Proyek berhasil diperbarui!" : "Proyek berhasil dibuat!");
        router.push(`/projects/${result.projectId}`);
        router.refresh();
      } else {
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, msg]) => {
            setError(field as keyof FormData, { message: msg });
          });
        }
        if (result.message) {
          toast.error(result.message);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link href={isEdit && project ? `/projects/${project.id}` : "/projects"} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-800">
          <ArrowLeft className="size-4" />
          {isEdit ? "Kembali ke detail proyek" : "Kembali ke daftar proyek"}
        </Link>
        <SectionHeader
          title={isEdit ? "Edit Informasi Proyek" : "Buat Proyek Baru"}
          description={
            isEdit
              ? "Ubah detail proyek Anda di sini."
              : "Isi data inti proyek. Template WBS akan dibuat secara otomatis berdasarkan pilihan."
          }
        />
      </div>

      {project ? (
        <ProjectMetaList
          items={[
            { label: "Status", value: project.status.toUpperCase() },
            { label: "Owner", value: project.owner },
            { label: "Lokasi", value: project.location },
            { label: "Target", value: project.targetDate || "-" },
          ]}
        />
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <SurfaceCard className="space-y-5">
            <h3 className="text-lg font-semibold text-zinc-900">Informasi Dasar</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Nama Proyek"
                placeholder="Contoh: Renovasi Rumah Pak Hasan"
                icon={<UserRound className="size-4" />}
                {...register("name")}
                error={errors.name?.message}
              />
              <Field
                label="Tipe Proyek"
                placeholder="Pilih tipe proyek"
                icon={<CalendarDays className="size-4" />}
                as="select"
                {...register("type")}
                error={errors.type?.message}
              />
              <Field
                label="Nama Owner / Klien"
                placeholder="Nama owner"
                icon={<UserRound className="size-4" />}
                {...register("ownerName")}
                error={errors.ownerName?.message}
              />
              <Field
                label="Lokasi / Alamat"
                placeholder="Alamat proyek"
                icon={<MapPin className="size-4" />}
                as="textarea"
                {...register("location")}
                error={errors.location?.message}
              />
            </div>
          </SurfaceCard>

          <SurfaceCard className="space-y-5">
            <h3 className="text-lg font-semibold text-zinc-900">Jadwal & Nilai</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Target Selesai"
                type="date"
                placeholder="YYYY-MM-DD"
                icon={<CalendarDays className="size-4" />}
                {...register("targetDate")}
                error={errors.targetDate?.message}
              />
              <Field
                label="Nilai Kontrak"
                type="number"
                placeholder="Rp 0"
                icon={<CircleDollarSign className="size-4" />}
                {...register("contractValue", { valueAsNumber: true })}
                error={errors.contractValue?.message}
              />
            </div>
            <p className="text-xs text-zinc-500">Nilai kontrak hanya terlihat oleh Anda dan tim.</p>
          </SurfaceCard>
        </div>

        <div className="space-y-6">
          {!isEdit ? (
            <SurfaceCard className="space-y-4">
              <h3 className="text-lg font-semibold text-zinc-900">Template WBS Awal</h3>
              <div className="space-y-3">
                {templates.map((template, index) => (
                  <label
                    key={template.title}
                    className={`block rounded-2xl border p-4 transition-colors ${
                      index === 1
                        ? `border-[${palette.accent}] bg-[${palette.accentSoft}]`
                        : "border-zinc-200 bg-white cursor-pointer hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="wbs-template"
                        defaultChecked={index === 1}
                        className="mt-1 size-4 accent-orange-500"
                      />
                      <div>
                        <p className="font-semibold text-zinc-900">{template.title}</p>
                        <p className="mt-1 text-sm leading-6 text-zinc-500">{template.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </SurfaceCard>
          ) : null}

          <SurfaceCard className="space-y-4">
            <h3 className="text-lg font-semibold text-zinc-900">Aksi</h3>
            <p className="text-sm leading-6 text-zinc-500">
              Pastikan data sudah benar sebelum menyimpan.
            </p>
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Proyek"}
              </Button>
              <Link
                href={isEdit && project ? `/projects/${project.id}` : "/projects"}
                className={`inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-[${palette.primary}] hover:bg-zinc-50`}
              >
                Batal
              </Link>
            </div>
          </SurfaceCard>
        </div>
      </form>
    </div>
  );
}
