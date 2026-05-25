import type {
  AdminActivityLog,
  ContractorProfile,
  DailyReport,
  MaterialEntry,
  PaymentTransaction,
  PortfolioEntry,
  Project,
  ProjectMember,
  ProjectPhoto,
  Review,
  Subscription,
  User,
  WbsItem,
} from "./types";

export const mockCurrentUser: User = {
  id: "user-1",
  fullName: "Budi Santoso",
  businessName: "CV Maju Jaya Konstruksi",
  email: "budi@cvmajujaya.com",
  phone: "081234567890",
  city: "Bandung",
  role: "contractor",
  subscriptionTier: "pro",
};

export const mockSubscriptions: Subscription[] = [
  {
    id: "sub-free",
    tier: "free",
    price: 0,
    activeProjectLimit: 1,
    pdfReports: false,
    ownerTracking: false,
    publicPortfolio: true,
  },
  {
    id: "sub-pro",
    tier: "pro",
    price: 149000,
    activeProjectLimit: 5,
    pdfReports: true,
    ownerTracking: true,
    publicPortfolio: true,
  },
  {
    id: "sub-business",
    tier: "business",
    price: 399000,
    activeProjectLimit: 999,
    pdfReports: true,
    ownerTracking: true,
    publicPortfolio: true,
  },
];

export const mockProjects: Project[] = [
  {
    id: "proj-1",
    name: "Renovasi Ruko Setiabudi",
    type: "Renovasi Komersial",
    location: "Bandung",
    ownerName: "PT Setiabudi Niaga",
    status: "active",
    progress: 78,
    daysRemaining: 23,
    reportsCount: 47,
    photosCount: 126,
    contractValue: 850000000,
  },
  {
    id: "proj-2",
    name: "Pembangunan Rumah Tinggal Aruna",
    type: "Rumah Tinggal",
    location: "Cimahi",
    ownerName: "Keluarga Aruna",
    status: "delayed",
    progress: 41,
    daysRemaining: -2,
    reportsCount: 19,
    photosCount: 67,
    contractValue: 420000000,
  },
  {
    id: "proj-3",
    name: "Gudang Distribusi Cikarang",
    type: "Industrial",
    location: "Bekasi",
    ownerName: "PT Logi Nusantara",
    status: "completed",
    progress: 100,
    daysRemaining: 0,
    reportsCount: 63,
    photosCount: 214,
    contractValue: 1500000000,
  },
];

export const mockWbsItems: WbsItem[] = [
  {
    id: "wbs-1",
    projectId: "proj-1",
    name: "Pekerjaan Struktur",
    category: "Struktur",
    weight: 30,
    volume: "1 paket",
    progress: 100,
    status: "completed",
    updatedAt: "2026-04-20",
  },
  {
    id: "wbs-2",
    projectId: "proj-1",
    name: "Pekerjaan Arsitektur",
    category: "Finishing",
    weight: 45,
    volume: "1 paket",
    progress: 72,
    status: "active",
    updatedAt: "2026-04-22",
  },
  {
    id: "wbs-3",
    projectId: "proj-1",
    name: "MEP",
    category: "Utilitas",
    weight: 25,
    volume: "1 paket",
    progress: 48,
    status: "active",
    updatedAt: "2026-04-21",
  },
];

export const mockReports: DailyReport[] = [
  {
    id: "rep-1",
    projectId: "proj-1",
    date: "2026-04-23",
    weather: "Cerah",
    author: "Mandor Agus",
    updatesCount: 8,
    photosCount: 12,
    status: "submitted",
    hasIssue: false,
  },
  {
    id: "rep-2",
    projectId: "proj-1",
    date: "2026-04-22",
    weather: "Mendung",
    author: "Mandor Agus",
    updatesCount: 6,
    photosCount: 9,
    status: "submitted",
    hasIssue: true,
  },
];

export const mockPhotos: ProjectPhoto[] = [
  {
    id: "photo-1",
    projectId: "proj-1",
    title: "Pemasangan plafon ruang utama",
    date: "2026-04-23",
    uploader: "Mandor Agus",
    workItem: "Pekerjaan Arsitektur",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd",
  },
  {
    id: "photo-2",
    projectId: "proj-1",
    title: "Pengecekan jalur kabel",
    date: "2026-04-22",
    uploader: "Mandor Agus",
    workItem: "MEP",
    url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef",
  },
];

export const mockMembers: ProjectMember[] = [
  {
    id: "member-1",
    projectId: "proj-1",
    name: "Agus Saputra",
    role: "mandor",
    status: "aktif",
    reportsSubmitted: 21,
  },
  {
    id: "member-2",
    projectId: "proj-1",
    name: "Rian Setiawan",
    role: "spesialis",
    status: "aktif",
    reportsSubmitted: 6,
  },
];

export const mockMaterials: MaterialEntry[] = [
  {
    id: "mat-1",
    projectId: "proj-1",
    date: "2026-04-23",
    name: "Gypsum Board",
    quantity: "120 lembar",
    supplier: "CV Bangun Jaya",
    recordedBy: "Agus Saputra",
  },
  {
    id: "mat-2",
    projectId: "proj-1",
    date: "2026-04-21",
    name: "Kabel NYM",
    quantity: "8 roll",
    supplier: "Toko Listrik Maju",
    recordedBy: "Rian Setiawan",
  },
];

export const mockContractorProfile: ContractorProfile = {
  slug: "cv-maju-jaya-konstruksi",
  headline: "Kontraktor renovasi, bangun baru, dan fit-out komersial.",
  city: "Bandung",
  verifiedProjects: 18,
  rating: 4.9,
  about:
    "Tim KontraktorPro ini berfokus pada proyek rumah tinggal, ruko, dan bangunan komersial ringan dengan dokumentasi yang rapi.",
  specialties: ["Renovasi", "Fit-out Interior", "Rumah Tinggal"],
};

export const mockPortfolioEntries: PortfolioEntry[] = [
  {
    id: "port-1",
    title: "Renovasi Kafe Braga",
    location: "Bandung",
    finishedAt: "2025-10-12",
    coverImage: mockPhotos[0].url,
    status: "approved",
  },
  {
    id: "port-2",
    title: "Pembangunan Rumah Cluster Aruna",
    location: "Cimahi",
    finishedAt: "2026-02-03",
    coverImage: mockPhotos[1].url,
    status: "pending",
  },
];

export const mockReviews: Review[] = [
  {
    id: "review-1",
    contractorName: "CV Maju Jaya Konstruksi",
    ownerName: "Ibu Aruna",
    rating: 5,
    comment: "Komunikasi rapi, progres jelas, dan dokumentasi sangat membantu.",
    status: "approved",
  },
];

export const mockPayments: PaymentTransaction[] = [
  {
    id: "pay-1",
    tier: "pro",
    method: "QRIS",
    amount: 149000,
    status: "paid",
  },
];

export const mockAdminLogs: AdminActivityLog[] = [
  {
    id: "log-1",
    actor: "Rani Admin",
    action: "approve_portfolio",
    target: "Renovasi Kafe Braga",
    timestamp: "2026-04-23T08:30:00.000Z",
  },
  {
    id: "log-2",
    actor: "Rani Admin",
    action: "review_user_report",
    target: "Laporan pengguna #1290",
    timestamp: "2026-04-23T09:10:00.000Z",
  },
];
