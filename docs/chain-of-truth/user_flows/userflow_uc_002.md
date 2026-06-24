# User Flow Specification

Document Version: v1.0

Use Case ID: UC-002
Use Case Name: Login dengan Password

Status: Active
Last Updated: 2026-06-23
Author: System Analyst AI

Implementation Status: **IMPLEMENTED** — real DB (PostgreSQL + bcryptjs)

---

# 1. OVERVIEW

## 1.1 Summary

Kontraktor (atau admin) masuk ke sistem menggunakan email dan password. Jika berhasil, session cookie di-set dan pengguna di-redirect ke dashboard sesuai role-nya.

## 1.2 Goal

Pengguna ingin mengakses fitur aplikasi yang dilindungi autentikasi.

## 1.3 Requirement References

| Requirement ID | Requirement Name |
| --- | --- |
| F001 | Autentikasi & Manajemen Sesi |
| NFR-6.2 | Security — HttpOnly cookie, bcrypt verification |

## 1.4 Primary Actor

Kontraktor / Moderator / Super Admin

## 1.5 Supporting Actors

Sistem Autentikasi

---

# 2. TRIGGER

Pengguna mengakses `/login` dan memilih tab atau mode "Login dengan Password".

---

# 3. PRECONDITIONS

| ID | Condition |
| --- | --- |
| PRE-001 | Pengguna memiliki akun terdaftar dan terverifikasi |
| PRE-002 | Akun tidak dalam status `suspended` |
| PRE-003 | Aplikasi dapat diakses melalui browser |

---

# 4. MAIN FLOW

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Pengguna mengakses `/login` | Sistem menampilkan halaman login dengan form email + password |
| 2 | Pengguna memasukkan email dan password | Sistem memvalidasi input tidak kosong (client-side) |
| 3 | Pengguna mengklik "Masuk dengan Password" | Sistem memanggil Server Action `loginWithPasswordAction` |
| 4 | — | Server Action memanggil `loginWithPassword()` di `auth-service.ts` |
| 5 | — | Sistem mencari user berdasarkan email (normalisasi lowercase) |
| 6 | — | Sistem memverifikasi password dengan `bcryptjs.compare()` |
| 7 | — | Sistem men-set cookie `kp-auth-session` (HttpOnly, Secure, 30 hari) |
| 8 | — | Sistem mengembalikan `{ redirectTo, firstLogin }` |
| 9 | — | Kontraktor → redirect ke `/dashboard`; Admin → redirect ke `/admin` |

---

# 5. ALTERNATIVE FLOWS

## AF-001: Pilih Login dengan OTP

### Condition
Pengguna ingin login tanpa password (hanya OTP email).

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Pengguna klik "Login dengan OTP / Kirim Kode" | Sistem memanggil `requestLoginOtpAction` (UC-003) |

---

## AF-002: Klik "Lupa Password"

### Condition
Pengguna tidak ingat password.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Pengguna klik "Lupa Password?" | Sistem redirect ke `/forgot-password` |

---

## AF-003: Klik "Belum punya akun"

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Pengguna klik "Daftar Sekarang" | Sistem redirect ke `/register` |

---

# 6. EXCEPTION FLOWS

## EF-001: Email atau Password Salah

### Condition
Email tidak ditemukan atau bcryptjs compare gagal.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Pengguna submit form | `loginWithPasswordAction` dipanggil |
| 2 | — | `loginWithPassword()` melempar error autentikasi |
| 3 | — | Sistem menampilkan pesan: "Email atau password tidak sesuai." |
| 4 | Pengguna memperbaiki input | Kembali ke Step 2 Main Flow |

---

## EF-002: Akun Disuspend

### Condition
Akun ditemukan tapi `suspended: true`.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Pengguna submit form dengan akun yang disuspend | `loginWithPassword()` menolak |
| 2 | — | Sistem menampilkan pesan: "Akun Anda telah disuspend. Hubungi administrator." |

---

## EF-003: Input Kosong

### Condition
Email atau password dikosongkan saat submit.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Pengguna klik submit dengan field kosong | Validasi client-side (zod) menolak |
| 2 | — | Sistem menampilkan inline error per field |

---

## EF-004: Sesi Sudah Aktif

### Condition
Pengguna sudah login dan mengakses `/login`.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Pengguna mengakses `/login` | `redirectIfAuthenticated()` di layout mendeteksi sesi |
| 2 | — | Redirect ke `/dashboard` (contractor) atau `/admin` (admin) |

---

# 7. POSTCONDITIONS

| ID | Condition |
| --- | --- |
| POST-001 | Cookie `kp-auth-session` di-set (HttpOnly, Secure, 30 hari) |
| POST-002 | Pengguna berada di `/dashboard` atau `/admin` sesuai role |
| POST-003 | `firstLogin` tersedia untuk logika onboarding (belum diimplementasikan) |

---

# 8. BUSINESS RULES

| Rule ID | Description |
| --- | --- |
| BR-001 | Email dinormalisasi lowercase sebelum query |
| BR-002 | bcryptjs.compare() memverifikasi password — tidak ada plaintext dibandingkan |
| BR-003 | Akun suspended tidak bisa login |
| BR-004 | Session cookie berlaku 30 hari |
| BR-005 | Redirect destination ditentukan oleh `role` — contractor → `/dashboard`, admin → `/admin` |

---

# 9. RELATED PAGES

| Page ID | Page Name |
| --- | --- |
| PAGE-M01-001 | Login |
| PAGE-M03-001 | Dashboard Utama |
| PAGE-M05-001 | Dashboard Admin |

---

# 10. DATA USAGE

## 10.1 Data Read
| Entity | Description |
| --- | --- |
| `users` | Find by email, verify password hash, check suspended status |

## 10.2 Data Created
Tidak ada (session disimpan di cookie, bukan DB).

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
| AC-001 | Form login menampilkan field email dan password |
| AC-002 | Field kosong menampilkan validasi error sebelum submit |
| AC-003 | Kredensial salah menampilkan pesan error yang tidak mengungkap apakah email atau password yang salah |
| AC-004 | Akun suspended menampilkan pesan error spesifik |
| AC-005 | Login berhasil: contractor → `/dashboard`, admin → `/admin` |
| AC-006 | Cookie `kp-auth-session` di-set setelah login berhasil |

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
| PAGE-M01-001 |

## System Logic Reference
| System Logic File |
| --- |
| `../system_logics/sys_uc_002.md` |

---

# 14. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document. |
