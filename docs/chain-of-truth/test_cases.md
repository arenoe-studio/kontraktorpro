# Test Case Specification

Document Version: v1.0

Project: KontraktorPro

Product: Aplikasi Manajemen Proyek Konstruksi Berbasis Web (SaaS)

Status: Active

Last Updated: 2026-06-23

Author: System Analyst AI

---

# 1. INTRODUCTION

## 1.1 Purpose

Dokumen ini mendefinisikan test case untuk fitur F001 (Autentikasi & Manajemen Sesi) — satu-satunya fitur yang sudah IMPLEMENTED secara real. Test case diturunkan dari SRS v1.0 dan User Flow Specifications UC-001 s/d UC-005.

## 1.2 Test Case Format

| Field | Description |
| --- | --- |
| **TC ID** | Format: `TC-F001-NNN` |
| **Related UC** | Use Case ID dari user flow |
| **Test Scenario** | Deskripsi skenario |
| **Preconditions** | Kondisi wajib sebelum test |
| **Test Data** | Data yang digunakan |
| **Test Steps** | Langkah-langkah pengujian |
| **Expected Result** | Hasil yang diharapkan |
| **Type** | Positif / Negatif / Exception |

---

# 2. TEST CASE INDEX

| TC ID | Use Case | Scenario | Type |
| --- | --- | --- | --- |
| TC-F001-001 | UC-001 | Registrasi berhasil | Positif |
| TC-F001-002 | UC-001 | Email sudah terdaftar | Negatif |
| TC-F001-003 | UC-001 | Field wajib kosong | Negatif |
| TC-F001-004 | UC-001 | Password tidak cocok | Negatif |
| TC-F001-005 | UC-001 | Sesi aktif akses /register | Exception |
| TC-F001-006 | UC-002 | Login password berhasil (contractor) | Positif |
| TC-F001-007 | UC-002 | Login password berhasil (admin) | Positif |
| TC-F001-008 | UC-002 | Email atau password salah | Negatif |
| TC-F001-009 | UC-002 | Akun disuspend | Negatif |
| TC-F001-010 | UC-002 | Field kosong saat login | Negatif |
| TC-F001-011 | UC-002 | Sesi aktif akses /login | Exception |
| TC-F001-012 | UC-003 | Kirim OTP login berhasil | Positif |
| TC-F001-013 | UC-003 | Email tidak terdaftar (OTP login) | Negatif |
| TC-F001-014 | UC-004 | Verifikasi OTP registrasi berhasil | Positif |
| TC-F001-015 | UC-004 | Verifikasi OTP login berhasil | Positif |
| TC-F001-016 | UC-004 | Kode OTP salah | Negatif |
| TC-F001-017 | UC-004 | OTP sudah kadaluarsa | Exception |
| TC-F001-018 | UC-004 | Lockout setelah 5x salah | Exception |
| TC-F001-019 | UC-004 | Kirim ulang OTP berhasil | Positif |
| TC-F001-020 | UC-004 | Kirim ulang OTP terlalu cepat (cooldown) | Negatif |
| TC-F001-021 | UC-005 | Reset password berhasil (3 step) | Positif |
| TC-F001-022 | UC-005 | Email tidak terdaftar (reset) | Negatif |
| TC-F001-023 | UC-005 | Password baru tidak cocok | Negatif |
| TC-F001-024 | UC-005 | Akses Step 3 tanpa selesaikan Step 2 | Exception |

---

# 3. TEST CASES

## 3.1 UC-001: Registrasi Kontraktor

---

#### TC-F001-001: Registrasi Berhasil

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-001 |
| **Related UC** | UC-001 |
| **Test Scenario** | Kontraktor baru berhasil mendaftar dengan data valid |
| **Preconditions** | Email belum terdaftar di sistem; Resend aktif |
| **Test Data** | Nama: "Budi Santoso", Email: test_baru@gmail.com, Telp: 081234567890, Password: TestPass123!, Konfirmasi: TestPass123! |
| **Test Steps** | 1. Buka `/register`<br>2. Isi semua field dengan data valid<br>3. Klik "Daftar Sekarang" |
| **Expected Result** | 1. Tidak ada error validasi<br>2. Email OTP dikirim ke test_baru@gmail.com<br>3. Cookie `kp-auth-otp` di-set di browser<br>4. Redirect ke `/verify-otp`<br>5. Halaman `/verify-otp` menampilkan masked email |
| **Type** | Positif |

