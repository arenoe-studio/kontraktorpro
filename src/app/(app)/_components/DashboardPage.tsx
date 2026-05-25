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
import { getDashboardSummary, getProjects, getStatusBadgeVariant, getStatusLabel } from "./mock-data";
import {
  ButtonLink,
  ProgressBar,
  SectionHeader,
  StatCard,
  StatusBadge,
  SurfaceCard,
  palette,
} from "./ui";

export function DashboardPage() {
  const summary = getDashboardSummary();
  const activeProjects = getProjects()
    .filter((project) => project.status === "active" || project.status === "delayed")
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <SurfaceCard className={`bg-[${palette.primary}] text-white`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm text-white/75">Jumat, 23 April 2026</p>
            <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
              Selamat pagi, Pak Budi 👋
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-white/75">
              Anda punya {summary.activeProjects} proyek aktif. {summary.reportCompletion} laporan
              harian sudah lengkap dan ada {summary.reminders.length} hal yang perlu ditindak hari
              ini.
            </p>
          </div>
          <ButtonLink href="/projects/new" className="self-start lg:self-auto">
            <Plus className="size-4" />
            Buat Proyek Baru
          </ButtonLink>
        </div>
      </SurfaceCard>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Proyek Aktif"
          value={`${summary.activeProjects}`}
          helper="1 proyek mendekati deadline minggu ini"
          href="/projects?status=aktif"
          icon="projects"
          accent={palette.primary}
        />
        <StatCard
          title="Laporan Hari Ini"
          value={summary.reportCompletion}
          helper="1 proyek masih menunggu laporan mandor"
          href="/projects/renovasi-rumah-pak-hasan?tab=reports"
          icon="reports"
          accent={palette.accent}
        />
        <StatCard
          title="Progres Rata-rata"
          value={`${summary.averageProgress}%`}
          helper="Ritme proyek stabil dibanding minggu lalu"
          href="/projects?sort=progress-low"
          icon="progress"
          accent={palette.primary}
        />
        <StatCard
          title="Selesai Bulan Ini"
          value={`${summary.finishedThisMonth}`}
          helper="1 proyek siap dipublish ke portofolio"
          href="/projects?status=selesai"
          icon="finished"
          accent={palette.success}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
        <SurfaceCard className="space-y-4">
          <SectionHeader
            title="Notifikasi & Reminder"
            description="Prioritas tertinggi ditampilkan dulu agar keputusan lapangan lebih cepat."
          />
          <div className="space-y-3">
            {summary.reminders.map((reminder) => (
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
            ))}
          </div>
          <Link href="/projects" className={`inline-flex text-sm font-semibold text-[${palette.primary}]`}>
            Lihat semua notifikasi
          </Link>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <SectionHeader title="Shortcut" description="Aksi cepat tanpa perlu pindah banyak layar." />
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                href: "/projects/renovasi-rumah-pak-hasan?tab=reports",
                label: "Buat Laporan Harian",
                icon: ClipboardList,
              },
              { href: "/projects/new", label: "Buat Proyek Baru", icon: FolderKanban },
              {
                href: "/projects/renovasi-rumah-pak-hasan?modal=pdf",
                label: "Generate Laporan PDF",
                icon: Sparkles,
              },
              { href: "/projects/renovasi-rumah-pak-hasan?tab=team", label: "Tambah Anggota Tim", icon: Users },
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.9fr)]">
        <SurfaceCard className="space-y-4">
          <SectionHeader
            title="Proyek Aktif"
            description="Urutan berdasarkan urgensi deadline dan kendala laporan."
            action={<ButtonLink href="/projects">Lihat Semua Proyek</ButtonLink>}
          />

          <div className="space-y-4">
            {activeProjects.map((project) => (
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
                      {project.type} · {project.location} · Owner {project.owner}
                    </p>
                  </div>

                  <ButtonLink href={`/projects/${project.id}`} variant="outline" size="sm">
                    Lihat Detail
                  </ButtonLink>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                  <div>
                    <ProgressBar value={project.progress} />
                    <p className="mt-2 text-sm text-zinc-500">
                      {project.daysRemaining > 0
                        ? `Sisa ${project.daysRemaining} hari menuju target`
                        : `Telat ${Math.abs(project.daysRemaining)} hari`}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-zinc-50 px-3 py-3">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        <Camera className="size-4" />
                        Foto
                      </p>
                      <p className="mt-2 font-mono text-xl font-bold text-zinc-900">{project.photoCount}</p>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 px-3 py-3">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                        <ClipboardList className="size-4" />
                        Laporan
                      </p>
                      <p className="mt-2 font-mono text-xl font-bold text-zinc-900">{project.reportCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <SectionHeader title="Aktivitas Terbaru" description="7–10 aktivitas lintas proyek." />
          <div className="space-y-4">
            {summary.activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div
                  className={`mt-1 size-3 rounded-full ${
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
            ))}
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: "Deadline Terdekat",
            value: "3 hari",
            helper: "Plafon dan pengecatan ruang keluarga",
            icon: CalendarClock,
          },
          {
            title: "Foto Hari Ini",
            value: "17",
            helper: "Mayoritas dari Renovasi Rumah Pak Hasan",
            icon: Camera,
          },
          {
            title: "Material Tercatat",
            value: "14",
            helper: "Masuk dan pemakaian lintas proyek aktif",
            icon: Hammer,
          },
          {
            title: "Anggota Aktif",
            value: "23",
            helper: "Mandor, pekerja harian, dan spesialis",
            icon: Users,
          },
        ].map(({ title, value, helper, icon: Icon }) => (
          <SurfaceCard key={title}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{title}</p>
                <p className="mt-3 font-mono text-3xl font-bold text-zinc-900">{value}</p>
                <p className="mt-2 text-sm text-zinc-500">{helper}</p>
              </div>
              <div className={`rounded-2xl bg-[${palette.primarySoft}] p-3 text-[${palette.primary}]`}>
                <Icon className="size-5" />
              </div>
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
