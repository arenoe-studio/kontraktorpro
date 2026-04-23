import Link from "next/link";
import {
  Camera,
  ChevronRight,
  ClipboardList,
  Copy,
  Eye,
  FileStack,
  FolderKanban,
  Hammer,
  Layers3,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";
import type { Project, ProjectTab } from "./mock-data";
import {
  formatCurrency,
  formatDate,
  getDeadlineLabel,
  getStatusBadgeVariant,
  getStatusLabel,
  projectTabs,
} from "./mock-data";
import {
  Button,
  ButtonLink,
  EmptyState,
  ProgressBar,
  ProjectMetaList,
  SectionHeader,
  StatusBadge,
  SurfaceCard,
  TabLink,
  palette,
} from "./ui";

function ActivityTone(type: "info" | "success" | "warning" | "danger") {
  if (type === "success") return "bg-green-500";
  if (type === "warning") return "bg-amber-500";
  if (type === "danger") return "bg-red-500";
  return "bg-blue-500";
}

function ProjectHeader({ project }: { project: Project }) {
  return (
    <SurfaceCard className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <Link href="/dashboard" className="font-medium hover:text-zinc-900">
              Dashboard
            </Link>
            <ChevronRight className="size-4" />
            <Link href="/projects" className="font-medium hover:text-zinc-900">
              Proyek Saya
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-zinc-900">{project.name}</span>
          </div>
          <div className="flex flex-wrap items-start gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{project.name}</h1>
                <StatusBadge variant={getStatusBadgeVariant(project.status)}>
                  {getStatusLabel(project.status)}
                </StatusBadge>
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                {project.type} · {project.location}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <ButtonLink href={`/projects/${project.id}?modal=pdf`} size="md">
            <FileStack className="size-4" />
            Generate Laporan PDF
          </ButtonLink>
          <ButtonLink href={`/projects/${project.id}/edit`} variant="outline" size="md">
            Edit Informasi
          </ButtonLink>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <SurfaceCard className="space-y-3 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Progress Proyek
          </p>
          <p className="font-mono text-3xl font-bold text-zinc-900">{project.progress}%</p>
          <ProgressBar value={project.progress} className="space-y-1" />
        </SurfaceCard>

        <SurfaceCard className="space-y-3 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Deadline
          </p>
          <p className="text-lg font-semibold text-zinc-900">{getDeadlineLabel(project.daysRemaining)}</p>
          <p className="text-sm text-zinc-500">Target {formatDate(project.targetDate)}</p>
        </SurfaceCard>

        <SurfaceCard className="space-y-3 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Nilai Kontrak
          </p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-lg font-bold text-zinc-900">{formatCurrency(project.contractValue)}</p>
            <Eye className="size-4 text-zinc-400" />
          </div>
          <p className="text-sm text-zinc-500">Hanya terlihat oleh Anda</p>
        </SurfaceCard>

        <SurfaceCard className="space-y-3 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Total Laporan
          </p>
          <p className="font-mono text-3xl font-bold text-zinc-900">{project.reportCount}</p>
          <p className="text-sm text-zinc-500">Tercatat lintas kontraktor dan mandor</p>
        </SurfaceCard>
      </div>

      <ProjectMetaList
        items={[
          { label: "Owner", value: project.owner },
          { label: "Mulai", value: formatDate(project.startDate) },
          { label: "Tracking Link", value: project.trackingEnabled ? "Aktif" : "Nonaktif" },
          { label: "Portofolio", value: project.portfolioPublished ? "Sudah publish" : "Belum publish" },
        ]}
      />
    </SurfaceCard>
  );
}

function WbsTab({ project }: { project: Project }) {
  if (project.wbs.length === 0) {
    return (
      <EmptyState
        icon={<Layers3 className="size-8" />}
        title="Belum ada item pekerjaan."
        description="Mulai dari template WBS atau tambahkan item pertama untuk mengaktifkan kalkulasi progres proyek."
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button>
              <Plus className="size-4" />
              Tambah Item Pertama
            </Button>
            <Button variant="outline">Gunakan Template</Button>
          </div>
        }
      />
    );
  }

  const done = project.wbs.filter((item) => item.status === "Selesai").length;
  const ongoing = project.wbs.filter((item) => item.status === "Dalam Pengerjaan").length;
  const pending = project.wbs.filter((item) => item.status === "Belum Dimulai").length;
  const totalWeight = project.wbs.reduce((sum, item) => sum + item.weight, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <SurfaceCard className="flex flex-col items-center justify-center gap-4">
          <div className={`flex size-44 items-center justify-center rounded-full border-[14px] border-[${palette.primarySoft}]`}>
            <div className="text-center">
              <p className="font-mono text-4xl font-bold text-zinc-900">{project.progress}%</p>
              <p className="text-sm text-zinc-500">Progress keseluruhan</p>
            </div>
          </div>
          <div className="grid w-full grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-2xl bg-zinc-50 p-3">
              <p className="font-semibold text-zinc-900">{done}</p>
              <p className="text-zinc-500">Selesai</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-3">
              <p className="font-semibold text-zinc-900">{ongoing}</p>
              <p className="text-zinc-500">Proses</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-3">
              <p className="font-semibold text-zinc-900">{pending}</p>
              <p className="text-zinc-500">Belum</p>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <SectionHeader
            title="Item Pekerjaan"
            description="Mock shell tabel WBS dengan hierarki 2 level dan validasi total bobot."
            action={
              <div className="flex flex-wrap gap-3">
                <Button>
                  <Plus className="size-4" />
                  Tambah Item
                </Button>
                <Button variant="outline">Gunakan Template</Button>
                <Button variant="ghost">Atur Ulang Bobot</Button>
              </div>
            }
          />

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Nama Item</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Bobot</th>
                  <th className="px-4 py-3">Volume</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Update</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 bg-white">
                {project.wbs.map((item) => (
                  <tr
                    key={item.id}
                    className={
                      item.progress === 100
                        ? "bg-green-50/60"
                        : item.status === "Tertunda"
                          ? "bg-amber-50/70"
                          : ""
                    }
                  >
                    <td className="px-4 py-4 font-medium text-zinc-900">
                      <div className={item.level === 1 ? "pl-6" : ""}>{item.name}</div>
                      {item.assignee ? (
                        <p className="mt-1 text-xs text-zinc-500">{item.assignee}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-zinc-500">{item.category}</td>
                    <td className="px-4 py-4 font-mono text-zinc-900">{item.weight}%</td>
                    <td className="px-4 py-4 text-zinc-500">{item.volume}</td>
                    <td className="px-4 py-4">
                      <ProgressBar value={item.progress} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        variant={
                          item.status === "Selesai"
                            ? "success"
                            : item.status === "Dalam Pengerjaan"
                              ? "info"
                              : item.status === "Tertunda"
                                ? "warning"
                                : "neutral"
                        }
                      >
                        {item.status}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-4 text-zinc-500">{item.updatedAt}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="danger" size="sm">
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-zinc-900">Total Bobot: {totalWeight}%</p>
              <p className="text-zinc-500">Total bobot semua item harus = 100%.</p>
            </div>
            <StatusBadge variant={totalWeight === 100 ? "success" : "danger"}>
              {totalWeight === 100 ? "Valid" : "Perlu koreksi"}
            </StatusBadge>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}

function ReportsTab({ project }: { project: Project }) {
  if (project.reports.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="size-8" />}
        title="Belum ada laporan harian."
        description="Alur laporan siap dipakai begitu worker auth dan daily report form terhubung."
        action={
          <Button>
            <Plus className="size-4" />
            Buat Laporan Pertama
          </Button>
        }
      />
    );
  }

  return (
    <SurfaceCard className="space-y-4">
      <SectionHeader
        title="Laporan Harian"
        description="Filter masih mock, tetapi list dan action state sudah siap untuk diikat ke data source."
        action={
          <Button>
            <Plus className="size-4" />
            Buat Laporan Hari Ini
          </Button>
        }
      />

      <div className="grid gap-3 md:grid-cols-[200px_200px_1fr]">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
          Filter Bulan
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
          Filter Pengisi
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500">
          Toggle hanya yang ada kendala
        </div>
      </div>

      <div className="space-y-3">
        {project.reports.map((report) => (
          <div
            key={report.id}
            className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-semibold text-zinc-900">{formatDate(report.date)}</p>
                <StatusBadge variant={report.issue ? "danger" : "info"}>{report.weather}</StatusBadge>
                {report.issue ? <StatusBadge variant="warning">Ada Kendala</StatusBadge> : null}
              </div>
              <p className="text-sm text-zinc-500">
                {report.updatedItems} item diupdate · {report.photos} foto · Pengisi {report.author}
              </p>
              <p className="text-sm text-zinc-600">{report.note}</p>
            </div>
            <Button variant="ghost">Lihat Detail</Button>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}

function PhotosTab({ project }: { project: Project }) {
  if (project.photos.length === 0) {
    return (
      <EmptyState
        icon={<Camera className="size-8" />}
        title="Belum ada foto dokumentasi."
        description="Begitu upload flow dihubungkan, galeri ini akan otomatis tampil dengan watermark dan mode seleksi PDF."
        action={<Button variant="outline">Upload Foto Pertama</Button>}
      />
    );
  }

  return (
    <SurfaceCard className="space-y-4">
      <SectionHeader
        title="Foto Dokumentasi"
        description="Grid 3 kolom desktop, 2 kolom mobile, siap untuk lightbox dan seleksi PDF."
        action={
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">Upload Foto Manual</Button>
            <Button variant="ghost">Pilih untuk Laporan PDF</Button>
          </div>
        }
      />

      <div className="grid gap-3 md:grid-cols-3">
        {project.photos.map((photo, index) => (
          <div
            key={photo.id}
            className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100"
          >
            <div
              className="flex aspect-[4/3] items-end justify-between bg-gradient-to-br from-slate-300 via-slate-200 to-slate-100 p-4"
              style={{
                backgroundImage: `linear-gradient(135deg, rgba(27,58,92,0.${index + 1}), rgba(249,115,22,0.10))`,
              }}
            >
              <div className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-700">
                KontraktorPro
              </div>
              <div className="rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium text-white">
                {photo.angle}
              </div>
            </div>
            <div className="space-y-1 p-4">
              <p className="font-semibold text-zinc-900">{photo.item}</p>
              <p className="text-sm text-zinc-500">
                {photo.uploadedAt} · {photo.uploader}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}

function TeamTab({ project }: { project: Project }) {
  if (project.team.length === 0) {
    return (
      <EmptyState
        icon={<Users className="size-8" />}
        title="Belum ada anggota tim di proyek ini."
        description="Flow invite via WhatsApp bisa disambungkan nanti tanpa mengubah struktur layout inti."
        action={
          <Button>
            <UserPlus className="size-4" />
            Tambah Anggota Pertama
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Tim Proyek"
        description="Card tim sudah memuat status, jumlah laporan, dan shell histori aktivitas."
        action={
          <Button>
            <UserPlus className="size-4" />
            Tambah Anggota
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {project.team.map((member) => (
          <SurfaceCard key={member.id} className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`flex size-14 items-center justify-center rounded-full bg-[${palette.primarySoft}] font-semibold text-[${palette.primary}]`}>
                  {member.initials}
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">{member.name}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <StatusBadge variant="neutral">{member.role}</StatusBadge>
                    <StatusBadge variant={member.status === "Aktif" ? "success" : "neutral"}>
                      {member.status}
                    </StatusBadge>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-zinc-50 px-3 py-2 text-right">
                <p className="font-mono text-lg font-bold text-zinc-900">{member.reportsSubmitted}</p>
                <p className="text-xs text-zinc-500">Laporan</p>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Aktivitas Terbaru
              </p>
              <div className="mt-3 space-y-2">
                {member.activities.map((activity) => (
                  <p key={activity} className="text-sm leading-6 text-zinc-600">
                    {activity}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="ghost">Lihat Aktivitas</Button>
              <Button variant="danger">Hapus dari Proyek</Button>
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}

function MaterialsTab({ project }: { project: Project }) {
  const hasData = project.materialsIn.length > 0 || project.materialsUsage.length > 0;

  if (!hasData) {
    return (
      <EmptyState
        icon={<Hammer className="size-8" />}
        title="Belum ada catatan material."
        description="Tabel material masuk dan pemakaian siap, tinggal dihubungkan ke form modal dan persistence."
        action={
          <Button>
            <Plus className="size-4" />
            Catat Material Pertama
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <SurfaceCard className="space-y-4">
        <SectionHeader
          title="Material Masuk"
          description="Sub-tab pertama untuk pencatatan material datang."
          action={
            <Button>
              <Plus className="size-4" />
              Catat Material Masuk
            </Button>
          }
        />

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Jumlah</th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Dicatat oleh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {project.materialsIn.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-4 text-zinc-500">{entry.date}</td>
                  <td className="px-4 py-4 font-medium text-zinc-900">{entry.name}</td>
                  <td className="px-4 py-4 text-zinc-500">{entry.quantity}</td>
                  <td className="px-4 py-4 text-zinc-500">{entry.supplier}</td>
                  <td className="px-4 py-4 text-zinc-500">{entry.recordedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-4">
        <SectionHeader
          title="Pemakaian per Item"
          description="Sub-tab kedua untuk mapping material ke item pekerjaan."
          action={
            <Button>
              <Plus className="size-4" />
              Catat Pemakaian
            </Button>
          }
        />

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              <tr>
                <th className="px-4 py-3">Item Pekerjaan</th>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Jumlah</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {project.materialsUsage.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-4 font-medium text-zinc-900">{entry.item}</td>
                  <td className="px-4 py-4 text-zinc-500">{entry.material}</td>
                  <td className="px-4 py-4 text-zinc-500">{entry.quantity}</td>
                  <td className="px-4 py-4 text-zinc-500">{entry.date}</td>
                  <td className="px-4 py-4 text-zinc-500">{entry.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SurfaceCard>
    </div>
  );
}

function SettingsTab({ project }: { project: Project }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <SurfaceCard className="space-y-5">
        <SectionHeader
          title="Pengaturan Proyek"
          description="Shell edit info, toggle link pantau, dan danger zone."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {[
            ["Nama Proyek", project.name],
            ["Lokasi", project.location],
            ["Tanggal Mulai", project.startDate],
            ["Target Selesai", project.targetDate],
            ["Nilai Kontrak", formatCurrency(project.contractValue)],
          ].map(([label, value]) => (
            <label key={label as string} className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                {label}
              </span>
              <input
                defaultValue={value as string}
                className="mt-2 min-h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900"
              />
            </label>
          ))}
        </div>
      </SurfaceCard>

      <div className="space-y-6">
        <SurfaceCard className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-900">Link Pantau Owner</h3>
          <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                {project.trackingEnabled ? "Aktif" : "Belum Aktif"}
              </p>
              <p className="text-sm text-zinc-500">
                /pantau/{project.id}
              </p>
            </div>
            <div className="flex h-7 w-12 items-center rounded-full bg-zinc-200 p-1">
              <div
                className="size-5 rounded-full bg-white shadow-sm"
                style={{
                  transform: project.trackingEnabled ? "translateX(20px)" : "translateX(0px)",
                  backgroundColor: project.trackingEnabled ? palette.primary : "#fff",
                }}
              />
            </div>
          </div>
          <Button variant="ghost" className="w-full">
            <Copy className="size-4" />
            Salin Link
          </Button>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-900">Preferensi Owner</h3>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
            <p className="font-semibold text-zinc-900">Izinkan owner memberi ulasan</p>
            <p className="mt-1 text-sm text-zinc-500">
              {project.allowOwnerReview ? "Sudah diaktifkan" : "Masih nonaktif"}
            </p>
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-4 border-red-200 bg-red-50/60">
          <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
          <p className="text-sm leading-6 text-red-700/80">
            Aksi di area ini perlu konfirmasi tambahan saat sudah terhubung ke backend.
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="danger" className="w-full">
              Arsipkan Proyek
            </Button>
            <Button variant="danger" className="w-full">
              Hapus Proyek
            </Button>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}

function PdfModal({ project }: { project: Project }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-zinc-900">Buat Laporan PDF</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Mock modal 2 langkah untuk {project.name}
            </p>
          </div>
          <Link href={`/projects/${project.id}`} className="text-sm font-semibold text-zinc-500">
            Tutup
          </Link>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Langkah 1 · Pilih Konten
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-500">
                  Dari tanggal
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-500">
                  Sampai tanggal
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {project.reports.map((report) => (
                  <label
                    key={report.id}
                    className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-zinc-900">{formatDate(report.date)}</p>
                      <p className="text-sm text-zinc-500">
                        {report.photos} foto · {report.author}
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="size-4 accent-orange-500" />
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Langkah 2 · Preview
              </p>
              <div className="mt-4 flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white text-center">
                <div className="space-y-2 px-6">
                  <FileStack className="mx-auto size-10 text-zinc-400" />
                  <p className="font-semibold text-zinc-900">Preview halaman pertama</p>
                  <p className="text-sm text-zinc-500">
                    7 halaman estimasi · 20 foto maksimum · siap untuk unduh atau salin link.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-5">
            <h4 className="font-semibold text-zinc-900">Opsi Tambahan</h4>
            {[
              "Sertakan ringkasan WBS",
              "Sertakan daftar anggota tim",
              "Tampilkan nilai kontrak di laporan",
            ].map((label, index) => (
              <label key={label} className="flex items-center justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3">
                <span className="text-sm text-zinc-700">{label}</span>
                <input type="checkbox" defaultChecked={index < 2} className="size-4 accent-orange-500" />
              </label>
            ))}
            <div className="pt-2">
              <Button className="w-full">Unduh PDF</Button>
            </div>
            <Button variant="outline" className="w-full">
              Salin Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectDetailContent({
  project,
  tab,
  showPdfModal,
}: {
  project: Project;
  tab: ProjectTab;
  showPdfModal?: boolean;
}) {
  const tabCounts = {
    wbs: project.wbs.length,
    reports: project.reports.length,
    photos: project.photos.length,
    team: project.team.length,
    materials: project.materialsIn.length + project.materialsUsage.length,
    settings: undefined,
  } as const;

  return (
    <div className="space-y-6">
      <ProjectHeader project={project} />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {projectTabs.map((item) => (
          <TabLink
            key={item.key}
            href={`/projects/${project.id}?tab=${item.key}`}
            isActive={tab === item.key}
            label={item.label}
            count={tabCounts[item.key]}
          />
        ))}
      </div>

      {tab === "wbs" ? <WbsTab project={project} /> : null}
      {tab === "reports" ? <ReportsTab project={project} /> : null}
      {tab === "photos" ? <PhotosTab project={project} /> : null}
      {tab === "team" ? <TeamTab project={project} /> : null}
      {tab === "materials" ? <MaterialsTab project={project} /> : null}
      {tab === "settings" ? <SettingsTab project={project} /> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <SurfaceCard className="space-y-4">
          <SectionHeader title="Aktivitas Terbaru" description="Timeline lintas aksi proyek untuk konteks cepat." />
          <div className="space-y-4">
            {project.activities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className={`mt-1 size-3 rounded-full ${ActivityTone(activity.type)}`} />
                  <span className="mt-2 h-full w-px bg-zinc-200" />
                </div>
                <div className="pb-4">
                  <p className="text-sm font-semibold text-zinc-900">{activity.description}</p>
                  <p className="mt-1 text-sm text-zinc-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="space-y-4">
          <SectionHeader title="Aksi Cepat" description="Shortcut utama dari blueprint dashboard/workspace." />
          <div className="grid gap-3">
            <ButtonLink href={`/projects/${project.id}?tab=reports`} variant="outline" className="justify-start">
              <ClipboardList className="size-4" />
              Buat Laporan Harian
            </ButtonLink>
            <ButtonLink href="/projects/new" variant="outline" className="justify-start">
              <FolderKanban className="size-4" />
              Buat Proyek Baru
            </ButtonLink>
            <ButtonLink href={`/projects/${project.id}?modal=pdf`} variant="outline" className="justify-start">
              <FileStack className="size-4" />
              Generate Laporan PDF
            </ButtonLink>
            <ButtonLink href={`/projects/${project.id}?tab=team`} variant="outline" className="justify-start">
              <Users className="size-4" />
              Tambah Anggota Tim
            </ButtonLink>
          </div>
        </SurfaceCard>
      </div>

      {showPdfModal ? <PdfModal project={project} /> : null}
    </div>
  );
}
