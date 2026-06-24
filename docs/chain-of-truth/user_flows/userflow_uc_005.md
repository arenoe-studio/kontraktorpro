# User Flow Specification

Document Version: v1.0

Use Case ID: UC-005
Use Case Name: Reset Password (Lupa Password)

Status: Active
Last Updated: 2026-06-23
Author: System Analyst AI

Implementation Status: **IMPLEMENTED** — real DB (3-step flow di satu halaman)

---

# 1. OVERVIEW

## 1.1 Summary

Kontraktor yang lupa password dapat mereset password melalui 3 langkah di halaman `/forgot-password`: (1) input email, (2) verifikasi OTP, (3) buat password baru.

## 1.2 Goal

Kontraktor ingin mendapatkan kembali akses ke akun setelah lupa password.

## 1.3 Requirement References

| Requirement ID | Requirement Name |
| --- | --- |
| F001 | Autentikasi & Manajemen Sesi |

## 1.4 Primary Actor

Kontraktor

## 1.5 Supporting Actors

Sistem Autentikasi, Resend Email Service

---

# 2. TRIGGER

Kontraktor klik "Lupa Password?" dari halaman login.

---

# 3. PRECONDITIONS

| ID | Condition |
| --- | --- |
| PRE-001 | Kontraktor memiliki akun dengan email yang valid |
| PRE-002 | Resend email service aktif |

---

# 4. MAIN FLOW — 3 Step

## Step 1: Input Email

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor mengakses `/forgot-password` | Sistem menampilkan Step 1: form input email |
| 2 | Kontraktor memasukkan email | Validasi format email |
| 3 | Kontraktor klik "Kirim Kode Reset" | Sistem memanggil `requestPasswordResetAction` |
| 4 | — | `startPasswordReset()` di `auth-service.ts` dipanggil |
| 5 | — | Sistem mencari user berdasarkan email |
| 6 | — | Sistem membuat OTP challenge di `otp_challenges` (flow: `forgot-password`) |
| 7 | — | Sistem mengirim OTP 6 digit via Resend |
| 8 | — | Sistem men-set cookie `kp-auth-reset` (challenge ID, 15 menit) |
| 9 | — | Halaman beralih ke Step 2 (verifikasi OTP) |

## Step 2: Verifikasi OTP

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor menerima email OTP | — |
| 2 | Kontraktor memasukkan kode 6 digit | — |
| 3 | Kontraktor klik "Verifikasi Kode" | Sistem memanggil `verifyPasswordResetOtpAction` |
| 4 | — | `verifyChallengeCode()` memverifikasi kode terhadap hash |
| 5 | — | OTP valid → challenge diupdate `is_verified: true` |
| 6 | — | Halaman beralih ke Step 3 (password baru) |

## Step 3: Buat Password Baru

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor memasukkan password baru + konfirmasi | Validasi: match dan minimal 8 karakter |
| 2 | Kontraktor klik "Simpan Password Baru" | Sistem memanggil `resetPasswordAction` |
| 3 | — | `resetPassword()` di `auth-service.ts` dipanggil |
| 4 | — | Sistem membaca cookie `kp-auth-reset`, memverifikasi challenge `is_verified: true` |
| 5 | — | Sistem men-hash password baru (bcryptjs cost 12) |
| 6 | — | Sistem mengupdate `users.password_hash` |
| 7 | — | Sistem menghapus OTP challenge dari DB |
| 8 | — | Sistem menghapus cookie `kp-auth-reset` |
| 9 | — | Redirect ke `/login?email={email}` dengan pesan sukses |

---

# 5. ALTERNATIVE FLOWS

## AF-001: Klik "Kirim Ulang Kode" di Step 2

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor klik "Kirim Ulang" | Sistem memanggil `resendPasswordResetOtpAction` |
| 2 | — | `resendChallenge()` memeriksa cooldown dan batas resend |
| 3 | — | OTP baru dikirim via Resend |

---

