# Technical Debt Cleanup — Bugfix Design

## Overview

Enam masalah struktural di KontraktorPro perlu diselesaikan sebelum integrasi DB dan fitur lanjutan dibangun. Semua masalah ini adalah akibat dari fase mock-first development yang bergerak cepat tanpa konsolidasi. Tidak ada yang menyebabkan crash saat ini, namun semuanya akan menjadi bug nyata saat data real diaktifkan.

Strategi fix: **minimal, targeted, non-destructive**. Tidak ada arsitektur baru. Tidak ada rewrite besar. Setiap fix hanya menyentuh file yang diperlukan.

Dua small improvements juga disertakan: wiring `@tanstack/react-query` dan setup Zustand store dasar — keduanya sudah terinstall tapi belum digunakan.

---

## Glossary

- **Bug_Condition (C)**: Kondisi yang memicu bug — inkonsistensi antara definisi lokal dan canonical source
- **Property (P)**: Perilaku yang diharapkan setelah fix — semua referensi mengarah ke satu sumber canonical
- **Preservation**: Semua halaman, komponen, dan flow yang sudah berjalan harus tetap berjalan identik setelah fix
- **canonical source**: File yang ditetapkan sebagai satu-satunya sumber kebenaran untuk suatu definisi
- **`cn()`**: Fungsi class-name merger (`clsx` + `tailwind-merge`) — canonical di `src/lib/utils.ts`
- **`ProjectStatus`**: Enum status proyek — canonical di `src/lib/contracts/enums.ts`
- **`formatCurrency` / `formatDate`**: Formatter utilities — canonical di `src/lib/utils.ts`
- **app-shell**: Layout wrapper untuk route group `(app)` — canonical akan menjadi `src/components/layout/app-shell.tsx`
- **`contractorSidebarNavigation`**: Array nav links untuk sidebar contractor — di `src/lib/navigation.ts`
- **`adminSidebarNavigation`**: Object nav links untuk sidebar admin — di `src/lib/navigation.ts`

---

## Bug Details

### Bug Condition

Bug terjadi ketika kode di luar canonical source mendefinisikan ulang atau mereferensikan versi berbeda dari utilitas/tipe yang sudah ada di canonical source. Kondisi ini terpenuhi untuk enam area berikut.

**Formal Specification:**

```
FUNCTION isBugCondition(file, symbol)
  INPUT: file path, symbol name
  OUTPUT: boolean

  canonicalSources = {
    "cn":              "src/lib/utils.ts",
    "ProjectStatus":   "src/lib/contracts/enums.ts",
    "formatCurrency":  "src/lib/utils.ts",
    "formatDate":      "src/lib/utils.ts",
    "navRoutes":       "src/lib/navigation.ts" (must match actual routes),
    "siteUrl":         "src/lib/site.ts"
  }

  RETURN (
    file defines symbol AND file != canonicalSources[symbol]
  ) OR (
    symbol = "navRoutes" AND route referenced does NOT exist in filesystem
  ) OR (
    symbol = "siteUrl" AND file uses hardcoded URL != siteConfig.url
  )
END FUNCTION
```

### Examples

| File | Symbol | Bug |
|---|---|---|
| `src/lib/ui/cn.ts` | `cn` | Mendefinisikan ulang, bukan re-export dari `utils.ts` |
| `src/app/(app)/_components/ui.tsx` | `cn` | Implementasi lokal inferior (tanpa `clsx`/`tailwind-merge`) |
| `src/app/(app)/_components/mock-data.ts` | `ProjectStatus` | Nilai Indonesian, bukan canonical English |
| `src/app/(app)/_components/mock-data.ts` | `formatCurrency`, `formatDate` | Duplikat, bukan import dari `utils.ts` |
| `src/lib/navigation.ts` | `contractorSidebarNavigation` | `/proyek`, `/portofolio`, `/langganan`, `/pengaturan-akun` tidak ada |
| `src/lib/navigation.ts` | `adminSidebarNavigation` | 8+ route yang tidak ada |
| `src/app/robots.ts` | sitemap URL | Hardcode `kontraktorpro.app`, bukan `siteConfig.url` |

---

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Semua halaman yang sudah ada harus tetap render dengan benar setelah fix
- Auth flow (login, register, OTP, forgot password) tidak boleh tersentuh
- Komponen UI di `src/components/ui/` yang mengimpor `cn` dari `@/lib/ui/cn` harus tetap berjalan (karena `cn.ts` akan menjadi re-export, bukan dihapus)
- Data mock proyek (4 proyek dengan WBS, reports, photos, team, materials) harus tetap ada dan lengkap
- Fungsi-fungsi di `mock-data.ts` yang bukan duplikat (`getProjects`, `getProjectById`, `getDashboardSummary`, `getStatusBadgeVariant`, `getStatusLabel`, `getDeadlineLabel`, `getProjectCounts`) harus tetap ada dan berfungsi
- Admin pages yang sudah ada harus tetap accessible

