# Information Architecture (IA) — Source of Truth #2

Document Version: v1.0

Project: KontraktorPro

Product: Aplikasi Manajemen Proyek Konstruksi Berbasis Web (SaaS)

Status: Active

Last Updated: 2026-06-23

Author: System Analyst AI

Source: Derived from SRS v1.0 (SoT-1)

---

## 1. DOCUMENT OVERVIEW

### 1.1 Purpose

Dokumen ini mendefinisikan Arsitektur Informasi (IA) dari KontraktorPro. Sebagai **Source of Truth #2 (SoT-2)**, dokumen ini diturunkan dari SoT-1 (SRS v1.0) dan menjadi landasan untuk:

- Struktur routing dan navigasi aplikasi.
- Pemetaan relasi antar halaman dan aliran informasi.
- Mapping permission/guard per halaman.
- Acuan implementasi frontend (Next.js App Router).

### 1.2 Related Sources of Truth

| Artifact | Reference | Description |
| --- | --- | --- |
| SoT-1 | SRS v1.0 | Spesifikasi kebutuhan perangkat lunak. |
| SoT-3 | Design System | Panduan token visual, warna, tipografi, komponen UI. |
| SoT-4 | User Flows | Detail langkah interaksi per use case. |

---

## 2. PRODUCT STRUCTURE

### 2.1 Product Modules

| Module ID | Module Name | Route Group | Description |
| --- | --- | --- | --- |
| M001 | Authentication | `(auth)` | Registrasi, login, OTP, reset password. |
| M002 | Marketing & Publik | `(marketing)` | Landing page, pricing, direktori, profil publik, link pantau. |
| M003 | Contractor App | `(app)` | Dashboard, proyek, WBS, laporan, galeri, tim, material. |
| M004 | Billing | `billing` | Paket langganan, checkout, riwayat pembayaran. |
| M005 | Admin Panel | `admin` | Dashboard admin, pengguna, moderasi, keuangan, paket, log. |

### 2.2 Module Hierarchy

```text
KontraktorPro (Root)
├── M001: Authentication
│   ├── Halaman Register
│   ├── Halaman Login
│   ├── Halaman Verifikasi OTP
│   └── Halaman Lupa Password
├── M002: Marketing & Publik (tanpa auth guard)
│   ├── Landing Page
│   ├── Halaman Harga
│   ├── Direktori Kontraktor
│   ├── Profil Publik Kontraktor [slug]
│   └── Link Pantau Progres [token]
├── M003: Contractor App (guard: contractor role)
│   ├── Dashboard Utama
│   ├── Manajemen Proyek
│   │   ├── Daftar Proyek
│   │   ├── Buat Proyek Baru
│   │   ├── Detail Proyek [id]
│   │   │   ├── Tab: Ringkasan
│   │   │   ├── Tab: WBS
│   │   │   ├── Tab: Laporan Harian
│   │   │   ├── Tab: Galeri Foto
│   │   │   ├── Tab: Tim
│   │   │   └── Tab: Material
│   │   └── Edit Proyek [id]
│   └── Pengaturan
│       ├── Pengaturan Akun
│       └── Profil Publik & Portofolio
├── M004: Billing (guard: any authenticated role)
│   ├── Halaman Billing & Langganan
│   ├── Halaman Checkout
│   └── Halaman Konfirmasi Sukses
└── M005: Admin Panel (guard: moderator | super_admin)
    ├── Dashboard Admin
    ├── Manajemen Pengguna
    │   ├── Daftar Pengguna
    │   └── Detail Pengguna [id]
    ├── Moderasi Konten
    │   ├── Moderasi Portofolio
    │   └── Moderasi Ulasan
    ├── Laporan Keuangan
    ├── Manajemen Paket (super_admin only)
    └── Log Aktivitas
```

---

## 3. SITE MAP

### 3.1 Navigation Tree

