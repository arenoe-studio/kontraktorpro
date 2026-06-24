# Prompts — Chain of Truth AI Agent Guide

Document Version: v1.0

Project: KontraktorPro

Last Updated: 2026-06-23

---

## Apa itu Chain of Truth?

Chain of Truth adalah metodologi pengembangan berbasis dokumentasi hierarkis di mana setiap artefak diturunkan dari dokumen induknya, membentuk rantai kebenaran yang dapat ditelusuri dari requirement sampai implementasi dan pengujian.

```
SRS (SoT-1)
  └── Information Architecture (SoT-2)
        └── Design System (SoT-3)
              └── User Flows (SoT-4)
                    └── System Logics (SoT-5)
                          └── Test Cases → Test Plan → Execution Sheet
```

---

## Cara Menggunakan Chain of Truth dengan AI Agent

### Prompt 1 — Implementasi Fitur Baru (Lengkap)

```
Berdasarkan dokumentasi Chain of Truth di docs/chain-of-truth/:
- SRS: docs/chain-of-truth/srs.md
- IA: docs/chain-of-truth/information_architecture.md
- Design System: docs/chain-of-truth/design_system.md
- User Flow: docs/chain-of-truth/user_flows/userflow_uc_[NNN].md
- System Logic: docs/chain-of-truth/system_logics/sys_uc_[NNN].md

Implementasikan [nama fitur] sesuai spesifikasi di atas.
Gunakan pola yang sudah ada di codebase (thin page.tsx, komponen di _components/).
Jangan membuat fitur di luar scope yang didefinisikan di SRS.
```

---

### Prompt 2 — Implementasi Berdasarkan User Flow Saja

```
Baca docs/chain-of-truth/user_flows/userflow_uc_[NNN].md dan
docs/chain-of-truth/system_logics/sys_uc_[NNN].md.

Implementasikan use case [UC-NNN: Nama UC] sesuai spesifikasi tersebut
menggunakan pola yang sudah ada di codebase KontraktorPro:
- Server Actions di src/features/[feature]/actions.ts
- Komponen di src/app/[route]/_components/
- Thin page.tsx sebagai entry point
```

---

### Prompt 3 — Membuat Halaman Baru

```
Berdasarkan docs/chain-of-truth/information_architecture.md (PAGE-[ID])
dan docs/chain-of-truth/design_system.md:

Buat halaman [nama halaman] di route [/path].
Guard: [requireRole("contractor") / requireAuth() / public]
Komponen utama di: src/app/[path]/_components/[NamaPage].tsx
page.tsx harus thin entry point — hanya panggil guard dan render komponen.
```

---

### Prompt 4 — Menambah System Logic Baru (ketika fitur diimplementasikan)

```
Fitur [nama fitur] baru saja diimplementasikan di:
- Server Action: src/features/[feature]/actions.ts
- Service: src/features/[feature]/[service].ts

Buat System Logic document di docs/chain-of-truth/system_logics/sys_uc_[NNN].md
menggunakan template yang sama dengan sys_uc_001.md s/d sys_uc_004.md.
Ganti "API Contract" dengan "Server Action Contract" sesuai pattern KontraktorPro.
Sertakan sequence diagram Mermaid yang akurat sesuai kode aktual.
```

---

### Prompt 5 — Menambah User Flow Baru

```
Berdasarkan SRS feature [F0NN] di docs/chain-of-truth/srs.md,
buat User Flow Specification baru di:
docs/chain-of-truth/user_flows/userflow_uc_[NNN].md

Gunakan template yang sama dengan userflow_uc_001.md s/d userflow_uc_012.md.
Sertakan:
- Main Flow
- Alternative Flows (AF)
- Exception Flows (EF)
- Acceptance Criteria
- Traceability
```

---

### Prompt 6 — Update Test Cases setelah Fitur Diimplementasikan

```
Fitur [nama fitur] sudah diimplementasikan (UC-[NNN]).
Tambahkan test cases baru ke docs/chain-of-truth/test_cases.md
mengikuti format TC-F[NNN]-[NNN] yang sudah ada.

Test cases harus mencakup:
- Positif: happy path
- Negatif: validasi error, input salah
- Exception: server error, expired state, unauthorized access

Perbarui juga docs/chain-of-truth/test_execution_sheet.md dengan baris baru.
```

