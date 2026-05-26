# Implementation Plan: Dashboard Real Data

## Overview

Menggantikan semua data mock/hardcoded pada Dashboard Utama Kontraktor (`/dashboard`) dengan data riil dari PostgreSQL (Neon) via Drizzle ORM. Implementasi mengikuti pola server-side aggregation: satu fungsi `getDashboardData(userId)` mengeksekusi semua query, mengagregasi hasilnya menjadi `DashboardSummary`, lalu meneruskannya sebagai props ke `DashboardPage`.

Urutan implementasi mengikuti dependency graph: DB layer → types & pure functions → service layer → UI integration → seed script → error boundary.

## Tasks

- [x] 1. DB Migration — tambah kolom `target_date` dan `completed_at` ke tabel `projects`
  - Buat file `drizzle/0002_dashboard_columns.sql` dengan dua ALTER TABLE statement
  - Kolom `target_date date` (nullable) dan `completed_at timestamp` (nullable)
  - Jalankan migration ke Neon dengan `npm run db:generate` lalu apply manual atau via Drizzle push
  - _Requirements: 3.6_

- [x] 2. Update Drizzle schema — tambah kolom baru ke tabel `projects`
  - [x] 2.1 Tambah `targetDate` dan `completedAt` ke definisi tabel `projects` di `src/lib/db/schema.ts`
    - Import `date` dari `drizzle-orm/pg-core` (belum ada di import list)
    - Tambah `targetDate: date("target_date")` (nullable, tanpa `.notNull()`)
    - Tambah `completedAt: timestamp("completed_at")` (nullable, tanpa `.notNull()`)
    - Pastikan tidak ada perubahan pada kolom yang sudah ada
    - _Requirements: 3.6_

- [x] 3. Buat tipe `DashboardSummary` dan tipe turunan
  - [x] 3.1 Buat file `src/features/dashboard/types.ts` dengan semua tipe yang dibutuhkan
    - Definisikan `ReminderType`, `DashboardReminder`, `DashboardActivity`, `ActiveProjectItem`, `NearDeadlineProject`
    - Definisikan `DashboardSummary` dengan semua field sesuai design document (Blok A–F + state flags)
    - Import `SubscriptionTier` dari `src/lib/contracts/enums.ts` jika dibutuhkan
    - _Requirements: 1.3, 9.1_

- [x] 4. Buat pure helper functions
  - [x] 4.1 Buat file `src/features/dashboard/helpers.ts` dengan semua pure functions
    - `toWIB(date: Date): Date` — konversi UTC ke WIB (UTC+7) tanpa library timezone
    - `getGreetingLabel(hourWIB: number): string` — returns salah satu dari 4 label sapaan
    - `formatRelativeTime(date: Date, now: Date): string` — format waktu relatif dengan 6 breakpoint
    - `calcDaysRemaining(targetDate: Date, now: Date): number` — selisih hari dalam UTC+7
    - `buildReminders(params: BuildReminderParams): DashboardReminder[]` — generate + sort + limit 5
    - `sortActiveProjects(projects: RawProject[]): RawProject[]` — delayed dulu, lalu active by targetDate asc, null di akhir
    - `mapActionLabel(action: string): string` — mapping 6 action ke label Indonesia, fallback ke action asli
    - `isAtProjectLimit(activeCount: number, tier: string): boolean` — free=1, pro=3, business=unlimited
    - Definisikan tipe internal `BuildReminderParams` dan `RawProject` di file yang sama
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 4.4, 4.5, 5.2, 6.3, 6.5, 10.2, 10.4_