```text
/ (root)                    → PAGE-M02-001 (Landing Page)
├── /harga                  → PAGE-M02-002 (Halaman Harga)
├── /direktori              → PAGE-M02-003 (Direktori Kontraktor)
├── /kontraktor/[slug]      → PAGE-M02-004 (Profil Publik)
├── /pantau/[token]         → PAGE-M02-005 (Link Pantau Owner)
├── /login                  → PAGE-M01-001 (Login)
├── /register               → PAGE-M01-002 (Register)
├── /verify-otp             → PAGE-M01-003 (Verifikasi OTP)
├── /forgot-password        → PAGE-M01-004 (Lupa Password)
├── /dashboard              → PAGE-M03-001 (Dashboard Kontraktor)
├── /projects               → PAGE-M03-002 (Daftar Proyek)
├── /projects/new           → PAGE-M03-003 (Buat Proyek Baru)
├── /projects/[id]          → PAGE-M03-004 (Detail Proyek)
├── /projects/[id]/edit     → PAGE-M03-005 (Edit Proyek)
├── /settings/account       → PAGE-M03-006 (Pengaturan Akun)
├── /settings/profile       → PAGE-M03-007 (Profil Publik & Portofolio)
├── /billing                → PAGE-M04-001 (Billing & Langganan)
├── /billing/checkout       → PAGE-M04-002 (Checkout)
├── /billing/checkout/success → PAGE-M04-003 (Konfirmasi Sukses)
├── /admin                  → PAGE-M05-001 (Dashboard Admin)
├── /admin/users            → PAGE-M05-002 (Daftar Pengguna)
├── /admin/users/[id]       → PAGE-M05-003 (Detail Pengguna)
├── /admin/moderation/portfolio → PAGE-M05-004 (Moderasi Portofolio)
├── /admin/moderation/reviews   → PAGE-M05-005 (Moderasi Ulasan)
├── /admin/finance          → PAGE-M05-006 (Laporan Keuangan)
├── /admin/packages         → PAGE-M05-007 (Manajemen Paket)
└── /admin/logs             → PAGE-M05-008 (Log Aktivitas)
```

### 3.2 Navigation Type

| Navigation | Type | Behavior |
| --- | --- | --- |
| App Sidebar | Fixed Sidebar | Tampil permanen di sisi kiri pada halaman `/dashboard`, `/projects/*`. Berisi menu navigasi per role. |
| Admin Sidebar | Fixed Sidebar | Tampil permanen di sisi kiri pada seluruh halaman `/admin/*`. |
| Marketing Navbar | Top Navbar | Navigasi horizontal di halaman marketing publik. |
| Auth Pages | Standalone | Tanpa sidebar — form terpusat di layar. |
| Breadcrumb | Disabled | Tidak digunakan — navigasi cukup dengan sidebar dan back button. |
| Project Tab Navigation | Inline Tabs | 6 tab di dalam halaman `/projects/[id]`. |

---

## 4. PAGE INVENTORY

### Module M001 — Authentication

| Page ID | Page Name | Route | Guard | Related Use Case |
| --- | --- | --- | --- | --- |
| PAGE-M01-001 | Login | `/login` | `redirectIfAuthenticated()` | UC-002, UC-003 |
| PAGE-M01-002 | Register | `/register` | `redirectIfAuthenticated()` | UC-001 |
| PAGE-M01-003 | Verifikasi OTP | `/verify-otp` | `redirectIfAuthenticated()` | UC-003, UC-004 |
| PAGE-M01-004 | Lupa Password | `/forgot-password` | `redirectIfAuthenticated()` | UC-005 |

### Module M002 — Marketing & Publik

| Page ID | Page Name | Route | Guard | Related Use Case |
| --- | --- | --- | --- | --- |
| PAGE-M02-001 | Landing Page | `/` | None (Public) | — |
| PAGE-M02-002 | Harga & Paket | `/harga` | None (Public) | — |
| PAGE-M02-003 | Direktori Kontraktor | `/direktori` | None (Public) | — |
| PAGE-M02-004 | Profil Publik Kontraktor | `/kontraktor/[slug]` | None (Public) | — |
| PAGE-M02-005 | Link Pantau Owner | `/pantau/[token]` | None (Public) | — |

### Module M003 — Contractor App

| Page ID | Page Name | Route | Guard | Related Use Case |
| --- | --- | --- | --- | --- |
| PAGE-M03-001 | Dashboard Utama | `/dashboard` | `requireRole("contractor")` | UC-006 |
| PAGE-M03-002 | Daftar Proyek | `/projects` | `requireRole("contractor")` | UC-007 |
| PAGE-M03-003 | Buat Proyek Baru | `/projects/new` | `requireRole("contractor")` | UC-008 |
| PAGE-M03-004 | Detail Proyek | `/projects/[id]` | `requireRole("contractor")` | UC-009 |
| PAGE-M03-005 | Edit Proyek | `/projects/[id]/edit` | `requireRole("contractor")` | UC-010 |
| PAGE-M03-006 | Pengaturan Akun | `/settings/account` | `requireRole("contractor")` | UC-013 |
| PAGE-M03-007 | Profil & Portofolio | `/settings/profile` | `requireRole("contractor")` | UC-014 |

