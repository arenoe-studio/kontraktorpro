# User Flow Specification

Document Version: v1.0

Use Case ID: UC-004
Use Case Name: Verifikasi OTP

Status: Active
Last Updated: 2026-06-23
Author: System Analyst AI

Implementation Status: **IMPLEMENTED** — real DB (PostgreSQL + bcryptjs compare)

---

# 1. OVERVIEW

## 1.1 Summary

Kontraktor memasukkan kode OTP 6 digit yang diterima via email. Sistem memverifikasi kode tersebut dan menyelesaikan flow yang sedang berjalan: membuat akun baru (setelah registrasi) atau membuat sesi login (setelah login OTP).

## 1.2 Goal

Kontraktor ingin memverifikasi kepemilikan email dan menyelesaikan proses autentikasi.

## 1.3 Requirement References

| Requirement ID | Requirement Name |
| --- | --- |
| F001 | Autentikasi & Manajemen Sesi |

## 1.4 Primary Actor

Kontraktor

## 1.5 Supporting Actors

Sistem Autentikasi, Resend Email Service (untuk resend)

---

# 2. TRIGGER

Kontraktor berada di halaman `/verify-otp` setelah redirect dari registrasi (UC-001) atau login OTP (UC-003).

---

# 3. PRECONDITIONS

| ID | Condition |
| --- | --- |
| PRE-001 | Cookie `kp-auth-otp` ada dan valid (belum expired) |
| PRE-002 | OTP challenge tersimpan di `otp_challenges` dengan `is_verified: false` |
| PRE-003 | `attempts_remaining > 0` dan `locked_until` tidak aktif |

---

# 4. MAIN FLOW

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor membuka email dan mendapatkan kode OTP | — |
| 2 | Kontraktor mengakses `/verify-otp` | Sistem membaca cookie `kp-auth-otp`, menampilkan form input 6 digit + masked email tujuan |
| 3 | Kontraktor memasukkan kode OTP | — |
| 4 | Kontraktor mengklik "Verifikasi" | Sistem memanggil Server Action `verifyCurrentOtpAction` |
| 5 | — | Server Action memanggil `verifyChallengeCode()` di `auth-service.ts` |
| 6 | — | Sistem mencari OTP challenge di DB berdasarkan ID dari cookie |
| 7 | — | Sistem memverifikasi kode dengan `bcryptjs.compare(inputCode, codeHash)` |
| 8a | _(jika flow = `register`)_ | Sistem membuat user baru (INSERT `users`), menghapus challenge (DELETE `otp_challenges`) |
| 8b | _(jika flow = `login`)_ | Sistem mengambil user berdasarkan email, menandai challenge `is_verified: true` |
| 9 | — | Sistem men-set cookie `kp-auth-session` (HttpOnly, Secure, 30 hari) |
| 10 | — | Sistem menghapus cookie `kp-auth-otp` |
| 11 | — | Sistem redirect ke `/dashboard` (contractor) atau `/admin` (admin) |

---

# 5. ALTERNATIVE FLOWS

## AF-001: Klik "Kirim Ulang Kode"

### Condition
Kontraktor belum menerima email atau kode sudah terlambat.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor klik "Kirim Ulang Kode" | Sistem memanggil `resendCurrentOtpAction` |
| 2 | — | Server Action memanggil `resendChallenge()` di `auth-service.ts` |
| 3 | — | Sistem memeriksa `resend_available_at` (cooldown) dan `resend_count` (maks 3x) |
| 4 | — | Sistem membuat OTP baru, update `otp_challenges`, kirim email via Resend |
| 5 | — | Toast sukses: "Kode baru telah dikirim ke email Anda." |

---

# 6. EXCEPTION FLOWS

## EF-001: Kode OTP Salah

### Condition
Input kode tidak cocok dengan `code_hash` di DB.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor submit kode yang salah | `bcryptjs.compare()` gagal |
| 2 | — | Sistem mengurangi `attempts_remaining` |
| 3 | — | Sistem menampilkan: "Kode tidak valid. Sisa percobaan: {n}" |
| 4 | Kontraktor mencoba lagi | Kembali ke Step 3 Main Flow |

---

## EF-002: Percobaan Habis (Lockout)

