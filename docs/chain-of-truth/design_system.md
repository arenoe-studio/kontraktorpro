# Design System (DS) — Source of Truth #3

Document Version: v1.0

Project: KontraktorPro

Product: Aplikasi Manajemen Proyek Konstruksi Berbasis Web (SaaS)

Status: Active

Last Updated: 2026-06-23

Author: System Analyst AI

Source: Derived from SRS v1.0 (SoT-1) + IA v1.0 (SoT-2)

---

## 1. DOCUMENT OVERVIEW

### 1.1 Purpose

Dokumen ini mendefinisikan bahasa visual, standar interaksi, dan komponen UI yang digunakan pada seluruh antarmuka KontraktorPro. Sebagai **Source of Truth #3 (SoT-3)**, dokumen ini adalah rujukan wajib untuk:

- Implementasi komponen frontend (React / Tailwind CSS v4).
- Menjaga konsistensi visual dan UX di seluruh halaman.
- Panduan bagi AI agent dalam menghasilkan kode komponen yang konsisten.

Blueprint desain lengkap per fitur tersedia di `docs/blueprint/design-system-kontraktorpro.md`.

### 1.2 Related Sources of Truth

| Artifact | Reference | Description |
| --- | --- | --- |
| SoT-1 | SRS v1.0 | Spesifikasi kebutuhan perangkat lunak. |
| SoT-2 | IA v1.0 | Struktur halaman dan navigasi. |
| SoT-4 | User Flows | Aliran interaksi per use case. |
| Blueprint | `docs/blueprint/design-system-kontraktorpro.md` | Detail visual per komponen. |

---

## 2. DESIGN PRINCIPLES

### 2.1 Design Goals

- **Profesional & Terpercaya:** Visual yang kokoh dan bersih mencerminkan industri konstruksi.
- **Efisiensi Kerja:** Kontraktor dapat menyelesaikan tugas utama (buat laporan, update proyek) dengan minimum klik.
- **Keterbacaan Tinggi:** Data numerik (nilai kontrak, progress %) dan status proyek harus langsung terbaca.

### 2.2 UX Principles

- **Feedback Instan:** Setiap aksi mutasi (simpan, hapus, submit) harus memicu toast notification dengan hasil yang jelas.
- **Error Tolerance:** Pesan error harus spesifik dan actionable — bukan hanya "terjadi kesalahan".
- **Konsistensi Pola:** Halaman list → detail → form menggunakan pola yang sama di seluruh module.

---

## 3. BRAND FOUNDATION

### 3.1 Brand Personality

- **Solid & Profesional:** Industri konstruksi menuntut kepercayaan. Desain hindari kesan playful berlebihan.
- **Modern & Bersih:** Minimalis — fokus pada data dan aksi, bukan dekorasi.
- **Lokal & Dekat:** Bahasa Indonesia, format IDR, tanggal `dd MMMM yyyy` — terasa familiar untuk kontraktor Indonesia.

### 3.2 Visual Characteristics

- **Border Radius:** `rounded-lg` (8px) untuk card dan button. `rounded-xl` (12px) untuk modal.
- **Shadow:** `shadow-sm` untuk card biasa. `shadow-md` untuk panel sidebar. `shadow-lg` untuk modal overlay.

---

## 4. COLOR SYSTEM

### 4.1 Primary Colors (Blue Brand)

Warna biru mencerminkan profesionalisme, kepercayaan, dan stabilitas — sesuai industri konstruksi.

| Token | Tailwind Class | Usage |
| --- | --- | --- |
| color-primary | `bg-blue-600` | Tombol aksi utama, link aktif sidebar, ikon utama. |
| color-primary-hover | `hover:bg-blue-700` | Hover pada tombol utama. |
| color-primary-light | `bg-blue-50` | Background highlight item aktif, badge info. |
| color-primary-text | `text-blue-600` | Link teks, label aktif. |

### 4.2 Secondary Colors (Slate)

| Token | Tailwind Class | Usage |
| --- | --- | --- |
| color-secondary | `bg-slate-600` | Tombol batal/sekunder. |
| color-secondary-hover | `hover:bg-slate-700` | Hover tombol sekunder. |
| color-muted | `bg-slate-100` | Background input disabled, placeholder area. |

### 4.3 Semantic Colors (Status & Alert)

