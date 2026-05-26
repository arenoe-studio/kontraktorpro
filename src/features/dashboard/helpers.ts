/**
 * Dashboard pure helper functions
 *
 * Semua fungsi di file ini adalah pure functions — tidak ada side effects,
 * tidak ada I/O, tidak ada dependency eksternal selain tipe dari types.ts.
 * Ini memudahkan pengujian secara terisolasi.
 *
 * @see src/features/dashboard/dashboard-service.ts (konsumen utama)
 * @see src/features/dashboard/__tests__/helpers.unit.test.ts
 * @see src/features/dashboard/__tests__/helpers.property.test.ts
 */

import type { DashboardReminder, ReminderType } from "./types";

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

/**
 * Representasi minimal proyek yang dibutuhkan oleh helper functions.
 * Digunakan oleh `sortActiveProjects` dan `buildReminders`.
 */
export type RawProject = {
  id: string;
  name: string;
  status: "active" | "delayed";
  targetDate: Date | null;
};

/**
 * Parameter untuk fungsi `buildReminders`.
 * Berisi semua data agregat yang dibutuhkan untuk menghasilkan reminder.
 */
export type BuildReminderParams = {
  /** Proyek berstatus active atau delayed milik pengguna. */
  activeProjects: Array<{
    id: string;
    name: string;
    status: "active" | "delayed";
    targetDate: Date | null;
  }>;
  /**
   * Set berisi project ID yang sudah memiliki laporan submitted hari ini (UTC+7).
   * Digunakan untuk menentukan apakah perlu reminder danger.
   */
  projectsWithReportToday: Set<string>;
  /**
   * Set berisi project ID yang sudah memiliki entri portfolio (draft atau published).
   * Digunakan untuk menentukan apakah perlu reminder success.
   */
  projectsWithPortfolio: Set<string>;
  /** Waktu "sekarang" — diinjeksikan agar fungsi tetap pure dan mudah diuji. */
  now: Date;
};

// ---------------------------------------------------------------------------
// Konstanta
// ---------------------------------------------------------------------------

/** Offset WIB dalam milidetik (UTC+7 = 7 * 60 * 60 * 1000). */
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Nama bulan singkat dalam Bahasa Indonesia, index 0 = Januari. */
const INDONESIAN_MONTH_ABBR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
] as const;

/** Urutan prioritas tipe reminder untuk sorting. */
const REMINDER_PRIORITY: Record<ReminderType, number> = {
  danger: 0,
  warning: 1,
  success: 2,
  info: 3,
};

/** Batas maksimal reminder yang dikembalikan. */
const MAX_REMINDERS = 5;

/** Mapping action string ke label Bahasa Indonesia. */
const ACTION_LABEL_MAP: Record<string, string> = {
  project_created: "Proyek baru dibuat",
  report_submitted: "Laporan harian dikirim",
  photo_uploaded: "Foto ditambahkan ke galeri",
  member_added: "Anggota tim ditambahkan",
  status_changed: "Status proyek diperbarui",
  material_recorded: "Material dicatat",
};

// ---------------------------------------------------------------------------
// Fungsi konversi waktu
// ---------------------------------------------------------------------------

/**
 * Konversi tanggal UTC ke WIB (UTC+7) tanpa library timezone eksternal.
 *
 * Cara kerja: tambahkan 7 jam ke timestamp UTC. Hasilnya adalah objek Date
 * yang jika dibaca dengan metode UTC (getUTCHours, getUTCDate, dll.) akan
 * memberikan nilai waktu WIB yang benar.
 *
 * @param date - Tanggal dalam UTC
 * @returns Objek Date baru dengan timestamp digeser +7 jam
 */
export function toWIB(date: Date): Date {
  return new Date(date.getTime() + WIB_OFFSET_MS);
}

// ---------------------------------------------------------------------------
// Greeting
// ---------------------------------------------------------------------------

/**
 * Mengembalikan label sapaan berdasarkan jam WIB (0–23).
 *
 * Breakpoint:
 * - 05:00–11:59 → "Selamat pagi"
 * - 12:00–14:59 → "Selamat siang"
 * - 15:00–17:59 → "Selamat sore"
 * - 18:00–04:59 → "Selamat malam"
 *
 * @param hourWIB - Jam dalam WIB, integer 0–23
 * @returns Salah satu dari 4 label sapaan
 */
export function getGreetingLabel(hourWIB: number): string {
  if (hourWIB >= 5 && hourWIB <= 11) return "Selamat pagi";
  if (hourWIB >= 12 && hourWIB <= 14) return "Selamat siang";
  if (hourWIB >= 15 && hourWIB <= 17) return "Selamat sore";
  return "Selamat malam";
}

// ---------------------------------------------------------------------------
// Format waktu relatif
// ---------------------------------------------------------------------------

