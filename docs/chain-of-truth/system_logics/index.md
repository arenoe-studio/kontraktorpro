# System Logic Specifications — Master Index

Document Version: v1.0

Project: KontraktorPro

Product: Aplikasi Manajemen Proyek Konstruksi Berbasis Web (SaaS)

Status: Active

Last Updated: 2026-06-23

Author: System Analyst AI

---

## 1. PURPOSE

Dokumen ini adalah indeks master untuk seluruh System Logic Specification KontraktorPro.

Setiap System Logic mendokumentasikan:
- **Sequence Diagram** (Mermaid) — aliran data antar aktor dan sistem
- **Server Action Contract** — pengganti REST API contract; KontraktorPro menggunakan Next.js Server Actions, bukan REST endpoint

> **Penting:** KontraktorPro **tidak memiliki `route.ts` API handler**. Semua mutasi melalui Next.js Server Actions di `src/features/auth/actions.ts`. System Logic di sini mendokumentasikan kontrak Server Action, bukan REST endpoint.

---

## 2. FILE STRUCTURE

```text
system_logics/
├── index.md         ← File ini
├── sys_uc_001.md    ← UC-001: Registrasi Kontraktor
├── sys_uc_002.md    ← UC-002 & UC-003: Login (Password + OTP)
├── sys_uc_003.md    ← UC-004: Verifikasi OTP
└── sys_uc_004.md    ← UC-005: Reset Password
```

---

## 3. SYSTEM LOGIC CATALOG

| ID | Use Case Name | File | Status |
| --- | --- | --- | --- |
| SL-001 | Registrasi Kontraktor | `./sys_uc_001.md` | IMPLEMENTED |
| SL-002 | Login Password + Login OTP | `./sys_uc_002.md` | IMPLEMENTED |
| SL-003 | Verifikasi OTP | `./sys_uc_003.md` | IMPLEMENTED |
| SL-004 | Reset Password | `./sys_uc_004.md` | IMPLEMENTED |

> **Catatan Status Aktual:** Fitur untuk UC-006 s/d UC-011, UC-013, dan UC-014 sudah diimplementasikan (berjalan dengan real data dan DB).
> Dokumen System Logic yang saat ini belum dibuat namun fiturnya sudah berjalan:
> - SL untuk UC-006 s/d UC-011 (App Flows)
> - SL untuk UC-013 (Pengaturan Akun)
> - SL untuk UC-014 (Profil Publik & Portofolio)

---

## 4. USER FLOW → SYSTEM LOGIC MAPPING

| User Flow | System Logic | Description |
| --- | --- | --- |
| `userflow_uc_001.md` | `sys_uc_001.md` | Registrasi dan pembuatan OTP challenge |
| `userflow_uc_002.md` | `sys_uc_002.md` | Login password dan login OTP |
| `userflow_uc_003.md` | `sys_uc_002.md` | Login OTP (digabung dengan login password) |
| `userflow_uc_004.md` | `sys_uc_003.md` | Verifikasi OTP untuk semua flow |
| `userflow_uc_005.md` | `sys_uc_004.md` | Reset password 3-step |

---

## 5. SERVER ACTION OVERVIEW

### Lokasi File

```
src/features/auth/actions.ts    ← Semua Server Actions auth
src/features/auth/auth-service.ts ← Business logic (dipanggil oleh actions)
```

### Pola Return Type

Semua Server Action mengembalikan `ActionResult<T>`:

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }
```

### Cookie yang Digunakan

| Cookie Name | TTL | Purpose |
| --- | --- | --- |
| `kp-auth-session` | 30 hari | Session autentikasi utama |
| `kp-auth-otp` | 15 menit | OTP challenge (register/login OTP) |
| `kp-auth-reset` | 15 menit | OTP challenge (reset password) |

Semua cookie: `HttpOnly: true`, `Secure: true`, `SameSite: strict`.

---

## 6. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document. |
| 1.1 | 2026-06-24 | System Analyst AI | Updated status for UC-006 to UC-011, UC-013, UC-014. |
