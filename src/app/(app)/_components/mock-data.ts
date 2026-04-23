export type ProjectStatus = "aktif" | "tertunda" | "selesai" | "arsip";
export type ProjectTab = "wbs" | "reports" | "photos" | "team" | "materials" | "settings";

export type WbsStatus = "Selesai" | "Dalam Pengerjaan" | "Belum Dimulai" | "Tertunda";
export type WbsItem = {
  id: string;
  name: string;
  category: string;
  weight: number;
  volume: string;
  progress: number;
  status: WbsStatus;
  updatedAt: string;
  assignee?: string;
  level: 0 | 1;
};

export type DailyReport = {
  id: string;
  date: string;
  weather: "Cerah" | "Berawan" | "Hujan";
  updatedItems: number;
  photos: number;
  issue: boolean;
  author: string;
  note: string;
};

export type ProjectPhoto = {
  id: string;
  uploadedAt: string;
  item: string;
  uploader: string;
  angle: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: "Mandor" | "Pekerja Harian" | "Spesialis";
  status: "Aktif" | "Selesai";
  reportsSubmitted: number;
  initials: string;
  activities: string[];
};

export type MaterialEntry = {
  id: string;
  date: string;
  name: string;
  quantity: string;
  supplier: string;
  recordedBy: string;
  note?: string;
};

export type MaterialUsage = {
  id: string;
  item: string;
  material: string;
  quantity: string;
  date: string;
  note: string;
};

export type ProjectActivity = {
  id: string;
  type: "info" | "success" | "warning" | "danger";
  time: string;
  description: string;
  href: string;
};

export type ProjectReminder = {
  id: string;
  type: "info" | "success" | "warning" | "danger";
  title: string;
  description: string;
  actionLabel: string;
  href: string;
};

export type Project = {
  id: string;
  name: string;
  type: string;
  owner: string;
  location: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  targetDate: string;
  daysRemaining: number;
  contractValue: number;
  photoCount: number;
  reportCount: number;
  trackingEnabled: boolean;
  allowOwnerReview: boolean;
  portfolioPublished: boolean;
  averageCompletion: number;
  pendingReportsToday: number;
  teamCount: number;
  reminders: ProjectReminder[];
  wbs: WbsItem[];
  reports: DailyReport[];
  photos: ProjectPhoto[];
  team: TeamMember[];
  materialsIn: MaterialEntry[];
  materialsUsage: MaterialUsage[];
  activities: ProjectActivity[];
};

export const projectTabs: Array<{ key: ProjectTab; label: string }> = [
  { key: "wbs", label: "WBS" },
  { key: "reports", label: "Laporan" },
  { key: "photos", label: "Foto" },
  { key: "team", label: "Tim" },
  { key: "materials", label: "Material" },
  { key: "settings", label: "Pengaturan" },
];

