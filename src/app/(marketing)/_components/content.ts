import type { ReactNode } from "react";
import {
  BookOpenText,
  Building2,
  Camera,
  ClipboardList,
  FileCheck2,
  FolderKanban,
  LayoutTemplate,
  Link2,
  MapPin,
  MessageCircleMore,
  ShieldAlert,
  Trophy,
  Users,
} from "lucide-react";

export type PlanName = "Gratis" | "Pro" | "Bisnis";

export type MarketingPlan = {
  name: PlanName;
  monthlyPrice: string;
  yearlyPrice?: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
  note?: string;
};

export type ContractorProfile = {
  slug: string;
  businessName: string;
  ownerName: string;
  city: string;
  experienceYears: number;
  completedProjects: number;
  packageTier: "Gratis" | "Pro" | "Bisnis";
  rating: number;
  reviewCount: number;
  specialties: string[];
  about?: string;
  phoneVisible: boolean;
  whatsappNumber: string;
  active: boolean;
  since: string;
  hero: string;
  portfolio: Array<{
    title: string;
    type: string;
    location: string;
    duration: string;
    coverLabel: string;
    rating?: number;
    year: string;
    summary: string;
  }>;
  reviews: Array<{
    ownerMasked: string;
    rating: number;
    projectName: string;
    year: string;
    body: string;
  }>;
};

export type OwnerTrackingRecord = {
  token: string;
  active: boolean;
  projectName: string;
  location: string;
  status: "Sedang Berjalan" | "Selesai" | "Ditunda";
  contractorSlug: string;
  contractorName: string;
  contractorBusiness: string;
  updatedAt: string;
  overallProgress: number;
  stats: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  visibleItems: Array<{
    name: string;
    progress: number;
    status: "Selesai" | "Berjalan" | "Belum Mulai";
  }>;
  photos: Array<{
    label: string;
    date: string;
  }>;
  updates: Array<{
    date: string;
    title: string;
    note: string;
  }>;
};

export const navigationLinks = [
  { href: "/#fitur", label: "Fitur" },
  { href: "/harga", label: "Harga" },
  { href: "/#tentang", label: "Tentang" },
];

export const painPoints: Array<{
  title: string;
  description: string;
  icon: typeof MessageCircleMore;
}> = [
  {
    title: "Koordinasi tercecer di WhatsApp",
    description: "Update proyek, catatan material, dan revisi owner tenggelam di chat harian.",
    icon: MessageCircleMore,
  },
  {
    title: "Laporan masih tulis tangan",
    description: "Mandor mencatat manual lalu rekap ulang malam hari, rawan lupa dan telat kirim.",
    icon: BookOpenText,
  },
  {
    title: "Foto proyek tersebar di galeri",
    description: "Dokumentasi susah dicari kembali saat owner minta progres minggu lalu.",
    icon: Camera,
  },
  {
    title: "Tidak ada bukti saat sengketa",
    description: "Saat progres dipertanyakan, kontraktor kesulitan menunjukkan jejak update yang rapi.",
    icon: ShieldAlert,
  },
  {
    title: "Kewalahan pegang banyak proyek",
    description: "Deadline, tim, dan progres tiap lokasi bercampur tanpa dashboard yang jelas.",
    icon: FolderKanban,
  },
  {
    title: "Portofolio hanya foto acak",
    description: "Hasil kerja bagus sulit dipercaya calon owner karena tidak tampil profesional.",
    icon: LayoutTemplate,
  },
];

export const featureHighlights: Array<{
  label: string;
  title: string;
  description: string;
  bullets: string[];
  visualLabel: string;
  accent: string;
  icon: typeof ClipboardList;
}> = [
  {
    label: "Laporan Harian",
    title: "Laporan harian terstruktur langsung dari lapangan",
    description:
      "Catat progres, tenaga, material, dan kendala proyek dalam format yang rapi dan mudah dibagikan.",
    bullets: ["Form mobile-first", "Foto, catatan, dan progres dalam satu update", "Timeline proyek selalu up to date"],
    visualLabel: "Mockup laporan harian",
    accent: "from-sky-100 to-white",
    icon: ClipboardList,
  },
  {
    label: "PDF ke Owner",
    title: "Kirim laporan PDF profesional tanpa edit manual",
    description:
      "Pilih update yang ingin dibagikan, lalu hasilkan laporan proyek siap kirim ke owner dalam hitungan detik.",
    bullets: ["Template rapi", "Siap kirim WhatsApp", "Branding usaha ikut tampil"],
    visualLabel: "Preview laporan PDF",
    accent: "from-orange-100 to-white",
    icon: FileCheck2,
  },
  {
    label: "Link Pantau",
    title: "Owner bisa memantau progres real-time tanpa login",
    description:
      "Bagikan satu link read-only agar owner melihat progres inti, foto terbaru, dan update proyek kapan saja.",
    bullets: ["Link unik aman", "Read-only", "Tampilan profesional"],
    visualLabel: "Preview link pantau owner",
    accent: "from-emerald-100 to-white",
    icon: Link2,
  },
  {
    label: "Portofolio Publik",
    title: "Bangun reputasi lewat profil publik yang terverifikasi",
    description:
      "Tampilkan spesialisasi, proyek selesai, dan ulasan owner agar calon klien percaya sebelum menghubungi.",
    bullets: ["Direktori publik", "Rating & ulasan", "Siap dibagikan di media sosial"],
    visualLabel: "Preview profil publik",
    accent: "from-violet-100 to-white",
    icon: Trophy,
  },
];