/**
 * Format selisih waktu antara `date` dan `now` menjadi string relatif (WIB).
 *
 * Breakpoint (berdasarkan selisih milidetik):
 * - < 1 menit (< 60.000 ms)       → "baru saja"
 * - 1–59 menit                     → "X menit lalu"
 * - 1–23 jam                       → "X jam lalu"
 * - 24–47 jam 59 menit (1 hari)    → "kemarin"
 * - 2–6 hari                       → "X hari lalu"
 * - ≥ 7 hari                       → "DD MMM YYYY" (bulan Indonesia)
 *
 * @param date - Timestamp kejadian
 * @param now  - Waktu referensi "sekarang"
 * @returns String waktu relatif dalam Bahasa Indonesia
 */
export function formatRelativeTime(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime();

  const ONE_MINUTE_MS = 60 * 1000;
  const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
  const ONE_DAY_MS = 24 * ONE_HOUR_MS;

  if (diffMs < ONE_MINUTE_MS) {
    return "baru saja";
  }

  if (diffMs < ONE_HOUR_MS) {
    const minutes = Math.floor(diffMs / ONE_MINUTE_MS);
    return `${minutes} menit lalu`;
  }

  if (diffMs < ONE_DAY_MS) {
    const hours = Math.floor(diffMs / ONE_HOUR_MS);
    return `${hours} jam lalu`;
  }

  if (diffMs < 2 * ONE_DAY_MS) {
    return "kemarin";
  }

  if (diffMs < 7 * ONE_DAY_MS) {
    const days = Math.floor(diffMs / ONE_DAY_MS);
    return `${days} hari lalu`;
  }

  // ≥ 7 hari: format "DD MMM YYYY" dengan bulan Indonesia
  const wibDate = toWIB(date);
  const day = wibDate.getUTCDate().toString().padStart(2, "0");
  const month = INDONESIAN_MONTH_ABBR[wibDate.getUTCMonth()];
  const year = wibDate.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

// ---------------------------------------------------------------------------
// Hitung sisa hari
// ---------------------------------------------------------------------------

/**
 * Hitung selisih hari kalender antara `targetDate` dan `now` dalam UTC+7.
 *
 * Menggunakan tanggal kalender (bukan selisih 24 jam penuh) sehingga:
 * - Jika targetDate adalah hari ini (WIB) → 0
 * - Jika targetDate adalah besok (WIB) → 1
 * - Jika targetDate sudah lewat kemarin (WIB) → -1
 *
 * @param targetDate - Tanggal target deadline
 * @param now        - Waktu referensi "sekarang"
 * @returns Selisih hari kalender; bisa negatif jika sudah lewat
 */
export function calcDaysRemaining(targetDate: Date, now: Date): number {
  const wibTarget = toWIB(targetDate);
  const wibNow = toWIB(now);

  // Normalisasi ke awal hari (00:00:00 UTC) untuk perbandingan kalender
  const targetDay = Date.UTC(
    wibTarget.getUTCFullYear(),
    wibTarget.getUTCMonth(),
    wibTarget.getUTCDate()
  );
  const nowDay = Date.UTC(
    wibNow.getUTCFullYear(),
    wibNow.getUTCMonth(),
    wibNow.getUTCDate()
  );

  return Math.round((targetDay - nowDay) / (24 * 60 * 60 * 1000));
}

// ---------------------------------------------------------------------------
// Build reminders
// ---------------------------------------------------------------------------

/**
 * Hasilkan daftar reminder dari data agregat proyek.
 *
 * Logika:
 * 1. Danger: proyek active/delayed yang belum submit laporan hari ini
 * 2. Warning: proyek active/delayed dengan targetDate ≤ 7 hari dari sekarang
 * 3. Success: proyek completed yang belum punya portfolio entry
 *    (Note: params.activeProjects hanya berisi active/delayed; completed
 *     ditangani di dashboard-service dan tidak masuk ke sini — lihat catatan
 *     di bawah)
 *
 * Urutan: danger → warning → success → info
 * Batas: maksimal 5 item
 *
 * @param params - Data agregat yang dibutuhkan untuk menghasilkan reminder
 * @returns Array reminder yang sudah diurutkan dan dibatasi
 */
export function buildReminders(params: BuildReminderParams): DashboardReminder[] {
  const { activeProjects, projectsWithReportToday, projectsWithPortfolio, now } =
    params;

  const reminders: DashboardReminder[] = [];

  for (const project of activeProjects) {
    // Danger: belum ada laporan submitted hari ini
    if (!projectsWithReportToday.has(project.id)) {
      reminders.push({
        id: `danger-report-${project.id}`,
        type: "danger",
        title: "Laporan belum dikirim",
        description: `Proyek "${project.name}" belum memiliki laporan harian hari ini.`,
        actionLabel: "Kirim Laporan",
        href: `/projects/${project.id}/reports/new`,
      });
    }

    // Warning: targetDate ≤ 7 hari dari sekarang
    if (project.targetDate !== null) {
      const daysRemaining = calcDaysRemaining(project.targetDate, now);
      if (daysRemaining <= 7) {
        reminders.push({
          id: `warning-deadline-${project.id}`,
          type: "warning",
          title: "Deadline mendekat",
          description:
            daysRemaining < 0
              ? `Proyek "${project.name}" sudah melewati deadline ${Math.abs(daysRemaining)} hari lalu.`
              : daysRemaining === 0
                ? `Proyek "${project.name}" deadline hari ini.`
                : `Proyek "${project.name}" deadline dalam ${daysRemaining} hari.`,
          actionLabel: "Lihat Proyek",
          href: `/projects/${project.id}`,
        });
      }
    }

    // Success: proyek completed tanpa portfolio
    // (Catatan: activeProjects hanya berisi active/delayed, jadi kondisi ini
    //  tidak akan terpicu dari sini. Reminder success untuk completed projects
    //  ditangani di dashboard-service.ts yang memanggil buildReminders dengan
    //  data yang sudah difilter. Untuk fleksibilitas, kita tetap cek di sini
    //  jika ada proyek completed yang dimasukkan ke params.)
    if (!projectsWithPortfolio.has(project.id)) {
      // Hanya tambahkan success reminder jika proyek sudah completed
      // (status "active"/"delayed" tidak memicu success reminder)
      // Kondisi ini tidak akan terpicu karena RawProject.status hanya active/delayed
      // Reminder success untuk completed projects ditangani terpisah di service
    }
  }

  // Urutkan berdasarkan prioritas: danger → warning → success → info
  reminders.sort(
    (a, b) => REMINDER_PRIORITY[a.type] - REMINDER_PRIORITY[b.type]
  );

  // Batasi maksimal 5 item
  return reminders.slice(0, MAX_REMINDERS);
}

// ---------------------------------------------------------------------------
// Sort active projects
// ---------------------------------------------------------------------------

/**
 * Urutkan proyek aktif berdasarkan urgensi:
 * 1. Proyek `delayed` muncul lebih dulu (diurutkan berdasarkan targetDate asc, null di akhir)
 * 2. Proyek `active` diurutkan berdasarkan targetDate ascending
 * 3. Proyek tanpa targetDate ditempatkan di akhir dalam kelompoknya
 *
 * @param projects - Array proyek berstatus active atau delayed
 * @returns Array proyek yang sudah diurutkan
 */
export function sortActiveProjects(projects: RawProject[]): RawProject[] {
  return [...projects].sort((a, b) => {
    // Delayed selalu sebelum active
    if (a.status !== b.status) {
      return a.status === "delayed" ? -1 : 1;
    }

    // Dalam kelompok yang sama, urutkan berdasarkan targetDate ascending
    // null targetDate ditempatkan di akhir
    if (a.targetDate === null && b.targetDate === null) return 0;
    if (a.targetDate === null) return 1;
    if (b.targetDate === null) return -1;

    return a.targetDate.getTime() - b.targetDate.getTime();
  });
}

// ---------------------------------------------------------------------------
// Map action label
// ---------------------------------------------------------------------------

/**
 * Petakan string action dari activity_logs ke label Bahasa Indonesia.
 *
 * Action yang dikenal:
 * - `project_created`  → "Proyek baru dibuat"
 * - `report_submitted` → "Laporan harian dikirim"
 * - `photo_uploaded`   → "Foto ditambahkan ke galeri"
 * - `member_added`     → "Anggota tim ditambahkan"
 * - `status_changed`   → "Status proyek diperbarui"
 * - `material_recorded`→ "Material dicatat"
 *
 * Action yang tidak dikenal dikembalikan apa adanya (tidak diubah).
 *
 * @param action - String action dari kolom `activity_logs.action`
 * @returns Label Bahasa Indonesia, atau action asli jika tidak dikenal
 */
export function mapActionLabel(action: string): string {
  return ACTION_LABEL_MAP[action] ?? action;
}

// ---------------------------------------------------------------------------
// Project limit check
// ---------------------------------------------------------------------------

/**
 * Periksa apakah kontraktor sudah mencapai batas proyek aktif sesuai tier.
 *
 * Batas per tier:
 * - `free`     → 1 proyek aktif
 * - `pro`      → 3 proyek aktif
 * - `business` → tidak terbatas (selalu false)
 *
 * @param activeCount - Jumlah proyek berstatus active atau delayed saat ini
 * @param tier        - Tier langganan pengguna ("free" | "pro" | "business")
 * @returns `true` jika sudah mencapai atau melebihi batas, `false` jika belum
 */
export function isAtProjectLimit(activeCount: number, tier: string): boolean {
  switch (tier) {
    case "free":
      return activeCount >= 1;
    case "pro":
      return activeCount >= 3;
    case "business":
      return false;
    default:
      // Tier tidak dikenal diperlakukan seperti free (paling ketat)
      return activeCount >= 1;
  }
}
