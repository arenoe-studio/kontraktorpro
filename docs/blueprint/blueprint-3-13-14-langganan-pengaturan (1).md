# Blueprint 3.13 — Langganan & Billing
**Proyek:** KontraktorPro  
**Grup:** 3 — Dashboard Kontraktor  
**Akses:** Login sebagai Kontraktor  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Kontraktor dapat melihat status paket aktif, memantau penggunaan, melihat riwayat pembayaran, dan melakukan upgrade atau downgrade.

---

## Layout
Sidebar + Topbar. Konten single column, max-width 720px.

---

## Konten Halaman

### Blok 1 — Status Paket Aktif
**Komponen:** Card dengan border aksen sesuai paket, Badge paket, Button

- Badge paket besar: `badge-neutral` Gratis / `badge-primary` Pro / `badge-accent` Bisnis
- Nama paket + tanggal mulai + tanggal perpanjangan berikutnya (jika berbayar)
- Button `primary` "Upgrade Paket" (jika Gratis) atau Button `outline-primary` "Kelola Langganan" (jika berbayar) → mengarah ke halaman Pricing (1.2)

---

### Blok 2 — Penggunaan Saat Ini
**Komponen:** Progress bar per slot, Label angka

- Proyek aktif: *"3 dari 5 slot terpakai"* + progress bar
- Akun mandor: *"2 dari 5 slot terpakai"* + progress bar
- Progress bar berubah warna `danger` jika sudah di 90%+

---

### Blok 3 — Riwayat Pembayaran
**Komponen:** Tabel

**Kolom:** Tanggal / Paket / Periode / Jumlah / Status (Badge) / Aksi

**Kolom Aksi:** Link "Unduh Invoice" per baris

**Empty state (paket Gratis, belum pernah bayar):**  
Teks: *"Belum ada riwayat pembayaran."*

---

### Blok 4 — Zona Downgrade / Cancel
**Komponen:** Card dengan border `neutral-300`, Button teks kecil

- Hanya tampil jika paket aktif adalah Pro atau Bisnis
- Button teks kecil `danger`: "Downgrade ke Gratis" — memicu modal konfirmasi dengan penjelasan fitur yang hilang
- Button teks kecil abu: "Batalkan Langganan" — memicu modal konfirmasi dengan penjelasan konsekuensi + countdown *"Langganan aktif sampai [tanggal]"*

---

## Catatan
- Proses pembayaran menggunakan halaman Checkout di Pricing (1.2)
- Downgrade tidak langsung efektif — aktif di akhir periode billing

---

---

# Blueprint 3.14 — Pengaturan Akun
**Proyek:** KontraktorPro  
**Grup:** 3 — Dashboard Kontraktor  
**Akses:** Login sebagai Kontraktor  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Pengaturan akun teknis — ganti password, notifikasi, dan preferensi platform. Terpisah dari Portofolio & Profil (3.12) yang berfokus pada identitas publik.

---

## Layout
Sidebar + Topbar. Konten dibagi 3 section vertikal dengan heading pemisah.

---

## Section 1 — Keamanan Akun
**Komponen:** Input password, Button `outline-primary`

**Ganti Password:**
- Input: Password Saat Ini
- Input: Password Baru (min 8 karakter)
- Input: Konfirmasi Password Baru
- Button `outline-primary` "Simpan Password Baru"

**Nomor HP:**
- Tampilkan nomor HP aktif (disamarkan sebagian)
- Button `ghost` kecil "Ubah Nomor HP" → membuka modal inline

**Modal Ubah Nomor HP — 3 langkah dalam satu modal dengan step indicator:**

Langkah 1 — Verifikasi Identitas:
- Teks: *"Masukkan password akun Anda untuk melanjutkan."*
- Input: Password — dengan toggle show/hide
- Button `primary` "Verifikasi" → jika benar, lanjut ke Langkah 2

Langkah 2 — Masukkan Nomor Baru:
- Input: Nomor HP baru
- Validasi: format 08xxx, minimal 10 digit, tidak boleh sama dengan nomor saat ini
- Button `primary` "Kirim OTP ke Nomor Baru"

Langkah 3 — Verifikasi OTP:
- 6 kotak input OTP (komponen sama dengan halaman 2.3)
- Countdown kirim ulang identik dengan blueprint 2.3
- Button `primary` "Konfirmasi Ganti Nomor"
- Setelah berhasil: toast success *"Nomor HP berhasil diubah."* + modal tertutup otomatis

---

## Section 2 — Notifikasi
**Komponen:** Toggle switch per item

Setiap toggle: label di kiri + toggle di kanan

- Reminder laporan harian belum masuk (pukul 17.00)
- Notifikasi deadline proyek mendekat
- Notifikasi paket akan habis / perpanjangan
- Notifikasi portofolio disetujui / ditolak admin
- Notifikasi ulasan baru dari owner

---

## Section 3 — Zona Bahaya
**Komponen:** Card border `danger`, Button `outline-danger`

- Heading: "Zona Bahaya"
- Teks: *"Tindakan di bawah ini tidak dapat dibatalkan."*
- Button `outline-danger` "Hapus Akun Permanen" → modal konfirmasi destruktif: ketik ulang nomor HP + penjelasan konsekuensi (semua data proyek, laporan, dan portofolio akan dihapus)

---

## Catatan
- Tidak ada pengaturan bahasa — platform hanya tersedia dalam Bahasa Indonesia
- Tidak ada pengaturan tema (dark/light mode) di versi ini
