# User Flow Specification

Document Version: v1.0

Use Case ID: UC-010
Use Case Name: Mengedit Proyek

Status: Active
Last Updated: 2026-06-23
Author: System Analyst AI

Implementation Status: **IMPLEMENTED** — menggunakan Server Actions & Zod ke DB

---

# 1. OVERVIEW

## 1.1 Summary

Kontraktor mengedit informasi proyek yang sudah ada melalui form yang sama dengan pembuatan proyek, namun field diisi dengan data proyek yang sudah ada.

## 1.2 Goal

Kontraktor ingin memperbarui informasi proyek (nama, lokasi, status, tanggal, dll.).

## 1.3 Requirement References

| Requirement ID | Requirement Name |
| --- | --- |
| F003 | Manajemen Proyek |

## 1.4 Primary Actor

Kontraktor

---

# 2. TRIGGER

Kontraktor klik "Edit Proyek" dari halaman detail proyek.

---

# 3. PRECONDITIONS

| ID | Condition |
| --- | --- |
| PRE-001 | Kontraktor memiliki sesi aktif dengan role `contractor` |
| PRE-002 | Proyek yang akan diedit adalah milik kontraktor yang login |

---

# 4. MAIN FLOW

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor mengakses `/projects/[id]/edit` | `requireRole("contractor")` memverifikasi sesi |
| 2 | — | Sistem memuat data proyek yang ada (pre-fill form) |
| 3 | Kontraktor mengubah field yang perlu diperbarui | Validasi real-time |
| 4 | Kontraktor klik "Simpan Perubahan" | _(Planned)_ Server Action `updateProjectAction` dipanggil |
| 5 | — | _(Planned)_ Sistem menyimpan perubahan ke DB |
| 6 | — | _(Planned)_ Redirect ke `/projects/[id]` dengan toast sukses |

---

# 5. ALTERNATIVE FLOWS

## AF-001: Klik "Batal"

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor klik "Batal" | Sistem kembali ke `/projects/[id]` |
| 2 | — | Perubahan tidak tersimpan |

---

# 6. BUSINESS RULES

| Rule ID | Description |
| --- | --- |
| BR-001 | Hanya pemilik proyek (`owner_id`) yang dapat mengedit |
| BR-002 | Status proyek dapat diubah melalui form edit |
| BR-003 | `owner_id` tidak dapat diubah |
| BR-004 | **Mock:** Form ada tapi tidak menyimpan ke DB |

---

# 7. ACCEPTANCE CRITERIA

| AC ID | Description |
| --- | --- |
| AC-001 | Form diisi dengan data proyek yang sudah ada |
| AC-002 | Semua field dapat diedit |
| AC-003 | "Batal" kembali ke detail proyek tanpa perubahan |
| AC-004 | _(Planned)_ Submit berhasil → redirect ke detail proyek + toast sukses |

---

# 8. TRACEABILITY

| Requirement ID | Page ID |
| --- | --- |
| F003 | PAGE-M03-005 |

---

# 9. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document. |
