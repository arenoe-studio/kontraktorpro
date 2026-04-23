import type { Role } from "@/lib/contracts/enums";
import {
  mockAdminLogs,
  mockPayments,
  mockPortfolioEntries,
  mockReviews,
} from "@/lib/contracts/mock-data";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const resolveAdminRole = (value?: string): Role =>
  value === "moderator" ? "moderator" : "super_admin";

export const adminProfile = {
  name: "Rani Admin",
  role: "super_admin" as Role,
  city: "Jakarta",
  lastActive: "5 menit lalu",
};

export const systemHealth = {
  status: "normal",
  uptime: "99,94%",
  moderationQueue: 12,
  activeUsers: 184,
  incident:
    "Semua sistem normal. Monitoring pembayaran dan moderasi berjalan sesuai SLA.",
};

export const dashboardKpis = [
  {
    label: "Total Pengguna Terdaftar",
    value: "2.418",
    helper: "+124 minggu ini",
    accent: "primary" as const,
  },
  {
    label: "Pengguna Aktif Bulan Ini",
    value: "1.684",
    helper: "69,6% dari total pengguna",
    accent: "success" as const,
  },
  {
    label: "Pelanggan Berbayar",
    value: "684",
    helper: "512 Pro • 172 Business",
    accent: "accent" as const,
  },
  {
    label: "Churn Bulan Ini",
    value: "3,1%",
    helper: "Turun 0,4% vs bulan lalu",
    accent: "warning" as const,
  },
  {
    label: "MRR",
    value: "Rp94,2 jt",
    helper: "+8,2% vs bulan lalu",
    accent: "accent" as const,
  },
  {
    label: "Proyek Aktif di Platform",
    value: "938",
    helper: "+41 proyek baru minggu ini",
    accent: "primary" as const,
  },
  {
    label: "Laporan Hari Ini",
    value: "326",
    helper: "Rata-rata 7 hari: 289",
    accent: "success" as const,
  },
  {
    label: "Menunggu Moderasi",
    value: "12",
    helper: "8 portofolio • 4 ulasan",
    accent: "warning" as const,
  },
];

export const userRows = [
  {
    id: "user-1001",
    name: "Budi Santoso",
    businessName: "CV Maju Jaya Konstruksi",
    city: "Bandung",
    tier: "pro",
    activeProjects: 3,
    registeredAt: "12 Jan 2026",
    lastActive: "3 jam lalu",
    status: "Aktif",
    phone: "081234567890",
    notes: [
      {
        author: "Rani Admin",
        timestamp: "23 Apr 2026 09:12",
        content: "Pelanggan aktif dan responsif. Sempat meminta invoice terpisah per proyek.",
      },
    ],
  },
  {
    id: "user-1002",
    name: "Dina Prameswari",
    businessName: "PT Nusa Karya Mandiri",
    city: "Jakarta",
    tier: "business",
    activeProjects: 7,
    registeredAt: "28 Feb 2026",
    lastActive: "42 menit lalu",
    status: "Perlu Verifikasi",
    phone: "081345678901",
    notes: [],
  },
  {
    id: "user-1003",
    name: "Rama Fadillah",
    businessName: "Rama Build Studio",
    city: "Surabaya",
    tier: "free",
    activeProjects: 1,
    registeredAt: "02 Mar 2026",
    lastActive: "1 hari lalu",
    status: "Suspend",
    phone: "082134567890",
    notes: [
      {
        author: "Sinta Moderator",
        timestamp: "20 Apr 2026 15:40",
        content: "Suspend sementara karena spam portofolio duplikat.",
      },
    ],
  },
  {
    id: "user-1004",
    name: "Fahri Nugraha",
    businessName: "Fahri Interior & Build",
    city: "Yogyakarta",
    tier: "pro",
    activeProjects: 2,
    registeredAt: "18 Apr 2026",
    lastActive: "15 menit lalu",
    status: "Aktif",
    phone: "081998877665",
    notes: [],
  },
];

export const moderationPortfolioRows = [
  {
    id: "port-queue-1",
    contractor: "CV Maju Jaya Konstruksi",
    city: "Bandung",
    project: "Renovasi Kafe Braga",
    projectType: "Fit-out Interior",
    duration: "3 bulan",
    submittedAt: "2 jam lalu",
    status: "pending",
    coverImage: mockPortfolioEntries[0]?.coverImage,
  },
  {
    id: "port-queue-2",
    contractor: "PT Nusa Karya Mandiri",
    city: "Jakarta",
    project: "Showroom Otomotif PIK",
    projectType: "Komersial",
    duration: "4 bulan",
    submittedAt: "5 jam lalu",
    status: "pending",
    coverImage: mockPortfolioEntries[0]?.coverImage,
  },
  {
    id: "port-queue-3",
    contractor: "Rama Build Studio",
    city: "Surabaya",
    project: "Rumah Tinggal Satelit",
    projectType: "Residensial",
    duration: "6 bulan",
    submittedAt: "Kemarin",
    status: "rejected",
    coverImage: mockPortfolioEntries[1]?.coverImage,
  },
];

