# User Flow Specification

Document Version: v1.0

Use Case ID: UC-011
Use Case Name: WBS & Laporan Harian Proyek

Status: Active
Last Updated: 2026-06-23
Author: System Analyst AI

Implementation Status: **IMPLEMENTED** — Create WBS item, Template WBS, & Daily Reports dengan kalkulasi project progress diaktifkan.

---

# 1. OVERVIEW

## 1.1 Summary

Dokumen ini mencakup dua sub-use case yang saling berkaitan dalam tab detail proyek:

- **UC-011a:** Mengelola WBS (Work Breakdown Structure) proyek
- **UC-011b:** Membuat dan melihat Laporan Harian proyek

Keduanya diakses dari dalam tab di halaman detail proyek `/projects/[id]`.

## 1.2 Requirement References

| Requirement ID | Requirement Name |
| --- | --- |
| F004 | Work Breakdown Structure (WBS) |
| F005 | Laporan Harian Proyek |

---

# 2. UC-011a: MENGELOLA WBS

## 2.1 Goal

Kontraktor ingin memecah pekerjaan proyek menjadi sub-pekerjaan dengan bobot dan progress yang terukur.

## 2.2 Main Flow (PLANNED)

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor buka tab "WBS" di detail proyek | Sistem menampilkan pohon WBS hierarkis |
| 2a | Kontraktor klik "Tambah Item" | Form input item WBS muncul (nama, kategori, bobot %) |
| 2b | **Kontraktor klik "Gunakan Template"** | **Modal pilih template WBS muncul (4 template pre-defined)** |
| 3a | Kontraktor mengisi form dan submit | Sistem menyimpan item WBS ke DB |
| 3b | **Kontraktor memilih template lalu konfirmasi** | **Sistem bulk-insert semua item template ke DB** |
| 4 | — | Pohon WBS diperbarui, progress proyek dikalkulasi ulang |
| 5 | Kontraktor update progress item | Sistem menghitung ulang total progress proyek |

## 2.3 Current State (IMPLEMENTED)

- Tab WBS menampilkan data real dari DB
- Form tambah item WBS fungsional (`createWbsItemAction`)
- **Tombol "Gunakan Template" fungsional** — modal 2 langkah dengan 4 template (Rumah Tinggal, Gedung Komersial, Renovasi Interior, Infrastruktur Jalan)
- Replace WBS yang ada (konfirmasi) atau apply ke WBS kosong (langsung)
- Progress proyek dikalkulasi ulang otomatis setelah template diterapkan

## 2.4 Business Rules

| Rule ID | Description |
| --- | --- |
| BR-001 | Total bobot item WBS level 1 harus = 100% |
| BR-002 | Progress proyek dihitung dari weighted average progress item WBS |
| BR-003 | Sub-item dapat bersarang (parent-child) |

---

# 3. UC-011b: LAPORAN HARIAN

## 3.1 Goal

Kontraktor ingin mencatat laporan harian pekerjaan proyek agar ada rekam jejak yang terstruktur.

## 3.2 Main Flow — Buat Laporan (PLANNED)

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor buka tab "Laporan Harian" | Sistem menampilkan daftar laporan + tombol "Buat Laporan Hari Ini" |
| 2 | Kontraktor klik "Buat Laporan Hari Ini" | Form laporan harian muncul |
| 3 | Kontraktor mengisi: Tanggal, Cuaca, Ringkasan Pekerjaan, Kendala | — |
| 4 | Kontraktor klik "Simpan sebagai Draft" | _(Planned)_ Sistem menyimpan laporan dengan status `draft` |
| 5 | Kontraktor klik "Submit Laporan" | _(Planned)_ Status berubah menjadi `submitted` |

## 3.3 Main Flow — Lihat Laporan (PLANNED)

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor buka tab "Laporan Harian" | Daftar laporan dengan filter tanggal |
| 2 | Kontraktor klik salah satu laporan | Detail laporan ditampilkan (read-only jika sudah `submitted`) |

## 3.4 Current State (MOCK)

- Tab Laporan Harian menampilkan daftar laporan dari `mock-data.ts` (read-only)
- Tidak ada form pembuatan laporan

## 3.5 Business Rules

| Rule ID | Description |
| --- | --- |
| BR-001 | Satu laporan per hari per proyek |
| BR-002 | Laporan `submitted` tidak dapat diedit oleh kontraktor |
| BR-003 | Status laporan: `draft` → `submitted` → `flagged` (oleh moderator) |

---

# 4. ACCEPTANCE CRITERIA (PLANNED)

| AC ID | Description |
| --- | --- |
| AC-001 | WBS menampilkan struktur hierarkis dengan bobot dan progress per item |
| AC-002 | Tambah/edit item WBS tersedia |
| AC-003 | Total progress proyek diperbarui otomatis saat WBS diupdate |
| AC-004 | Daftar laporan harian tersedia dengan filter tanggal |
| AC-005 | Form laporan harian dapat diisi dan disimpan |
| AC-006 | Status laporan dapat berubah dari draft ke submitted |

---

# 5. TRACEABILITY

| Requirement ID | Page ID |
| --- | --- |
| F004, F005 | PAGE-M03-004 (tab=wbs, tab=reports) |

---

# 6. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document — planned features documented. |
| 1.1 | 2026-06-24 | AI Agent | Update status: Template WBS diimplementasikan. Main flow 2b-3b ditambahkan. |
