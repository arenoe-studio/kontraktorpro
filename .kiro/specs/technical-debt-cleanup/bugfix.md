# Bugfix Requirements Document

## Introduction

KontraktorPro memiliki sejumlah inkonsistensi struktural dan duplikasi kode yang terakumulasi selama fase mock-first development. Masalah-masalah ini belum menyebabkan crash di production saat ini karena semua data masih hardcoded, namun akan menjadi bug nyata begitu integrasi DB dan fitur-fitur lanjutan diaktifkan. Dokumen ini mendefinisikan perilaku yang salah, perilaku yang benar, dan perilaku yang harus tetap tidak berubah untuk setiap item.

Enam masalah yang ditangani:
1. Duplikasi fungsi `cn()` di dua lokasi
2. Konflik `ProjectStatus` enum (Indonesian vs English values)
3. Navigasi broken — route yang direferensikan tidak ada
4. URL mismatch antara `robots.ts` dan `site.ts`
5. Duplikasi `formatCurrency` dan `formatDate` di `mock-data.ts`
6. Dua implementasi app-shell tanpa kepemilikan yang jelas

---

## Bug Analysis

### Current Behavior (Defect)

**Bug 1 — Duplikasi `cn()`**

1.1 WHEN komponen di `src/components/` mengimpor `cn`, THEN sistem menggunakan `src/lib/ui/cn.ts` sebagai sumber

1.2 WHEN komponen di `src/app/(app)/_components/` menggunakan `cn`, THEN sistem menggunakan implementasi lokal di `ui.tsx` yang merupakan versi sederhana (`values.filter(Boolean).join(" ")`) tanpa `clsx` dan `tailwind-merge`, sehingga class conflict tidak di-resolve dengan benar

1.3 WHEN `src/components/layout/app-shell.tsx` mengimpor `cn`, THEN sistem menggunakan `src/lib/ui/cn.ts`, bukan `src/lib/utils.ts` yang merupakan canonical source

**Bug 2 — Konflik `ProjectStatus` enum**

2.1 WHEN `mock-data.ts` mendefinisikan status proyek, THEN sistem menggunakan nilai Indonesian (`"aktif"`, `"tertunda"`, `"selesai"`, `"arsip"`) yang berbeda dari canonical enum di `src/lib/contracts/enums.ts` (`"active"`, `"delayed"`, `"completed"`, `"archived"`)

2.2 WHEN kode DB schema di `src/lib/db/schema.ts` menggunakan `ProjectStatus` dari `enums.ts`, THEN nilai dari `mock-data.ts` tidak akan cocok dengan nilai DB, menyebabkan query mismatch saat integrasi

**Bug 3 — Navigasi broken**

3.1 WHEN pengguna mengklik item navigasi contractor sidebar (`/proyek`, `/portofolio`, `/langganan`, `/pengaturan-akun`), THEN sistem mengarahkan ke route yang tidak ada (404)

3.2 WHEN pengguna mengklik item navigasi admin (`/admin/aktivitas`, `/admin/pengguna`, `/admin/verifikasi`, `/admin/laporan`, `/admin/moderasi-portofolio`, `/admin/moderasi-ulasan`, `/admin/notifikasi`, `/admin/paket`, `/admin/keuangan`, `/admin/log-aktivitas`), THEN sistem mengarahkan ke route yang tidak ada (404)

**Bug 4 — URL mismatch**

4.1 WHEN `src/app/robots.ts` dirender, THEN sistem menggunakan `https://kontraktorpro.app` sebagai base URL untuk sitemap

4.2 WHEN `src/lib/site.ts` digunakan untuk metadata, THEN sistem menggunakan `https://kontraktorpro.local` sebagai base URL, sehingga sitemap URL di robots.txt tidak konsisten dengan metadata URL

**Bug 5 — Duplikasi `formatCurrency` dan `formatDate`**

5.1 WHEN `project-detail-content.tsx` memformat nilai mata uang atau tanggal, THEN sistem mengimpor dari `mock-data.ts` (duplikat) bukan dari `src/lib/utils.ts` (canonical)

5.2 WHEN `formatDate` di `mock-data.ts` dipanggil, THEN sistem menggunakan format `"short"` untuk bulan (`"23 Apr 2026"`) yang berbeda dari canonical `src/lib/utils.ts` yang menggunakan format `"long"` (`"23 April 2026"`), menyebabkan inkonsistensi tampilan

**Bug 6 — Dua app-shell tanpa kepemilikan jelas**

6.1 WHEN `src/app/(app)/layout.tsx` merender shell, THEN sistem menggunakan `src/app/(app)/_components/app-shell.tsx` (hardcoded contractor shell) yang memiliki navigasi hardcoded berbeda dari `src/lib/navigation.ts`

6.2 WHEN `src/components/layout/app-shell.tsx` (generic composable shell) ada di codebase, THEN sistem tidak menggunakannya di mana pun dalam `(app)` route group, sehingga keberadaannya ambigu

---

### Expected Behavior (Correct)

**Bug 1 — Duplikasi `cn()`**

1.1 WHEN komponen mana pun mengimpor `cn`, THEN sistem SHALL menggunakan satu sumber tunggal: `src/lib/utils.ts`

1.2 WHEN `src/lib/ui/cn.ts` ada, THEN sistem SHALL menjadikannya re-export dari `src/lib/utils.ts` untuk backward compatibility dengan semua komponen yang sudah mengimpornya