### Module M004 — Billing

| Page ID | Page Name | Route | Guard | Related Use Case |
| --- | --- | --- | --- | --- |
| PAGE-M04-001 | Billing & Langganan | `/billing` | `requireAuth()` | UC-011 |
| PAGE-M04-002 | Checkout | `/billing/checkout` | `requireAuth()` | UC-012 |
| PAGE-M04-003 | Konfirmasi Sukses | `/billing/checkout/success` | `requireAuth()` | UC-012 |

### Module M005 — Admin Panel

| Page ID | Page Name | Route | Guard | Related Use Case |
| --- | --- | --- | --- | --- |
| PAGE-M05-001 | Dashboard Admin | `/admin` | `requireRole(["moderator","super_admin"])` | — |
| PAGE-M05-002 | Daftar Pengguna | `/admin/users` | `requireRole(["moderator","super_admin"])` | — |
| PAGE-M05-003 | Detail Pengguna | `/admin/users/[id]` | `requireRole(["moderator","super_admin"])` | — |
| PAGE-M05-004 | Moderasi Portofolio | `/admin/moderation/portfolio` | `requireRole(["moderator","super_admin"])` | — |
| PAGE-M05-005 | Moderasi Ulasan | `/admin/moderation/reviews` | `requireRole(["moderator","super_admin"])` | — |
| PAGE-M05-006 | Laporan Keuangan | `/admin/finance` | `requireRole(["moderator","super_admin"])` | — |
| PAGE-M05-007 | Manajemen Paket | `/admin/packages` | `requireRole("super_admin")` | — |
| PAGE-M05-008 | Log Aktivitas | `/admin/logs` | `requireRole(["moderator","super_admin"])` | — |

---

## 5. PAGE DEFINITIONS

### PAGE-M01-001: Login

**Purpose:** Memverifikasi identitas pengguna sebelum mengakses fitur app atau admin.

**Entry Points:**
- Akses langsung URL `/login`.
- Redirect otomatis dari halaman app/admin jika sesi tidak valid.
- Klik tombol "Masuk" di marketing navbar.

**Exit Points:**
- Login sukses sebagai `contractor` → redirect ke `/dashboard`.
- Login sukses sebagai `moderator` atau `super_admin` → redirect ke `/admin`.
- Klik "Daftar Sekarang" → `/register`.
- Klik "Lupa Password" → `/forgot-password`.

**Notes:** Dua mode login: password dan OTP email. Halaman standalone tanpa sidebar.

---

### PAGE-M01-002: Register

**Purpose:** Mendaftarkan akun kontraktor baru dan memverifikasi email via OTP.

**Entry Points:**
- Akses langsung URL `/register`.
- Klik "Daftar Sekarang" dari halaman login atau marketing.

**Exit Points:**
- Submit form berhasil → redirect ke `/verify-otp` dengan OTP challenge aktif.
- Klik "Sudah punya akun" → `/login`.

**Notes:** Setelah submit, cookie `kp-auth-otp` di-set (15 menit). Akun belum dibuat sampai OTP diverifikasi.

---

### PAGE-M01-003: Verifikasi OTP

**Purpose:** Memverifikasi kode OTP 6 digit yang dikirim ke email pengguna.

**Entry Points:**
- Redirect dari `/register` (OTP registrasi).
- Redirect dari `/login` setelah memilih mode login OTP.

**Exit Points:**
- OTP valid untuk registrasi → akun dibuat, session di-set, redirect ke `/dashboard`.
- OTP valid untuk login → session di-set, redirect ke `/dashboard` atau `/admin`.
- Klik "Kirim Ulang Kode" → sistem resend OTP (dengan cooldown).

**Notes:** Cookie `kp-auth-otp` dibaca untuk menentukan jenis challenge (register/login).

---

### PAGE-M01-004: Lupa Password

**Purpose:** Memulai alur reset password melalui verifikasi email dan OTP.

**Entry Points:**
- Klik "Lupa Password" dari halaman login.

**Exit Points:**
- Alur berhasil (3 langkah: email → OTP → password baru) → redirect ke `/login?email=...`.
- Klik "Kembali ke Login" → `/login`.

**Notes:** Tiga step dalam satu halaman: (1) input email, (2) input OTP, (3) input password baru.

---

### PAGE-M03-001: Dashboard Utama

**Purpose:** Menampilkan ringkasan KPI dan status seluruh proyek kontraktor.

**Entry Points:**
- Login berhasil sebagai contractor.
- Klik menu "Dashboard" di sidebar.

