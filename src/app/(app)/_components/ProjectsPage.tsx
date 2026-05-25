import Link from "next/link";
import { Camera, ClipboardList, Plus, Search } from "lucide-react";
import {
  getDeadlineLabel,
  getProjectCounts,
  getProjects,
  getStatusBadgeVariant,
  getStatusLabel,
} from "./mock-data";
import { type ProjectStatus } from "@/lib/contracts/enums";
import {
  ButtonLink,
  EmptyState,
  ProgressBar,
  SectionHeader,
  StatusBadge,
  SurfaceCard,
  TabLink,
  palette,
} from "./ui";

type ProjectListSearchParams = Promise<{
  status?: string;
  q?: string;
  sort?: string;
}>;

function normalizeStatus(status?: string): ProjectStatus | "semua" {
  if (status === "active" || status === "delayed" || status === "completed" || status === "archived") {
    return status;
  }

  return "semua";
}

export async function ProjectsPage({
  searchParams,
}: {
  searchParams: ProjectListSearchParams;
}) {
  const query = await searchParams;
  const selectedStatus = normalizeStatus(query.status);
  const searchQuery = query.q?.trim().toLowerCase() ?? "";
  const sort = query.sort ?? "latest";
  const counts = getProjectCounts();

  let projects = getProjects().filter((project) =>
    selectedStatus === "semua"
      ? project.status !== "archived"
      : project.status === selectedStatus
  );

  if (searchQuery) {
    projects = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery) ||
        project.owner.toLowerCase().includes(searchQuery)
    );
  }

  projects = [...projects].sort((left, right) => {
    if (sort === "deadline") return left.daysRemaining - right.daysRemaining;
    if (sort === "progress-low") return left.progress - right.progress;
    return right.startDate.localeCompare(left.startDate);
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Proyek Saya"
        description="Semua proyek kontraktor, lengkap dengan filter status, pencarian, dan urutan prioritas."
        action={
          <ButtonLink href="/projects/new">
            <Plus className="size-4" />
            Buat Proyek Baru
          </ButtonLink>
        }
      />

      <SurfaceCard className="space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <TabLink href="/projects" isActive={selectedStatus === "semua"} label="Semua" count={counts.semua} />
          <TabLink href="/projects?status=active" isActive={selectedStatus === "active"} label="Aktif" count={counts.aktif} />
          <TabLink href="/projects?status=delayed" isActive={selectedStatus === "delayed"} label="Tertunda" count={counts.tertunda} />
          <TabLink href="/projects?status=completed" isActive={selectedStatus === "completed"} label="Selesai" count={counts.selesai} />
          <TabLink href="/projects?status=archived" isActive={selectedStatus === "archived"} label="Arsip" count={counts.arsip} />
        </div>

        <form className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px_120px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-3.5 size-4 text-zinc-400" />
            <input
              name="q"
              defaultValue={query.q}
              placeholder="Cari nama proyek atau owner..."
              className="min-h-11 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 pl-11 text-sm text-zinc-900"
            />
            {selectedStatus !== "semua" ? <input type="hidden" name="status" value={selectedStatus} /> : null}
          </label>
          <select
            name="sort"
            defaultValue={sort}
            className="min-h-11 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900"
          >
            <option value="latest">Terbaru</option>
            <option value="deadline">Deadline Terdekat</option>
            <option value="progress-low">Progres Terendah</option>
          </select>
          <button
            type="submit"
            className={`min-h-11 rounded-2xl bg-[${palette.primary}] px-4 py-3 text-sm font-semibold text-white`}
          >
            Terapkan
          </button>
        </form>
      </SurfaceCard>

      {projects.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="size-8" />}
          title={selectedStatus === "semua" ? "Belum ada proyek." : "Tidak ada proyek dengan status ini."}
          description={
            selectedStatus === "semua"
              ? "Mulai dengan membuat proyek pertama Anda. Shell daftar proyek sudah siap dihubungkan ke data nyata."
              : "Coba pindah status atau ubah pencarian untuk melihat proyek lain."
          }
          action={
            selectedStatus === "semua" ? (
              <ButtonLink href="/projects/new">
                <Plus className="size-4" />
                Buat Proyek Pertama
              </ButtonLink>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <SurfaceCard key={project.id} className="space-y-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-zinc-900">{project.name}</h2>
                    <StatusBadge variant={getStatusBadgeVariant(project.status)}>
                      {getStatusLabel(project.status)}
                    </StatusBadge>
                  </div>
                  <p className="text-sm text-zinc-500">
                    {project.type} · {project.location} · Owner {project.owner}
                  </p>
                </div>
                <ButtonLink href={`/projects/${project.id}`} variant="outline" size="sm">
                  Lihat Detail
                </ButtonLink>
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
                <div>
                  <ProgressBar value={project.progress} />
                  <p className="mt-2 text-sm text-zinc-500">{getDeadlineLabel(project.daysRemaining)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-zinc-50 p-3">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      <Camera className="size-4" />
                      Foto
                    </p>
                    <p className="mt-2 font-mono text-xl font-bold text-zinc-900">{project.photoCount}</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 p-3">
                    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                      <ClipboardList className="size-4" />
                      Laporan
                    </p>
                    <p className="mt-2 font-mono text-xl font-bold text-zinc-900">{project.reportCount}</p>
                  </div>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      )}

      <Link href="/projects/new" className={`inline-flex text-sm font-semibold text-[${palette.primary}]`}>
        Tambah proyek baru
      </Link>
    </div>
  );
}
