# User Flow Specification

Document Version: v1.0

Use Case ID: UC-007
Use Case Name: Daftar & Filter Proyek

Status: Active
Last Updated: 2026-06-23
Author: System Analyst AI

Implementation Status: **IMPLEMENTED** — data list diambil dari DB via `projects-service.ts`

---

# 1. OVERVIEW

## 1.1 Summary

Kontraktor melihat seluruh proyeknya dalam tampilan daftar/grid, dengan kemampuan filter berdasarkan status dan pengurutan.

## 1.2 Goal

Kontraktor ingin menemukan dan mengakses proyek tertentu dengan cepat.

## 1.3 Requirement References

| Requirement ID | Requirement Name |
| --- | --- |
| F003 | Manajemen Proyek |

## 1.4 Primary Actor

Kontraktor

---

# 2. TRIGGER

Kontraktor klik menu "Proyek Saya" di sidebar atau klik "Lihat Semua Proyek" dari dashboard.

---

# 3. PRECONDITIONS

| ID | Condition |
| --- | --- |
| PRE-001 | Kontraktor memiliki sesi aktif dengan role `contractor` |

---

# 4. MAIN FLOW

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor mengakses `/projects` | `requireRole("contractor")` memverifikasi sesi |
| 2 | — | Sistem memuat daftar proyek dari `getProjects()` |
| 3 | — | Sistem menampilkan daftar proyek dengan: nama, lokasi, status badge, progress bar, tanggal target |
| 4 | Kontraktor memilih filter status | Sistem memfilter proyek berdasarkan status yang dipilih |
| 5 | Kontraktor memilih urutan (terbaru/nama/progress) | Sistem mengurutkan ulang daftar |
| 6 | Kontraktor klik salah satu proyek | Sistem redirect ke `/projects/[id]` |

---

# 5. ALTERNATIVE FLOWS

## AF-001: Klik "Buat Proyek Baru"

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor klik tombol "Buat Proyek Baru" | Sistem redirect ke `/projects/new` |

---

## AF-002: Tidak Ada Proyek yang Cocok dengan Filter

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor memilih filter yang tidak menghasilkan proyek | Sistem menampilkan empty state: "Tidak ada proyek dengan status ini." |

---

# 6. BUSINESS RULES

| Rule ID | Description |
| --- | --- |
| BR-001 | Hanya proyek milik kontraktor yang sedang login yang ditampilkan |
| BR-002 | Status filter: All, Draft, Active, Delayed, Completed, Archived |
| BR-003 | Data daftar proyek diambil secara real-time dari database; KPI jumlah foto dan laporan per proyek menyesuaikan ketersediaan data. |

---

# 7. ACCEPTANCE CRITERIA

| AC ID | Description |
| --- | --- |
| AC-001 | Daftar proyek tampil dengan status badge berwarna |
| AC-002 | Filter status berfungsi dan mengupdate tampilan |
| AC-003 | Klik proyek navigasi ke halaman detail |
| AC-004 | Tombol "Buat Proyek Baru" tersedia |
| AC-005 | Empty state tampil jika tidak ada proyek atau tidak ada yang cocok filter |

---

# 8. TRACEABILITY

| Requirement ID | Page ID |
| --- | --- |
| F003 | PAGE-M03-002 |

---

# 9. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document. |
