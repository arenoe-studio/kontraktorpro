# User Flow Specification

Document Version: v1.0

Use Case ID: UC-006
Use Case Name: Dashboard Utama Kontraktor

Status: Active
Last Updated: 2026-06-23
Author: System Analyst AI

Implementation Status: **IMPLEMENTED** — data agregasi dari DB via `dashboard-service.ts`

---

# 1. OVERVIEW

## 1.1 Summary

Setelah login, kontraktor melihat halaman dashboard yang menampilkan ringkasan KPI seluruh proyeknya: total proyek, proyek aktif, proyek selesai, proyek terlambat, serta daftar proyek terbaru.

## 1.2 Goal

Kontraktor ingin mendapat gambaran cepat tentang status keseluruhan portofolio proyeknya.

## 1.3 Requirement References

| Requirement ID | Requirement Name |
| --- | --- |
| F002 | Dashboard Kontraktor |

## 1.4 Primary Actor

Kontraktor

---

# 2. TRIGGER

Kontraktor berhasil login atau klik menu "Dashboard" di sidebar.

---

# 3. PRECONDITIONS

| ID | Condition |
| --- | --- |
| PRE-001 | Kontraktor memiliki sesi aktif (`kp-auth-session`) |
| PRE-002 | Role kontraktor adalah `contractor` |

---

# 4. MAIN FLOW

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor mengakses `/dashboard` | `requireRole("contractor")` memverifikasi sesi |
| 2 | — | Sistem memuat data KPI dari `getDashboardSummary()` |
| 3 | — | Sistem menampilkan 4 KPI Cards: Total Proyek, Aktif, Selesai, Terlambat |
| 4 | — | Sistem menampilkan daftar proyek terbaru dengan badge status dan progress bar |
| 5 | Kontraktor membaca ringkasan dashboard | — |
| 6 | Kontraktor klik salah satu proyek | Sistem redirect ke `/projects/[id]` |

---

# 5. ALTERNATIVE FLOWS

## AF-001: Tidak Ada Proyek

### Condition
Kontraktor belum memiliki proyek.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Sistem memuat dashboard | KPI cards semua bernilai 0 |
| 2 | — | Area daftar proyek menampilkan empty state + tombol "Buat Proyek Pertama" |

---

# 6. POSTCONDITIONS

| ID | Condition |
| --- | --- |
| POST-001 | Kontraktor melihat ringkasan KPI terkini |
| POST-002 | Kontraktor dapat navigasi ke proyek detail dari dashboard |

---

# 7. BUSINESS RULES

| Rule ID | Description |
| --- | --- |
| BR-001 | Data dashboard hanya milik kontraktor yang sedang login (`owner_id = session.userId`) |
| BR-002 | Halaman read-only — tidak ada mutasi dari dashboard |
| BR-003 | Data dashboard di-fetch secara real-time dari database; KPI yang belum memiliki tabel (foto, material) di-fallback ke nilai 0 sementara. |

---

# 8. ACCEPTANCE CRITERIA

| AC ID | Description |
| --- | --- |
| AC-001 | 4 KPI cards ditampilkan: Total, Aktif, Selesai, Terlambat |
| AC-002 | Daftar proyek terbaru tampil dengan status badge berwarna sesuai |
| AC-003 | Progress bar per proyek sesuai nilai progress |
| AC-004 | Klik proyek navigasi ke detail proyek |
| AC-005 | Empty state tampil jika belum ada proyek |

---

# 9. TRACEABILITY

| Requirement ID | Page ID |
| --- | --- |
| F002 | PAGE-M03-001 |

---

# 10. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document. |