---

#### TC-F001-002: Email Sudah Terdaftar

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-002 |
| **Related UC** | UC-001 (AF-001) |
| **Test Scenario** | Kontraktor mendaftar dengan email yang sudah ada di sistem |
| **Preconditions** | Email sudah terdaftar di tabel `users` |
| **Test Data** | Email: email_yang_sudah_ada@gmail.com |
| **Test Steps** | 1. Buka `/register`<br>2. Isi field dengan email yang sudah terdaftar<br>3. Klik "Daftar Sekarang" |
| **Expected Result** | 1. Sistem menampilkan pesan error: "Email sudah terdaftar. Silakan login atau gunakan email lain."<br>2. Kontraktor tetap di halaman `/register`<br>3. Tidak ada email OTP terkirim |
| **Type** | Negatif |

---

#### TC-F001-003: Field Wajib Kosong

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-003 |
| **Related UC** | UC-001 |
| **Test Scenario** | Kontraktor submit form registrasi dengan field Nama dan Email kosong |
| **Preconditions** | — |
| **Test Data** | Nama: kosong, Email: kosong, Password: TestPass123! |
| **Test Steps** | 1. Buka `/register`<br>2. Kosongkan field Nama dan Email<br>3. Isi Password dan Konfirmasi<br>4. Klik "Daftar Sekarang" |
| **Expected Result** | 1. Error validasi inline muncul di field Nama: "Nama harus diisi"<br>2. Error validasi inline muncul di field Email: "Email harus diisi"<br>3. Form tidak ter-submit<br>4. Tidak ada request ke server |
| **Type** | Negatif |

---

#### TC-F001-004: Password Tidak Cocok

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-004 |
| **Related UC** | UC-001 |
| **Test Scenario** | Password dan konfirmasi password tidak sama |
| **Test Data** | Password: TestPass123!, Konfirmasi: TestPass456! |
| **Test Steps** | 1. Isi semua field<br>2. Buat password dan konfirmasi berbeda<br>3. Klik "Daftar Sekarang" |
| **Expected Result** | 1. Error: "Konfirmasi password tidak cocok"<br>2. Form tidak ter-submit |
| **Type** | Negatif |

---

#### TC-F001-005: Sesi Aktif Akses /register

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-005 |
| **Related UC** | UC-001 (EF-002) |
| **Test Scenario** | Pengguna yang sudah login mencoba mengakses halaman register |
| **Preconditions** | Pengguna sudah login sebagai contractor |
| **Test Steps** | 1. Login terlebih dahulu<br>2. Akses URL `/register` langsung |
| **Expected Result** | 1. Sistem mendeteksi sesi aktif<br>2. Redirect otomatis ke `/dashboard` |
| **Type** | Exception |

---

## 3.2 UC-002: Login dengan Password

---

#### TC-F001-006: Login Password Berhasil (Contractor)

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-006 |
| **Related UC** | UC-002 |
| **Test Scenario** | Kontraktor berhasil login dengan email dan password yang valid |
| **Preconditions** | Akun contractor terdaftar dan terverifikasi, tidak disuspend |
| **Test Data** | Email: kontraktor@test.com, Password: TestPass123! |
| **Test Steps** | 1. Buka `/login`<br>2. Masukkan email dan password valid<br>3. Klik "Masuk dengan Password" |
| **Expected Result** | 1. Sistem memverifikasi kredensial<br>2. Cookie `kp-auth-session` di-set (HttpOnly, Secure, 30 hari)<br>3. Redirect ke `/dashboard`<br>4. Dashboard menampilkan data kontraktor yang login |
| **Type** | Positif |

---

#### TC-F001-007: Login Password Berhasil (Admin)

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-007 |
| **Related UC** | UC-002 |
| **Test Scenario** | Admin berhasil login dan diarahkan ke panel admin |
| **Preconditions** | Akun moderator atau super_admin terdaftar |
| **Test Data** | Email: admin@test.com, Password: AdminPass123! |
| **Test Steps** | 1. Buka `/login`<br>2. Masukkan kredensial admin<br>3. Klik "Masuk dengan Password" |
| **Expected Result** | 1. Login berhasil<br>2. Cookie `kp-auth-session` di-set<br>3. Redirect ke `/admin` (bukan `/dashboard`) |
| **Type** | Positif |