- [x] 5. Tulis tests untuk helper functions
  - [x] 5.1 Buat file `src/features/dashboard/__tests__/helpers.unit.test.ts` dengan unit tests edge cases
    - `getGreetingLabel`: jam 5 (batas bawah pagi), jam 11 (batas atas pagi), jam 0 (tengah malam), jam 4 (batas atas malam), jam 12, jam 17
    - `formatRelativeTime`: selisih 0 detik, 59 menit, tepat 1 jam, tepat 7 hari, 8 hari
    - `calcDaysRemaining`: targetDate hari ini, kemarin, besok, null handling
    - `buildReminders`: array kosong, lebih dari 5 kondisi (harus terpotong), urutan prioritas
    - `sortActiveProjects`: semua delayed, semua active, campuran, ada null targetDate
    - `mapActionLabel`: semua 6 action dikenal, action tidak dikenal
    - `isAtProjectLimit`: free dengan 0/1/2 proyek, pro dengan 2/3/4 proyek, business dengan 100 proyek
    - _Requirements: 2.2–2.5, 4.4, 4.5, 5.2, 6.3, 6.5, 10.2, 10.4_

  - [x]* 5.2 Buat file `src/features/dashboard/__tests__/helpers.property.test.ts` dengan property-based tests menggunakan fast-check
    - **Property 1: Greeting label selalu sesuai range jam WIB**
    - **Validates: Requirements 2.2, 2.3, 2.4, 2.5**
    - **Property 7: Reminder diurutkan dengan prioritas danger → warning → success → info**
    - **Validates: Requirements 4.4**
    - **Property 8: Jumlah reminder tidak pernah melebihi 5**
    - **Validates: Requirements 4.5**
    - **Property 9: activeProjects hanya berisi active/delayed, urutan urgensi, maksimal 5**
    - **Validates: Requirements 5.1, 5.2, 5.3**
    - **Property 10: daysRemaining null jika dan hanya jika targetDate null**
    - **Validates: Requirements 5.5**
    - **Property 11: Format waktu relatif selalu sesuai breakpoint**
    - **Validates: Requirements 6.5**
    - **Property 12: mapActionLabel mengembalikan label Indonesia untuk action dikenal, action asli untuk yang tidak dikenal**
    - **Validates: Requirements 6.3**
    - **Property 13: isAtProjectLimit akurat untuk semua kombinasi tier dan jumlah proyek**
    - **Validates: Requirements 10.2, 10.3, 10.4**
    - Setiap property diberi komentar `// Feature: dashboard-real-data, Property N: <deskripsi>`
    - Minimum 100 iterasi per property (default fast-check)
    - _Requirements: 2.2–2.5, 4.4, 4.5, 5.1–5.3, 5.5, 6.3, 6.5, 10.2–10.4_

- [x] 6. Checkpoint — Pastikan semua tests helper lulus
  - Jalankan `npm test` dan pastikan semua tests di `helpers.unit.test.ts` dan `helpers.property.test.ts` lulus
  - Pastikan tidak ada TypeScript error di `types.ts` dan `helpers.ts` dengan `npm run typecheck`
  - Tanyakan ke user jika ada pertanyaan sebelum melanjutkan.

- [x] 7. Buat `dashboard-service.ts` — fungsi utama `getDashboardData`
  - [x] 7.1 Buat file `src/features/dashboard/dashboard-service.ts` dengan fungsi `getDashboardData`
    - Import `db` dari `src/lib/db/index.ts` dan tabel-tabel yang dibutuhkan dari `src/lib/db/schema.ts`
    - Import semua helper functions dari `./helpers` dan tipe dari `./types`
    - **Step 1:** Query semua proyek milik user (`projects WHERE owner_id = userId`) → dapatkan `projectIds`
    - **Step 2:** Jalankan 4 query secara paralel via `Promise.all`: `daily_reports`, `activity_logs`, `project_members`, `portfolio_entries`
    - **Step 3:** Agregasi semua data menjadi `DashboardSummary` menggunakan helper functions
    - Implementasikan partial failure pattern untuk `activity_logs` (try-catch internal, return `activityLoadError: true`)
    - Implementasikan graceful degradation untuk `project_photos` dan `material_entries` (return 0 jika tabel belum ada)
    - Jika `projectIds` kosong (user tanpa proyek), skip query paralel dan return `DashboardSummary` dengan semua nilai 0 dan array kosong
    - Hitung `isProjectLimitReached` dari `users.subscriptionTier` dan `activeProjectCount` menggunakan `isAtProjectLimit`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1–2.7, 3.1–3.5, 4.1–4.6, 5.1–5.6, 6.1–6.6, 7.1–7.5, 10.2–10.4_

  - [x]* 7.2 Buat file `src/features/dashboard/__tests__/dashboard-service.test.ts` dengan integration tests
    - Mock Drizzle `db` instance untuk menghindari koneksi DB nyata di CI
    - Test: user dengan proyek lengkap → `DashboardSummary` valid dengan semua field terisi
    - Test: user tanpa proyek → semua nilai 0, semua array kosong, `isProjectLimitReached: false`
    - Test: `activity_logs` query gagal → `activityLoadError: true`, `activities: []`, dashboard tetap return
    - Test: `activeProjectCount` akurat untuk berbagai kombinasi status proyek
    - Test: `reportCompletionToday` format "X/Y" akurat
    - **Property 2: activeProjectCount akurat untuk semua kombinasi status proyek**
    - **Validates: Requirements 2.6, 3.1**
    - **Property 3: reportCompletionToday selalu dalam format "X/Y" dengan nilai akurat**
    - **Validates: Requirements 3.2**
    - **Property 4: averageProgress adalah rata-rata integer yang akurat**
    - **Validates: Requirements 3.3**
    - **Property 5: finishedThisMonth hanya menghitung proyek completed bulan ini**
    - **Validates: Requirements 3.4**
    - **Property 6: nearDeadlineProjects hanya berisi proyek dengan daysRemaining ≤ 7**
    - **Validates: Requirements 3.5**
    - **Property 14: DashboardSummary selalu memiliki shape yang valid untuk semua userId**
    - **Validates: Requirements 1.3, 9.1**
    - _Requirements: 1.1–1.5, 3.1–3.5, 6.6_

