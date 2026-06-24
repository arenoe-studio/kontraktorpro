# Test Execution Sheet

Document Version: v1.0

Project: KontraktorPro

Product: Aplikasi Manajemen Proyek Konstruksi Berbasis Web (SaaS)

Status: Template (Belum Dieksekusi)

Last Updated: 2026-06-23

Author: System Analyst AI

---

# 1. INSTRUCTIONS

1. Buka file ini dalam mode editable sebelum mulai testing.
2. Eksekusi test case secara berurutan sesuai tabel di bawah.
3. Kolom **Actual Result:** catat hasil aktual yang terjadi saat pengujian.
4. Kolom **Status:** isi `PASS` jika actual = expected, `FAIL` jika tidak sesuai, `N/A` jika tidak dapat diuji.
5. Kolom **Notes:** tulis keterangan tambahan (ID defect, link screenshot, kondisi khusus).
6. Isi **Execution Summary** di bagian akhir setelah semua TC dijalankan.

---

# 2. FEATURE F001: AUTENTIKASI & MANAJEMEN SESI

## 2.1 UC-001: Registrasi Kontraktor

| TC ID | Test Scenario | Test Steps (ringkas) | Expected Result (ringkas) | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| TC-F001-001 | Registrasi berhasil | 1. Buka `/register`<br>2. Isi data valid (nama, email baru, telp, password)<br>3. Klik "Daftar Sekarang" | 1. Email OTP terkirim<br>2. Cookie `kp-auth-otp` di-set<br>3. Redirect ke `/verify-otp` | | | |
| TC-F001-002 | Email sudah terdaftar | 1. Buka `/register`<br>2. Gunakan email yang sudah ada di DB<br>3. Submit | 1. Error: "Email sudah terdaftar"<br>2. Tidak ada email terkirim<br>3. Tetap di `/register` | | | |
| TC-F001-003 | Field wajib kosong | 1. Buka `/register`<br>2. Kosongkan Nama dan Email<br>3. Submit | 1. Error inline per field kosong<br>2. Form tidak ter-submit | | | |
| TC-F001-004 | Password tidak cocok | 1. Isi form dengan password dan konfirmasi berbeda<br>2. Submit | 1. Error: "Konfirmasi password tidak cocok"<br>2. Form tidak ter-submit | | | |
| TC-F001-005 | Sesi aktif akses /register | 1. Login terlebih dahulu<br>2. Akses `/register` via URL | 1. Redirect otomatis ke `/dashboard` | | | |

---

## 2.2 UC-002: Login dengan Password

| TC ID | Test Scenario | Test Steps (ringkas) | Expected Result (ringkas) | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| TC-F001-006 | Login berhasil (contractor) | 1. Buka `/login`<br>2. Masukkan email+password contractor valid<br>3. Klik "Masuk" | 1. Cookie `kp-auth-session` di-set<br>2. Redirect ke `/dashboard` | | | |
| TC-F001-007 | Login berhasil (admin) | 1. Buka `/login`<br>2. Masukkan email+password admin valid<br>3. Klik "Masuk" | 1. Cookie `kp-auth-session` di-set<br>2. Redirect ke `/admin` | | | |
| TC-F001-008 | Email atau password salah | 1. Buka `/login`<br>2. Masukkan password salah<br>3. Klik "Masuk" | 1. Error: "Email atau password tidak sesuai"<br>2. Tidak ada cookie session | | | |
| TC-F001-009 | Akun disuspend | 1. Login dengan akun yang `suspended: true` | 1. Error: "Akun Anda telah disuspend"<br>2. Tidak ada cookie session | | | |
| TC-F001-010 | Field kosong saat login | 1. Kosongkan email<br>2. Submit | 1. Error inline: "Email harus diisi" | | | |
| TC-F001-011 | Sesi aktif akses /login | 1. Login terlebih dahulu<br>2. Akses `/login` via URL | 1. Redirect ke `/dashboard` atau `/admin` | | | |

---

## 2.3 UC-003: Login dengan OTP Email

| TC ID | Test Scenario | Test Steps (ringkas) | Expected Result (ringkas) | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| TC-F001-012 | Kirim OTP login berhasil | 1. Buka `/login`<br>2. Pilih mode OTP<br>3. Masukkan email terdaftar<br>4. Klik "Kirim Kode OTP" | 1. Email OTP terkirim<br>2. Cookie `kp-auth-otp` di-set<br>3. Redirect ke `/verify-otp` | | | |
| TC-F001-013 | Email tidak terdaftar (OTP) | 1. Pilih mode OTP<br>2. Masukkan email tidak terdaftar<br>3. Submit | 1. Error: "Email tidak terdaftar di sistem"<br>2. Tidak ada email terkirim | | | |

---

## 2.4 UC-004: Verifikasi OTP