**Scope:**
Semua input yang tidak menyentuh enam area bug di atas harus sepenuhnya tidak terpengaruh oleh fix ini.

---

## Hypothesized Root Cause

### Bug 1 — Duplikasi `cn()`
`src/lib/ui/cn.ts` dibuat lebih awal sebagai utilitas UI-specific. Kemudian `src/lib/utils.ts` dibuat sebagai canonical shared utilities. Tidak ada konsolidasi yang dilakukan. `src/app/(app)/_components/ui.tsx` mendefinisikan `cn` lokal karena file tersebut adalah self-contained UI barrel yang dibuat sebelum `utils.ts` ada.

### Bug 2 — Konflik `ProjectStatus`
`mock-data.ts` dibuat secara independen untuk kebutuhan UI mock dengan label Indonesian yang lebih natural untuk display. Canonical enum di `enums.ts` menggunakan English values untuk konsistensi dengan DB schema. Tidak ada sinkronisasi yang dilakukan antara keduanya.

### Bug 3 — Navigasi broken
`navigation.ts` dibuat berdasarkan blueprint/rencana fitur, bukan berdasarkan route yang sudah diimplementasikan. Route-route seperti `/proyek`, `/portofolio`, `/admin/pengguna` adalah nama yang direncanakan tapi tidak pernah diimplementasikan dengan nama tersebut.

### Bug 4 — URL mismatch
`robots.ts` dibuat dengan URL production hardcoded (`kontraktorpro.app`) sementara `site.ts` menggunakan URL development placeholder (`kontraktorpro.local`). Tidak ada yang menarik URL dari `siteConfig`.

### Bug 5 — Duplikasi `formatCurrency` / `formatDate`
`mock-data.ts` adalah file self-contained yang dibuat sebelum `utils.ts` dikonsolidasi. Formatter didefinisikan lokal untuk kemudahan. Tidak ada refactor yang dilakukan setelah `utils.ts` menjadi canonical.

### Bug 6 — Dua app-shell
`src/app/(app)/_components/app-shell.tsx` dibuat sebagai prototype cepat dengan semua hardcoded. `src/components/layout/app-shell.tsx` dibuat kemudian sebagai generic composable shell. Tidak ada migrasi yang dilakukan dari prototype ke generic shell.

---

## Correctness Properties

Property 1: Bug Condition — Tidak Ada Definisi Duplikat di Luar Canonical Source

_For any_ symbol (`cn`, `ProjectStatus`, `formatCurrency`, `formatDate`, nav routes, site URL) yang memiliki canonical source, fixed codebase SHALL memastikan tidak ada file lain yang mendefinisikan ulang symbol tersebut secara independen — semua referensi mengarah ke atau re-export dari canonical source.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation — Semua Halaman dan Flow yang Ada Tetap Berjalan

_For any_ halaman, komponen, atau flow yang sudah berjalan sebelum fix (semua route yang ada, auth flow, data mock, komponen UI), fixed codebase SHALL menghasilkan output yang identik dengan codebase sebelum fix — tidak ada regresi visual, tidak ada broken import, tidak ada TypeScript error baru.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**

---

## Fix Implementation

### Changes Required

#### Fix 1 — Konsolidasi `cn()`

**File**: `src/lib/ui/cn.ts`
**Perubahan**: Ubah dari definisi independen menjadi re-export dari `src/lib/utils.ts`
```ts
// Before: mendefinisikan ulang
export function cn(...inputs: ClassValue[]) { ... }

// After: re-export
export { cn } from "@/lib/utils";
```

**File**: `src/app/(app)/_components/ui.tsx`
**Perubahan**: Hapus definisi `cn` lokal, impor dari `@/lib/utils`
```ts
// Remove local cn definition
// Add: import { cn } from "@/lib/utils";
```

**File**: `src/components/layout/app-shell.tsx`
**Perubahan**: Ubah import dari `@/lib/ui/cn` ke `@/lib/utils`

---

#### Fix 2 — Konsolidasi `ProjectStatus`