| Token | Tailwind Class | Usage |
| --- | --- | --- |
| color-success | `bg-emerald-500` / `text-emerald-700` | Proyek active, status completed, toast sukses. |
| color-warning | `bg-amber-500` / `text-amber-700` | Proyek delayed, stok menipis, deadline dekat. |
| color-danger | `bg-red-500` / `text-red-700` | Error form, aksi destruktif, proyek overdue. |
| color-info | `bg-blue-500` / `text-blue-700` | Informasi sistem, proyek draft. |
| color-neutral | `bg-slate-400` / `text-slate-600` | Proyek archived, item non-aktif. |

### 4.4 Project Status Color Map

| Status | Badge Color | Tailwind |
| --- | --- | --- |
| `draft` | Abu-abu | `bg-slate-100 text-slate-700` |
| `active` | Hijau | `bg-emerald-100 text-emerald-800` |
| `delayed` | Merah | `bg-red-100 text-red-800` |
| `completed` | Biru | `bg-blue-100 text-blue-800` |
| `archived` | Abu gelap | `bg-slate-200 text-slate-600` |

### 4.5 Neutral Colors (Background & Text)

| Token | Tailwind Class | Usage |
| --- | --- | --- |
| color-bg-app | `bg-slate-50` | Latar belakang halaman app. |
| color-bg-card | `bg-white` | Card, panel, tabel, modal. |
| color-text-main | `text-slate-900` | Judul, label form, data penting. |
| color-text-muted | `text-slate-500` | Deskripsi, sub-info, timestamp. |
| color-border | `border-slate-200` | Garis pembatas, border input. |

---

## 5. TYPOGRAPHY

Font: **Inter** (system font stack dengan fallback `sans-serif`).

| Style | Weight | Size | Usage |
| --- | --- | --- | --- |
| Display Title | 700 (Bold) | 30px / 1.875rem | Judul besar di halaman auth. |
| Page Title | 700 (Bold) | 24px / 1.5rem | Header halaman utama. |
| Section Title | 600 (SemiBold) | 18px / 1.125rem | Judul card, panel, section. |
| Body Large | 400 (Regular) | 16px / 1rem | Label form, teks tabel. |
| Body Medium | 400 (Regular) | 14px / 0.875rem | Deskripsi item, menu sidebar. |
| Body Small | 400 (Regular) | 12px / 0.75rem | Timestamp, metadata, badge teks. |
| Currency | 600 (SemiBold) | 16px / 1rem | Nominal IDR — `formatCurrency()` dari `src/lib/utils.ts`. |
| Percentage | 700 (Bold) | 24px / 1.5rem | KPI cards, progress number. |

---

## 6. ELEVATION & SHADOWS

| Level | Class | Usage |
| --- | --- | --- |
| Flat | `shadow-none` | Input field, tabel datar, divider. |
| Subtle | `shadow-sm` | Card proyek, item list. |
| Raised | `shadow-md` | Sidebar, panel ringkasan, sticky header. |
| Overlay | `shadow-lg` | Modal dialog, dropdown menu, popover. |

---

## 7. GRID & LAYOUT

### 7.1 App Shell Layout (halaman app & admin)

```
┌─────────────────────────────────────────────────┐
│  SIDEBAR (260px fixed)  │  MAIN CONTENT AREA     │
│                         │  (flex-1, p-6)         │
│  Logo                   │                        │
│  Nav Links              │  Page Header           │
│  ...                    │  Content Body          │
│  User Menu              │                        │
└─────────────────────────────────────────────────┘
```

- Sidebar width: 260px (fixed, tidak collapsible saat ini).
- Content padding: 24px (`p-6`).
- Max content width: `max-w-7xl` pada halaman admin.

### 7.2 Auth Layout

- Form terpusat secara vertikal dan horizontal.
- Lebar form maksimal: 440px (`max-w-sm`).
- Tidak ada sidebar.

### 7.3 Marketing Layout

- Full-width dengan navigation bar di atas.
- Section-based layout dengan max-width 1280px.

### 7.4 Responsive Breakpoints (Tailwind default)

| Breakpoint | Min Width | Behavior |
| --- | --- | --- |
| `sm` | 640px | — |
| `md` | 768px | Tablet — sidebar mulai muncul |
| `lg` | 1024px | Desktop — layout penuh |
| `xl` | 1280px | Large desktop |

---

## 8. ICONOGRAPHY

Library: **Lucide React** (sudah terinstall). Gunakan ikon outline dengan stroke 2px.