const projects: Project[] = [
  {
    id: "renovasi-rumah-pak-hasan",
    name: "Renovasi Rumah Pak Hasan",
    type: "Renovasi",
    owner: "Pak Hasan",
    location: "Bekasi Timur",
    status: "aktif",
    progress: 72,
    startDate: "2026-03-10",
    targetDate: "2026-05-20",
    daysRemaining: 27,
    contractValue: 285000000,
    photoCount: 146,
    reportCount: 41,
    trackingEnabled: true,
    allowOwnerReview: true,
    portfolioPublished: false,
    averageCompletion: 76,
    pendingReportsToday: 1,
    teamCount: 7,
    reminders: [
      {
        id: "r1",
        type: "danger",
        title: "Laporan mandor belum masuk",
        description: "Mandor finishing belum kirim laporan hari ini.",
        actionLabel: "Ingatkan Mandor",
        href: "/projects/renovasi-rumah-pak-hasan?tab=reports",
      },
      {
        id: "r2",
        type: "warning",
        title: "Deadline plafon tinggal 3 hari",
        description: "Area plafon dan pengecatan butuh penyesuaian ritme kerja.",
        actionLabel: "Lihat Proyek",
        href: "/projects/renovasi-rumah-pak-hasan",
      },
    ],
    wbs: [
      {
        id: "w1",
        name: "Persiapan Area",
        category: "Persiapan",
        weight: 8,
        volume: "1 ls",
        progress: 100,
        status: "Selesai",
        updatedAt: "2 hari lalu",
        assignee: "Pak Deni",
        level: 0,
      },
      {
        id: "w2",
        name: "Pembongkaran Plafon Lama",
        category: "Persiapan",
        weight: 4,
        volume: "85 m²",
        progress: 100,
        status: "Selesai",
        updatedAt: "2 hari lalu",
        assignee: "Pak Deni",
        level: 1,
      },
      {
        id: "w3",
        name: "Pekerjaan Dinding & Cat",
        category: "Finishing",
        weight: 24,
        volume: "210 m²",
        progress: 78,
        status: "Dalam Pengerjaan",
        updatedAt: "5 jam lalu",
        assignee: "Pak Farid",
        level: 0,
      },
      {
        id: "w4",
        name: "Primer & Acian",
        category: "Finishing",
        weight: 10,
        volume: "120 m²",
        progress: 84,
        status: "Dalam Pengerjaan",
        updatedAt: "5 jam lalu",
        assignee: "Pak Farid",
        level: 1,
      },
      {
        id: "w5",
        name: "Instalasi Lampu Downlight",
        category: "MEP",
        weight: 12,
        volume: "18 titik",
        progress: 30,
        status: "Tertunda",
        updatedAt: "kemarin",
        assignee: "Pak Rian",
        level: 0,
      },
      {
        id: "w6",
        name: "Pembersihan Akhir",
        category: "Finishing",
        weight: 6,
        volume: "1 ls",
        progress: 0,
        status: "Belum Dimulai",
        updatedAt: "belum ada",
        level: 0,
      },
    ],
    reports: [
      {
        id: "dr1",
        date: "2026-04-23",
        weather: "Cerah",
        updatedItems: 3,
        photos: 11,
        issue: true,
        author: "Pak Farid",
        note: "Pengecatan tertunda 2 jam karena material masking habis.",
      },
      {
        id: "dr2",
        date: "2026-04-22",
        weather: "Berawan",
        updatedItems: 4,
        photos: 9,
        issue: false,
        author: "Pak Deni",
        note: "Plafon kamar utama selesai pemasangan.",
      },
      {
        id: "dr3",
        date: "2026-04-21",
        weather: "Hujan",
        updatedItems: 2,
        photos: 6,
        issue: false,
        author: "Kontraktor",
        note: "Penyesuaian jadwal pengiriman lampu dan fitting.",
      },
    ],
    photos: [
      {
        id: "ph1",
        uploadedAt: "23 Apr 2026 · 08:15",
        item: "Primer & Acian",
        uploader: "Pak Farid",
        angle: "Ruang keluarga",
      },
      {
        id: "ph2",
        uploadedAt: "22 Apr 2026 · 16:40",
        item: "Pemasangan plafon",
        uploader: "Pak Deni",
        angle: "Kamar utama",
      },
      {
        id: "ph3",
        uploadedAt: "21 Apr 2026 · 14:10",
        item: "Instalasi downlight",
        uploader: "Pak Rian",
        angle: "Koridor lantai 1",
      },
      {
        id: "ph4",
        uploadedAt: "20 Apr 2026 · 10:32",
        item: "Cat finishing",
        uploader: "Kontraktor",
        angle: "Fasad depan",
      },
    ],
    team: [
      {
        id: "tm1",
        name: "Deni Saputra",
        role: "Mandor",
        status: "Aktif",
        reportsSubmitted: 16,
        initials: "DS",
        activities: [
          "23 Apr 2026 — Mengirim laporan harian dengan 11 foto.",
          "22 Apr 2026 — Update progres plafon kamar utama jadi 100%.",
        ],
      },
      {
        id: "tm2",
        name: "Farid Kurniawan",
        role: "Spesialis",
        status: "Aktif",
        reportsSubmitted: 9,
        initials: "FK",
        activities: [
          "23 Apr 2026 — Mengirim laporan pengecatan dan kendala material.",
        ],
      },
      {
        id: "tm3",
        name: "Rian Hidayat",
        role: "Pekerja Harian",
        status: "Aktif",
        reportsSubmitted: 4,
        initials: "RH",
        activities: ["21 Apr 2026 — Upload foto instalasi downlight."],
      },
    ],
    materialsIn: [
      {
        id: "mi1",
        date: "23 Apr 2026",
        name: "Cat Interior Putih",
        quantity: "12 pail",
        supplier: "Toko Bangunan Sumber Jaya",
        recordedBy: "Kontraktor",
      },
      {
        id: "mi2",
        date: "22 Apr 2026",
        name: "Gypsum Board",
        quantity: "32 lembar",
        supplier: "CV Mapan",
        recordedBy: "Deni Saputra",
      },
    ],
    materialsUsage: [
      {
        id: "mu1",
        item: "Primer & Acian",
        material: "Cat Interior Putih",
        quantity: "4 pail",
        date: "23 Apr 2026",
        note: "Area ruang keluarga dan dapur",
      },
      {
        id: "mu2",
        item: "Pemasangan plafon",
        material: "Gypsum Board",
        quantity: "18 lembar",
        date: "22 Apr 2026",
        note: "Kamar utama + lorong",
      },
    ],
    activities: [
      {
        id: "a1",
        type: "danger",
        time: "10 menit lalu",
        description: "Mandor finishing menandai kendala material masking habis.",
        href: "/projects/renovasi-rumah-pak-hasan?tab=reports",
      },
      {
        id: "a2",
        type: "info",
        time: "2 jam lalu",
        description: "Foto progres ruang keluarga ditambahkan ke galeri proyek.",
        href: "/projects/renovasi-rumah-pak-hasan?tab=photos",
      },
      {
        id: "a3",
        type: "success",
        time: "kemarin",
        description: "Pekerjaan plafon kamar utama selesai 100%.",
        href: "/projects/renovasi-rumah-pak-hasan?tab=wbs",
      },
    ],
  },
  {
    id: "pembangunan-ruko-jatinegara",
    name: "Pembangunan Ruko Jatinegara",
    type: "Ruko",
    owner: "Bu Nita",
    location: "Jatinegara, Jakarta Timur",
    status: "aktif",
    progress: 48,
    startDate: "2026-02-02",
    targetDate: "2026-07-15",
    daysRemaining: 83,
    contractValue: 715000000,
    photoCount: 89,
    reportCount: 37,
    trackingEnabled: true,
    allowOwnerReview: false,
    portfolioPublished: false,
    averageCompletion: 52,
    pendingReportsToday: 0,
    teamCount: 12,
    reminders: [
      {
        id: "r3",
        type: "info",
        title: "Laporan PDF mingguan siap",
        description: "Preview ringkasan minggu ini sudah siap dikirim ke owner.",
        actionLabel: "Kirim Sekarang",
        href: "/projects/pembangunan-ruko-jatinegara",
      },
    ],
    wbs: [],
    reports: [],
    photos: [],
    team: [],
    materialsIn: [],
    materialsUsage: [],
    activities: [
      {
        id: "a4",
        type: "info",
        time: "1 hari lalu",
        description: "Owner tracking link dibuka 5 kali minggu ini.",
        href: "/projects/pembangunan-ruko-jatinegara",
      },
    ],
  },
  {
    id: "interior-kafe-melati",
    name: "Interior Kafe Melati",
    type: "Renovasi",
    owner: "Mas Aldi",
    location: "Depok",
    status: "tertunda",
    progress: 31,
    startDate: "2026-04-01",
    targetDate: "2026-06-18",
    daysRemaining: 56,
    contractValue: 162000000,
    photoCount: 21,
    reportCount: 11,
    trackingEnabled: false,
    allowOwnerReview: true,
    portfolioPublished: false,
    averageCompletion: 34,
    pendingReportsToday: 1,
    teamCount: 4,
    reminders: [
      {
        id: "r4",
        type: "warning",
        title: "Material kayu custom belum datang",
        description: "Pekerjaan countertop akan geser 2 hari bila supplier terlambat.",
        actionLabel: "Cek Material",
        href: "/projects/interior-kafe-melati?tab=materials",
      },
    ],
    wbs: [],
    reports: [],
    photos: [],
    team: [],
    materialsIn: [],
    materialsUsage: [],
    activities: [
      {
        id: "a5",
        type: "warning",
        time: "4 jam lalu",
        description: "Supplier kayu mengajukan revisi jadwal pengiriman.",
        href: "/projects/interior-kafe-melati?tab=materials",
      },
    ],
  },
  {
    id: "rumah-ibu-siska-cibubur",
    name: "Rumah Ibu Siska Cibubur",
    type: "Rumah Tinggal Baru",
    owner: "Ibu Siska",
    location: "Cibubur",
    status: "selesai",
    progress: 100,
    startDate: "2025-11-20",
    targetDate: "2026-03-30",
    daysRemaining: 0,
    contractValue: 935000000,
    photoCount: 312,
    reportCount: 88,
    trackingEnabled: false,
    allowOwnerReview: true,
    portfolioPublished: false,
    averageCompletion: 100,
    pendingReportsToday: 0,
    teamCount: 14,
    reminders: [
      {
        id: "r5",
        type: "success",
        title: "Belum dipublish ke portofolio",
        description: "Proyek ini siap ditampilkan di profil publik Anda.",
        actionLabel: "Publish Sekarang",
        href: "/projects/rumah-ibu-siska-cibubur",
      },
    ],
    wbs: [],
    reports: [],
    photos: [],
    team: [],
    materialsIn: [],
    materialsUsage: [],
    activities: [
      {
        id: "a6",
        type: "success",
        time: "3 hari lalu",
        description: "Serah terima proyek berhasil dilakukan.",
        href: "/projects/rumah-ibu-siska-cibubur",
      },
    ],
  },
];