---

#### TC-F001-008: Email atau Password Salah

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-008 |
| **Related UC** | UC-002 (EF-001) |
| **Test Scenario** | Pengguna memasukkan password yang salah |
| **Test Data** | Email: kontraktor@test.com, Password: passwordsalah |
| **Test Steps** | 1. Buka `/login`<br>2. Masukkan email valid dan password salah<br>3. Klik "Masuk" |
| **Expected Result** | 1. Sistem menampilkan: "Email atau password tidak sesuai."<br>2. Pengguna tetap di `/login`<br>3. Tidak ada cookie session yang dibuat |
| **Type** | Negatif |

---

#### TC-F001-009: Akun Disuspend

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-009 |
| **Related UC** | UC-002 (EF-002) |
| **Test Scenario** | Pengguna dengan akun suspended mencoba login |
| **Preconditions** | Akun dengan `suspended: true` ada di DB |
| **Test Steps** | 1. Buka `/login`<br>2. Masukkan kredensial akun yang disuspend<br>3. Klik "Masuk" |
| **Expected Result** | 1. Sistem menampilkan: "Akun Anda telah disuspend. Hubungi administrator."<br>2. Tidak ada cookie session yang dibuat |
| **Type** | Negatif |

---

#### TC-F001-010: Field Kosong Saat Login

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-010 |
| **Related UC** | UC-002 |
| **Test Scenario** | Pengguna submit form login dengan email kosong |
| **Test Steps** | 1. Buka `/login`<br>2. Kosongkan field email<br>3. Isi password<br>4. Klik "Masuk" |
| **Expected Result** | 1. Error validasi: "Email harus diisi"<br>2. Form tidak ter-submit |
| **Type** | Negatif |

---

#### TC-F001-011: Sesi Aktif Akses /login

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-011 |
| **Related UC** | UC-002 (EF-004) |
| **Test Scenario** | Pengguna yang sudah login mengakses /login |
| **Preconditions** | Pengguna sudah login |
| **Test Steps** | 1. Login terlebih dahulu<br>2. Akses `/login` langsung via URL |
| **Expected Result** | 1. Redirect ke `/dashboard` (contractor) atau `/admin` (admin)<br>2. Halaman login tidak ditampilkan |
| **Type** | Exception |

---

## 3.3 UC-003: Login dengan OTP Email

---

#### TC-F001-012: Kirim OTP Login Berhasil

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-012 |
| **Related UC** | UC-003 |
| **Test Scenario** | Pengguna berhasil meminta OTP login via email |
| **Preconditions** | Akun terdaftar; Resend aktif |
| **Test Data** | Email: kontraktor@test.com |
| **Test Steps** | 1. Buka `/login`<br>2. Pilih mode OTP<br>3. Masukkan email valid<br>4. Klik "Kirim Kode OTP" |
| **Expected Result** | 1. Email OTP terkirim ke kontraktor@test.com<br>2. Cookie `kp-auth-otp` di-set<br>3. Redirect ke `/verify-otp`<br>4. Halaman verify menampilkan masked email |
| **Type** | Positif |

---

#### TC-F001-013: Email Tidak Terdaftar (OTP Login)

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-013 |
| **Related UC** | UC-003 (EF-001) |
| **Test Scenario** | Pengguna memasukkan email yang tidak terdaftar untuk login OTP |
| **Test Data** | Email: tidakada@test.com |
| **Test Steps** | 1. Buka `/login`<br>2. Pilih mode OTP<br>3. Masukkan email tidak terdaftar<br>4. Klik "Kirim Kode OTP" |
| **Expected Result** | 1. Sistem menampilkan: "Email tidak terdaftar di sistem."<br>2. Tidak ada email OTP terkirim<br>3. Tidak ada cookie yang dibuat |
| **Type** | Negatif |

---

## 3.4 UC-004: Verifikasi OTP

---