**Exit Points:**
- Klik proyek di daftar → `/projects/[id]`.
- Klik menu sidebar lain.

**Notes:** Data KPI dihitung dari semua proyek milik kontraktor yang login. Sudah menggunakan data aktual dari database.

---

### PAGE-M03-002: Daftar Proyek

**Purpose:** Menampilkan seluruh proyek milik kontraktor dengan kemampuan filter dan sort.

**Entry Points:**
- Klik menu "Proyek" di sidebar.
- Klik "Lihat Semua Proyek" dari dashboard.

**Exit Points:**
- Klik proyek → `/projects/[id]`.
- Klik "Buat Proyek Baru" → `/projects/new`.

---

### PAGE-M03-003: Buat Proyek Baru

**Purpose:** Form pembuatan proyek konstruksi baru.

**Entry Points:**
- Klik "Buat Proyek Baru" dari daftar proyek.

**Exit Points:**
- Submit berhasil → redirect ke `/projects/[id]` (proyek yang baru dibuat).
- Klik "Batal" → kembali ke `/projects`.

**Notes:** Form shell — sudah persist ke DB melalui Server Actions.

---

### PAGE-M03-004: Detail Proyek

**Purpose:** Tampilan detail proyek dengan navigasi 6 tab.

**Entry Points:**
- Klik proyek dari daftar proyek atau dashboard.

**Child Pages (Tabs):**

| Tab | Query Param | Content |
| --- | --- | --- |
| Ringkasan (default) | `?tab=overview` | Info umum, progress, milestone |
| WBS | `?tab=wbs` | Struktur pekerjaan hierarkis |
| Laporan Harian | `?tab=reports` | Daftar laporan harian |
| Galeri Foto | `?tab=photos` | Grid foto dokumentasi |
| Tim | `?tab=team` | Daftar anggota tim |
| Material | `?tab=materials` | Tracking material |

**Exit Points:**
- Klik "Edit Proyek" → `/projects/[id]/edit`.
- Klik menu sidebar → halaman lain.

---

### PAGE-M03-005: Edit Proyek

**Purpose:** Form editing informasi proyek yang sudah ada.

**Entry Points:**
- Klik "Edit Proyek" dari halaman detail proyek.

**Exit Points:**
- Submit berhasil → redirect ke `/projects/[id]`.
- Klik "Batal" → kembali ke `/projects/[id]`.

---

### PAGE-M03-006: Pengaturan Akun

**Purpose:** Mengelola informasi keamanan, password, dan notifikasi akun kontraktor.

**Entry Points:**
- Klik menu "Pengaturan" di sidebar.

**Exit Points:**
- Klik menu sidebar lain.

---

### PAGE-M03-007: Profil Publik & Portofolio

**Purpose:** Mengelola informasi profil publik kontraktor dan memanajemen portofolio proyek selesai.

**Entry Points:**
- Klik tab Profil atau Portofolio di halaman Pengaturan.

**Exit Points:**
- Klik "Lihat Profil Publik" → `/kontraktor/[slug]`.
- Klik menu sidebar lain.

---

### PAGE-M04-001: Billing & Langganan

**Purpose:** Menampilkan paket aktif, riwayat pembayaran, dan pilihan upgrade.

**Entry Points:**
- Klik menu "Billing" di sidebar (tersedia untuk semua role).
- Redirect dari halaman yang memerlukan tier upgrade.

**Exit Points:**
- Klik "Upgrade Paket" → `/billing/checkout`.

---

### PAGE-M04-002: Checkout

**Purpose:** Proses pembayaran upgrade paket langganan.

**Entry Points:**
- Klik "Upgrade Paket" dari billing page.

**Exit Points:**
- Pembayaran sukses → `/billing/checkout/success`.
- Klik "Batal" → `/billing`.

**Notes:** Saat ini mock — langsung redirect ke success tanpa payment gateway nyata.

---

## 6. AUTH GUARD BEHAVIOR

| Guard Function | Behavior if Not Authenticated | Behavior if Authenticated |
| --- | --- | --- |
| `redirectIfAuthenticated()` | Halaman tampil normal | Redirect ke `/dashboard` (contractor) atau `/admin` (moderator/admin) |
| `requireAuth()` | Redirect ke `/login` | Halaman tampil normal |
| `requireRole("contractor")` | Redirect ke `/login` jika tidak ada sesi; redirect ke `/admin` jika role bukan contractor | Halaman tampil normal |
| `requireRole(["moderator","super_admin"])` | Redirect ke `/login` jika tidak ada sesi; redirect ke `/dashboard` jika contractor | Halaman tampil normal |