export const moderationReviewRows = [
  {
    id: "review-q-1",
    contractor: "CV Maju Jaya Konstruksi",
    owner: "Ibu A***",
    rating: 5,
    comment:
      "Dokumentasi proyek sangat rapi dan update progres harian membuat kami tenang.",
    project: "Renovasi Rumah Aruna",
    submittedAt: "1 jam lalu",
    status: "pending",
    flagged: false,
  },
  {
    id: "review-q-2",
    contractor: "PT Nusa Karya Mandiri",
    owner: "Bpk H***",
    rating: 3,
    comment:
      "Pengerjaan bagus tapi ada beberapa kata yang perlu disensor agar tetap profesional.",
    project: "Gudang PIK 2",
    submittedAt: "4 jam lalu",
    status: "pending",
    flagged: true,
  },
  {
    id: "review-q-3",
    contractor: mockReviews[0]?.contractorName ?? "KontraktorPro Partner",
    owner: "Ibu A***",
    rating: mockReviews[0]?.rating ?? 5,
    comment: mockReviews[0]?.comment ?? "Ulasan terverifikasi.",
    project: "Kafe Braga",
    submittedAt: "2 hari lalu",
    status: "approved",
    flagged: false,
  },
];

export const financeSummary = {
  mrr: 94200000,
  arr: 1130400000,
  revenueThisMonth: 108700000,
  failedTransactions: 14,
};

export const financeTransactions = [
  ...mockPayments.map((item, index) => ({
    id: `TX-${index + 1001}`,
    date: "23 Apr 2026",
    user: "Budi Santoso",
    tier: item.tier,
    period: "Bulanan",
    amount: item.amount,
    status: item.status,
  })),
  {
    id: "TX-1004",
    date: "22 Apr 2026",
    user: "Dina Prameswari",
    tier: "business" as const,
    period: "Tahunan",
    amount: 3899000,
    status: "paid" as const,
  },
  {
    id: "TX-1005",
    date: "22 Apr 2026",
    user: "Rama Fadillah",
    tier: "pro" as const,
    period: "Bulanan",
    amount: 149000,
    status: "failed" as const,
  },
];

export const cancelReasons = [
  {
    name: "Rizky Saputra",
    previousTier: "Pro",
    reason: "Proyek sedang selesai semua, akan kembali saat ada tender baru.",
    cancelledAt: "18 Apr 2026",
  },
  {
    name: "CV Pilar Utama",
    previousTier: "Business",
    reason: "Perlu approval procurement internal sebelum perpanjang.",
    cancelledAt: "16 Apr 2026",
  },
  {
    name: "Nadira Build",
    previousTier: "Pro",
    reason: "Mencoba paket gratis sementara.",
    cancelledAt: "12 Apr 2026",
  },
];

export const packageRows = [
  {
    tier: "free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    customers: 1734,
    activeProjectLimit: 1,
    workerLimit: 1,
    features: ["Dashboard proyek dasar", "Portofolio publik", "1 proyek aktif"],
    trial: false,
  },
  {
    tier: "pro",
    monthlyPrice: 149000,
    yearlyPrice: 1490000,
    customers: 512,
    activeProjectLimit: 5,
    workerLimit: 8,
    features: ["Laporan PDF", "Link pantau owner", "Reminder deadline"],
    trial: true,
  },
  {
    tier: "business",
    monthlyPrice: 399000,
    yearlyPrice: 3990000,
    customers: 172,
    activeProjectLimit: 0,
    workerLimit: 0,
    features: ["Multi-admin", "Proyek tanpa batas", "Support onboarding"],
    trial: true,
  },
];

export const promoRows = [
  {
    code: "PROHEMAT",
    discount: "20%",
    appliesTo: "Pro",
    limit: 150,
    used: 38,
    expiresAt: "30 Apr 2026",
    status: "Aktif",
  },
  {
    code: "BISNIS2026",
    discount: "Rp100.000",
    appliesTo: "Business",
    limit: 50,
    used: 12,
    expiresAt: "15 Mei 2026",
    status: "Aktif",
  },
];

export const adminLogs = mockAdminLogs.map((item, index) => ({
  id: item.id,
  timestamp: item.timestamp.replace("T", " ").replace(".000Z", " WIB"),
  admin: item.actor,
  level: index % 2 === 0 ? "super_admin" : "moderator",
  actionType:
    index % 2 === 0 ? "Moderasi Konten" : "Manajemen Pengguna",
  description:
    index % 2 === 0
      ? `Approve portofolio: ${item.target}`
      : `Review laporan pengguna: ${item.target}`,
  target: item.target,
  ipAddress: "103.147.92.12",
}));

export const platformActivity = [
  "Budi Santoso upgrade ke paket Pro • 8 menit lalu",
  "Portofolio baru dikirim oleh PT Nusa Karya Mandiri • 12 menit lalu",
  "Pembayaran Business berhasil • 18 menit lalu",
  "Laporan pengguna baru masuk • 29 menit lalu",
  "Kontraktor baru mendaftar dari Semarang • 41 menit lalu",
];

export const growthBars = [42, 55, 61, 68, 74, 82, 91, 106, 112, 118, 126, 134];
export const revenueBars = [56, 59, 61, 66, 70, 74, 77, 81, 84, 89, 92, 94];
