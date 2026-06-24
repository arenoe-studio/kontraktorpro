# Software Requirements Specification (SRS)

Document Version: v1.0

Project: KontraktorPro

Product: Aplikasi Manajemen Proyek Konstruksi Berbasis Web (SaaS)

Status: Active

Last Updated: 2026-06-23

Author: System Analyst AI

---

# 1. INTRODUCTION

## 1.1 Purpose

Dokumen ini mendefinisikan spesifikasi kebutuhan fungsional dan non-fungsional untuk sistem KontraktorPro. Dokumen ini berfungsi sebagai **Source of Truth #1 (SoT-1)** — dokumen tunggal yang melandasi pembuatan seluruh artefak pengembangan berikutnya: Information Architecture, Design System, User Flows, System Logics, Data Model, dan Test Cases.

## 1.2 Scope

### Business Goals

- Membantu kontraktor Indonesia dalam mengelola proyek konstruksi secara digital dan terpusat.
- Menggantikan pencatatan manual (spreadsheet/kertas) dengan platform SaaS terstruktur.
- Memberikan transparansi progres proyek kepada owner/klien melalui link pantau publik.
- Mendukung pertumbuhan bisnis kontraktor melalui fitur portofolio dan direktori.

### In Scope

- Autentikasi multi-metode: email + password, login via OTP email, reset password via OTP.
- Manajemen proyek: buat, lihat, edit proyek; tracking status dan progress.
- Work Breakdown Structure (WBS): struktur pekerjaan proyek secara hierarkis.
- Laporan harian: form input, daftar, dan detail laporan per proyek.
- Dokumentasi proyek: galeri foto, manajemen tim, tracking material.
- Portofolio publik kontraktor dan direktori yang dapat diakses publik.
- Link pantau progres untuk owner/klien tanpa login.
- Billing & manajemen langganan (tier: Free, Pro, Business).
- Admin panel: manajemen pengguna, moderasi konten, laporan keuangan, log aktivitas.
- Ekspor PDF laporan — menggunakan utilitas sisi klien (jsPDF).

### Out of Scope

- Integrasi payment gateway nyata (Midtrans/dll.) — saat ini mock.
- Notifikasi WhatsApp otomatis — `NotificationService` didefinisikan, belum diimplementasikan.
- Fitur multi-cabang atau multi-perusahaan per akun.
- Mobile native app (hanya responsive web).

## 1.3 Stakeholders

| Stakeholder | Role | Responsibility |
| --- | --- | --- |
| Kontraktor | End User Utama | Mengelola proyek, tim, laporan, dan portofolio. |
| Owner / Klien | End User Sekunder | Memantau progres proyek via link pantau publik. |
| Moderator | Admin Internal | Memoderasi portofolio dan ulasan kontraktor. |
| Super Admin | Admin Sistem | Mengelola seluruh pengguna, paket, dan keuangan platform. |
| System Analyst | Author | Menyusun dan memperbarui dokumentasi SoT. |

## 1.4 Definitions

| Term | Definition |
| --- | --- |
| Kontraktor | Pengguna utama yang memiliki akun bertipe `role: contractor`. |
| Moderator | Admin internal dengan `role: moderator`. |
| Super Admin | Admin tertinggi dengan `role: super_admin`. |
| OTP | One-Time Password — kode 6 digit yang dikirim via email Resend. |
| WBS | Work Breakdown Structure — hierarki pekerjaan dalam proyek. |
| Owner Tracking | Link publik unik untuk memantau progres proyek tanpa login. |
| Subscription Tier | Tingkat langganan: `free`, `pro`, `business`. |
| Server Action | Fungsi server-side Next.js (`"use server"`) yang menggantikan REST API endpoint. |
| Session Cookie | Cookie `kp-auth-session` (HttpOnly, Secure) berumur 30 hari sebagai bukti autentikasi. |

## 1.5 References

- `docs/Project_Codebase.md` — Referensi kode dan arsitektur aktual.
- `docs/blueprint/` — Blueprint desain per fitur (SoT blueprint).
- `src/lib/db/schema.ts` — Schema database aktual (Drizzle ORM + Neon PostgreSQL).
- `src/lib/contracts/enums.ts` — Definisi enum kanonik.

---

# 2. PRODUCT OVERVIEW

## 2.1 Product Summary

