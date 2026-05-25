# Blueprint 2.4 — Lupa Password
**Proyek:** KontraktorPro  
**Grup:** 2 — Autentikasi  
**Akses:** Tanpa login — diakses dari link di halaman Login (2.2)  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Flow reset password via OTP. Terdiri dari 3 langkah berurutan dalam satu halaman — konten berubah per langkah tanpa pindah URL.

---

## Struktur Halaman

### Layout Utama
Single column, konten terpusat, max-width 400px.  
Background: `neutral-50`.

---

### Indikator Langkah
**Komponen:** Step indicator 3 langkah di atas konten

Tampilan: 3 lingkaran bernomor dihubungkan garis horizontal  
- Langkah aktif: lingkaran `primary-800` terisi, teks putih  
- Langkah selesai: lingkaran `success-500` dengan ikon centang  
- Langkah belum: lingkaran `neutral-300`, teks abu

**Label langkah:** Masukkan Nomor HP / Verifikasi OTP / Buat Password Baru

---

### Langkah 1 — Masukkan Nomor HP
**Komponen:** Input text, Button `primary`

**Isi:**
- Heading `h2`: *"Lupa Password?"*
- Teks body: *"Masukkan nomor HP yang terdaftar. Kami akan kirim kode verifikasi."*
- Input: Nomor HP, placeholder *"08123456789"*, wajib
- Button `primary` full-width: "Kirim Kode OTP"

**Validasi:**
- Jika nomor tidak terdaftar: error *"Nomor HP ini tidak terdaftar."* + link "Daftar sekarang"

---

### Langkah 2 — Verifikasi OTP
**Komponen:** 6 input box OTP (sama persis dengan halaman 2.3)

**Isi:**
- Heading `h2`: *"Masukkan Kode Verifikasi"*
- Teks: nomor HP yang disamarkan
- 6 kotak OTP dengan perilaku identik dengan blueprint 2.3
- Button `primary` full-width: "Verifikasi Kode" — disabled sampai 6 kotak terisi
- Countdown kirim ulang identik dengan blueprint 2.3

---

### Langkah 3 — Buat Password Baru
**Komponen:** Input password, Button `primary`

**Isi:**
- Heading `h2`: *"Buat Password Baru"*
- Teks body: *"Password baru harus berbeda dari password sebelumnya."*
- Input: Password Baru — dengan toggle show/hide, minimal 8 karakter
- Input: Konfirmasi Password Baru — dengan toggle show/hide
- Button `primary` full-width: "Simpan Password Baru"

**Validasi:**
- Password minimal 8 karakter — helper text muncul di bawah field saat mengetik
- Konfirmasi harus cocok — error inline jika tidak sama

---

## Alur Setelah Password Berhasil Diubah
- Tampil pesan sukses singkat: ikon centang hijau + *"Password berhasil diubah."*
- Redirect otomatis ke halaman Login (2.2) setelah 2 detik
- Di halaman Login, field Nomor HP sudah terisi otomatis (pre-filled)

---

## Catatan
- Tidak ada navbar atau navigasi lain — hanya logo sebagai link ke Landing Page
- Link "Kembali ke Login" tersedia di bawah form di semua langkah
- Token reset password kedaluwarsa setelah 10 menit dari kirim OTP