| TC ID | Test Scenario | Test Steps (ringkas) | Expected Result (ringkas) | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| TC-F001-014 | Verifikasi OTP registrasi berhasil | 1. Setelah TC-F001-001<br>2. Ambil OTP dari email<br>3. Masukkan di `/verify-otp`<br>4. Klik "Verifikasi" | 1. Akun dibuat di `users`<br>2. Cookie session di-set<br>3. Redirect ke `/dashboard`<br>4. Cookie OTP dihapus | | | |
| TC-F001-015 | Verifikasi OTP login berhasil | 1. Setelah TC-F001-012<br>2. Masukkan OTP dari email | 1. Session di-set<br>2. Redirect ke `/dashboard`/`/admin` sesuai role | | | |
| TC-F001-016 | Kode OTP salah | 1. Di `/verify-otp`<br>2. Masukkan kode: 000000<br>3. Klik "Verifikasi" | 1. Error: "Kode tidak valid. Sisa {n} percobaan."<br>2. `attempts_remaining` berkurang | | | |
| TC-F001-017 | OTP sudah kadaluarsa | 1. Tunggu 15 menit atau update `expires_at` di DB<br>2. Submit kode OTP | 1. Error: "Kode OTP sudah kadaluarsa" | | | |
| TC-F001-018 | Lockout setelah 5x salah | 1. Submit kode salah (000000) sebanyak 5 kali | 1. Percobaan ke-5: "Terlalu banyak percobaan gagal"<br>2. `locked_until` di-set di DB | | | |
| TC-F001-019 | Kirim ulang OTP berhasil | 1. Di `/verify-otp`<br>2. Tunggu cooldown habis<br>3. Klik "Kirim Ulang Kode" | 1. Toast: "Kode baru telah dikirim"<br>2. Email baru diterima<br>3. Kode lama tidak valid | | | |
| TC-F001-020 | Cooldown kirim ulang | 1. Di `/verify-otp`<br>2. Langsung klik "Kirim Ulang" tanpa menunggu | 1. Error: "Tunggu beberapa saat sebelum meminta kode baru"<br>2. Tidak ada email terkirim | | | |

---

## 2.5 UC-005: Reset Password

| TC ID | Test Scenario | Test Steps (ringkas) | Expected Result (ringkas) | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| TC-F001-021 | Reset password berhasil | **Step 1:** Buka `/forgot-password`, isi email, submit<br>**Step 2:** Masukkan OTP dari email, submit<br>**Step 3:** Isi password baru + konfirmasi, submit | **Step 1:** OTP dikirim; `kp-auth-reset` di-set<br>**Step 2:** OTP valid; Step 3 tampil<br>**Step 3:** Password diperbarui; cookie dihapus; redirect `/login?email=...`<br>**Post:** Login dengan password baru berhasil | | | |
| TC-F001-022 | Email tidak terdaftar (reset) | 1. Buka `/forgot-password`<br>2. Masukkan email tidak terdaftar<br>3. Submit Step 1 | 1. Error: "Email tidak terdaftar di sistem"<br>2. Tidak ada OTP terkirim | | | |
| TC-F001-023 | Password baru tidak cocok | 1. Selesaikan Step 1 & 2<br>2. Di Step 3, isi password berbeda dengan konfirmasi<br>3. Submit | 1. Error: "Konfirmasi password tidak cocok"<br>2. Password tidak diubah di DB | | | |
| TC-F001-024 | Akses Step 3 tanpa Step 2 | 1. Manipulasi state (skip Step 2)<br>2. Coba submit Step 3 | 1. Server menolak dengan error<br>2. Password tidak diubah | | | |

---

# 3. EXECUTION SUMMARY

| Feature / UC | Total TC | PASS | FAIL | N/A | Pass Rate |
| --- | --- | --- | --- | --- | --- |
| UC-001: Registrasi | 5 | | | | |
| UC-002: Login Password | 6 | | | | |
| UC-003: Login OTP | 2 | | | | |
| UC-004: Verifikasi OTP | 7 | | | | |
| UC-005: Reset Password | 4 | | | | |
| **TOTAL F001** | **24** | | | | |

---

# 4. DEFECT LOG

| Defect ID | TC ID | Severity | Description | Status | Assigned To | Fixed Date |
| --- | --- | --- | --- | --- | --- | --- |
| — | — | — | — | — | — | — |

---

# 5. SIGN-OFF

**Tester Name:** ____________________

**Execution Date Start:** ____________________

**Execution Date End:** ____________________

**Environment:** Local / Staging / Production

**Browser:** Chrome ☐  Edge ☐  Firefox ☐  Safari ☐

**Result:** PASS ☐  FAIL ☐  CONDITIONAL ☐

**Signature:** ____________________

---

**UAT Approval:**

**End User Name:** ____________________

**UAT Date:** ____________________

**Signature:** ____________________

---

# 6. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial template. |