- [x] 8. Checkpoint — Pastikan service dan semua tests lulus
  - Jalankan `npm test` dan pastikan semua tests di `dashboard-service.test.ts` lulus
  - Jalankan `npm run typecheck` dan pastikan tidak ada error TypeScript
  - Tanyakan ke user jika ada pertanyaan sebelum melanjutkan.

- [x] 9. Modifikasi `DashboardPage.tsx` — terima `DashboardSummary` sebagai props
  - [x] 9.1 Modifikasi `src/app/(app)/_components/DashboardPage.tsx` untuk menerima data dari props
    - Ubah signature: `export function DashboardPage({ data }: { data: DashboardSummary })`
    - Import `DashboardSummary` dari `src/features/dashboard/types`
    - Hapus semua import dari `./mock-data` yang spesifik untuk dashboard (getDashboardSummary, getProjects)
    - Pertahankan import `getStatusBadgeVariant` dan `getStatusLabel` dari `./mock-data` — fungsi ini masih dibutuhkan untuk render badge status
    - Ganti semua referensi ke `summary.*` dan `activeProjects` dengan field dari `data.*`
    - Implementasikan empty state (Req 10.1): jika `data.activeProjectCount === 0 && data.finishedThisMonth === 0`, tampilkan onboarding card dengan tombol "Buat Proyek Pertama"
    - Implementasikan project limit banner (Req 10.3): jika `data.isProjectLimitReached`, tampilkan banner dan disable tombol "Buat Proyek Baru"
    - Implementasikan empty state Blok D (Req 10.5): jika `data.activeProjects.length === 0` (tapi user punya proyek lain), tampilkan empty state dengan tombol "Buat Proyek Baru"
    - Ganti data hardcoded di Shortcut section dengan link yang tidak bergantung pada ID proyek spesifik
    - _Requirements: 9.2, 9.3, 9.4, 10.1, 10.3, 10.5_

- [x] 10. Modifikasi `page.tsx` — panggil `getDashboardData` dan pass props
  - [x] 10.1 Modifikasi `src/app/(app)/dashboard/page.tsx` untuk memanggil service
    - Ubah menjadi async Server Component: `export default async function Page()`
    - Import `requireRole` dari `src/lib/auth/session`
    - Import `getDashboardData` dari `src/features/dashboard/dashboard-service`
    - Import `DashboardPage` dari `../_components/DashboardPage`
    - Panggil `requireRole("contractor")` untuk mendapatkan `user`
    - Panggil `getDashboardData(user.id)` untuk mendapatkan `data`
    - Render `<DashboardPage data={data} />`
    - Tidak perlu try-catch — biarkan exception propagate ke error boundary
    - _Requirements: 1.1, 9.1, 9.2, 9.6_