### Condition
`attempts_remaining` mencapai 0.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor submit kode yang salah terakhir | `attempts_remaining` menjadi 0 |
| 2 | — | Sistem men-set `locked_until` ke masa depan |
| 3 | — | Sistem menampilkan: "Terlalu banyak percobaan gagal. Silakan minta kode baru." |

---

## EF-003: OTP Expired (Kadaluarsa)

### Condition
`expires_at` sudah lewat.

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor submit kode | `verifyChallengeCode()` memeriksa `expires_at` |
| 2 | — | Sistem menampilkan: "Kode OTP sudah kadaluarsa. Silakan minta kode baru." |

---

## EF-004: Cooldown Resend Belum Habis

### Condition
`resend_available_at` masih di masa depan saat klik "Kirim Ulang".

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor klik "Kirim Ulang" terlalu cepat | `resendChallenge()` menolak |
| 2 | — | Sistem menampilkan: "Tunggu beberapa saat sebelum meminta kode baru." |

---

## EF-005: Batas Resend Tercapai

### Condition
`resend_count` sudah mencapai batas maksimal (3x).

### Flow

| Step | Actor Action | System Response |
| --- | --- | --- |
| 1 | Kontraktor klik "Kirim Ulang" ke-4 | `resendChallenge()` menolak |
| 2 | — | Sistem menampilkan: "Batas pengiriman ulang kode telah tercapai." |

---

# 7. POSTCONDITIONS

| ID | Condition |
| --- | --- |
| POST-001 | (flow=register) Akun user baru tersimpan di `users` |
| POST-002 | Cookie `kp-auth-session` di-set (HttpOnly, Secure, 30 hari) |
| POST-003 | Cookie `kp-auth-otp` dihapus |
| POST-004 | OTP challenge dihapus dari DB (untuk flow=register) atau diupdate `is_verified: true` |
| POST-005 | Pengguna berada di `/dashboard` atau `/admin` sesuai role |

---

# 8. BUSINESS RULES

| Rule ID | Description |
| --- | --- |
| BR-001 | OTP diverifikasi via `bcryptjs.compare()` — tidak ada plaintext comparison |
| BR-002 | Maksimal 5 percobaan sebelum lockout |
| BR-003 | OTP berlaku 15 menit |
| BR-004 | Resend maksimal 3x per challenge |
| BR-005 | Setelah registrasi berhasil: `INSERT users` + `DELETE otp_challenges` dalam satu transaksi DB |

---

# 9. RELATED PAGES

| Page ID | Page Name |
| --- | --- |
| PAGE-M01-003 | Verifikasi OTP |
| PAGE-M03-001 | Dashboard Utama (post-login contractor) |
| PAGE-M05-001 | Dashboard Admin (post-login admin) |

---

# 10. DATA USAGE

## 10.1 Data Read
| Entity | Description |
| --- | --- |
| `otp_challenges` | Ambil challenge berdasarkan ID dari cookie, verifikasi kode dan status |

## 10.2 Data Created
| Entity | Description |
| --- | --- |
| `users` | Dibuat setelah verifikasi berhasil untuk flow `register` |

## 10.3 Data Updated
| Entity | Description |
| --- | --- |
| `otp_challenges` | Update `is_verified: true` (flow=login), update `attempts_remaining`, `locked_until`, atau resend fields |

## 10.4 Data Deleted
| Entity | Description |
| --- | --- |
| `otp_challenges` | Dihapus setelah berhasil untuk flow `register` |

---

# 11. PERMISSIONS

| Role | Access |
| --- | --- |
| Guest dengan cookie `kp-auth-otp` aktif | ALLOWED |
| Pengguna sudah login | REDIRECT ke dashboard |

---

# 12. ACCEPTANCE CRITERIA

| AC ID | Description |
| --- | --- |
| AC-001 | Halaman menampilkan masked email tujuan OTP |
| AC-002 | Input 6 digit OTP tersedia |
| AC-003 | Kode valid → sesi dibuat, redirect ke dashboard |
| AC-004 | Kode salah → pesan error + sisa percobaan ditampilkan |
| AC-005 | Lockout setelah 5 kali salah |
| AC-006 | Tombol "Kirim Ulang" tersedia dengan cooldown timer |
| AC-007 | Resend berhasil → toast konfirmasi |

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
