import Link from "next/link";
import { ArrowLeft, CalendarDays, CircleDollarSign, MapPin, UserRound } from "lucide-react";
import type { Project } from "./mock-data";
import { Button, ProjectMetaList, SectionHeader, SurfaceCard, palette } from "./ui";

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

function Field({
  label,
  placeholder,
  icon,
  defaultValue,
  as = "input",
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  defaultValue?: string;
  as?: "input" | "textarea" | "select";
}) {
  const baseClassName =
    "mt-2 min-h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-400";

  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      <div className="relative mt-2">
        <div className="pointer-events-none absolute left-4 top-3.5 text-zinc-400">{icon}</div>
        {as === "textarea" ? (
          <textarea
            defaultValue={defaultValue}
            placeholder={placeholder}
            className={`${baseClassName} min-h-28 pl-11`}
          />
        ) : as === "select" ? (
          <select defaultValue={defaultValue} className={`${baseClassName} pl-11`}>
            <option value="Rumah Tinggal Baru">Rumah Tinggal Baru</option>
            <option value="Renovasi">Renovasi</option>
            <option value="Ruko">Ruko</option>
            <option value="Gedung">Gedung</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        ) : (
          <input defaultValue={defaultValue} placeholder={placeholder} className={`${baseClassName} pl-11`} />
        )}
      </div>
    </label>
  );
}

export function ProjectFormShell({
  mode,
  project,
}: {
  mode: "create" | "edit";
  project?: Project;
}) {
  const isEdit = mode === "edit";

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Link href={isEdit && project ? `/projects/${project.id}` : "/projects"} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500">
          <ArrowLeft className="size-4" />
          {isEdit ? "Kembali ke detail proyek" : "Kembali ke daftar proyek"}
        </Link>
        <SectionHeader
          title={isEdit ? "Edit Informasi Proyek" : "Buat Proyek Baru"}
          description={
            isEdit
              ? "Shell edit ini mengikuti blueprint modal, tetapi ditampilkan penuh agar aman untuk paralel development."
              : "Isi data inti proyek. WBS awal masih berupa mock shell agar worker lain bisa lanjut integrasi domain."
          }
        />
      </div>

      {project ? (
        <ProjectMetaList
          items={[
            { label: "Status", value: project.status.toUpperCase() },
            { label: "Owner", value: project.owner },
            { label: "Lokasi", value: project.location },
            { label: "Target", value: project.targetDate },
          ]}
        />
      ) : null}

      <form className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <SurfaceCard className="space-y-5">
            <h3 className="text-lg font-semibold text-zinc-900">Informasi Dasar</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Nama Proyek"
                placeholder="Contoh: Renovasi Rumah Pak Hasan"
                defaultValue={project?.name}
                icon={<UserRound className="size-4" />}
              />
              <Field
                label="Tipe Proyek"
                placeholder="Pilih tipe proyek"
                defaultValue={project?.type ?? "Renovasi"}
                icon={<CalendarDays className="size-4" />}
                as="select"
              />
              <Field
                label="Nama Owner / Klien"
                placeholder="Nama owner"
                defaultValue={project?.owner}
                icon={<UserRound className="size-4" />}
              />
              <Field
                label="Lokasi / Alamat"
                placeholder="Alamat proyek"
                defaultValue={project?.location}
                icon={<MapPin className="size-4" />}
                as="textarea"
              />
            </div>
          </SurfaceCard>

          <SurfaceCard className="space-y-5">
            <h3 className="text-lg font-semibold text-zinc-900">Jadwal & Nilai</h3>
            <div className="grid gap-5 md:grid-cols-3">
              <Field
                label="Tanggal Mulai"
                placeholder="YYYY-MM-DD"
                defaultValue={project?.startDate ?? "2026-04-23"}
                icon={<CalendarDays className="size-4" />}
              />
              <Field
                label="Target Selesai"
                placeholder="YYYY-MM-DD"
                defaultValue={project?.targetDate ?? "2026-06-30"}
                icon={<CalendarDays className="size-4" />}
              />
              <Field
                label="Nilai Kontrak"
                placeholder="Rp 0"
                defaultValue={project ? `${project.contractValue}` : ""}
                icon={<CircleDollarSign className="size-4" />}
              />
            </div>
            <p className="text-xs text-zinc-500">Nilai kontrak hanya terlihat oleh Anda.</p>
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
                        : "border-zinc-200 bg-white"
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
              Form ini masih shell mock. Tujuannya memberi jalur UI lengkap untuk integrasi auth,
              project actions, dan service layer berikutnya.
            </p>
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                {isEdit ? "Simpan Perubahan" : "Buat Proyek"}
              </Button>
              <Link
                href={isEdit && project ? `/projects/${project.id}` : "/projects"}
                className={`inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-[${palette.primary}]`}
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
