# User Flows — Master Index

Document Version: v1.0

Project: KontraktorPro

Product: Aplikasi Manajemen Proyek Konstruksi Berbasis Web (SaaS)

Status: Active

Last Updated: 2026-06-23

Author: System Analyst AI

---

## 1. PURPOSE

Dokumen ini adalah indeks master untuk seluruh User Flow Specification KontraktorPro. Setiap user flow didokumentasikan dalam file terpisah.

---

## 2. FILE STRUCTURE

```text
user_flows/
├── index.md              ← File ini
├── userflow_uc_001.md    ← UC-001: Registrasi Kontraktor
├── userflow_uc_002.md    ← UC-002: Login dengan Password
├── userflow_uc_003.md    ← UC-003: Login dengan OTP Email
├── userflow_uc_004.md    ← UC-004: Verifikasi OTP
├── userflow_uc_005.md    ← UC-005: Reset Password (Lupa Password)
├── userflow_uc_006.md    ← UC-006: Dashboard Utama Kontraktor
├── userflow_uc_007.md    ← UC-007: Daftar & Filter Proyek
├── userflow_uc_008.md    ← UC-008: Membuat Proyek Baru
├── userflow_uc_009.md    ← UC-009: Melihat Detail Proyek
├── userflow_uc_010.md    ← UC-010: Mengedit Proyek
├── userflow_uc_011.md    ← UC-011: WBS & Laporan Harian (Planned)
├── userflow_uc_012.md    ← UC-012: Billing & Checkout
├── userflow_uc_013.md    ← UC-013: Pengaturan Akun
└── userflow_uc_014.md    ← UC-014: Profil Publik & Portofolio
```

---

## 3. USER FLOW CATALOG

| Use Case ID | Use Case Name | File | Status Implementasi |
| --- | --- | --- | --- |
| UC-001 | Registrasi Kontraktor | `./userflow_uc_001.md` | IMPLEMENTED |
| UC-002 | Login dengan Password | `./userflow_uc_002.md` | IMPLEMENTED |
| UC-003 | Login dengan OTP Email | `./userflow_uc_003.md` | IMPLEMENTED |
| UC-004 | Verifikasi OTP | `./userflow_uc_004.md` | IMPLEMENTED |
| UC-005 | Reset Password (Lupa Password) | `./userflow_uc_005.md` | IMPLEMENTED |
| UC-006 | Dashboard Utama Kontraktor | `./userflow_uc_006.md` | IMPLEMENTED |
| UC-007 | Daftar & Filter Proyek | `./userflow_uc_007.md` | IMPLEMENTED |
| UC-008 | Membuat Proyek Baru | `./userflow_uc_008.md` | IMPLEMENTED |
| UC-009 | Melihat Detail Proyek | `./userflow_uc_009.md` | IMPLEMENTED |
| UC-010 | Mengedit Proyek | `./userflow_uc_010.md` | IMPLEMENTED |
| UC-011 | WBS & Laporan Harian | `./userflow_uc_011.md` | IMPLEMENTED |
| UC-012 | Billing & Checkout | `./userflow_uc_012.md` | MOCK |
| UC-013 | Pengaturan Akun | `./userflow_uc_013.md` | IMPLEMENTED |
| UC-014 | Profil Publik & Portofolio | `./userflow_uc_014.md` | IMPLEMENTED |

---

## 4. REQUIREMENT → USER FLOW MAPPING

| Feature ID | Feature Name | Use Cases |
| --- | --- | --- |
| F001 | Autentikasi & Manajemen Sesi | UC-001, UC-002, UC-003, UC-004, UC-005 |
| F002 | Dashboard Kontraktor | UC-006 |
| F003 | Manajemen Proyek | UC-007, UC-008, UC-009, UC-010 |
| F004 | Work Breakdown Structure | UC-011 |
| F005 | Laporan Harian Proyek | UC-011 |
| F009 | Portofolio & Profil | UC-014 |
| F010 | Pengaturan Akun | UC-013 |
| F011 | Billing & Manajemen Langganan | UC-012 |

---

## 5. PAGE → USER FLOW MAPPING

| Page ID | Page Name | Use Cases |
| --- | --- | --- |
| PAGE-M01-002 | Register | UC-001 |
| PAGE-M01-001 | Login | UC-002, UC-003 |
| PAGE-M01-003 | Verifikasi OTP | UC-004 |
| PAGE-M01-004 | Lupa Password | UC-005 |
| PAGE-M03-001 | Dashboard Utama | UC-006 |
| PAGE-M03-002 | Daftar Proyek | UC-007 |
| PAGE-M03-003 | Buat Proyek Baru | UC-008 |
| PAGE-M03-004 | Detail Proyek | UC-009 |
| PAGE-M03-005 | Edit Proyek | UC-010 |
| PAGE-M03-006 | Pengaturan Akun | UC-013 |
| PAGE-M03-007 | Profil Publik & Portofolio | UC-014 |
| PAGE-M04-001 | Billing | UC-012 |
| PAGE-M04-002 | Checkout | UC-012 |

---

## 6. USER FLOW DEPENDENCIES

| Use Case | Depends On | Notes |
| --- | --- | --- |
| UC-001 | None | Entry point pertama untuk pengguna baru |
| UC-002 | None | Login langsung dengan password |
| UC-003 | None | Login dengan OTP (alternatif UC-002) |
| UC-004 | UC-001 atau UC-003 | OTP harus sudah dikirim terlebih dahulu |
| UC-005 | None | Dapat diakses dari halaman login |
| UC-006 | UC-002 atau UC-003 + UC-004 | Memerlukan sesi aktif |
| UC-007 | UC-002 atau UC-003 + UC-004 | Memerlukan sesi aktif |
| UC-008 | UC-007 | Dimulai dari daftar proyek |
| UC-009 | UC-007 | Dimulai dari daftar proyek |
| UC-010 | UC-009 | Dimulai dari detail proyek |
| UC-011 | UC-009 | Dimulai dari detail proyek (tab) |
| UC-012 | UC-002 atau UC-003 + UC-004 | Memerlukan sesi aktif (any role) |
| UC-013 | UC-002 atau UC-003 + UC-004 | Memerlukan sesi aktif |
| UC-014 | UC-002 atau UC-003 + UC-004 | Memerlukan sesi aktif |

---

## 7. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document. |
| 1.1 | 2026-06-24 | System Analyst AI | Added UC-013 and UC-014. |
