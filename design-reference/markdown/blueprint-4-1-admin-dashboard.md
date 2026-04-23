# Blueprint 4.1 — Admin Dashboard
**Proyek:** KontraktorPro  
**Grup:** 4 — Admin Panel  
**Akses:** Login sebagai Admin (Super Admin atau Moderator)  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Halaman utama admin setelah login. Memberikan visibilitas penuh kondisi platform dalam satu pandangan — pengguna, pendapatan, moderasi, dan aktivitas real-time.

---

## Dua Level Akses
| Level | Hak Akses |
|---|---|
| **Super Admin** | Akses penuh termasuk data keuangan dan pengaturan sistem |
| **Moderator** | Hanya manajemen pengguna dan moderasi konten — menu keuangan disembunyikan |

Menu yang tidak bisa diakses moderator **disembunyikan**, bukan di-disable.

---

## Layout
**Desktop only** — tidak dioptimasi untuk mobile. Jika diakses dari HP, tampilkan banner: *"Admin panel dioptimalkan untuk layar desktop. Beberapa fitur mungkin tidak berfungsi optimal."*

**Struktur:** Sidebar kiri (260px, fixed) + area konten kanan + Topbar sticky.

---

## Sidebar Admin

**Bagian atas:**
- Logo + Badge `danger` kecil "ADMIN"
- Nama admin yang login + label level akses

**Menu navigasi — Grup 1 (Overview):**
- Dashboard
- Aktivitas Real-time

**Menu navigasi — Grup 2 (Pengguna):**
- Semua Pengguna
- Verifikasi Akun — Badge angka jika ada antrian
- Laporan Pengguna — Badge angka jika ada

**Menu navigasi — Grup 3 (Konten):**
- Moderasi Portofolio — Badge angka antrian
- Moderasi Ulasan — Badge angka antrian

**Menu navigasi — Grup 4 (Bisnis) — hanya Super Admin:**
- Paket & Harga
- Keuangan & MRR
- Promo & Diskon

**Menu navigasi — Grup 5 (Sistem):**
- Pengaturan Platform
- Log Aktivitas Admin
- Notifikasi Sistem

**Bagian bawah sidebar:**
- Indikator status sistem: Badge `success` *"Semua sistem normal"* atau Badge `danger` jika ada masalah
- Tombol Keluar

---

## Topbar Admin
- Kiri: judul halaman aktif
- Tengah: search global — *"Cari pengguna, email, nama proyek..."*
- Kanan: indikator status sistem (titik hijau/merah) + ikon notifikasi + avatar admin (dropdown: Profil, Ganti Password, Keluar)

---

## Konten Halaman Dashboard

### Blok A — System Health Bar
**Komponen:** Banner full-width, Badge status

Ditampilkan paling atas, selalu terlihat. Satu baris berisi:
- Status server: Badge `success` Normal / Badge `danger` Gangguan
- Uptime bulan ini: angka %
- Antrian moderasi: jumlah konten menunggu review
- Pengguna aktif sekarang: angka real-time

Jika ada masalah sistem: bar berubah jadi banner `danger` penuh dengan deskripsi masalah + Button `outline-danger` "Lihat Detail".

---

### Blok B — Kartu KPI
**Komponen:** Card KPI, 2 baris grid 4 kolom

**Baris 1 — Metrik Pengguna:**
1. **Total Pengguna Terdaftar** — angka besar + tren minggu ini
2. **Pengguna Aktif Bulan Ini (MAU)** — angka + persentase dari total
3. **Pelanggan Berbayar** — angka + breakdown Pro vs Bisnis
4. **Churn Bulan Ini** — persentase + angka absolut, warna `danger` jika naik dari bulan lalu

**Baris 2 — Metrik Bisnis:**
5. **MRR** — nilai rupiah + tren % dari bulan lalu *(hanya Super Admin)*
6. **Total Proyek Aktif di Platform** — angka + jumlah baru minggu ini
7. **Laporan Dikirim Hari Ini** — angka + rata-rata 7 hari
8. **Konten Menunggu Moderasi** — angka, card berubah `warning` jika > 10, `danger` jika > 50 + Button `ghost` kecil "Review Sekarang"

---

### Blok C — Grafik Pertumbuhan
**Komponen:** Line chart (kiri), Bar chart (kanan) — layout 2 kolom

**Grafik kiri — Pertumbuhan Pengguna:**
- Line chart 2 garis: Total Daftar vs Berbayar
- Toggle periode: 7 hari / 30 hari / 3 bulan / 12 bulan

**Grafik kanan — MRR *(hanya Super Admin)*:**
- Bar chart 6 bulan terakhir
- Bar dibagi warna: Pro vs Bisnis
- Garis horizontal: target MRR bulan ini

---

### Blok D — Antrian Moderasi
**Komponen:** 2 tab (Portofolio Baru / Ulasan Baru), Card per item, Button

Header: *"Menunggu Moderasi"* + Badge jumlah total

**Tab Portofolio Baru — setiap baris:**
- Thumbnail foto pertama + nama kontraktor + kota + nama proyek + tipe proyek + waktu submit
- Button `success` "Approve" + Button `outline-danger` "Tolak"
- Link "Lihat detail lengkap" → halaman Moderasi Portofolio (4.4)
- Jika tolak: modal muncul untuk isi alasan penolakan

**Tab Ulasan Baru — setiap baris:**
- Nama kontraktor yang diulas + rating bintang + cuplikan teks ulasan + nama owner + waktu submit
- Button `success` "Publish" + Button `outline-danger` "Hapus"

Link di bawah: "Lihat semua antrian →" → halaman moderasi masing-masing

---

### Blok E — Pengguna Baru & Aktivitas
**Komponen:** Tabel ringkas (kiri), Timeline (kanan) — layout 2 kolom

**Kiri — Pengguna Baru (8 terbaru):**
- Kolom: Nama / Kota / Tanggal Daftar / Paket / Status / Button `ghost` "Lihat"
- Link: "Lihat semua pengguna →" → halaman Manajemen Pengguna (4.2)

**Kanan — Aktivitas Platform Terbaru:**
- Timeline 10 item terbaru: titik warna + waktu relatif + deskripsi
- Tipe aktivitas: daftar baru, upgrade paket, portofolio submit, laporan pengguna, pembayaran berhasil
- Link: "Lihat log lengkap →" → halaman Log Aktivitas Admin (4.8)

---

## Catatan
- Semua data di dashboard ini real-time atau near-real-time (refresh otomatis setiap 60 detik)
- Data keuangan (MRR, pendapatan) hanya terlihat oleh Super Admin