---

### Prompt 7 — Audit Konsistensi Chain of Truth

```
Lakukan audit konsistensi Chain of Truth untuk KontraktorPro:

1. Periksa apakah setiap Feature ID di srs.md punya mapping di information_architecture.md
2. Periksa apakah setiap User Flow di user_flows/index.md punya file yang lengkap
3. Periksa apakah System Logic sudah cover semua fitur yang IMPLEMENTED
4. Periksa apakah test_cases.md sudah cover semua UC yang IMPLEMENTED

Laporkan gap yang ditemukan dan buat daftar dokumen yang perlu dibuat/diperbarui.
```

---

## Status Dokumen Saat Ini

| Dokumen | Status | File |
| --- | --- | --- |
| SRS | ✅ Active v1.0 | `srs.md` |
| Information Architecture | ✅ Active v1.0 | `information_architecture.md` |
| Design System | ✅ Active v1.0 | `design_system.md` |
| Data Model | ✅ Active v1.0 | `data_model.md` |
| User Flows Index | ✅ Active v1.0 | `user_flows/index.md` |
| UC-001 Registrasi | ✅ Implemented | `user_flows/userflow_uc_001.md` |
| UC-002 Login Password | ✅ Implemented | `user_flows/userflow_uc_002.md` |
| UC-003 Login OTP | ✅ Implemented | `user_flows/userflow_uc_003.md` |
| UC-004 Verifikasi OTP | ✅ Implemented | `user_flows/userflow_uc_004.md` |
| UC-005 Reset Password | ✅ Implemented | `user_flows/userflow_uc_005.md` |
| UC-006 Dashboard | 🔶 Mock | `user_flows/userflow_uc_006.md` |
| UC-007 Daftar Proyek | 🔶 Mock | `user_flows/userflow_uc_007.md` |
| UC-008 Buat Proyek | 🔶 Mock | `user_flows/userflow_uc_008.md` |
| UC-009 Detail Proyek | 🔶 Mock | `user_flows/userflow_uc_009.md` |
| UC-010 Edit Proyek | 🔶 Mock | `user_flows/userflow_uc_010.md` |
| UC-011 WBS & Laporan Harian | ⬜ Planned | `user_flows/userflow_uc_011.md` |
| UC-012 Billing & Checkout | 🔶 Mock | `user_flows/userflow_uc_012.md` |
| System Logics Index | ✅ Active v1.0 | `system_logics/index.md` |
| SL-001 Registrasi | ✅ Implemented | `system_logics/sys_uc_001.md` |
| SL-002 Login | ✅ Implemented | `system_logics/sys_uc_002.md` |
| SL-003 Verifikasi OTP | ✅ Implemented | `system_logics/sys_uc_003.md` |
| SL-004 Reset Password | ✅ Implemented | `system_logics/sys_uc_004.md` |
| Test Plan | ✅ Active v1.0 | `test_plan.md` |
| Test Cases | ✅ Active v1.0 (F001 only) | `test_cases.md` |
| Test Execution Sheet | ⬜ Template | `test_execution_sheet.md` |

**Legend:** ✅ Done | 🔶 Mock (UI ada, belum real) | ⬜ Planned / Template

---

## Aturan Pembaruan

- **SRS** diperbarui jika ada perubahan scope atau feature requirement.
- **IA** diperbarui jika ada route baru atau perubahan struktur navigasi.
- **User Flows** diperbarui jika behavior use case berubah.
- **System Logics** dibuat/diperbarui ketika fitur diimplementasikan dari MOCK ke REAL.
- **Test Cases** ditambah ketika System Logic baru dibuat.
- **Test Execution Sheet** diisi setiap siklus testing.

---

## Referensi Codebase

| Kebutuhan | File |
| --- | --- |
| Auth logic | `src/features/auth/auth-service.ts` |
| Server Actions | `src/features/auth/actions.ts` |
| Session utilities | `src/lib/auth/session.ts` |
| Database schema | `src/lib/db/schema.ts` |
| Enum definitions | `src/lib/contracts/enums.ts` |
| Mock data (app) | `src/app/(app)/_components/mock-data.ts` |
| Utilities | `src/lib/utils.ts` |
| Navigation | `src/lib/navigation.ts` |
