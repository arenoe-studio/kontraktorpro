# User Flow Specification

Document Version: v1.0

Use Case ID: UC-001
Use Case Name: Registrasi Kontraktor

Status: Active
Last Updated: 2026-06-23
Author: System Analyst AI

Implementation Status: **IMPLEMENTED** — real DB (PostgreSQL + bcryptjs + Resend OTP)

---

# 1. OVERVIEW

## 1.1 Summary

Kontraktor baru mendaftarkan akun dengan mengisi form registrasi, setelah itu sistem mengirimkan kode OTP 6 digit ke email. Akun baru dibuat setelah OTP berhasil diverifikasi (UC-004).

## 1.2 Goal

Kontraktor ingin memiliki akun KontraktorPro agar dapat mengakses fitur manajemen proyek.

## 1.3 Requirement References

| Requirement ID | Requirement Name |
| --- | --- |
| F001 | Autentikasi & Manajemen Sesi |
| NFR-6.2 | Security — Cookie HttpOnly, password hashing |

## 1.4 Primary Actor

Kontraktor (pengguna baru, belum memiliki akun)

## 1.5 Supporting Actors

Sistem Autentikasi, Resend Email Service

---

# 2. TRIGGER

Kontraktor mengakses `/register` atau klik "Daftar Sekarang" dari halaman login/marketing.

---

# 3. PRECONDITIONS

| ID | Condition |
| --- | --- |
| PRE-001 | Kontraktor belum memiliki akun dengan email yang sama |
| PRE-002 | Aplikasi dapat diakses melalui browser |
| PRE-003 | Resend email service dalam kondisi aktif |

---

# 4. MAIN FLOW

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor mengakses halaman `/register` | Sistem menampilkan form registrasi (Nama Lengkap, Email, Nomor Telepon, Password, Konfirmasi Password) |
| 2 | Kontraktor mengisi seluruh field | Sistem memvalidasi input client-side (zod schema) |
| 3 | Kontraktor mengklik "Daftar Sekarang" | Sistem memanggil Server Action `registerAction` |
| 4 | — | Server Action memanggil `startRegistration()` di `auth-service.ts` |
| 5 | — | Sistem memeriksa keunikan email di tabel `users` |
| 6 | — | Sistem men-hash password (bcryptjs cost 12) + OTP (bcryptjs cost 10) |
| 7 | — | Sistem menyimpan OTP challenge ke tabel `otp_challenges` (flow: `register`) |
| 8 | — | Sistem mengirim kode OTP 6 digit ke email via Resend |
| 9 | — | Sistem menyimpan `kp-auth-otp` cookie (challenge ID, 15 menit) |
| 10 | — | Sistem redirect kontraktor ke `/verify-otp` untuk verifikasi OTP |

---

# 5. ALTERNATIVE FLOWS

## AF-001: Email Sudah Terdaftar

### Condition
Email yang dimasukkan sudah ada di tabel `users`.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor submit form dengan email yang sudah terdaftar | `registerAction` mengembalikan error |
| 2 | — | Sistem menampilkan pesan "Email sudah terdaftar. Silakan login atau gunakan email lain." |
| 3 | Kontraktor mengganti email | Kembali ke Step 2 Main Flow |

---

## AF-002: Klik "Sudah punya akun"

### Condition
Kontraktor ternyata sudah memiliki akun.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor klik link "Sudah punya akun? Masuk" | Sistem redirect ke `/login` |

---

# 6. EXCEPTION FLOWS

## EF-001: Resend Gagal Mengirim Email

### Condition
Resend API gagal mengirim email OTP (error 5xx atau network timeout).

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | `registerAction` dipanggil | `emailOtpService.sendOtp()` gagal |
| 2 | — | Sistem menampilkan toast error: "Gagal mengirim kode verifikasi. Silakan coba lagi." |
| 3 | — | OTP challenge tidak dibuat, akun tidak dibuat |

---

## EF-002: Sesi Sudah Aktif

### Condition
Kontraktor sudah login dan mencoba mengakses `/register`.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor mengakses `/register` | `redirectIfAuthenticated()` di layout mendeteksi sesi aktif |
| 2 | — | Sistem redirect ke `/dashboard` (contractor) atau `/admin` (admin) |

---

# 7. POSTCONDITIONS

| ID | Condition |
| --- | --- |
| POST-001 | OTP challenge tersimpan di `otp_challenges` dengan flow `register` |
| POST-002 | Cookie `kp-auth-otp` di-set di browser (15 menit) |
| POST-003 | Email OTP terkirim ke email kontraktor |
| POST-004 | Kontraktor berada di halaman `/verify-otp` |
| POST-005 | Akun belum dibuat — dibuat setelah verifikasi OTP berhasil (UC-004) |

---

# 8. BUSINESS RULES

| Rule ID | Description |
| --- | --- |
| BR-001 | Email harus unik — cek di DB sebelum proses |
| BR-002 | Password di-hash bcryptjs cost 12 sebelum disimpan di metadata OTP challenge |
| BR-003 | OTP di-hash bcryptjs cost 10 sebelum disimpan di `otp_challenges.code_hash` |
| BR-004 | OTP challenge berlaku 15 menit (`expires_at`) |
| BR-005 | Tidak ada plaintext password atau OTP yang disimpan di DB |

---

# 9. RELATED PAGES

| Page ID | Page Name |
| --- | --- |
| PAGE-M01-002 | Register |
| PAGE-M01-003 | Verifikasi OTP |

---

# 10. DATA USAGE

## 10.1 Data Read
| Entity | Description |
| --- | --- |
| `users` | Cek keunikan email |

## 10.2 Data Created
| Entity | Description |
| --- | --- |
| `otp_challenges` | OTP challenge dengan flow `register`, metadata berisi password hash |

## 10.3 Data Updated
Tidak ada.

## 10.4 Data Deleted
Tidak ada (di fase ini — akan dihapus setelah verifikasi di UC-004).

---

# 11. PERMISSIONS

| Role | Access |
| --- | --- |
| Guest (belum login) | ALLOWED |
| Kontraktor (sudah login) | REDIRECT ke `/dashboard` |

---

# 12. ACCEPTANCE CRITERIA

| AC ID | Description |
| --- | --- |
| AC-001 | Form registrasi menampilkan field: Nama Lengkap, Email, Nomor Telepon, Password, Konfirmasi Password |
| AC-002 | Validasi client-side menampilkan error per field sebelum submit |
| AC-003 | Email yang sudah terdaftar menampilkan pesan error spesifik |
| AC-004 | Email OTP terkirim setelah form valid di-submit |
| AC-005 | Kontraktor di-redirect ke `/verify-otp` setelah submit berhasil |
| AC-006 | Akun belum aktif sampai OTP diverifikasi |

---

# 13. TRACEABILITY

## Requirement Traceability
| Requirement ID |
| --- |
| F001 |
| NFR-6.2 |

## Information Architecture Traceability
| Page ID |
| --- |
| PAGE-M01-002 |
| PAGE-M01-003 |

## System Logic Reference
| System Logic File |
| --- |
| `../system_logics/sys_uc_001.md` |

---

# 14. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document. |