**File**: `src/app/(app)/_components/mock-data.ts`
**Perubahan**:
1. Hapus `export type ProjectStatus = "aktif" | "tertunda" | "selesai" | "arsip"`
2. Tambah `import { type ProjectStatus } from "@/lib/contracts/enums"`
3. Update semua nilai status di data mock: `"aktif"` → `"active"`, `"tertunda"` → `"delayed"`, `"selesai"` → `"completed"`, `"arsip"` → `"archived"`
4. Update fungsi `getStatusBadgeVariant`, `getStatusLabel`, `getDashboardSummary`, `getProjectCounts` untuk menggunakan nilai canonical
5. Update `getStatusLabel` untuk tetap mengembalikan label Indonesian (display concern terpisah dari data concern)

**Catatan**: `ProjectStatus` dari `enums.ts` mencakup `"draft"` yang tidak ada di mock saat ini — ini valid, mock hanya menggunakan subset.

---

#### Fix 3 — Perbaiki Navigasi

**File**: `src/lib/navigation.ts`
**Perubahan**:

Contractor sidebar — ganti dengan route yang benar:
```ts
contractorSidebarNavigation = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/projects", label: "Proyek Saya", icon: FolderKanban },
  { href: "/billing", label: "Langganan", icon: CreditCard },
  // /portofolio dan /pengaturan-akun dihapus (belum ada)
]
```

Admin sidebar — ganti dengan route yang benar:
```ts
adminSidebarNavigation = {
  overview: [
    { href: "/admin", label: "Dashboard", icon: Home },
    // /admin/aktivitas dihapus (belum ada)
  ],
  users: [
    { href: "/admin/users", label: "Semua Pengguna", icon: Users },
    // /admin/verifikasi dan /admin/laporan dihapus (belum ada)
  ],
  content: [
    { href: "/admin/moderation/portfolio", label: "Moderasi Portofolio", icon: Globe },
    { href: "/admin/moderation/reviews", label: "Moderasi Ulasan", icon: ClipboardList },
  ],
  business: [
    { href: "/admin/packages", label: "Paket & Harga", icon: CreditCard },
    { href: "/admin/finance", label: "Keuangan & MRR", icon: Layers3 },
  ],
  system: [
    { href: "/admin/logs", label: "Log Aktivitas", icon: ClipboardList },
    // /admin/notifikasi dihapus (belum ada)
  ],
}
```

---

#### Fix 4 — URL mismatch

**File**: `src/app/robots.ts`
**Perubahan**: Import `siteConfig` dan gunakan `siteConfig.url`
```ts
import { siteConfig } from "@/lib/site";
// sitemap: `${siteConfig.url}/sitemap.xml`
```

---

#### Fix 5 — Hapus duplikasi `formatCurrency` / `formatDate`

**File**: `src/app/(app)/_components/mock-data.ts`
**Perubahan**:
1. Hapus definisi lokal `formatCurrency` dan `formatDate`
2. Tambah `import { formatCurrency, formatDate } from "@/lib/utils"`
3. Re-export keduanya agar komponen yang sudah mengimpor dari `mock-data` tidak perlu diubah: `export { formatCurrency, formatDate } from "@/lib/utils"`

**Catatan penting**: `formatDate` di `mock-data.ts` menggunakan `month: "short"` (menghasilkan "Apr") sementara canonical `utils.ts` menggunakan `month: "long"` (menghasilkan "April"). Setelah fix, semua tampilan tanggal akan menggunakan format `"long"`. Ini adalah perubahan visual yang disengaja untuk konsistensi.

---

#### Fix 6 — Konsolidasi app-shell

**File**: `src/app/(app)/layout.tsx`
**Perubahan**: Ganti import dari `_components/app-shell` ke komposisi menggunakan `src/components/layout/`

**File**: `src/app/(app)/_components/app-shell.tsx`
**Perubahan**: File ini akan digantikan. Logika navigasi, topbar, dan sidebar dipindahkan ke komponen generic di `src/components/layout/`.

**Strategi**: `src/components/layout/app-shell.tsx` (generic composable) menjadi canonical. Contractor-specific sidebar dan topbar dikonfigurasi melalui props, bukan hardcoded di dalam shell.

**Komponen yang sudah ada di `src/components/layout/`**:
- `app-shell.tsx` — generic layout wrapper (sidebar + topbar + bottomNav + children)
- `app-sidebar.tsx` — sidebar component
- `app-topbar.tsx` — topbar component
- `bottom-nav.tsx` — mobile bottom nav
- `app-navbar.tsx` — navbar component

---

#### Small Improvement A — Wire `@tanstack/react-query`

**File baru**: `src/components/providers/query-provider.tsx`
**Perubahan**: Buat `QueryClientProvider` sebagai client component

**File**: `src/app/layout.tsx`
**Perubahan**: Wrap children dengan `QueryProvider`

---

#### Small Improvement B — Setup Zustand store dasar

**File baru**: `src/lib/store/ui-store.ts`
**Perubahan**: Buat minimal store untuk UI state (sidebar open/close, active filters)