1.3 WHEN `cn` digunakan di `src/app/(app)/_components/ui.tsx`, THEN sistem SHALL mengimpor dari `src/lib/utils.ts` bukan mendefinisikan implementasi lokal yang inferior

**Bug 2 — Konflik `ProjectStatus` enum**

2.1 WHEN `mock-data.ts` mendefinisikan tipe status proyek, THEN sistem SHALL menggunakan `ProjectStatus` dari `src/lib/contracts/enums.ts` (`"draft"`, `"active"`, `"delayed"`, `"completed"`, `"archived"`)

2.2 WHEN data mock proyek menggunakan status, THEN sistem SHALL menggunakan nilai English canonical (`"active"`, `"delayed"`, `"completed"`) yang sesuai dengan DB schema

2.3 WHEN fungsi `getStatusLabel`, `getStatusBadgeVariant`, `getDashboardSummary`, dan `getProjectCounts` memfilter berdasarkan status, THEN sistem SHALL menggunakan nilai canonical English sebagai kondisi filter

**Bug 3 — Navigasi broken**

3.1 WHEN `contractorSidebarNavigation` didefinisikan, THEN sistem SHALL menggunakan route yang benar: `/projects` (bukan `/proyek`), `/billing` (bukan `/langganan`), dan menghapus `/portofolio` dan `/pengaturan-akun` yang belum ada

3.2 WHEN `adminSidebarNavigation` didefinisikan, THEN sistem SHALL menggunakan route yang benar: `/admin/users` (bukan `/admin/pengguna`), `/admin/moderation/portfolio` (bukan `/admin/moderasi-portofolio`), `/admin/moderation/reviews` (bukan `/admin/moderasi-ulasan`), `/admin/finance` (bukan `/admin/keuangan`), `/admin/packages` (bukan `/admin/paket`), `/admin/logs` (bukan `/admin/log-aktivitas`)

3.3 WHEN route admin yang belum ada direferensikan (`/admin/aktivitas`, `/admin/verifikasi`, `/admin/laporan`, `/admin/notifikasi`), THEN sistem SHALL menandainya sebagai `disabled: true` atau menghapusnya dari navigasi

**Bug 4 — URL mismatch**

4.1 WHEN `robots.ts` membangun sitemap URL, THEN sistem SHALL menggunakan `siteConfig.url` dari `src/lib/site.ts` sebagai sumber tunggal, bukan hardcode URL berbeda

**Bug 5 — Duplikasi `formatCurrency` dan `formatDate`**

5.1 WHEN `project-detail-content.tsx` dan komponen lain memformat nilai mata uang atau tanggal, THEN sistem SHALL mengimpor dari `src/lib/utils.ts`

5.2 WHEN `mock-data.ts` mengekspor `formatCurrency` dan `formatDate`, THEN sistem SHALL menghapus definisi duplikat tersebut dan mengimpor dari `src/lib/utils.ts`

5.3 WHEN `formatDate` dari `src/lib/utils.ts` digunakan, THEN sistem SHALL menghasilkan format `"long"` yang konsisten (`"23 April 2026"`)

**Bug 6 — Dua app-shell tanpa kepemilikan jelas**

6.1 WHEN `src/app/(app)/layout.tsx` merender shell, THEN sistem SHALL menggunakan `src/components/layout/app-shell.tsx` (generic composable) sebagai struktur layout, dengan sidebar, topbar, dan bottom nav dari `src/components/layout/`

6.2 WHEN `src/app/(app)/_components/app-shell.tsx` ada, THEN sistem SHALL menggantikannya dengan komposisi dari komponen generic shell yang sudah ada di `src/components/layout/`

---

### Unchanged Behavior (Regression Prevention)

3.1 WHEN pengguna mengakses `/dashboard`, THEN sistem SHALL CONTINUE TO merender halaman dashboard contractor tanpa perubahan

3.2 WHEN pengguna mengakses `/projects` atau `/projects/[id]`, THEN sistem SHALL CONTINUE TO merender halaman proyek dengan data mock yang sama

3.3 WHEN pengguna mengakses route admin yang sudah ada (`/admin`, `/admin/users`, `/admin/users/[id]`, `/admin/moderation/portfolio`, `/admin/moderation/reviews`, `/admin/finance`, `/admin/packages`, `/admin/logs`), THEN sistem SHALL CONTINUE TO merender halaman tersebut dengan benar

3.4 WHEN komponen UI di `src/components/ui/` menggunakan `cn` dari `@/lib/ui/cn`, THEN sistem SHALL CONTINUE TO menghasilkan class yang sama (karena `cn.ts` akan menjadi re-export)

3.5 WHEN auth flow (login, register, OTP, forgot password) dijalankan, THEN sistem SHALL CONTINUE TO bekerja tanpa perubahan

3.6 WHEN `QueryClientProvider` ditambahkan ke layout, THEN sistem SHALL CONTINUE TO merender semua halaman yang ada tanpa error

3.7 WHEN Zustand store dasar dibuat, THEN sistem SHALL CONTINUE TO tidak mempengaruhi komponen yang sudah ada (store baru, tidak ada yang menggunakannya dulu)

3.8 WHEN `siteConfig.url` digunakan di `robots.ts`, THEN sistem SHALL CONTINUE TO menghasilkan robots.txt yang valid dengan sitemap URL yang benar