---

## 7. ROUTING CONVENTIONS

| Pattern | Rule |
| --- | --- |
| `[id]` | Dynamic segment untuk proyek dan pengguna — gunakan `params.id`. |
| `[slug]` | Dynamic segment untuk profil publik kontraktor. |
| `[token]` | Dynamic segment untuk link pantau owner. |
| `?tab=` | Query parameter untuk navigasi tab di detail proyek. |
| `?email=` | Query parameter opsional untuk pre-fill email di login setelah reset password. |
| `?redirect=` | Query parameter opsional untuk redirect setelah login (belum diimplementasikan). |

---

## 8. NAVIGATION LINKS PER ROLE

### Contractor Sidebar (`src/lib/navigation.ts`)

| Menu | Route | Icon |
| --- | --- | --- |
| Dashboard | `/dashboard` | LayoutDashboard |
| Proyek Saya | `/projects` | FolderKanban |
| Billing | `/billing` | CreditCard |
| Pengaturan | `/settings/account` | Settings |

### Admin / Moderator Sidebar

| Menu | Route | Access |
| --- | --- | --- |
| Dashboard | `/admin` | moderator + super_admin |
| Pengguna | `/admin/users` | moderator + super_admin |
| Moderasi Portofolio | `/admin/moderation/portfolio` | moderator + super_admin |
| Moderasi Ulasan | `/admin/moderation/reviews` | moderator + super_admin |
| Keuangan | `/admin/finance` | moderator + super_admin |
| Paket | `/admin/packages` | super_admin only |
| Log Aktivitas | `/admin/logs` | moderator + super_admin |
| Billing | `/billing` | moderator + super_admin |

---

## 9. CONTENT HIERARCHY

### M001: Authentication

**Level 1 (Page):** Form standalone terpusat.
**Level 2 (Form Fields):** Input field dengan validasi real-time.
**Level 3 (Feedback):** Toast error/success + inline field error.

### M003: Contractor App

**Level 1 (Dashboard/List):** KPI cards + tabel/grid proyek.
**Level 2 (Detail/Form):** Panel informasi + tab navigation.
**Level 3 (Tab Content):** Data spesifik per tab (WBS tree, laporan list, galeri, dll.).

### M005: Admin Panel

**Level 1 (Dashboard):** KPI platform-wide.
**Level 2 (List):** Tabel pengguna/antrian moderasi/log.
**Level 3 (Detail):** Detail per entitas dengan action buttons.

---

## 10. TRACEABILITY MATRIX (SRS v1.0 → IA v1.0)

| Feature ID | Feature Name | Mapped Pages | Route |
| --- | --- | --- | --- |
| F001 | Autentikasi & Manajemen Sesi | PAGE-M01-001 to M01-004 | `/login`, `/register`, `/verify-otp`, `/forgot-password` |
| F002 | Dashboard Kontraktor | PAGE-M03-001 | `/dashboard` |
| F003 | Manajemen Proyek | PAGE-M03-002 to M03-005 | `/projects`, `/projects/new`, `/projects/[id]`, `/projects/[id]/edit` |
| F004 | WBS Proyek | PAGE-M03-004 (tab=wbs) | `/projects/[id]?tab=wbs` |
| F005 | Laporan Harian | PAGE-M03-004 (tab=reports) | `/projects/[id]?tab=reports` |
| F006 | Galeri Foto | PAGE-M03-004 (tab=photos) | `/projects/[id]?tab=photos` |
| F007 | Manajemen Tim | PAGE-M03-004 (tab=team) | `/projects/[id]?tab=team` |
| F008 | Tracking Material | PAGE-M03-004 (tab=materials) | `/projects/[id]?tab=materials` |
| F009 | Portofolio & Profil Publik | PAGE-M02-003, M02-004 | `/direktori`, `/kontraktor/[slug]` |
| F010 | Link Pantau Owner | PAGE-M02-005 | `/pantau/[token]` |
| F011 | Billing & Langganan | PAGE-M04-001 to M04-003 | `/billing`, `/billing/checkout`, `/billing/checkout/success` |
| F012 | Admin Panel | PAGE-M05-001 to M05-008 | `/admin/*` |
| F013 | Pengaturan Akun | PAGE-M03-006 | `/settings/account` |
| F014 | Pengaturan Profil | PAGE-M03-007 | `/settings/profile` |

---

## 11. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document — derived from SRS v1.0 and current codebase route structure. |