KontraktorPro adalah platform SaaS manajemen proyek konstruksi berbasis web yang dirancang khusus untuk kontraktor Indonesia. Platform ini menyediakan alat digital untuk mencatat dan memantau progres proyek, membuat laporan harian, mengelola tim dan material, membangun portofolio publik, serta memberikan akses transparansi kepada klien/owner. Admin platform dapat mengelola pengguna, memoderasi konten, dan memantau keuangan sistem melalui panel admin yang terpisah.

## 2.2 User Types

| User Type | Role Value | Description |
| --- | --- | --- |
| Kontraktor | `contractor` | Pengguna SaaS utama. Mengelola proyek, laporan, tim, material, portofolio, dan langganan. |
| Moderator | `moderator` | Admin internal. Meninjau dan menyetujui/menolak portofolio dan ulasan kontraktor. |
| Super Admin | `super_admin` | Admin penuh. Semua akses moderator + manajemen pengguna, paket, dan keuangan. |
| Guest / Owner | — | Tidak memiliki akun. Mengakses halaman publik (marketing, link pantau proyek). |

## 2.3 User Goals

### Kontraktor

- Mendaftarkan akun dan memverifikasi email melalui OTP.
- Membuat dan mengelola proyek konstruksi beserta detail WBS, laporan harian, tim, dan material.
- Memberikan link pantau kepada owner/klien untuk memantau progres tanpa login.
- Membangun portofolio digital dari proyek yang telah selesai.
- Mengelola paket langganan sesuai kebutuhan bisnis.

### Moderator / Super Admin

- Meninjau portofolio dan ulasan yang dikirimkan kontraktor.
- Mengelola akun pengguna (suspend, aktivasi, edit tier).
- Memantau keuangan dan aktivitas platform.

## 2.4 Operating Environment

- **Framework:** Next.js 16.2.4 (App Router, Server Components, Server Actions).
- **Language:** TypeScript 5.
- **Styling:** Tailwind CSS v4.
- **Database:** PostgreSQL via Neon serverless + Drizzle ORM.
- **Auth:** Custom cookie-based session (`kp-auth-session`). `next-auth` installed but NOT used.
- **Email:** Resend (OTP delivery). Environment variable: `RESEND_API_KEY`.
- **Deployment:** Vercel (target). Node.js environment.
- **Browser Support:** Chrome, Firefox, Edge, Safari (latest stable).
- **Locale:** `id-ID` — semua string UI dalam Bahasa Indonesia.

## 2.5 Assumptions

- Setiap kontraktor memiliki email yang valid dan aktif untuk menerima OTP.
- Koneksi internet stabil tersedia saat penggunaan aplikasi.
- Cookies diizinkan pada browser pengguna (diperlukan untuk sesi).

## 2.6 Constraints

- Tidak ada `route.ts` API handler — semua mutasi menggunakan Next.js Server Actions.
- `next-auth` tidak boleh diaktifkan — akan konflik dengan sistem cookie kustom.
- Schema database memerlukan migrasi Drizzle setiap ada perubahan — tidak boleh edit schema tanpa `npm run db:generate`.
- Semua cookie menggunakan `secure: true` — aplikasi harus diakses via HTTPS di production.

---

# 3. SYSTEM FEATURES

---

## Feature ID: F001
Feature Name: Autentikasi & Manajemen Sesi

### Description

Fitur ini menangani seluruh alur masuk dan keluar pengguna termasuk registrasi akun baru, login dengan password, login dengan OTP email, verifikasi OTP, reset password, dan logout.

### Requirements

- Sistem harus menyediakan form registrasi dengan field: Nama Lengkap, Email, Password, Konfirmasi Password, Nomor Telepon.
- Sistem harus mengirimkan kode OTP 6 digit ke email pengguna melalui Resend setelah registrasi.
- Sistem harus memvalidasi OTP sebelum membuat akun dan sesi aktif.
- Sistem harus menyediakan login via password dan login via OTP (dua jalur terpisah).
- Sistem harus memungkinkan reset password melalui verifikasi OTP via email.
- Sistem harus menyimpan sesi dalam cookie `kp-auth-session` (HttpOnly, Secure, 30 hari).
- Sistem harus memblokir akses halaman app jika sesi tidak valid dan redirect ke `/login`.
- Sistem harus redirect kontraktor ke `/dashboard` dan admin ke `/admin` setelah login.

### Business Rules