export const comparisonRows = [
  {
    aspect: "Riwayat progres proyek",
    legacy: "Chat tercecer dan sulit dicari",
    modern: "Timeline proyek rapi, terurut, dan siap dibagikan",
  },
  {
    aspect: "Laporan ke owner",
    legacy: "Edit manual dari catatan dan foto",
    modern: "Generate PDF profesional dalam satu klik",
  },
  {
    aspect: "Dokumentasi lapangan",
    legacy: "Tersebar di galeri HP dan grup chat",
    modern: "Foto tertaut ke laporan dan item pekerjaan",
  },
  {
    aspect: "Pantau banyak proyek",
    legacy: "Harus ingat satu-satu lewat chat",
    modern: "Dashboard progres dan deadline per proyek",
  },
  {
    aspect: "Bangun reputasi usaha",
    legacy: "Portofolio tidak konsisten",
    modern: "Profil publik terverifikasi dengan ulasan owner",
  },
];

export const testimonials = [
  {
    name: "Bima Saputra",
    city: "Bandung",
    quote:
      "Sekarang owner tidak lagi minta foto satu-satu. Saya tinggal kirim link pantau dan laporan mingguan.",
  },
  {
    name: "Rizki Mandala",
    city: "Bekasi",
    quote:
      "Yang paling terasa itu laporan harian jadi rapi. Mandor bisa isi di lapangan, saya tinggal review malam hari.",
  },
  {
    name: "Aulia Konstruksi",
    city: "Surabaya",
    quote:
      "Profil publik bikin calon owner lebih yakin. Saat dihubungi, mereka sudah lihat hasil proyek dan ulasan duluan.",
  },
];

export const pricingPlans: MarketingPlan[] = [
  {
    name: "Gratis",
    monthlyPrice: "Rp 0",
    description: "Untuk mulai lebih rapi di proyek pertama.",
    features: [
      "1 proyek aktif",
      "Laporan harian terstruktur",
      "Upload dokumentasi dasar",
      "Tim inti proyek",
      "Profil publik dasar",
    ],
    cta: "Mulai Gratis",
  },
  {
    name: "Pro",
    monthlyPrice: "Rp 129.000",
    yearlyPrice: "Rp 103.200",
    description: "Untuk kontraktor yang butuh laporan owner dan reputasi lebih kuat.",
    features: [
      "Proyek aktif tanpa batas kecil",
      "Generate laporan PDF",
      "Link pantau owner",
      "Prioritas di direktori",
      "Portofolio publik terverifikasi",
      "Ringkasan progres & deadline",
      "Coba gratis 14 hari",
    ],
    cta: "Coba Pro",
    featured: true,
    note: "Coba 14 hari gratis, batalkan kapan saja",
  },
  {
    name: "Bisnis",
    monthlyPrice: "Rp 249.000",
    yearlyPrice: "Rp 199.200",
    description: "Untuk usaha yang menangani banyak proyek dan butuh kontrol lebih rapi.",
    features: [
      "Semua fitur Pro",
      "Multi admin usaha",
      "Prioritas direktori tertinggi",
      "Template laporan brand usaha",
      "Ekspor data lanjutan",
      "Dukungan prioritas",
    ],
    cta: "Mulai Bisnis",
  },
];