export function getProjects() {
  return projects;
}

export function getProjectById(projectId: string) {
  return projects.find((project) => project.id === projectId);
}

export function getDashboardSummary() {
  const activeProjects = projects.filter((project) => project.status === "aktif");
  const finishedProjects = projects.filter((project) => project.status === "selesai");
  const reportTargets = activeProjects.length;
  const reportsCompleted = activeProjects.filter(
    (project) => project.pendingReportsToday === 0
  ).length;

  return {
    activeProjects: activeProjects.length,
    reportCompletion: `${reportsCompleted}/${reportTargets}`,
    averageProgress: Math.round(
      activeProjects.reduce((sum, project) => sum + project.progress, 0) /
        Math.max(1, activeProjects.length)
    ),
    finishedThisMonth: finishedProjects.length,
    reminders: projects.flatMap((project) => project.reminders).slice(0, 5),
    activities: projects
      .flatMap((project) => project.activities)
      .sort((left, right) => right.time.localeCompare(left.time))
      .slice(0, 8),
  };
}

export function getStatusBadgeVariant(status: ProjectStatus) {
  if (status === "aktif") return "success";
  if (status === "tertunda") return "warning";
  if (status === "selesai") return "info";
  return "neutral";
}

export function getStatusLabel(status: ProjectStatus) {
  if (status === "aktif") return "Aktif";
  if (status === "tertunda") return "Tertunda";
  if (status === "selesai") return "Selesai";
  return "Arsip";
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function getDeadlineLabel(daysRemaining: number) {
  if (daysRemaining < 0) return `Telat ${Math.abs(daysRemaining)} hari`;
  if (daysRemaining === 0) return "Deadline hari ini";
  return `Sisa ${daysRemaining} hari`;
}

export function getProjectCounts() {
  return {
    semua: projects.filter((project) => project.status !== "arsip").length,
    aktif: projects.filter((project) => project.status === "aktif").length,
    tertunda: projects.filter((project) => project.status === "tertunda").length,
    selesai: projects.filter((project) => project.status === "selesai").length,
    arsip: projects.filter((project) => project.status === "arsip").length,
  };
}
