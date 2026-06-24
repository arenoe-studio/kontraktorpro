import Link from "next/link";
import {
  CalendarClock,
  Camera,
  ClipboardList,
  FolderKanban,
  Hammer,
  Plus,
  Sparkles,
  TriangleAlert,
  Users,
} from "lucide-react";
import { getStatusBadgeVariant, getStatusLabel } from "./mock-data";
import { type DashboardSummary } from "@/features/dashboard/types";
import {
  ButtonLink,
  EmptyState,
  ProgressBar,
  SectionHeader,
  StatCard,
  StatusBadge,
  SurfaceCard,
  palette,
} from "./ui";

export function DashboardPage({ data }: { data: DashboardSummary }) {
  // Blok A — full empty state (onboarding) jika belum ada proyek sama sekali
  if (data.activeProjectCount === 0 && data.finishedThisMonth === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          icon={<FolderKanban className="size-8" />}
          title="Belum ada proyek"
          description="Mulai perjalanan Anda dengan membuat proyek pertama. Pantau progres, laporan harian, dan tim Anda dalam satu tempat."
          action={
            <ButtonLink href="/projects/new">
              <Plus className="size-4" />
              Buat Proyek Pertama
            </ButtonLink>
          }
        />
      </div>
    );
  }

  // KPI helper texts
  const proyek_aktif_helper =
    data.nearDeadlineProjects.length > 0
      ? `${data.nearDeadlineProjects.length} proyek mendekati deadline minggu ini`
      : "Semua proyek berjalan lancar";

  const laporan_helper =
    data.pendingReportCount > 0
      ? `${data.pendingReportCount} proyek masih menunggu laporan`
      : "Semua laporan sudah masuk";

  // Secondary stats
  const deadline_terdekat_value =
    data.nearestDeadlineDays > 0 ? `${data.nearestDeadlineDays} hari` : "Tidak ada";

  return (
    <div className="space-y-6">
      {/* Blok A — Greeting */}
      <SurfaceCard className={`bg-[${palette.primary}] text-white`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm text-white/75">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              {data.greetingLabel}, {data.fullName} 👋
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-white/75">
              Anda punya {data.activeProjectCount} proyek aktif. {data.reportCompletionToday}{" "}
              laporan harian sudah lengkap dan ada {data.pendingReportCount} hal yang perlu
              ditindak hari ini.
            </p>
          </div>

          <div className="flex flex-col gap-3 self-start lg:self-auto">
            {/* Blok — Project limit banner (Req 10.3) */}
            {data.isProjectLimitReached && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
                <TriangleAlert className="size-4 shrink-0" />
                <span>Batas proyek aktif tercapai. Upgrade paket untuk menambah proyek.</span>
              </div>
            )}

            {data.isProjectLimitReached ? (
              <span
                title="Upgrade paket Anda untuk membuat proyek baru"
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-500 opacity-60"
              >
                <Plus className="size-4" />
                Buat Proyek Baru
              </span>
            ) : (
              <ButtonLink href="/projects/new">
                <Plus className="size-4" />
                Buat Proyek Baru
              </ButtonLink>
            )}
          </div>
        </div>
      </SurfaceCard>

      {/* Blok B — KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Proyek Aktif"
          value={`${data.activeProjectCount}`}
          helper={proyek_aktif_helper}
          href="/projects?status=active"
          icon="projects"
          accent={palette.primary}
        />
        <StatCard
          title="Laporan Hari Ini"
          value={data.reportCompletionToday}
          helper={laporan_helper}
          href="/projects"
          icon="reports"
          accent={palette.accent}
        />
        <StatCard
          title="Progres Rata-rata"
          value={`${data.averageProgress}%`}
          helper="Ritme proyek stabil"
          href="/projects?sort=progress-low"
          icon="progress"
          accent={palette.primary}
        />
        <StatCard
          title="Selesai Bulan Ini"
          value={`${data.finishedThisMonth}`}
          helper="Proyek selesai bulan ini"
          href="/projects?status=completed"
          icon="finished"
          accent={palette.success}
        />
      </div>

      {/* Blok C + F — Reminders & Shortcuts */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
        <SurfaceCard className="space-y-4">
          <SectionHeader
            title="Notifikasi & Reminder"
            description="Prioritas tertinggi ditampilkan dulu agar keputusan lapangan lebih cepat."
          />
          <div className="space-y-3">
            {data.reminders.length === 0 ? (
              <p className="text-sm text-zinc-500">Tidak ada reminder saat ini. Semua berjalan lancar.</p>
            ) : (
              data.reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex gap-3">
                    <div
                      className={`mt-0.5 rounded-2xl p-2 ${
                        reminder.type === "danger"
                          ? "bg-red-100 text-red-600"
                          : reminder.type === "warning"
                            ? "bg-amber-100 text-amber-600"
                            : reminder.type === "success"
                              ? "bg-green-100 text-green-600"
                              : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <TriangleAlert className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">{reminder.title}</p>
                      <p className="mt-1 text-sm text-zinc-500">{reminder.description}</p>
                    </div>
                  </div>
                  <ButtonLink href={reminder.href} variant="ghost" size="sm">
                    {reminder.actionLabel}
                  </ButtonLink>
                </div>
              ))
            )}
          </div>
          <Link
            href="/projects"
            className={`inline-flex text-sm font-semibold text-[${palette.primary}]`}
          >
            Lihat semua notifikasi
          </Link>
        </SurfaceCard>

        {/* Blok F — Shortcuts (generic links, no hardcoded project IDs) */}
        <SurfaceCard className="space-y-4">
          <SectionHeader
            title="Shortcut"
            description="Aksi cepat tanpa perlu pindah banyak layar."
          />
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                href: "/projects",
                label: "Buat Laporan Harian",
                icon: ClipboardList,
              },
              { href: "/projects/new", label: "Buat Proyek Baru", icon: FolderKanban },
              {
                href: "/projects",
                label: "Generate Laporan PDF",
                icon: Sparkles,
              },
              { href: "/projects", label: "Tambah Anggota Tim", icon: Users },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:bg-white"
              >
                <Icon className={`size-5 text-[${palette.primary}]`} />
                <p className="mt-4 text-sm font-semibold text-zinc-900">{label}</p>
              </Link>
            ))}
          </div>
        </SurfaceCard>
      </div>

      {/* Blok D + E — Active Projects & Recent Activities */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.9fr)]">
        <SurfaceCard className="space-y-4">
          <SectionHeader
            title="Proyek Aktif"
            description="Urutan berdasarkan urgensi deadline dan kendala laporan."
            action={<ButtonLink href="/projects">Lihat Semua Proyek</ButtonLink>}
          />

          {/* Blok D empty state (Req 10.5) — user punya proyek tapi tidak ada yang active/delayed */}
          {data.activeProjects.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-zinc-300 py-12 text-center">
              <FolderKanban className={`size-8 text-[${palette.primary}]`} />
              <div className="space-y-1">
                <p className="font-semibold text-zinc-900">Tidak ada proyek aktif</p>
                <p className="text-sm text-zinc-500">
                  Semua proyek sudah selesai atau diarsipkan. Mulai proyek baru untuk melanjutkan.
                </p>
              </div>
              <ButtonLink href="/projects/new" variant="outline" size="sm">
                <Plus className="size-4" />
                Buat Proyek Baru
              </ButtonLink>
            </div>
          ) : (
            <div className="space-y-4">
              {data.activeProjects.map((project) => {
                // Handle nullable daysRemaining
                const deadlineLabel =
                  project.daysRemaining === null
                    ? "Tidak ada target"
                    : project.daysRemaining < 0
                      ? `Telat ${Math.abs(project.daysRemaining)} hari`
                      : project.daysRemaining === 0
                        ? "Deadline hari ini"
                        : `Sisa ${project.daysRemaining} hari menuju target`;

                return (
                  <div
                    key={project.id}
                    className="rounded-3xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-zinc-900">{project.name}</h3>
                          <StatusBadge variant={getStatusBadgeVariant(project.status)}>
                            {getStatusLabel(project.status)}
                          </StatusBadge>
                        </div>
                        <p className="text-sm text-zinc-500">
                          {project.type} · {project.location} · Owner {project.ownerName}
                        </p>
                      </div>

                      <ButtonLink href={`/projects/${project.id}`} variant="outline" size="sm">
                        Lihat Detail
                      </ButtonLink>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                      <div>
                        <ProgressBar value={project.progress} />
                        <p className="mt-2 text-sm text-zinc-500">{deadlineLabel}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-zinc-50 px-3 py-3">
                          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                            <Camera className="size-4" />
                            Foto
                          </p>
                          <p className="mt-2 font-mono text-xl font-bold text-zinc-900">
                            {project.photoCount}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-zinc-50 px-3 py-3">
                          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                            <ClipboardList className="size-4" />
                            Laporan
                          </p>
                          <p className="mt-2 font-mono text-xl font-bold text-zinc-900">
                            {project.reportCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <SectionHeader title="Aktivitas Terbaru" description="7–10 aktivitas lintas proyek." />
          {data.activityLoadError && (
            <p className="rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-700">
              Gagal memuat aktivitas terbaru. Data lain tetap tersedia.
            </p>
          )}
          <div className="space-y-4">
            {data.activities.length === 0 ? (
              <p className="text-sm text-zinc-500">Belum ada aktivitas tercatat.</p>
            ) : (
              data.activities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div
                    className={`mt-1 size-3 shrink-0 rounded-full ${
                      activity.type === "danger"
                        ? "bg-red-500"
                        : activity.type === "warning"
                          ? "bg-amber-500"
                          : activity.type === "success"
                            ? "bg-green-500"
                            : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{activity.description}</p>
                    <p className="mt-1 text-sm text-zinc-500">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </SurfaceCard>
      </div>

      {/* Baris Bawah — Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Deadline Terdekat",
            value: deadline_terdekat_value,
            helper: "Proyek aktif dengan deadline paling dekat",
            icon: CalendarClock,
          },
          {
            title: "Foto Hari Ini",
            value: `${data.photosToday}`,
            helper: "Foto yang diupload hari ini",
            icon: Camera,
          },
          {
            title: "Material Tercatat",
            value: `${data.materialsRecordedTotal}`,
            helper: "Masuk dan pemakaian lintas proyek aktif",
            icon: Hammer,
          },
          {
            title: "Anggota Aktif",
            value: `${data.activeMemberCount}`,
            helper: "Mandor, pekerja harian, dan spesialis",
            icon: Users,
          },
        ].map(({ title, value, helper, icon: Icon }) => (
          <SurfaceCard key={title}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  {title}
                </p>
                <p className="mt-3 font-mono text-3xl font-bold text-zinc-900">{value}</p>
                <p className="mt-2 text-sm text-zinc-500">{helper}</p>
              </div>
              <div
                className={`rounded-2xl bg-[${palette.primarySoft}] p-3 text-[${palette.primary}]`}
              >
                <Icon className="size-5" />
              </div>
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