export const faqItems = [
  {
    question: "Apakah benar-benar gratis selamanya?",
    answer:
      "Ya. Paket Gratis tetap bisa dipakai untuk 1 proyek aktif tanpa kartu kredit dan tanpa batas waktu.",
  },
  {
    question: "Bagaimana cara membayar?",
    answer:
      "Saat ini alur pembayaran dirancang untuk transfer bank, QRIS, kartu kredit, dan e-wallet melalui checkout aman.",
  },
  {
    question: "Bisa cancel kapan saja?",
    answer:
      "Bisa. Paket berbayar dapat dihentikan kapan saja dan manfaatnya aktif sampai akhir periode berjalan.",
  },
  {
    question: "Apa yang terjadi jika downgrade ke Gratis?",
    answer:
      "Data lama tetap aman. Fitur premium seperti link pantau dan prioritas direktori berhenti sampai Anda upgrade kembali.",
  },
  {
    question: "Apakah ada diskon untuk asosiasi kontraktor?",
    answer:
      "Rencana diskon kolektif tersedia. Tim KontraktorPro dapat dihubungi untuk kebutuhan komunitas atau asosiasi.",
  },
  {
    question: "Apakah data aman jika berhenti berlangganan?",
    answer:
      "Ya. Data tetap tersimpan dan dapat diakses kembali saat Anda masuk dan mengaktifkan paket yang sesuai.",
  },
];

export const contractors: ContractorProfile[] = [
  {
    slug: "mitra-bangun-santosa",
    businessName: "Mitra Bangun Santosa",
    ownerName: "Andri Saputra",
    city: "Bandung",
    experienceYears: 9,
    completedProjects: 42,
    packageTier: "Bisnis",
    rating: 4.9,
    reviewCount: 18,
    specialties: ["Rumah Tinggal", "Renovasi", "Ruko"],
    about:
      "Mitra Bangun Santosa fokus pada pembangunan rumah tinggal dan renovasi premium dengan update progres yang disiplin dan dokumentasi lengkap.",
    phoneVisible: true,
    whatsappNumber: "+62 812-3456-7788",
    active: true,
    since: "2017",
    hero: "Renovasi rumah dua lantai dengan finishing rapi dan timeline terkontrol.",
    portfolio: [
      {
        title: "Renovasi Rumah Keluarga Wijaya",
        type: "Renovasi",
        location: "Bandung Timur",
        duration: "4 bulan",
        coverLabel: "Fasad rumah modern",
        rating: 5,
        year: "2025",
        summary: "Renovasi total rumah tinggal dengan pembaruan fasad, interior, dan area servis.",
      },
      {
        title: "Pembangunan Ruko Setiabudi",
        type: "Ruko",
        location: "Bandung Barat",
        duration: "6 bulan",
        coverLabel: "Ruko dua lantai",
        rating: 4.8,
        year: "2024",
        summary: "Proyek ruko komersial dengan pekerjaan struktur, arsitektur, dan finishing.",
      },
      {
        title: "Rumah Tinggal Cimenyan",
        type: "Rumah Tinggal",
        location: "Cimenyan",
        duration: "7 bulan",
        coverLabel: "Rumah tinggal kontemporer",
        rating: 4.9,
        year: "2024",
        summary: "Pembangunan rumah baru dengan fokus pada pencahayaan alami dan detailing fasad.",
      },
    ],
    reviews: [
      {
        ownerMasked: "Ibu W***",
        rating: 5,
        projectName: "Renovasi Rumah Keluarga Wijaya",
        year: "2025",
        body: "Komunikasi rapi, progres jelas, dan dokumentasi selalu dikirim tepat waktu.",
      },
      {
        ownerMasked: "Bapak H***",
        rating: 4.8,
        projectName: "Pembangunan Ruko Setiabudi",
        year: "2024",
        body: "Tim cepat merespons perubahan lapangan dan update selalu mudah dipahami.",
      },
    ],
  },
  {
    slug: "graha-renovasi-prima",
    businessName: "Graha Renovasi Prima",
    ownerName: "Naufal Hadi",
    city: "Jakarta Selatan",
    experienceYears: 7,
    completedProjects: 29,
    packageTier: "Pro",
    rating: 4.8,
    reviewCount: 12,
    specialties: ["Renovasi", "Interior", "Kafe"],
    about:
      "Spesialis renovasi rumah, kafe, dan interior bisnis kecil dengan fokus pengerjaan rapi dan owner update mingguan.",
    phoneVisible: true,
    whatsappNumber: "+62 811-2299-8811",
    active: true,
    since: "2019",
    hero: "Renovasi komersial cepat dengan finishing yang rapi dan dokumentasi owner-friendly.",
    portfolio: [
      {
        title: "Renovasi Kafe Tebet",
        type: "Kafe",
        location: "Tebet",
        duration: "2 bulan",
        coverLabel: "Interior kafe",
        rating: 4.9,
        year: "2025",
        summary: "Renovasi interior dan fasad kafe aktif tanpa menutup operasional terlalu lama.",
      },
      {
        title: "Interior Apartemen Bintaro",
        type: "Interior",
        location: "Bintaro",
        duration: "6 minggu",
        coverLabel: "Interior apartemen minimalis",
        year: "2024",
        summary: "Custom interior apartemen dengan penyimpanan efisien dan finishing minimalis.",
      },
    ],
    reviews: [
      {
        ownerMasked: "Ibu S***",
        rating: 4.9,
        projectName: "Renovasi Kafe Tebet",
        year: "2025",
        body: "Saya suka karena semua progres dikirim dengan bahasa yang mudah dipahami owner.",
      },
    ],
  },
  {
    slug: "sinar-properti-mandiri",
    businessName: "Sinar Properti Mandiri",
    ownerName: "Fajar Nugroho",
    city: "Surabaya",
    experienceYears: 11,
    completedProjects: 56,
    packageTier: "Gratis",
    rating: 4.6,
    reviewCount: 8,
    specialties: ["Rumah Tinggal", "Gedung", "Ruko"],
    phoneVisible: false,
    whatsappNumber: "",
    active: true,
    since: "2014",
    hero: "Kontraktor umum dengan pengalaman proyek rumah tinggal hingga ruko kawasan niaga.",
    portfolio: [
      {
        title: "Rumah Tinggal Darmo",
        type: "Rumah Tinggal",
        location: "Surabaya",
        duration: "8 bulan",
        coverLabel: "Rumah bergaya tropis",
        year: "2024",
        summary: "Pembangunan rumah tinggal dengan layout tropis dan area keluarga terbuka.",
      },
    ],
    reviews: [],
  },
  {
    slug: "arsitek-bersama-jaya",
    businessName: "Arsitek Bersama Jaya",
    ownerName: "Dewi Permatasari",
    city: "Yogyakarta",
    experienceYears: 5,
    completedProjects: 17,
    packageTier: "Pro",
    rating: 4.7,
    reviewCount: 6,
    specialties: ["Rumah Tinggal", "Villa", "Renovasi"],
    phoneVisible: true,
    whatsappNumber: "+62 813-7000-4433",
    active: false,
    since: "2021",
    hero: "Profil ini sengaja dinonaktifkan untuk contoh state tidak tersedia.",
    portfolio: [],
    reviews: [],
  },
];