- Email harus unik — tidak boleh mendaftar dengan email yang sudah terdaftar.
- OTP berlaku selama 15 menit (`kp-auth-otp` cookie).
- OTP reset password berlaku selama 15 menit (`kp-auth-reset` cookie).
- Password di-hash dengan bcryptjs cost 12. OTP di-hash dengan bcryptjs cost 10.
- Akun yang di-suspend tidak dapat login.
- Pengguna yang sudah login yang mengakses halaman auth akan di-redirect ke dashboard.
- Cookie reset berlaku sekali pakai — dihapus setelah password berhasil diubah.

---

## Feature ID: F002
Feature Name: Dashboard Kontraktor

### Description

Halaman utama kontraktor yang menampilkan ringkasan KPI proyek, daftar proyek aktif, dan metrik bisnis penting setelah login.

### Requirements

- Sistem harus menampilkan ringkasan KPI: total proyek, proyek aktif, proyek selesai, proyek terlambat.
- Sistem harus menampilkan daftar proyek terbaru beserta status dan progress.
- Sistem harus menampilkan indikator progress visual (progress bar) per proyek.
- Sistem harus menampilkan peringatan proyek yang mendekati deadline atau terlambat.

### Business Rules

- KPI dihitung dari seluruh proyek milik kontraktor yang sedang login.
- Data dashboard bersifat read-only — tidak ada mutasi dari halaman ini.
- **Status saat ini:** Implementasi menggunakan data mock. Belum terhubung ke database real untuk project data.

---

## Feature ID: F003
Feature Name: Manajemen Proyek

### Description

Fitur CRUD proyek konstruksi. Kontraktor dapat membuat proyek baru, melihat daftar proyek, melihat detail proyek dengan navigasi tab, dan mengedit informasi proyek.

### Requirements

- Sistem harus memungkinkan kontraktor membuat proyek dengan field: Nama Proyek, Deskripsi, Lokasi, Tanggal Mulai, Tanggal Selesai Target, Nilai Kontrak, Nama Owner/Klien.
- Sistem harus menampilkan daftar proyek dengan kemampuan filter (status) dan sort.
- Sistem harus menampilkan detail proyek dalam 6 tab: Ringkasan, WBS, Laporan Harian, Galeri Foto, Tim, Material.
- Sistem harus memungkinkan editing informasi proyek melalui form yang sama dengan pembuatan.
- Sistem harus menampilkan badge status dengan warna yang sesuai: `draft` (abu), `active` (hijau), `delayed` (merah), `completed` (biru), `archived` (abu tua).

### Business Rules

- Proyek hanya dapat dilihat dan diedit oleh kontraktor pemiliknya.
- Status proyek: `draft` → `active` → `completed` atau `delayed` → `archived`.
- Progress proyek dinyatakan dalam persen (0–100).
- **Status saat ini:** Form tidak menyimpan data ke DB — form shell saja. Read data dari mock. Fitur CRUD real akan diimplementasikan di fase berikutnya.

---

## Feature ID: F004
Feature Name: Work Breakdown Structure (WBS)

### Description

Tampilan hierarkis pekerjaan dalam proyek, memungkinkan kontraktor memecah proyek menjadi sub-pekerjaan yang lebih kecil dengan tracking progress per item.

### Requirements

- Sistem harus menampilkan WBS dalam struktur hierarkis (parent-child tasks).
- Setiap item WBS harus memiliki: nama pekerjaan, bobot (%), progress aktual (%).
- Sistem harus menghitung total progress proyek berdasarkan bobot item WBS.

### Business Rules

- Total bobot seluruh item WBS level 1 harus 100%.
- **Status saat ini:** Read-only mock. CRUD WBS direncanakan di fase berikutnya.

---

## Feature ID: F005
Feature Name: Laporan Harian Proyek

### Description

Sistem pencatatan laporan harian proyek yang memungkinkan kontraktor mengisi form laporan per hari, melihat daftar laporan, dan melihat detail laporan individual.

### Requirements

- Sistem harus menyediakan form laporan harian dengan field: Tanggal, Cuaca, Ringkasan Pekerjaan, Kendala, Foto (opsional).
- Sistem harus menampilkan daftar laporan dengan filter tanggal.
- Sistem harus menampilkan detail laporan dengan status: `draft`, `submitted`, `flagged`.

### Business Rules

- Satu laporan per hari per proyek.
- Laporan `submitted` tidak dapat diedit kecuali oleh moderator.
- **Status saat ini:** Read-only mock. Form laporan direncanakan di fase berikutnya.

