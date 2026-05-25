# Blueprint 2.2 — Login
**Proyek:** KontraktorPro  
**Grup:** 2 — Autentikasi  
**Akses:** Tanpa login  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Akses masuk ke akun yang sudah ada. Dua jalur: password atau OTP langsung via HP.

---

## Struktur Halaman

### Layout Utama
Sama dengan Register (2.1) — 2 kolom desktop, 1 kolom mobile.

---

### Kolom Kiri — Branding (Desktop Only)
Sama persis dengan Register (2.1). Background `primary-800`, logo, benefit list.

---

### Kolom Kanan — Form Login
**Komponen:** Input text, Button `primary`, Button `outline-primary`

**Header form:**
- Heading `h2`: *"Masuk ke KontraktorPro"*
- Teks: *"Belum punya akun?"* + Link "Daftar gratis" → halaman Register (2.1)

**Field form:**
1. **Nomor HP** — input number, placeholder: *"08123456789"*, wajib
2. **Password** — input password dengan toggle show/hide, wajib
- Link kecil di kanan label password: "Lupa password?" → halaman Lupa Password (2.4)

**Tombol:**
- Button `primary` full-width: "Masuk"
- Separator teks: *"atau"*
- Button `outline-primary` full-width: "Masuk dengan OTP" — kirim kode 6 digit ke HP tanpa perlu password

**Validasi:**
- Jika nomor HP tidak terdaftar: error *"Nomor HP tidak ditemukan. Daftar dulu?"* dengan link ke Register
- Jika password salah: error *"Password salah."* dengan link "Lupa password?"
- Jika akun di-suspend: error *"Akun Anda dinonaktifkan. Hubungi tim KontraktorPro."*

---

## Alur Login dengan OTP
1. Klik "Masuk dengan OTP"
2. Field password disembunyikan — hanya perlu Nomor HP
3. Submit → sistem kirim OTP ke HP
4. Redirect ke halaman Verifikasi OTP (2.3)
5. Setelah OTP valid → masuk ke Dashboard

---

## Alur Setelah Login Berhasil
- Jika pengguna pertama kali login setelah register → Dashboard dengan onboarding card aktif
- Jika pengguna lama → Dashboard langsung, tidak ada onboarding

---

## Catatan
- Halaman ini tidak memerlukan navbar penuh — cukup logo di pojok kiri atas
- Tidak ada opsi "Ingat saya" yang eksplisit — session aktif selama 30 hari secara default
- Login admin menggunakan URL terpisah yang tidak terhubung dari halaman ini