| Fungsi | Lucide Icon | Konteks |
| --- | --- | --- |
| Dashboard | `LayoutDashboard` | Menu sidebar |
| Proyek | `FolderKanban` | Menu sidebar, judul halaman |
| WBS | `GitBranch` | Tab proyek |
| Laporan Harian | `ClipboardList` | Tab proyek |
| Galeri Foto | `Images` | Tab proyek |
| Tim | `Users` | Tab proyek |
| Material | `Package` | Tab proyek |
| Billing | `CreditCard` | Menu sidebar |
| Admin | `Shield` | Menu admin |
| Pengguna | `UserCog` | Menu admin |
| Moderasi | `CheckSquare` | Menu admin |
| Keuangan | `TrendingUp` | Menu admin |
| Log | `ScrollText` | Menu admin |
| Tambah | `Plus` | Tombol aksi |
| Edit | `Pencil` | Tombol aksi |
| Hapus | `Trash2` | Tombol destruktif |
| Kembali | `ArrowLeft` | Navigasi |
| Logout | `LogOut` | User menu |
| Notifikasi | `Bell` | Header |
| Cari | `Search` | Search input |
| Filter | `Filter` | Filter bar |
| Upload | `Upload` | File upload |
| Download | `Download` | Export |
| Kalender | `Calendar` | Date picker |
| Progress | `BarChart3` | KPI card |

---

## 9. COMPONENT LIBRARY

### 9.1 Button

| Variant | Tailwind Classes | Usage |
| --- | --- | --- |
| Primary | `bg-blue-600 text-white hover:bg-blue-700 rounded-lg` | Aksi utama (Simpan, Submit, Buat) |
| Secondary | `bg-slate-200 text-slate-800 hover:bg-slate-300 rounded-lg` | Batal, Kembali |
| Danger | `bg-red-600 text-white hover:bg-red-700 rounded-lg` | Hapus, Suspend |
| Ghost | `text-slate-600 hover:bg-slate-100 rounded-lg` | Aksi tersier |
| Link | `text-blue-600 underline hover:text-blue-800` | Link navigasi |

**States:**
| State | Visual |
| --- | --- |
| Default | Warna penuh |
| Hover | Shade lebih gelap |
| Disabled | `opacity-50 cursor-not-allowed` |
| Loading | Spinner icon + disabled |

### 9.2 Form Input

- **Default:** `border border-slate-300 rounded-lg bg-white text-slate-900 placeholder:text-slate-400`
- **Focus:** `focus:border-blue-500 focus:ring-2 focus:ring-blue-200`
- **Error:** `border-red-500 focus:ring-red-200`
- **Disabled:** `bg-slate-100 text-slate-500 cursor-not-allowed`
- **Error Message:** `text-red-600 text-sm mt-1`

### 9.3 Card

```
bg-white rounded-lg shadow-sm border border-slate-200 p-4
```

Gunakan untuk: card KPI, card proyek, card billing plan.

### 9.4 Status Badge

```
inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
```

Warna sesuai Status Color Map di Section 4.4.

### 9.5 Progress Bar

```
bg-slate-200 rounded-full h-2
  ↳ inner: bg-{color}-500 rounded-full h-2 transition-all
```

Warna progress dari `src/lib/ui/tokens.ts` → `getProgressTone(value)`:
- < 30% → `bg-red-500`
- 30–60% → `bg-amber-500`
- 60–90% → `bg-blue-500`
- ≥ 90% → `bg-emerald-500`

### 9.6 Modal Dialog

- **Overlay:** `fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50`
- **Container:** `bg-white rounded-xl shadow-lg max-w-md w-full mx-auto mt-20 p-6`
- **Header:** Judul + tombol X (close)
- **Footer:** Tombol Batal (Secondary) + Tombol Aksi (Primary) — rata kanan

### 9.7 Table

- **Header:** `bg-slate-100 text-slate-700 font-semibold text-sm`
- **Row:** Zebra striping — ganjil `bg-white`, genap `bg-slate-50`
- **Hover Row:** `hover:bg-blue-50/30`
- **Empty State:** Centered illustration + teks informatif

### 9.8 Toast (Sonner)

- Sudah terpasang di root layout via `<Toaster />`.
- Gunakan `toast.success()`, `toast.error()`, `toast.warning()` dari `sonner`.
- Pesan toast harus spesifik — contoh: "Proyek berhasil dibuat" bukan "Sukses".

### 9.9 KPI Card

```
bg-white rounded-lg shadow-sm border border-slate-200 p-6
├── Icon (32px, text-blue-600)
├── Label (text-sm text-slate-500)
└── Value (text-2xl font-bold text-slate-900)
```

---

## 10. FORM DESIGN RULES