---

## Feature ID: F006
Feature Name: Galeri Foto & Dokumentasi

### Description

Penyimpanan dan tampilan foto dokumentasi proyek yang dapat diupload oleh kontraktor.

### Requirements

- Sistem harus memungkinkan upload foto dokumentasi per proyek.
- Sistem harus menampilkan galeri foto dalam grid layout.

### Business Rules

- Upload foto menggunakan UploadThing (`FileStorageService`).
- **Status saat ini:** Mock URL saja. UploadThing route belum dibuat. Direncanakan fase berikutnya.

---

## Feature ID: F007
Feature Name: Manajemen Tim Proyek

### Description

Pengelolaan anggota tim yang terlibat dalam proyek dengan role masing-masing.

### Requirements

- Sistem harus memungkinkan penambahan, pengeditan, dan penghapusan anggota tim.
- Setiap anggota tim memiliki role: `mandor`, `pekerja`, `spesialis`.

### Business Rules

- **Status saat ini:** Read-only mock. CRUD tim direncanakan di fase berikutnya.

---

## Feature ID: F008
Feature Name: Tracking Material Proyek

### Description

Pencatatan dan pemantauan material yang digunakan dalam proyek konstruksi.

### Requirements

- Sistem harus mencatat material dengan field: nama material, satuan, volume rencana, volume realisasi, harga satuan.
- Sistem harus menampilkan selisih antara volume rencana dan realisasi.

### Business Rules

- **Status saat ini:** Read-only mock. CRUD material direncanakan di fase berikutnya.

---

## Feature ID: F009
Feature Name: Portofolio & Profil Publik Kontraktor

### Description

Halaman publik profil kontraktor yang dapat diakses oleh siapa pun, menampilkan informasi bisnis, rating, dan portofolio proyek yang telah selesai.

### Requirements

- Sistem harus menampilkan profil publik kontraktor berdasarkan `slug` URL.
- Profil mencakup: nama perusahaan, spesialisasi, lokasi, rating, proyek terverifikasi, portofolio.
- Direktori kontraktor dapat dicari dan difilter berdasarkan spesialisasi dan lokasi.

### Business Rules

- Profil publik hanya menampilkan proyek yang statusnya `approved` oleh moderator.
- Kontraktor tier `free` memiliki limit portofolio yang ditampilkan.
- **Status saat ini:** Data statis dari `content.ts`. Profil dinamis dari DB direncanakan fase berikutnya.

---

## Feature ID: F010
Feature Name: Link Pantau Progres Owner

### Description

Link publik unik yang dapat dibagikan kontraktor kepada owner/klien untuk memantau progres proyek tanpa perlu login.

### Requirements

- Sistem harus menghasilkan token unik per proyek untuk link pantau.
- Halaman pantau menampilkan: nama proyek, status, progress keseluruhan, ringkasan WBS terkini.

### Business Rules

- Token bersifat publik — siapa pun dengan token dapat melihat progres.
- **Status saat ini:** Data statis dari `content.ts`. Implementasi real direncanakan fase berikutnya.

---

## Feature ID: F011
Feature Name: Billing & Manajemen Langganan

### Description

Sistem pengelolaan paket langganan kontraktor yang mencakup tampilan paket aktif, riwayat pembayaran, dan proses checkout upgrade paket.

### Requirements

- Sistem harus menampilkan paket langganan aktif dan perbandingan fitur antar tier.
- Sistem harus menyediakan halaman checkout dengan pilihan metode pembayaran.
- Sistem harus menampilkan konfirmasi setelah pembayaran berhasil.
- Sistem harus menampilkan riwayat invoice dan pembayaran.

### Business Rules

- Tier tersedia: `free`, `pro`, `business`.
- Akses billing hanya untuk pengguna yang sudah login (semua role).
- **Status saat ini:** Mock flow — checkout redirect langsung ke halaman sukses. Real payment (`PaymentGatewayService`) direncanakan fase berikutnya.

---

## Feature ID: F012
Feature Name: Admin Panel

### Description

Panel administrasi internal untuk moderator dan super_admin yang mencakup manajemen pengguna, moderasi konten, laporan keuangan platform, manajemen paket, dan log aktivitas.

### Requirements