- [x] 11. Buat `error.tsx` untuk dashboard route
  - [x] 11.1 Buat file `src/app/(app)/dashboard/error.tsx` sebagai error boundary untuk route `/dashboard`
    - Gunakan `"use client"` directive (error boundaries harus client component di Next.js App Router)
    - Terima props `{ error: Error & { digest?: string }, reset: () => void }`
    - Tampilkan pesan error yang user-friendly dalam Bahasa Indonesia
    - Sertakan tombol "Coba Lagi" yang memanggil `reset()`
    - Gunakan komponen UI yang sudah ada (`SurfaceCard`, `ButtonLink`) untuk konsistensi visual
    - _Requirements: 9.6_

- [x] 12. Buat seed script untuk akun demo
  - [x] 12.1 Buat file `scripts/seed-demo.ts` dengan seed script idempoten
    - Import `db` dari `src/lib/db/index.ts` dan semua tabel yang dibutuhkan dari `src/lib/db/schema.ts`
    - Cari user `arenoe.studio@gmail.com` — jika tidak ada, log warning dan exit (jangan buat user baru)
    - Update `fullName` ke `"Budi Santoso"` dan `businessName` ke `"CV Maju Jaya Konstruksi"` jika berbeda
    - Seed 3 proyek dengan `onConflictDoNothing()` berdasarkan `name + owner_id`:
      - Proyek 1 (active): progress 65%, `targetDate` = 5 hari dari sekarang, nilai kontrak IDR 285.000.000
      - Proyek 2 (delayed): progress 30%, `targetDate` = 2 hari yang lalu, nilai kontrak IDR 162.000.000
      - Proyek 3 (completed): progress 100%, `completedAt` = bulan ini, nilai kontrak IDR 935.000.000
    - Seed `daily_reports`: minimal 5 per proyek aktif, proyek active tidak punya laporan submitted hari ini
    - Seed `activity_logs`: minimal 8 entri dengan action yang beragam (semua 6 action yang dikenal)
    - Seed `project_members`: minimal 5 anggota aktif lintas proyek
    - Tidak seed `portfolio_entries` untuk proyek completed (agar memicu success reminder)
    - Semua insert menggunakan `onConflictDoNothing()` untuk idempotency
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 12.2 Tambah npm script `seed:demo` ke `package.json`
    - Tambah `"seed:demo": "tsx scripts/seed-demo.ts"` ke bagian `scripts`
    - Pastikan `tsx` tersedia (sudah ada sebagai transitive dependency via `drizzle-kit`)
    - _Requirements: 8.6_

- [x] 13. Checkpoint — Verifikasi type check dan build
  - Jalankan `npm run typecheck` dan pastikan tidak ada TypeScript error di seluruh codebase
  - Jalankan `npm run lint` dan pastikan tidak ada ESLint error baru
  - Jalankan `npm test` dan pastikan semua tests lulus
  - Verifikasi bahwa `mock-data.ts` masih intact dan tidak ada import yang rusak di `/projects` dan `/projects/[id]`
  - Tanyakan ke user jika ada pertanyaan sebelum mendeklarasikan selesai.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirement spesifik untuk traceability
- `mock-data.ts` **tidak dihapus** — masih digunakan oleh `/projects` dan `/projects/[id]`
- `getStatusBadgeVariant` dan `getStatusLabel` dari `mock-data.ts` tetap digunakan di `DashboardPage.tsx` karena bersifat presentational (tidak ada data DB yang terlibat)
- Kolom `target_date` di DB menggunakan tipe `date` (bukan `timestamp`) — Drizzle mengembalikannya sebagai string `"YYYY-MM-DD"`
- Partial failure pattern untuk `activity_logs` memastikan dashboard tetap tampil meski log gagal diambil
- Seed script harus dijalankan setelah migration DB (Task 1) selesai

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1"] },
    { "id": 1, "tasks": ["3.1"] },
    { "id": 2, "tasks": ["4.1"] },
    { "id": 3, "tasks": ["5.1", "5.2"] },
    { "id": 4, "tasks": ["7.1"] },
    { "id": 5, "tasks": ["7.2"] },
    { "id": 6, "tasks": ["9.1", "11.1", "12.1"] },
    { "id": 7, "tasks": ["10.1", "12.2"] }
  ]
}
```