- **Label posisi:** Di atas input (top-aligned), bukan di samping.
- **Required fields:** Tanda bintang merah `*` di samping label.
- **Error:** Muncul di bawah input setelah submit atau onBlur. Harus deskriptif.
  - Benar: "Email sudah terdaftar di sistem"
  - Salah: "Email tidak valid"
- **Loading state:** Tombol submit berubah menjadi disabled + spinner saat Server Action berjalan.
- **Validation library:** `react-hook-form` + `@hookform/resolvers` + `zod`.

---

## 11. INTERACTION PATTERNS

### 11.1 Server Action Loading State

Saat Server Action dipanggil (registrasi, login, simpan proyek, dll.):
- Tombol submit: disabled + spinner berputar.
- Form: tidak bisa di-submit ulang (double submit prevention).
- Feedback: toast muncul setelah action selesai.

### 11.2 Empty State

Jika daftar proyek kosong atau hasil pencarian tidak ada:
- Tampilkan ikon besar (misalnya `FolderOpen` dari Lucide).
- Teks: "[Konteks] tidak ditemukan. [Aksi yang bisa dilakukan]."
- Contoh: "Belum ada proyek. Klik 'Buat Proyek Baru' untuk memulai."

### 11.3 Destructive Action Pattern

Untuk aksi yang tidak bisa dibatalkan (hapus proyek, suspend pengguna):
1. User klik tombol Danger.
2. Modal konfirmasi muncul dengan deskripsi konsekuensi.
3. Tombol konfirmasi: "Ya, Hapus" (Danger) dan "Batal" (Secondary).
4. Setelah konfirmasi: loading state → toast result.

### 11.4 Tab Navigation (Project Detail)

- Tab aktif: `border-b-2 border-blue-600 text-blue-600 font-semibold`
- Tab non-aktif: `text-slate-500 hover:text-slate-700`
- Tab menyimpan state via query parameter `?tab=` — dapat di-bookmark.

---

## 12. FORMATTING CONVENTIONS

Gunakan fungsi dari `src/lib/utils.ts`:

| Data | Function | Output Example |
| --- | --- | --- |
| Mata uang IDR | `formatCurrency(value)` | `Rp 1.500.000` |
| Tanggal | `formatDate(value)` | `23 Juni 2026` |
| Progress | `{value}%` | `75%` |
| Class merging | `cn(...inputs)` | — |

---

## 13. DESIGN TOKENS TABLE

| Token Name | Category | Value | Tailwind |
| --- | --- | --- | --- |
| token-color-primary | Color | #2563eb | `bg-blue-600` |
| token-color-primary-hover | Color | #1d4ed8 | `hover:bg-blue-700` |
| token-color-danger | Color | #dc2626 | `bg-red-600` |
| token-color-success | Color | #10b981 | `bg-emerald-500` |
| token-color-warning | Color | #f59e0b | `bg-amber-500` |
| token-bg-app | Color | #f8fafc | `bg-slate-50` |
| token-border-radius-card | Layout | 8px | `rounded-lg` |
| token-border-radius-modal | Layout | 12px | `rounded-xl` |
| token-shadow-card | Depth | shadow-sm | `shadow-sm` |
| token-shadow-modal | Depth | shadow-lg | `shadow-lg` |

---

## 14. TRACEABILITY MATRIX (SRS v1.0 → DS v1.0)

| Feature ID | Feature Name | Target Components | Design Rules |
| --- | --- | --- | --- |
| F001 | Autentikasi | Auth Form, Input, Button Primary | Max-w-sm form, label atas, error inline |
| F002 | Dashboard | KPI Card, Progress Bar, Status Badge | Color map project status |
| F003 | Manajemen Proyek | Card list, Tab Navigation, Form | Tab dengan query param, zebra table |
| F004 | WBS | Tree component, Progress Bar | Hierarki indentasi, bobot % |
| F005 | Laporan Harian | Table, Status Badge, Form Modal | Status draft/submitted/flagged |
| F006 | Galeri Foto | Grid layout, Upload Button | Shadow-sm card foto |
| F007 | Tim Proyek | Table, Role Badge | Role: mandor/pekerja/spesialis |
| F008 | Material | Table, Progress (rencana vs realisasi) | Warna merah jika realisasi > rencana |
| F011 | Billing | Plan Card, CTA Button | Tier highlight, upgrade CTA |
| F012 | Admin Panel | KPI Card, Table, Modal konfirmasi | Destructive pattern untuk suspend |

---

## 15. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document — derived from SRS v1.0, IA v1.0, dan blueprint desain KontraktorPro. |
