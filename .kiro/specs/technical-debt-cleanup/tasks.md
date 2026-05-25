# Implementation Plan

## Overview

Implementasi fix untuk 6 masalah technical debt di KontraktorPro secara berurutan, dimulai dari exploration test, preservation test, lalu fix satu per satu. Setiap fix diverifikasi dengan TypeScript compilation sebelum lanjut ke fix berikutnya.

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "2"] },
    { "wave": 2, "tasks": ["3", "4", "5", "6", "7"] },
    { "wave": 3, "tasks": ["8"] },
    { "wave": 4, "tasks": ["9", "10"] },
    { "wave": 5, "tasks": ["11"] }
  ]
}
```

## Tasks

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Definisi Duplikat di Luar Canonical Source
  - **CRITICAL**: Test ini HARUS FAIL pada kode unfixed — kegagalan membuktikan bug ada
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: Test ini mengenkode expected behavior — akan memvalidasi fix saat pass setelah implementasi
  - **GOAL**: Buktikan bahwa simbol-simbol kritis didefinisikan di lebih dari satu tempat dan route yang direferensikan tidak ada
  - **Scoped PBT Approach**: Scope ke kasus konkret yang deterministik — cek file-file spesifik
  - Tulis test yang memverifikasi:
    - `src/lib/ui/cn.ts` mendefinisikan `cn` secara independen (bukan re-export dari `utils.ts`)
    - `src/app/(app)/_components/mock-data.ts` mengekspor `ProjectStatus` dengan nilai `"aktif"` (bukan `"active"`)
    - `src/lib/navigation.ts` berisi route `/proyek` yang tidak ada di filesystem
    - `src/app/robots.ts` menggunakan URL hardcoded berbeda dari `siteConfig.url`
  - Run test pada kode UNFIXED
  - **EXPECTED OUTCOME**: Test FAILS (ini benar — membuktikan bug ada)
  - Dokumentasikan counterexample yang ditemukan
  - Mark task complete saat test ditulis, dijalankan, dan kegagalan didokumentasikan
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 3.1, 3.2, 4.1_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Semua Halaman dan Flow yang Ada Tetap Berjalan
  - **IMPORTANT**: Ikuti observation-first methodology
  - Observe: `tsc --noEmit` pass tanpa error pada kode unfixed
  - Observe: `getProjects()` mengembalikan 4 proyek dengan semua field lengkap
  - Observe: `getStatusLabel("aktif")` mengembalikan `"Aktif"` pada kode unfixed
  - Observe: komponen yang mengimpor `cn` dari `@/lib/ui/cn` render tanpa error
  - Tulis preservation tests:
    - TypeScript compilation check: `tsc --noEmit` harus pass (baseline)
    - Mock data integrity: `getProjects()` mengembalikan array dengan length 4
    - Status label: semua status values menghasilkan label Indonesian yang benar
    - Import resolution: semua komponen UI yang menggunakan `cn` dari `@/lib/ui/cn` resolve tanpa error
  - Run tests pada kode UNFIXED
  - **EXPECTED OUTCOME**: Tests PASS (ini mengkonfirmasi baseline behavior yang harus dipreservasi)
  - Mark task complete saat tests ditulis, dijalankan, dan passing pada unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Fix 1 — Konsolidasi `cn()`

  - [x] 3.1 Ubah `src/lib/ui/cn.ts` menjadi re-export dari `src/lib/utils.ts`
    - Hapus implementasi independen (`clsx` + `twMerge`)
    - Ganti dengan: `export { cn } from "@/lib/utils";`
    - Hapus import `clsx` dan `tailwind-merge` yang tidak lagi dibutuhkan
    - _Bug_Condition: isBugCondition("src/lib/ui/cn.ts", "cn") = true (mendefinisikan ulang)_
    - _Expected_Behavior: cn.ts hanya re-export, tidak mendefinisikan ulang_
    - _Preservation: semua komponen yang mengimpor dari @/lib/ui/cn tetap berjalan_
    - _Requirements: 1.1, 1.2, 3.4_

  - [x] 3.2 Hapus definisi `cn` lokal di `src/app/(app)/_components/ui.tsx`
    - Hapus fungsi `cn` lokal (implementasi inferior tanpa `clsx`/`tailwind-merge`)
    - Tambah `import { cn } from "@/lib/utils";` di bagian atas file
    - Verifikasi semua penggunaan `cn` di file tersebut tetap berfungsi
    - _Requirements: 1.3_

  - [x] 3.3 Update import `cn` di `src/components/layout/app-shell.tsx`
    - Ubah `import { cn } from "@/lib/ui/cn"` → `import { cn } from "@/lib/utils"`
    - _Requirements: 1.1_

  - [x] 3.4 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Tidak Ada Definisi Duplikat `cn`
    - **IMPORTANT**: Re-run test yang SAMA dari task 1 — jangan tulis test baru
    - Run bug condition exploration test dari step 1 (bagian cn)
    - **EXPECTED OUTCOME**: Test PASSES (mengkonfirmasi cn hanya ada di satu tempat)
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 3.5 Verify preservation tests still pass
    - **Property 2: Preservation** - Komponen UI Tetap Berjalan
    - **IMPORTANT**: Re-run tests yang SAMA dari task 2 — jangan tulis test baru
    - Run `tsc --noEmit` — harus pass tanpa error baru
    - **EXPECTED OUTCOME**: Tests PASS (tidak ada regresi)

- [x] 4. Fix 2 — Konsolidasi `ProjectStatus` enum

  - [x] 4.1 Update `mock-data.ts` untuk menggunakan canonical `ProjectStatus`
    - Hapus `export type ProjectStatus = "aktif" | "tertunda" | "selesai" | "arsip"`
    - Tambah `import { type ProjectStatus } from "@/lib/contracts/enums"`
    - Update semua nilai status di array `projects`:
      - `"aktif"` → `"active"`
      - `"tertunda"` → `"delayed"`
      - `"selesai"` → `"completed"`
      - `"arsip"` → `"archived"`
    - _Bug_Condition: isBugCondition("mock-data.ts", "ProjectStatus") = true_
    - _Expected_Behavior: ProjectStatus menggunakan nilai canonical English_
    - _Preservation: getProjects() tetap mengembalikan 4 proyek dengan semua field_
    - _Requirements: 2.1, 2.2_

  - [x] 4.2 Update fungsi-fungsi yang memfilter berdasarkan status
    - Update `getStatusBadgeVariant`: `"aktif"` → `"active"`, `"tertunda"` → `"delayed"`, `"selesai"` → `"completed"`
    - Update `getStatusLabel`: `"aktif"` → `"active"`, dst. (label Indonesian tetap dikembalikan)
    - Update `getDashboardSummary`: filter `status === "active"` dan `status === "completed"`
    - Update `getProjectCounts`: semua filter menggunakan nilai canonical
    - _Requirements: 2.3_

  - [x] 4.3 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - `ProjectStatus` Menggunakan Nilai Canonical
    - **IMPORTANT**: Re-run test yang SAMA dari task 1 — jangan tulis test baru
    - **EXPECTED OUTCOME**: Test PASSES

  - [x] 4.4 Verify preservation tests still pass
    - **Property 2: Preservation** - Mock Data Integrity
    - Run `tsc --noEmit` — harus pass
    - Verifikasi `getProjects()` masih mengembalikan 4 proyek
    - Verifikasi `getStatusLabel("active")` mengembalikan `"Aktif"`
    - **EXPECTED OUTCOME**: Tests PASS

- [x] 5. Fix 3 — Perbaiki navigasi broken

  - [x] 5.1 Update `contractorSidebarNavigation` di `src/lib/navigation.ts`
    - Ganti `/proyek` → `/projects`
    - Ganti `/langganan` → `/billing`
    - Hapus `/portofolio` (route belum ada)
    - Hapus `/pengaturan-akun` (route belum ada)
    - _Bug_Condition: route "/proyek" tidak ada di filesystem_
    - _Expected_Behavior: semua route di navigation ada di filesystem_
    - _Requirements: 3.1_

  - [x] 5.2 Update `adminSidebarNavigation` di `src/lib/navigation.ts`
    - Ganti `/admin/pengguna` → `/admin/users`
    - Ganti `/admin/moderasi-portofolio` → `/admin/moderation/portfolio`
    - Ganti `/admin/moderasi-ulasan` → `/admin/moderation/reviews`
    - Ganti `/admin/keuangan` → `/admin/finance`
    - Ganti `/admin/paket` → `/admin/packages`
    - Ganti `/admin/log-aktivitas` → `/admin/logs`
    - Hapus `/admin/aktivitas`, `/admin/verifikasi`, `/admin/laporan`, `/admin/notifikasi` (belum ada)
    - _Requirements: 3.2, 3.3_

  - [x] 5.3 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Semua Route di Navigation Ada
    - **IMPORTANT**: Re-run test yang SAMA dari task 1 — jangan tulis test baru
    - **EXPECTED OUTCOME**: Test PASSES

  - [x] 5.4 Verify preservation tests still pass
    - **Property 2: Preservation** - Admin dan Contractor Pages Tetap Accessible
    - Run `tsc --noEmit` — harus pass
    - **EXPECTED OUTCOME**: Tests PASS

- [x] 6. Fix 4 — URL mismatch `robots.ts`

  - [x] 6.1 Update `src/app/robots.ts` untuk menggunakan `siteConfig.url`
    - Tambah `import { siteConfig } from "@/lib/site"`
    - Ganti `"https://kontraktorpro.app/sitemap.xml"` → `` `${siteConfig.url}/sitemap.xml` ``
    - _Bug_Condition: robots.ts menggunakan URL hardcoded berbeda dari siteConfig.url_
    - _Expected_Behavior: robots.ts menggunakan siteConfig.url sebagai single source of truth_
    - _Requirements: 4.1_

  - [x] 6.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - URL Konsisten
    - **IMPORTANT**: Re-run test yang SAMA dari task 1 — jangan tulis test baru
    - **EXPECTED OUTCOME**: Test PASSES

- [x] 7. Fix 5 — Hapus duplikasi `formatCurrency` dan `formatDate`

  - [x] 7.1 Update `mock-data.ts` untuk mengimpor formatter dari `utils.ts`
    - Hapus definisi lokal `formatCurrency` dan `formatDate`
    - Tambah `import { formatCurrency, formatDate } from "@/lib/utils"`
    - Tambah re-export: `export { formatCurrency, formatDate } from "@/lib/utils"` agar komponen yang mengimpor dari `mock-data` tidak perlu diubah
    - **CATATAN**: Format tanggal akan berubah dari `"short"` ke `"long"` (Apr → April) — ini perubahan visual yang disengaja
    - _Bug_Condition: mock-data.ts mendefinisikan formatCurrency dan formatDate secara independen_
    - _Expected_Behavior: mock-data.ts re-export dari utils.ts_
    - _Preservation: project-detail-content.tsx dan komponen lain yang mengimpor dari mock-data tetap berjalan_
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 7.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Tidak Ada Duplikasi Formatter
    - **IMPORTANT**: Re-run test yang SAMA dari task 1 — jangan tulis test baru
    - **EXPECTED OUTCOME**: Test PASSES

  - [x] 7.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Formatter Tetap Berfungsi
    - Run `tsc --noEmit` — harus pass
    - Verifikasi `formatCurrency(285000000)` menghasilkan `"Rp 285.000.000"`
    - **EXPECTED OUTCOME**: Tests PASS

- [x] 8. Fix 6 — Konsolidasi app-shell

  - [x] 8.1 Analisis komponen yang sudah ada di `src/components/layout/`
    - Baca `app-sidebar.tsx`, `app-topbar.tsx`, `bottom-nav.tsx`, `app-navbar.tsx`
    - Identifikasi props yang dibutuhkan untuk konfigurasi contractor-specific
    - Tentukan apakah komponen-komponen tersebut sudah cukup atau perlu props tambahan

  - [x] 8.2 Konfigurasi generic shell untuk contractor app
    - Update `src/app/(app)/layout.tsx` untuk menggunakan `AppShell` dari `src/components/layout/app-shell.tsx`
    - Pass sidebar, topbar, dan bottomNav sebagai props menggunakan komponen dari `src/components/layout/`
    - Pastikan navigasi menggunakan `contractorSidebarNavigation` dari `src/lib/navigation.ts` (yang sudah diperbaiki di Fix 3)
    - _Bug_Condition: layout.tsx menggunakan hardcoded app-shell dari _components/_
    - _Expected_Behavior: layout.tsx menggunakan generic composable shell_
    - _Preservation: semua halaman di (app) route group tetap render dengan benar_
    - _Requirements: 6.1, 6.2_

  - [x] 8.3 Deprecate atau hapus `src/app/(app)/_components/app-shell.tsx`
    - Setelah layout.tsx tidak lagi mengimpornya, file ini dapat dihapus
    - Verifikasi tidak ada file lain yang mengimpornya sebelum menghapus

  - [x] 8.4 Verify preservation tests still pass
    - **Property 2: Preservation** - Semua Halaman (app) Tetap Render
    - Run `tsc --noEmit` — harus pass
    - Verifikasi `/dashboard`, `/projects`, `/projects/[id]` render tanpa error
    - **EXPECTED OUTCOME**: Tests PASS

- [x] 9. Small Improvement A — Wire `@tanstack/react-query`

  - [x] 9.1 Buat `QueryProvider` client component
    - Buat file baru: `src/components/providers/query-provider.tsx`
    - Implementasi `QueryClientProvider` dengan `QueryClient` yang dikonfigurasi dengan default options yang sesuai
    - Tambah `ReactQueryDevtools` untuk development
    - _Requirements: 3.6_

  - [x] 9.2 Tambah `QueryProvider` ke root layout
    - Update `src/app/layout.tsx` untuk wrap children dengan `QueryProvider`
    - Pastikan `Toaster` tetap ada dan posisinya tidak berubah
    - _Requirements: 3.6_

  - [x] 9.3 Verify tidak ada regresi
    - Run `tsc --noEmit` — harus pass
    - Verifikasi semua halaman tetap render tanpa error hydration

- [x] 10. Small Improvement B — Setup Zustand store dasar

  - [x] 10.1 Buat UI store
    - Buat file baru: `src/lib/store/ui-store.ts`
    - Definisikan store untuk UI state: `sidebarOpen: boolean`, `activeFilters: Record<string, string>`
    - Gunakan Zustand v5 API (`create` dari `zustand`)
    - _Requirements: 3.7_

  - [x] 10.2 Buat barrel export untuk stores
    - Buat file baru: `src/lib/store/index.ts`
    - Export semua stores dari satu titik

  - [x] 10.3 Verify tidak ada regresi
    - Run `tsc --noEmit` — harus pass
    - Store baru tidak digunakan oleh komponen mana pun — tidak ada perubahan behavior

- [x] 11. Checkpoint — Pastikan semua fix bersih

  - [x] 11.1 Run TypeScript compilation final
    - `tsc --noEmit` harus pass tanpa error
    - Jika ada error, selesaikan sebelum lanjut

  - [x] 11.2 Verifikasi tidak ada import yang broken
    - Cek semua file yang dimodifikasi tidak memiliki unresolved imports
    - Cek `src/lib/ui/cn.ts` re-export berfungsi dengan benar

  - [x] 11.3 Update `docs/Project_Codebase.md`
    - Update section 9 "Unknown/Unclear Areas" — hapus item yang sudah diselesaikan
    - Update section 6 "Dependency Map" — tambah `QueryClientProvider` dan Zustand store
    - Update section 4 "Function Reference" — update `cn` canonical source, hapus duplikasi `formatCurrency`/`formatDate`

  - [x] 11.4 Buat `docs/CHANGELOG.md` entry
    - Dokumentasikan semua perubahan sesuai format AGENTS.md
    - Catat semua file yang dimodifikasi, dibuat, dan dihapus
    - Catat architecture impact dan risk notes

  - Pastikan semua tests pass. Tanyakan ke user jika ada pertanyaan.

## Notes

- Tulis exploration tests (Task 1) SEBELUM mengimplementasikan fix apapun
- Jalankan tests pada kode UNFIXED untuk membuktikan bug ada
- Ikuti observation-first methodology untuk preservation tests (Task 2)
- Setiap fix diverifikasi dengan `tsc --noEmit` sebelum lanjut ke fix berikutnya
- Fix 6 (app-shell) adalah yang paling berisiko — lakukan terakhir setelah semua fix lain verified
- `src/lib/ui/cn.ts` TIDAK dihapus — diubah menjadi re-export untuk backward compatibility
- `src/app/(app)/_components/app-shell.tsx` dihapus setelah layout.tsx tidak lagi menggunakannya
- Format tanggal akan berubah dari "short" ke "long" setelah Fix 5 — ini disengaja
