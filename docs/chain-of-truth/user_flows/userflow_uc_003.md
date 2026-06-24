# User Flow Specification

Document Version: v1.0

Use Case ID: UC-003
Use Case Name: Login dengan OTP Email

Status: Active
Last Updated: 2026-06-23
Author: System Analyst AI

Implementation Status: **IMPLEMENTED** — real DB (PostgreSQL + Resend OTP)

---

# 1. OVERVIEW

## 1.1 Summary

Kontraktor memilih mode login tanpa password dengan memasukkan email saja. Sistem mengirimkan OTP 6 digit ke email tersebut. Kontraktor kemudian di-redirect ke halaman verifikasi OTP (UC-004).

## 1.2 Goal

Kontraktor ingin login tanpa perlu mengingat password, cukup menggunakan akses ke email.

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

Pengguna mengakses `/login` dan memilih mode "Kirim Kode OTP".

---

# 3. PRECONDITIONS

| ID | Condition |
| --- | --- |
| PRE-001 | Pengguna memiliki akun terdaftar dan terverifikasi |
| PRE-002 | Akun tidak dalam status `suspended` |
| PRE-003 | Resend email service aktif |

---

# 4. MAIN FLOW

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Pengguna mengakses `/login` | Sistem menampilkan halaman login |
| 2 | Pengguna memasukkan email dan memilih mode OTP | Sistem memvalidasi email tidak kosong |
| 3 | Pengguna mengklik "Kirim Kode OTP" | Sistem memanggil Server Action `requestLoginOtpAction` |
| 4 | — | Server Action memanggil `startLoginOtp()` di `auth-service.ts` |
| 5 | — | Sistem mencari user berdasarkan email (normalisasi lowercase) |
| 6 | — | Sistem membuat OTP challenge di `otp_challenges` (flow: `login`) |
| 7 | — | Sistem mengirim OTP 6 digit via Resend ke email pengguna |
| 8 | — | Sistem men-set cookie `kp-auth-otp` (challenge ID, 15 menit) |
| 9 | — | Sistem redirect pengguna ke `/verify-otp` |

---

# 5. ALTERNATIVE FLOWS

## AF-001: Pilih Login dengan Password

### Condition
Pengguna memilih kembali ke login password.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Pengguna klik "Login dengan Password" | Form beralih ke mode password (UC-002) |

---

# 6. EXCEPTION FLOWS

## EF-001: Email Tidak Terdaftar

### Condition
Email yang dimasukkan tidak ada di tabel `users`.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Pengguna submit email | `startLoginOtp()` tidak menemukan user |
| 2 | — | Sistem menampilkan pesan: "Email tidak terdaftar di sistem." |

---

## EF-002: Akun Disuspend

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Pengguna submit email akun yang disuspend | `startLoginOtp()` menolak |
| 2 | — | Sistem menampilkan pesan: "Akun Anda telah disuspend. Hubungi administrator." |

---

## EF-003: Resend Gagal Mengirim Email

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | `requestLoginOtpAction` dipanggil | `emailOtpService.sendOtp()` gagal |
| 2 | — | Toast error: "Gagal mengirim kode OTP. Silakan coba lagi." |
| 3 | — | OTP challenge tidak dibuat |

---

# 7. POSTCONDITIONS

| ID | Condition |
| --- | --- |
| POST-001 | OTP challenge tersimpan di `otp_challenges` dengan flow `login` |
| POST-002 | Cookie `kp-auth-otp` di-set (15 menit) |
| POST-003 | Email OTP terkirim ke email pengguna |
| POST-004 | Pengguna berada di halaman `/verify-otp` |

---

# 8. BUSINESS RULES

| Rule ID | Description |
| --- | --- |
| BR-001 | Email dinormalisasi lowercase sebelum query |
| BR-002 | Akun suspended tidak bisa meminta OTP login |
| BR-003 | OTP challenge berlaku 15 menit |
| BR-004 | Kode OTP di-hash (cost 10) sebelum disimpan di `otp_challenges.code_hash` |

---

# 9. RELATED PAGES

| Page ID | Page Name |
| --- | --- |
| PAGE-M01-001 | Login |
| PAGE-M01-003 | Verifikasi OTP |

---

# 10. DATA USAGE

## 10.1 Data Read
| Entity | Description |
| --- | --- |
| `users` | Find by email, check suspended status |

## 10.2 Data Created
| Entity | Description |
| --- | --- |
| `otp_challenges` | OTP challenge dengan flow `login` |

## 10.3 Data Updated
Tidak ada.

## 10.4 Data Deleted
Tidak ada.

---

# 11. PERMISSIONS

| Role | Access |
| --- | --- |
| Guest | ALLOWED |
| Semua role (sudah login) | REDIRECT ke dashboard sesuai role |

---

# 12. ACCEPTANCE CRITERIA

| AC ID | Description |
| --- | --- |
| AC-001 | Mode OTP dapat dipilih di halaman login |
| AC-002 | Email tidak terdaftar menampilkan pesan error spesifik |
| AC-003 | Email OTP diterima dalam waktu < 30 detik setelah submit |
| AC-004 | Pengguna di-redirect ke `/verify-otp` setelah email terkirim |
| AC-005 | Cookie `kp-auth-otp` di-set di browser |

---

# 13. TRACEABILITY

## Requirement Traceability
| Requirement ID |
| --- |
| F001 |

## System Logic Reference
| System Logic File |
| --- |
| `../system_logics/sys_uc_003.md` |

---

# 14. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document. |
