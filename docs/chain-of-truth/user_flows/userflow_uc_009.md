# User Flow Specification

Document Version: v1.0

Use Case ID: UC-009
Use Case Name: Melihat Detail Proyek

Status: Active
Last Updated: 2026-06-23
Author: System Analyst AI

Implementation Status: **IMPLEMENTED** — data overview/header diambil dari DB via `projects-service.ts`, tab lain sementara kosong (empty state)

---

# 1. OVERVIEW

## 1.1 Summary

Kontraktor mengakses halaman detail proyek yang menyediakan navigasi 6 tab: Ringkasan, WBS, Laporan Harian, Galeri Foto, Tim, dan Material. Setiap tab menampilkan informasi spesifik proyek tersebut.

## 1.2 Goal

Kontraktor ingin melihat semua informasi terkait proyek dalam satu halaman terpadu.

## 1.3 Requirement References

| Requirement ID | Requirement Name |
| --- | --- |
| F003 | Manajemen Proyek |
| F004 | Work Breakdown Structure |
| F005 | Laporan Harian |
| F006 | Galeri Foto |
| F007 | Manajemen Tim |
| F008 | Tracking Material |

## 1.4 Primary Actor

Kontraktor

---

# 2. TRIGGER

Kontraktor klik proyek dari daftar proyek atau dashboard.

---

# 3. PRECONDITIONS

| ID | Condition |
| --- | --- |
| PRE-001 | Kontraktor memiliki sesi aktif dengan role `contractor` |
| PRE-002 | Proyek dengan ID tersebut ada dan dimiliki oleh kontraktor yang login |

---

# 4. MAIN FLOW

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor mengakses `/projects/[id]` | `requireRole("contractor")` memverifikasi sesi |
| 2 | — | Sistem memuat data proyek dari `getProjectById(id)` |
| 3 | — | Sistem menampilkan header proyek: nama, status badge, progress bar, tanggal |
| 4 | — | Tab "Ringkasan" aktif secara default |
| 5 | Kontraktor membaca ringkasan | Tab Ringkasan: info umum, nilai kontrak, nama klien, lokasi |
| 6 | Kontraktor klik tab "WBS" | Tab WBS: tampilan hierarki pekerjaan (mock, read-only) |
| 7 | Kontraktor klik tab "Laporan Harian" | Tab: daftar laporan harian (mock, read-only) |
| 8 | Kontraktor klik tab "Galeri Foto" | Tab: grid foto dokumentasi (mock) |
| 9 | Kontraktor klik tab "Tim" | Tab: daftar anggota tim dengan role (mock) |
| 10 | Kontraktor klik tab "Material" | Tab: tabel material dengan rencana vs realisasi (mock) |

---

# 5. ALTERNATIVE FLOWS

## AF-001: Klik "Edit Proyek"

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor klik tombol "Edit Proyek" | Sistem redirect ke `/projects/[id]/edit` |

---

## AF-002: URL Tab Direct Access

### Condition
Kontraktor mengakses `/projects/[id]?tab=wbs` langsung via URL.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | URL mengandung `?tab=wbs` | Sistem membuka tab WBS langsung |

---

## AF-003: Proyek Tidak Ditemukan

### Condition
ID proyek tidak valid atau bukan milik kontraktor.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Sistem mencari proyek berdasarkan ID | Proyek tidak ditemukan |
| 2 | — | Sistem menampilkan halaman `not-found` |

---

# 6. BUSINESS RULES

| Rule ID | Description |
| --- | --- |
| BR-001 | Proyek hanya dapat dilihat oleh `owner_id` yang sesuai |
| BR-002 | Tab status tersimpan di URL query param `?tab=` |
| BR-003 | Halaman read-only untuk semua tab saat ini — aksi CRUD per tab direncanakan |

---

# 7. ACCEPTANCE CRITERIA

| AC ID | Description |
| --- | --- |
| AC-001 | Header proyek menampilkan nama, status badge, progress bar |
| AC-002 | 6 tab tersedia dan dapat diklik |
| AC-003 | Tab aktif terindikasi secara visual (underline biru) |
| AC-004 | URL diperbarui saat berpindah tab |
| AC-005 | Setiap tab menampilkan data yang relevan |
| AC-006 | Tombol "Edit Proyek" tersedia |

---

# 8. TRACEABILITY

| Requirement ID | Page ID |
| --- | --- |
| F003, F004, F005, F006, F007, F008 | PAGE-M03-004 |

---

# 9. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document. |
