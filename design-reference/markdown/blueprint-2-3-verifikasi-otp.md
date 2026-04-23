# Blueprint 2.3 — Verifikasi OTP
**Proyek:** KontraktorPro  
**Grup:** 2 — Autentikasi  
**Akses:** Tanpa login — redirect otomatis dari Register atau Login dengan OTP  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Verifikasi kepemilikan nomor HP via kode OTP 6 digit. Halaman ini digunakan untuk dua skenario: setelah register baru, dan saat login dengan OTP.

---

## Struktur Halaman

### Layout Utama
Single column, konten terpusat secara vertikal dan horizontal, max-width 400px.  
Background: `neutral-50`.

---

### Konten Utama
**Komponen:** 6 input box OTP, Button `primary`, Link teks

**Isi dari atas ke bawah:**
- Logo KontraktorPro (kecil, di atas)
- Ikon ilustrasi: HP dengan sinyal/pesan — 48px
- Heading `h2`: *"Masukkan Kode Verifikasi"*
- Teks body: *"Kode 6 digit telah dikirim ke"* + nomor HP yang disamarkan (contoh: *"0812\*\*\*\*789"*)
- Link kecil di bawah nomor: "Bukan nomor saya" → kembali ke halaman sebelumnya

**Input OTP:**
- 6 kotak input terpisah, masing-masing 1 digit
- Lebar setiap kotak: 44px, tinggi 52px, `radius-md`, border `neutral-300`
- Focus: border `primary-800`
- Terisi: border `primary-800`, background `primary-50`, font `font-mono` besar
- Perilaku: setelah 1 digit diisi, fokus otomatis pindah ke kotak berikutnya
- Perilaku paste: jika pengguna paste 6 digit sekaligus, langsung mengisi semua kotak

- Button `primary` full-width: "Verifikasi" — disabled sampai 6 kotak terisi
- Jika kode salah: border semua kotak berubah merah + teks error di bawah: *"Kode salah. Sisa [N] percobaan."*

**Kirim ulang:**
- Teks: *"Tidak menerima kode?"*
- Countdown: *"Kirim ulang dalam 0:45"* — setelah countdown habis berubah jadi link aktif "Kirim ulang kode"
- Maksimal 3 kali kirim ulang — setelah itu tampil: *"Terlalu banyak percobaan. Coba lagi dalam 10 menit."*

---

## State Khusus

**OTP kedaluwarsa (lebih dari 5 menit):** Semua kotak dikosongkan, muncul pesan *"Kode sudah kedaluwarsa."* + link "Kirim kode baru".

**Percobaan habis (3x salah):** Semua input di-disable, tampil pesan *"Terlalu banyak percobaan."* dengan countdown 10 menit sebelum bisa coba lagi.

---

## Alur Setelah Verifikasi Berhasil
- Dari Register → masuk ke Dashboard dengan onboarding card aktif
- Dari Login OTP → masuk ke Dashboard langsung

---

## Catatan
- Halaman ini tidak bisa diakses langsung via URL tanpa sesi aktif dari Register/Login
- Tidak ada navbar atau navigasi lain di halaman ini — hanya logo sebagai link ke Landing Page