**File baru**: `src/lib/store/index.ts`
**Perubahan**: Barrel export untuk semua stores

---

## Testing Strategy

### Validation Approach

Strategi testing mengikuti dua fase: pertama, tulis exploration tests pada kode UNFIXED untuk membuktikan bug ada; kedua, verifikasi fix bekerja dan tidak memperkenalkan regresi.

### Exploratory Bug Condition Checking

**Goal**: Buktikan bahwa bug condition terpenuhi pada kode unfixed — yaitu, ada definisi duplikat di luar canonical source.

**Test Plan**: Tulis static analysis / import resolution tests yang memverifikasi bahwa simbol-simbol tertentu didefinisikan di lebih dari satu tempat, dan bahwa route yang direferensikan di `navigation.ts` tidak ada di filesystem.

**Test Cases**:
1. **cn duplication test**: Verifikasi bahwa `src/lib/ui/cn.ts` mendefinisikan `cn` secara independen (bukan re-export) — akan FAIL setelah fix
2. **ProjectStatus mismatch test**: Verifikasi bahwa `mock-data.ts` mengekspor `ProjectStatus` dengan nilai Indonesian — akan FAIL setelah fix
3. **Broken nav routes test**: Verifikasi bahwa `/proyek` dan `/admin/pengguna` ada di `navigation.ts` tapi tidak ada di filesystem — akan FAIL setelah fix
4. **URL mismatch test**: Verifikasi bahwa `robots.ts` menggunakan URL berbeda dari `siteConfig.url` — akan FAIL setelah fix

**Expected Counterexamples**:
- `cn` didefinisikan di 3 tempat: `utils.ts`, `ui/cn.ts`, `_components/ui.tsx`
- `ProjectStatus` di `mock-data.ts` memiliki nilai `"aktif"` yang tidak ada di `enums.ts`
- `navigation.ts` mereferensikan `/proyek` yang tidak ada sebagai route

### Fix Checking

**Goal**: Verifikasi bahwa setelah fix, semua simbol hanya didefinisikan di canonical source.

**Pseudocode:**
```
FOR ALL symbol IN [cn, ProjectStatus, formatCurrency, formatDate] DO
  definitions := findAllDefinitions(symbol, codebase)
  ASSERT length(definitions) = 1
  ASSERT definitions[0].file = canonicalSource[symbol]
END FOR

FOR ALL route IN navigation.allRoutes DO
  ASSERT routeExistsInFilesystem(route)
END FOR

ASSERT robots.sitemapUrl = siteConfig.url + "/sitemap.xml"
```

### Preservation Checking

**Goal**: Verifikasi bahwa semua halaman dan komponen yang ada tetap berjalan identik setelah fix.

**Pseudocode:**
```
FOR ALL page IN existingPages DO
  ASSERT page renders without TypeScript errors
  ASSERT page renders without import errors
  ASSERT page visual output = original visual output
END FOR
```

**Testing Approach**: TypeScript compiler (`tsc --noEmit`) adalah tool utama untuk preservation checking — jika tidak ada type error baru, semua import chains masih valid. Visual regression dapat diverifikasi dengan manual review.

**Test Cases**:
1. **TypeScript compilation**: `tsc --noEmit` harus pass tanpa error baru setelah setiap fix
2. **Import chain verification**: Semua komponen yang mengimpor `cn` dari `@/lib/ui/cn` harus tetap resolve dengan benar
3. **Mock data integrity**: `getProjects()` harus tetap mengembalikan 4 proyek dengan semua field lengkap
4. **Navigation render**: Sidebar contractor dan admin harus render tanpa error

### Unit Tests

- Verifikasi `cn` dari `@/lib/utils` menghasilkan output yang sama dengan implementasi sebelumnya
- Verifikasi `getStatusLabel("active")` mengembalikan `"Aktif"` (label Indonesian tetap ada)
- Verifikasi `getStatusBadgeVariant("active")` mengembalikan `"success"`
- Verifikasi `formatDate` dari `utils.ts` menghasilkan format yang benar

### Property-Based Tests

- Untuk semua nilai `ProjectStatus` canonical (`"draft"`, `"active"`, `"delayed"`, `"completed"`, `"archived"`), `getStatusLabel` harus mengembalikan string non-empty
- Untuk semua nilai `ProjectStatus` canonical, `getStatusBadgeVariant` harus mengembalikan salah satu dari badge variant yang valid

### Integration Tests

- Build Next.js (`next build`) harus berhasil tanpa error setelah semua fix
- Semua route yang ada harus dapat diakses tanpa 404
- `QueryClientProvider` harus wrap semua halaman tanpa error hydration