## AF-002: Klik "Kembali ke Login"

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor klik "Kembali ke Login" | Redirect ke `/login` |

---

# 6. EXCEPTION FLOWS

## EF-001: Email Tidak Terdaftar

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor submit email yang tidak terdaftar | `startPasswordReset()` menolak |
| 2 | — | Pesan: "Email tidak terdaftar di sistem." |

---

## EF-002: Kode OTP Salah (Step 2)

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor submit kode salah | `verifyChallengeCode()` gagal |
| 2 | — | Pesan: "Kode tidak valid. Sisa percobaan: {n}" |

---

## EF-003: Password Baru Tidak Match (Step 3)

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor submit password yang tidak cocok | Validasi client-side zod gagal |
| 2 | — | Pesan: "Konfirmasi password tidak cocok." |

---

## EF-004: Challenge Belum Diverifikasi di Step 3

### Condition
Kontraktor mencoba mengakses Step 3 tanpa menyelesaikan Step 2.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | `resetPasswordAction` dipanggil | Challenge `is_verified: false` |
| 2 | — | Sistem menolak dan menampilkan error |

---

# 7. POSTCONDITIONS

| ID | Condition |
| --- | --- |
| POST-001 | `users.password_hash` diperbarui dengan hash password baru |
| POST-002 | OTP challenge dihapus dari `otp_challenges` |
| POST-003 | Cookie `kp-auth-reset` dihapus |
| POST-004 | Kontraktor berada di `/login?email={email}` dengan notifikasi sukses |

---

# 8. BUSINESS RULES

| Rule ID | Description |
| --- | --- |
| BR-001 | Password baru di-hash bcryptjs cost 12 |
| BR-002 | Challenge `is_verified` harus `true` sebelum reset password diizinkan |
| BR-003 | Cookie `kp-auth-reset` berlaku 15 menit |
| BR-004 | Setelah reset berhasil: challenge dihapus, cookie dihapus, redirect ke login |

---

# 9. RELATED PAGES

| Page ID | Page Name |
| --- | --- |
| PAGE-M01-004 | Lupa Password |
| PAGE-M01-001 | Login |

---

# 10. DATA USAGE

## 10.1 Data Read
| Entity | Description |
| --- | --- |
| `users` | Find by email (Step 1) |
| `otp_challenges` | Verify challenge (Step 2 & 3) |

## 10.2 Data Created
| Entity | Description |
| --- | --- |
| `otp_challenges` | Challenge baru (flow: `forgot-password`) di Step 1 |

## 10.3 Data Updated
| Entity | Description |
| --- | --- |
| `users` | Update `password_hash` (Step 3) |
| `otp_challenges` | Update `is_verified: true` (Step 2) |

## 10.4 Data Deleted
| Entity | Description |
| --- | --- |
| `otp_challenges` | Dihapus setelah reset berhasil (Step 3) |

---

# 11. PERMISSIONS

| Role | Access |
| --- | --- |
| Guest | ALLOWED |
| Semua role (sudah login) | REDIRECT ke dashboard |

---

# 12. ACCEPTANCE CRITERIA

| AC ID | Description |
| --- | --- |
| AC-001 | Step 1 menampilkan form email |
| AC-002 | Email tidak terdaftar menampilkan error spesifik |
| AC-003 | OTP terkirim ke email setelah Step 1 |
| AC-004 | Step 2 menampilkan form input 6 digit OTP |
| AC-005 | Kode salah menampilkan sisa percobaan |
| AC-006 | Step 3 menampilkan form password baru + konfirmasi |
| AC-007 | Password tidak match menampilkan validasi error |
| AC-008 | Setelah berhasil: redirect ke `/login?email=` dengan pesan sukses |

---

# 13. TRACEABILITY

## Requirement Traceability
| Requirement ID |
| --- |
| F001 |

## System Logic Reference
| System Logic File |
| --- |
| `../system_logics/sys_uc_004.md` |

---

# 14. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document. |
