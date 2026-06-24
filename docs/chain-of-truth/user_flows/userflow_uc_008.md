# User Flow Specification

Document Version: v1.0

Use Case ID: UC-008
Use Case Name: Membuat Proyek Baru

Status: Active
Last Updated: 2026-06-23
Author: System Analyst AI

Implementation Status: **IMPLEMENTED** — menggunakan Server Actions & Zod ke DB

---

# 1. OVERVIEW

## 1.1 Summary

Kontraktor mengisi form untuk membuat proyek konstruksi baru. Form mencakup informasi dasar proyek: nama, lokasi, deskripsi, tanggal, nilai kontrak, dan data klien.

## 1.2 Goal

Kontraktor ingin mendaftarkan proyek baru ke dalam sistem untuk mulai mengelolanya.

## 1.3 Requirement References

| Requirement ID | Requirement Name |
| --- | --- |
| F003 | Manajemen Proyek |

## 1.4 Primary Actor

Kontraktor

---

# 2. TRIGGER

Kontraktor klik "Buat Proyek Baru" dari halaman daftar proyek.

---

# 3. PRECONDITIONS

| ID | Condition |
| --- | --- |
| PRE-001 | Kontraktor memiliki sesi aktif dengan role `contractor` |
| PRE-002 | _(Planned)_ Kontraktor memiliki kuota proyek sesuai tier langganan |

---

# 4. MAIN FLOW

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor mengakses `/projects/new` | Sistem menampilkan `ProjectFormShell` (mode=create) |
| 2 | Kontraktor mengisi: Nama Proyek, Lokasi, Deskripsi | Validasi real-time per field |
| 3 | Kontraktor mengisi: Tanggal Mulai, Tanggal Target Selesai | Validasi: tanggal selesai > tanggal mulai |
| 4 | Kontraktor mengisi: Nilai Kontrak, Nama Klien/Owner | — |
| 5 | Kontraktor klik "Simpan Proyek" | _(Planned)_ Server Action `createProjectAction` dipanggil |
| 6 | — | _(Planned)_ Sistem menyimpan proyek ke DB dengan status `draft` |
| 7 | — | _(Planned)_ Redirect ke `/projects/[id]` proyek baru |

---

# 5. ALTERNATIVE FLOWS

## AF-001: Klik "Batal"

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor klik "Batal" | Sistem kembali ke `/projects` |
| 2 | — | Data form tidak tersimpan |

---

# 6. EXCEPTION FLOWS

## EF-001: Validasi Gagal

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor submit form dengan field wajib kosong | Validasi zod menolak |
| 2 | — | Error inline per field yang kosong |

---

# 7. POSTCONDITIONS (PLANNED)

| ID | Condition |
| --- | --- |
| POST-001 | Proyek baru tersimpan di `projects` dengan `owner_id = session.userId`, status = `draft` |
| POST-002 | Kontraktor berada di halaman detail proyek baru |

---

# 8. BUSINESS RULES

| Rule ID | Description |
| --- | --- |
| BR-001 | Field wajib: Nama Proyek, Lokasi |
| BR-002 | Tanggal selesai harus setelah tanggal mulai |
| BR-003 | Status awal proyek: `draft` |
| BR-004 | `owner_id` diambil dari session — tidak bisa diubah |
| BR-005 | **Mock:** Form ada tapi submit tidak menyimpan ke DB — akan diimplementasikan di fase berikutnya |

---

# 9. ACCEPTANCE CRITERIA

| AC ID | Description |
| --- | --- |
| AC-001 | Form menampilkan semua field yang diperlukan |
| AC-002 | Validasi error tampil inline per field |
| AC-003 | Tombol "Batal" kembali ke daftar proyek |
| AC-004 | _(Planned)_ Submit berhasil → redirect ke detail proyek baru |

---

# 10. TRACEABILITY

| Requirement ID | Page ID |
| --- | --- |
| F003 | PAGE-M03-003 |

---

# 11. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document. |
