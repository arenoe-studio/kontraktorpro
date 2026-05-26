/**
 * Dashboard feature types
 *
 * Tipe-tipe ini digunakan oleh dashboard-service.ts dan DashboardPage.tsx.
 * Dipisah dari src/lib/contracts/types.ts karena spesifik untuk fitur dashboard.
 *
 * @see src/features/dashboard/dashboard-service.ts
 * @see src/app/(app)/_components/DashboardPage.tsx
 */

// ---------------------------------------------------------------------------
// Primitive / union types
// ---------------------------------------------------------------------------

/** Tipe visual untuk reminder dan aktivitas dashboard. */
export type ReminderType = "danger" | "warning" | "success" | "info";

// ---------------------------------------------------------------------------
// Blok C — Reminders
// ---------------------------------------------------------------------------

/** Satu item reminder yang ditampilkan di Blok C dashboard. */
export type DashboardReminder = {
  id: string;
  type: ReminderType;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
};

// ---------------------------------------------------------------------------
// Blok E — Activities
// ---------------------------------------------------------------------------

/** Satu item aktivitas terbaru yang ditampilkan di Blok E dashboard. */
export type DashboardActivity = {
  id: string;
  type: ReminderType;
  description: string;
  /** Waktu relatif yang sudah diformat, mis. "5 menit lalu" atau "kemarin". */
  time: string;
  /** Timestamp asli untuk keperluan sorting atau re-format di sisi klien. */
  createdAt: Date;
};

// ---------------------------------------------------------------------------
// Blok D — Active Projects
// ---------------------------------------------------------------------------

/** Satu item proyek aktif yang ditampilkan di Blok D dashboard. */
export type ActiveProjectItem = {
  id: string;
  name: string;
  type: string;
  location: string;
  ownerName: string;
  status: "active" | "delayed";
  /** Persentase kemajuan proyek, integer 0–100. */
  progress: number;
  /** ISO date string "YYYY-MM-DD", atau null jika tidak ada target. */
  targetDate: string | null;
  /** Jumlah hari menuju deadline (bisa negatif jika sudah lewat), atau null jika targetDate null. */
  daysRemaining: number | null;
  /** Jumlah daily_reports yang terkait dengan proyek ini. */
  reportCount: number;
  /** Jumlah foto proyek; bernilai 0 sampai tabel project_photos tersedia. */
  photoCount: number;
};

// ---------------------------------------------------------------------------
// Blok B — KPI: Near Deadline
// ---------------------------------------------------------------------------

/** Proyek yang mendekati deadline (daysRemaining ≤ 7), digunakan di Blok B KPI. */
export type NearDeadlineProject = {
  id: string;
  name: string;
  /** ISO date string "YYYY-MM-DD". */
  targetDate: string;
  /** Jumlah hari menuju deadline; bisa negatif jika sudah lewat. */
  daysRemaining: number;
};

// ---------------------------------------------------------------------------
// Agregat utama — DashboardSummary
// ---------------------------------------------------------------------------

/**
 * Tipe agregat yang berisi semua data yang dibutuhkan komponen DashboardPage.
 * Dihasilkan oleh getDashboardData(userId) di dashboard-service.ts.
 */
export type DashboardSummary = {
  // ------------------------------------------------------------------
  // Blok A — Greeting
  // ------------------------------------------------------------------

  /** Nama lengkap kontraktor dari tabel users. */
  fullName: string;
  /**
   * Label sapaan berdasarkan waktu WIB:
   * "Selamat pagi" | "Selamat siang" | "Selamat sore" | "Selamat malam"
   */
  greetingLabel: string;
  /** Jumlah proyek berstatus active atau delayed milik pengguna. */
  activeProjectCount: number;
  /**
   * Jumlah proyek aktif/delayed yang belum memiliki laporan submitted hari ini (UTC+7).
   */
  pendingReportCount: number;

  // ------------------------------------------------------------------
  // Blok B — KPI Cards
  // ------------------------------------------------------------------

  /**
   * Rasio laporan hari ini dalam format string "X/Y".
   * X = proyek aktif yang sudah submit laporan hari ini.
   * Y = total proyek aktif.
   * Contoh: "2/4", "0/0"
   */
  reportCompletionToday: string;
  /** Rata-rata progress seluruh proyek active/delayed, integer 0–100. */
  averageProgress: number;
  /** Jumlah proyek yang selesai (status completed) dalam bulan kalender ini (UTC+7). */
  finishedThisMonth: number;
  /** Proyek aktif/delayed dengan daysRemaining ≤ 7. */
  nearDeadlineProjects: NearDeadlineProject[];

  // ------------------------------------------------------------------
  // Blok C — Reminders
  // ------------------------------------------------------------------

  /** Daftar reminder yang dihasilkan dari kondisi data proyek, maksimal 5 item. */
  reminders: DashboardReminder[];

  // ------------------------------------------------------------------
  // Blok D — Active Projects
  // ------------------------------------------------------------------

  /** Daftar proyek aktif/delayed diurutkan berdasarkan urgensi, maksimal 5 item. */
  activeProjects: ActiveProjectItem[];

  // ------------------------------------------------------------------
  // Blok E — Activities
  // ------------------------------------------------------------------

  /** Daftar aktivitas terbaru lintas proyek, maksimal 10 item. */
  activities: DashboardActivity[];
  /**
   * True jika query activity_logs gagal (partial failure).
   * Dashboard tetap ditampilkan dengan activities kosong.
   */
  activityLoadError: boolean;

  // ------------------------------------------------------------------
  // Baris Bawah — Secondary Stats
  // ------------------------------------------------------------------

  /**
   * Jumlah hari menuju deadline proyek aktif yang paling dekat.
   * Bernilai 0 jika tidak ada proyek aktif dengan targetDate.
   */
  nearestDeadlineDays: number;
  /**
   * Jumlah foto yang diupload hari ini (UTC+7) untuk proyek milik pengguna.
   * Bernilai 0 jika tabel project_photos belum tersedia.
   */
  photosToday: number;
  /**
   * Total entri material (incoming + usage) untuk proyek aktif milik pengguna.
   * Bernilai 0 jika tabel material_entries belum tersedia.
   */
  materialsRecordedTotal: number;
  /**
   * Jumlah anggota tim aktif (isActive = true) lintas semua proyek milik pengguna.
   * Bernilai 0 jika tidak ada data.
   */
  activeMemberCount: number;

  // ------------------------------------------------------------------
  // State flags
  // ------------------------------------------------------------------

  /**
   * True jika kontraktor sudah mencapai batas proyek aktif sesuai tier langganan:
   * free = 1 proyek, pro = 3 proyek, business = tidak terbatas.
   */
  isProjectLimitReached: boolean;
};