#### TC-F001-014: Verifikasi OTP Registrasi Berhasil

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-014 |
| **Related UC** | UC-004 (flow=register) |
| **Test Scenario** | Kontraktor berhasil memverifikasi OTP setelah registrasi |
| **Preconditions** | TC-F001-001 sudah dijalankan; OTP belum expired |
| **Test Steps** | 1. Ambil kode OTP dari email<br>2. Buka `/verify-otp`<br>3. Masukkan kode 6 digit<br>4. Klik "Verifikasi" |
| **Expected Result** | 1. Sistem memverifikasi kode<br>2. Akun baru dibuat di tabel `users`<br>3. OTP challenge dihapus dari DB<br>4. Cookie `kp-auth-session` di-set (30 hari)<br>5. Cookie `kp-auth-otp` dihapus<br>6. Redirect ke `/dashboard` |
| **Type** | Positif |

---

#### TC-F001-015: Verifikasi OTP Login Berhasil

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-015 |
| **Related UC** | UC-004 (flow=login) |
| **Test Scenario** | Pengguna berhasil memverifikasi OTP setelah login OTP |
| **Preconditions** | TC-F001-012 sudah dijalankan |
| **Test Steps** | 1. Ambil kode OTP dari email<br>2. Masukkan di `/verify-otp`<br>3. Klik "Verifikasi" |
| **Expected Result** | 1. Sesi login dibuat<br>2. Cookie `kp-auth-session` di-set<br>3. Redirect ke `/dashboard` atau `/admin` sesuai role |
| **Type** | Positif |

---

#### TC-F001-016: Kode OTP Salah

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-016 |
| **Related UC** | UC-004 (EF-001) |
| **Test Scenario** | Pengguna memasukkan kode OTP yang salah |
| **Preconditions** | Ada OTP challenge aktif di browser |
| **Test Data** | Kode: 000000 (kemungkinan besar salah) |
| **Test Steps** | 1. Buka `/verify-otp`<br>2. Masukkan kode yang salah<br>3. Klik "Verifikasi" |
| **Expected Result** | 1. Sistem menampilkan: "Kode tidak valid. Sisa {n} percobaan."<br>2. `attempts_remaining` berkurang 1 di DB<br>3. Kontraktor tetap di `/verify-otp` |
| **Type** | Negatif |

---

#### TC-F001-017: OTP Sudah Kadaluarsa

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-017 |
| **Related UC** | UC-004 (EF) |
| **Test Scenario** | Pengguna mencoba memverifikasi OTP yang sudah lewat 15 menit |
| **Preconditions** | OTP challenge sudah expired (`expires_at` di masa lalu) — bisa dimanipulasi di DB untuk testing |
| **Test Steps** | 1. Tunggu 15 menit setelah OTP dikirim (atau update DB)<br>2. Masukkan kode OTP<br>3. Klik "Verifikasi" |
| **Expected Result** | 1. Sistem menampilkan: "Kode OTP sudah kadaluarsa. Silakan minta kode baru."<br>2. Tidak ada sesi yang dibuat |
| **Type** | Exception |

---

#### TC-F001-018: Lockout Setelah 5x Salah

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-018 |
| **Related UC** | UC-004 (EF-002) |
| **Test Scenario** | Pengguna salah memasukkan kode 5 kali berturut-turut |
| **Test Steps** | 1. Submit kode salah (000000) sebanyak 5 kali berturut-turut |
| **Expected Result** | 1. Percobaan ke-5: "Terlalu banyak percobaan gagal. Silakan minta kode baru."<br>2. `locked_until` di-set di DB<br>3. Tombol verifikasi di-disable |
| **Type** | Exception |

---

#### TC-F001-019: Kirim Ulang OTP Berhasil

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-019 |
| **Related UC** | UC-004 (AF-001) |
| **Test Scenario** | Pengguna berhasil meminta kirim ulang kode OTP |
| **Preconditions** | Ada OTP challenge aktif; cooldown sudah habis |
| **Test Steps** | 1. Buka `/verify-otp`<br>2. Tunggu cooldown habis<br>3. Klik "Kirim Ulang Kode" |
| **Expected Result** | 1. Toast: "Kode baru telah dikirim ke email Anda."<br>2. Email OTP baru diterima<br>3. `resend_count` bertambah 1 di DB<br>4. Kode lama tidak valid lagi |
| **Type** | Positif |

---

#### TC-F001-020: Kirim Ulang OTP Terlalu Cepat (Cooldown)

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-020 |
| **Related UC** | UC-004 (EF-004) |
| **Test Scenario** | Pengguna klik "Kirim Ulang" sebelum cooldown habis |
| **Test Steps** | 1. Buka `/verify-otp`<br>2. Langsung klik "Kirim Ulang Kode" (tanpa menunggu) |
| **Expected Result** | 1. Sistem menampilkan: "Tunggu beberapa saat sebelum meminta kode baru."<br>2. Tidak ada email baru terkirim |
| **Type** | Negatif |