export const ownerTrackingRecords: OwnerTrackingRecord[] = [
  {
    token: "santosa-bdg-78",
    active: true,
    projectName: "Pembangunan Rumah Tinggal Cimenyan",
    location: "Cimenyan, Bandung",
    status: "Sedang Berjalan",
    contractorSlug: "mitra-bangun-santosa",
    contractorName: "Andri Saputra",
    contractorBusiness: "Mitra Bangun Santosa",
    updatedAt: "3 jam lalu",
    overallProgress: 67,
    stats: {
      completed: 8,
      inProgress: 3,
      notStarted: 2,
    },
    visibleItems: [
      { name: "Pekerjaan struktur lantai 2", progress: 100, status: "Selesai" },
      { name: "Pemasangan bata ringan area depan", progress: 82, status: "Berjalan" },
      { name: "Plumbing kamar mandi utama", progress: 60, status: "Berjalan" },
      { name: "Finishing plafon", progress: 0, status: "Belum Mulai" },
    ],
    photos: [
      { label: "Pengecoran selesai", date: "22 Apr 2026" },
      { label: "Dinding area depan", date: "21 Apr 2026" },
      { label: "Material datang", date: "21 Apr 2026" },
      { label: "Progres lantai 2", date: "20 Apr 2026" },
    ],
    updates: [
      {
        date: "22 Apr 2026",
        title: "Pekerjaan struktur lantai 2 mencapai 100%",
        note: "Pengecoran selesai dan area masuk tahap curing.",
      },
      {
        date: "21 Apr 2026",
        title: "Pemasangan bata ringan naik ke 82%",
        note: "Tim fokus pada area depan dan kamar utama.",
      },
      {
        date: "20 Apr 2026",
        title: "Plumbing kamar mandi utama mulai dikerjakan",
        note: "Material pipa sudah lengkap dan instalasi awal berjalan baik.",
      },
    ],
  },
  {
    token: "arsip-ruko-2025",
    active: true,
    projectName: "Pembangunan Ruko Setiabudi",
    location: "Bandung Barat",
    status: "Selesai",
    contractorSlug: "mitra-bangun-santosa",
    contractorName: "Andri Saputra",
    contractorBusiness: "Mitra Bangun Santosa",
    updatedAt: "12 hari lalu",
    overallProgress: 100,
    stats: {
      completed: 12,
      inProgress: 0,
      notStarted: 0,
    },
    visibleItems: [
      { name: "Struktur utama", progress: 100, status: "Selesai" },
      { name: "Fasad ruko", progress: 100, status: "Selesai" },
      { name: "Finishing interior", progress: 100, status: "Selesai" },
    ],
    photos: [
      { label: "Fasad final", date: "10 Apr 2026" },
      { label: "Interior selesai", date: "10 Apr 2026" },
    ],
    updates: [
      {
        date: "10 Apr 2026",
        title: "Proyek selesai 100%",
        note: "Serah terima proyek dilakukan dan dokumentasi final dikirim ke owner.",
      },
    ],
  },
  {
    token: "owner-link-off",
    active: false,
    projectName: "",
    location: "",
    status: "Ditunda",
    contractorSlug: "",
    contractorName: "",
    contractorBusiness: "",
    updatedAt: "",
    overallProgress: 0,
    stats: {
      completed: 0,
      inProgress: 0,
      notStarted: 0,
    },
    visibleItems: [],
    photos: [],
    updates: [],
  },
  {
    token: "owner-link-empty",
    active: true,
    projectName: "Proyek Renovasi Cibubur",
    location: "Cibubur, Jakarta Timur",
    status: "Ditunda",
    contractorSlug: "graha-renovasi-prima",
    contractorName: "Naufal Hadi",
    contractorBusiness: "Graha Renovasi Prima",
    updatedAt: "baru dibuat",
    overallProgress: 0,
    stats: {
      completed: 0,
      inProgress: 0,
      notStarted: 0,
    },
    visibleItems: [],
    photos: [],
    updates: [],
  },
];