- Sistem harus menampilkan dashboard admin dengan KPI platform (total user, pendapatan, dll.).
- Sistem harus memungkinkan moderator meninjau dan menyetujui/menolak portofolio dan ulasan.
- Super admin harus dapat melihat detail pengguna, mengubah tier, dan suspend/aktifkan akun.
- Sistem harus menampilkan laporan keuangan platform dengan filter periode.
- Sistem harus mencatat dan menampilkan log aktivitas seluruh pengguna.

### Business Rules

- Akses admin hanya untuk `role: moderator` dan `role: super_admin`.
- Super admin dapat mengakses seluruh fitur termasuk manajemen paket (dikunci di belakang `super_admin` role check).
- Moderator tidak dapat mengakses manajemen paket dan keuangan.
- **Status saat ini:** Seluruh data mock. Aksi nyata (approve, reject, suspend) direncanakan fase berikutnya.

---

# 4. DATA REQUIREMENTS

## 4.1 Core Business Objects

| Object | Description |
| --- | --- |
| User | Akun pengguna dengan role, subscription tier, dan credential. |
| ContractorProfile | Profil publik kontraktor dengan slug, rating, dan statistik. |
| Project | Proyek konstruksi milik kontraktor. |
| ProjectMember | Anggota tim dalam proyek. |
| Subscription | Data langganan aktif pengguna. |
| ActivityLog | Log audit seluruh aksi pengguna. |
| DailyReport | Laporan harian per proyek. |
| PortfolioEntry | Portofolio proyek yang dipublikasikan. |
| OtpChallenge | Data tantangan OTP untuk registrasi, login, dan reset password. |

## 4.2 Ownership Rules

| Object | Owner | Access |
| --- | --- | --- |
| User | System | CRUD oleh super_admin |
| ContractorProfile | Kontraktor | Read publik; write oleh pemilik; moderasi oleh moderator |
| Project | Kontraktor | CRUD oleh pemilik saja |
| DailyReport | Kontraktor | CRUD oleh pemilik; read-only setelah submitted |
| OtpChallenge | System | Dibuat sistem; dihapus setelah diverifikasi |

## 4.3 Data Retention Rules

- Data OTP challenges: dihapus setelah verifikasi berhasil atau expired.
- Data transaksi dan log: disimpan permanen untuk keperluan audit.
- Data proyek: disimpan permanen; diarsipkan tidak dihapus.

## 4.4 Data Validation Rules

- Email harus unik dan format valid.
- Password minimal 8 karakter.
- Progress proyek: integer 0–100.
- Harga kontrak: nilai positif dalam IDR.
- Nama produk/proyek: alfanumerik, bebas dari injection script.

---

# 5. EXTERNAL INTERFACES

## 5.1 User Interface Requirements

- Layout responsif untuk Desktop (≥1024px) dan Tablet (768px–1023px).
- Navigasi sidebar untuk halaman app dan admin.
- Toast notifications menggunakan Sonner untuk feedback aksi.
- Semua label, pesan error, dan konten UI dalam Bahasa Indonesia (`id-ID`).

## 5.2 External Systems

| System | Purpose | Status |
| --- | --- | --- |
| Resend | Pengiriman OTP via email | AKTIF |
| Neon PostgreSQL | Database utama via Drizzle ORM | AKTIF |
| UploadThing | Upload foto dokumentasi proyek | PLANNED |
| Midtrans / Payment Gateway | Pembayaran langganan | PLANNED |
| WhatsApp Business API | Notifikasi proyek | PLANNED |

## 5.3 Communication Requirements

- Tidak ada REST API handler (`route.ts`) — semua komunikasi melalui Next.js Server Actions.
- Database: Neon WebSocket serverless (pool mode). Menggunakan adapter `ws` di Node.js.
- Email: HTTPS ke Resend API. Memerlukan `RESEND_API_KEY` di environment.

---

# 6. NON-FUNCTIONAL REQUIREMENTS

## 6.1 Performance

- Halaman dashboard harus memuat dalam waktu < 3 detik pada koneksi standar.
- Server Action auth harus merespons dalam < 2 detik.

## 6.2 Security

- Semua cookie autentikasi: `HttpOnly`, `Secure`, `SameSite=Strict`.
- Password harus di-hash menggunakan bcryptjs (cost 12). Tidak ada plaintext password yang disimpan.
- OTP harus di-hash (cost 10) — tidak ada kode plaintext di database.
- Halaman admin dilindungi oleh RBAC guard di level `layout.tsx`.
- Environment variable `DATABASE_URL` dan `RESEND_API_KEY` tidak boleh di-expose ke client.