---

## 3.5 UC-005: Reset Password

---

#### TC-F001-021: Reset Password Berhasil (3 Step)

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-021 |
| **Related UC** | UC-005 |
| **Test Scenario** | Kontraktor berhasil mereset password melalui 3 step |
| **Preconditions** | Akun terdaftar; Resend aktif |
| **Test Data** | Email: kontraktor@test.com, Password baru: NewPass456! |
| **Test Steps** | **Step 1:** Buka `/forgot-password`, masukkan email, klik "Kirim Kode Reset"<br>**Step 2:** Ambil OTP dari email, masukkan, klik "Verifikasi Kode"<br>**Step 3:** Masukkan password baru + konfirmasi, klik "Simpan Password Baru" |
| **Expected Result** | **Step 1:** Email OTP dikirim; cookie `kp-auth-reset` di-set; Step 2 tampil<br>**Step 2:** OTP valid; `is_verified: true` di DB; Step 3 tampil<br>**Step 3:** Password baru tersimpan (hash); challenge dihapus; cookie `kp-auth-reset` dihapus; redirect ke `/login?email=kontraktor@test.com`<br>**Verifikasi akhir:** Login menggunakan password baru berhasil |
| **Type** | Positif |

---

#### TC-F001-022: Email Tidak Terdaftar (Reset)

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-022 |
| **Related UC** | UC-005 (EF-001) |
| **Test Scenario** | Pengguna memasukkan email yang tidak terdaftar di form reset |
| **Test Data** | Email: tidakada@test.com |
| **Test Steps** | 1. Buka `/forgot-password`<br>2. Masukkan email tidak terdaftar<br>3. Klik "Kirim Kode Reset" |
| **Expected Result** | 1. Sistem menampilkan: "Email tidak terdaftar di sistem."<br>2. Tidak ada OTP terkirim<br>3. Step 2 tidak tampil |
| **Type** | Negatif |

---

#### TC-F001-023: Password Baru Tidak Cocok

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-023 |
| **Related UC** | UC-005 (EF-003) |
| **Test Scenario** | Password baru dan konfirmasi tidak cocok di Step 3 |
| **Preconditions** | Step 1 dan Step 2 sudah selesai |
| **Test Data** | Password baru: NewPass456!, Konfirmasi: NewPass789! |
| **Test Steps** | 1. Selesaikan Step 1 dan 2<br>2. Di Step 3, isi password dan konfirmasi berbeda<br>3. Klik "Simpan Password Baru" |
| **Expected Result** | 1. Error: "Konfirmasi password tidak cocok."<br>2. Password tidak diubah di DB |
| **Type** | Negatif |

---

#### TC-F001-024: Akses Step 3 Tanpa Selesaikan Step 2

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-024 |
| **Related UC** | UC-005 (EF-004) |
| **Test Scenario** | Sistem menolak reset password jika OTP belum diverifikasi |
| **Preconditions** | Ada cookie `kp-auth-reset` tapi `is_verified: false` di DB |
| **Test Steps** | 1. Manipulasi state untuk skip ke Step 3 (atau call `resetPasswordAction` langsung)<br>2. Isi password baru<br>3. Submit |
| **Expected Result** | 1. Server Action menolak: "Verifikasi OTP harus diselesaikan terlebih dahulu."<br>2. Password tidak diubah |
| **Type** | Exception |

---

# 4. TRACEABILITY MATRIX

| TC ID | Feature | UC | SRS Requirement | System Logic |
| --- | --- | --- | --- | --- |
| TC-F001-001 to 005 | F001 | UC-001 | F001, NFR-6.2 | sys_uc_001 |
| TC-F001-006 to 011 | F001 | UC-002 | F001, NFR-6.2 | sys_uc_002 |
| TC-F001-012 to 013 | F001 | UC-003 | F001 | sys_uc_002 |
| TC-F001-014 to 020 | F001 | UC-004 | F001 | sys_uc_003 |
| TC-F001-021 to 024 | F001 | UC-005 | F001 | sys_uc_004 |

---

# 5. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-23 | System Analyst AI | Initial document — 24 test cases untuk F001 (auth). |