export const featureTableSections: Array<{
  title: string;
  rows: Array<{
    feature: string;
    free: ReactNode;
    pro: ReactNode;
    business: ReactNode;
  }>;
}> = [
  {
    title: "Manajemen Proyek",
    rows: [
      { feature: "Proyek aktif", free: "1 proyek", pro: "Hingga 10 proyek", business: "Tanpa batas kecil" },
      { feature: "Dashboard progres", free: true, pro: true, business: true },
      { feature: "Deadline & ringkasan", free: false, pro: true, business: true },
    ],
  },
  {
    title: "Laporan & Dokumentasi",
    rows: [
      { feature: "Laporan harian", free: true, pro: true, business: true },
      { feature: "Laporan PDF", free: false, pro: true, business: true },
      { feature: "Link pantau owner", free: false, pro: true, business: true },
    ],
  },
  {
    title: "Tim",
    rows: [
      { feature: "Tim inti proyek", free: "Dasar", pro: "Lengkap", business: "Lengkap + multi admin" },
    ],
  },
  {
    title: "Portofolio & Direktori",
    rows: [
      { feature: "Profil publik", free: true, pro: true, business: true },
      { feature: "Prioritas direktori", free: "Standar", pro: "Prioritas", business: "Paling atas" },
    ],
  },
  {
    title: "Data & Analitik",
    rows: [
      { feature: "Ringkasan progres", free: false, pro: true, business: true },
      { feature: "Ekspor data", free: false, pro: false, business: true },
    ],
  },
  {
    title: "Dukungan",
    rows: [
      { feature: "Dukungan prioritas", free: false, pro: false, business: true },
    ],
  },
];

export function getContractorBySlug(slug: string) {
  return contractors.find((contractor) => contractor.slug === slug);
}

export function getOwnerTrackingByToken(token: string) {
  return ownerTrackingRecords.find((record) => record.token === token);
}

export function getTierRank(tier: ContractorProfile["packageTier"]) {
  if (tier === "Bisnis") return 3;
  if (tier === "Pro") return 2;
  return 1;
}

export const marketingHighlights = [
  {
    label: "500+",
    description: "kontraktor mulai merapikan progres proyeknya",
    icon: Users,
  },
  {
    label: "12 kota",
    description: "sudah punya pengguna aktif dari proyek nyata",
    icon: MapPin,
  },
  {
    label: "1 platform",
    description: "untuk laporan, dokumentasi, link owner, dan portofolio",
    icon: Building2,
  },
];

export const directorySortOptions = [
  "Rating Tertinggi",
  "Proyek Terbanyak",
  "Terbaru Bergabung",
];