## 6.3 Availability

- Target uptime 99.5% selama jam kerja (07:00–21:00 WIB).

## 6.4 Reliability

- State form tidak hilang saat terjadi kegagalan Server Action — error ditampilkan, form tetap terisi.
- Session cookie 30 hari — pengguna tidak perlu login ulang setiap hari.

## 6.5 Scalability

- Database schema mendukung multi-tenant (setiap kontraktor memiliki project terpisah by `owner_id`).
- Neon serverless PostgreSQL dapat auto-scale sesuai beban.

## 6.6 Maintainability

- Semua enum kanonik di `src/lib/contracts/enums.ts` — tidak diduplikasi di tempat lain.
- Setiap `page.tsx` adalah thin entry point — logika dan UI di `_components/`.
- Tidak ada logika bisnis di komponen UI — dipisahkan ke services dan actions.

## 6.7 Usability

- Seluruh UI dalam Bahasa Indonesia — kontraktor tidak perlu memahami Bahasa Inggris.
- Error message informatif dan spesifik (bukan hanya "terjadi kesalahan").

---

# 7. PERMISSIONS AND ACCESS CONTROL

| Capability | Guest | Contractor | Moderator | Super Admin |
| --- | --- | --- | --- | --- |
| Akses halaman marketing / publik | ALLOWED | ALLOWED | ALLOWED | ALLOWED |
| Akses link pantau owner | ALLOWED | ALLOWED | ALLOWED | ALLOWED |
| Register & Login | ALLOWED | REDIRECT → dashboard | REDIRECT → admin | REDIRECT → admin |
| Akses dashboard & proyek | DENIED | ALLOWED | DENIED | DENIED |
| Akses billing | DENIED | ALLOWED | ALLOWED | ALLOWED |
| Akses admin panel | DENIED | DENIED | ALLOWED | ALLOWED |
| Akses manajemen paket | DENIED | DENIED | DENIED | ALLOWED |
| Suspend pengguna | DENIED | DENIED | DENIED | ALLOWED |

---

# 8. FEATURE INVENTORY

| Feature ID | Feature Name | Priority | Status |
| --- | --- | --- | --- |
| F001 | Autentikasi & Manajemen Sesi | Critical | IMPLEMENTED |
| F002 | Dashboard Kontraktor | High | MOCK |
| F003 | Manajemen Proyek | High | MOCK (form shell) |
| F004 | Work Breakdown Structure (WBS) | High | MOCK (read-only) |
| F005 | Laporan Harian Proyek | High | MOCK (read-only) |
| F006 | Galeri Foto & Dokumentasi | Medium | MOCK |
| F007 | Manajemen Tim Proyek | Medium | MOCK |
| F008 | Tracking Material Proyek | Medium | MOCK |
| F009 | Portofolio & Profil Publik | Medium | MOCK (static) |
| F010 | Link Pantau Progres Owner | Medium | MOCK (static) |
| F011 | Billing & Manajemen Langganan | High | MOCK (checkout mock) |
| F012 | Admin Panel | High | MOCK (UI only) |

---

# 9. OPEN QUESTIONS

| ID | Question | Status |
| --- | --- | --- |
| OQ-001 | Apakah foreign key constraints perlu ditambahkan ke schema Drizzle? | OPEN |
| OQ-002 | Provider payment gateway final: Midtrans atau lainnya? | OPEN |
| OQ-003 | Batas limit portofolio per tier subscription? | OPEN |
| OQ-004 | Apakah kontraktor dapat memiliki lebih dari satu profil publik? | OPEN |

---

# 10. FUTURE CONSIDERATIONS

- Implementasi real CRUD proyek, WBS, laporan harian, tim, dan material (Phase 4).
- Integrasi UploadThing untuk upload foto dokumentasi proyek (Phase 4).
- Portofolio publish flow dengan moderasi admin (Phase 5).
- Real payment gateway Midtrans + subscription enforcement per tier (Phase 6).
- Notifikasi WhatsApp otomatis untuk update laporan harian (Phase 4+).
- Halaman pengaturan akun kontraktor (Phase 6).
- Halaman 404 dan offline page (Phase final).

---

# 11. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document — adapted from Chain of Truth Reference (POS). Reflects current codebase state. |
