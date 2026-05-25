# Blueprint 4.2 — Manajemen Pengguna
**Proyek:** KontraktorPro  
**Grup:** 4 — Admin Panel  
**Akses:** Login sebagai Admin (Super Admin atau Moderator)  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Tampilan dan pengelolaan semua akun kontraktor yang terdaftar di platform — cari, filter, dan ambil aksi per pengguna.

---

## Layout
Sidebar Admin + Topbar Admin (sama dengan 4.1). Area konten: full width.

---

## Konten Halaman

### Header Halaman
- Judul: "Semua Pengguna"
- Button `outline-primary` "Export Data CSV" di kanan

---

### Filter Bar
**Komponen:** Search bar, Dropdown filter (4 filter sejajar)

- Search: *"Cari nama, nomor HP, nama usaha..."*
- Dropdown Paket: Semua / Gratis / Pro / Bisnis
- Dropdown Kota
- Dropdown Status: Semua / Aktif / Suspend / Perlu Verifikasi
- Date range picker: filter by tanggal daftar

---

### Tabel Pengguna
**Komponen:** Tabel, Badge, Dropdown aksi

**Kolom:**
| Kolom | Keterangan |
|---|---|
| Avatar + Nama | Foto profil kecil + nama kontraktor |
| Nama Usaha | Nama perusahaan/usaha |
| Kota | Lokasi operasional |
| Paket | Badge: `neutral` Gratis / `primary` Pro / `accent` Bisnis |
| Proyek Aktif | Angka jumlah proyek aktif saat ini |
| Tanggal Daftar | Format: 12 Jan 2025 |
| Terakhir Aktif | Format relatif: *"3 jam lalu"* |
| Status | Badge: `success` Aktif / `danger` Suspend / `warning` Perlu Verifikasi |
| Aksi | Button `ghost` "Lihat" + ikon titik tiga "..." untuk aksi lanjut |

**Dropdown aksi per baris (ikon "..."):**
- Lihat profil lengkap → Detail Pengguna (4.3)
- Login sebagai pengguna ini *(impersonate — hanya Super Admin)*
- Kirim notifikasi ke pengguna ini
- Suspend akun — konfirmasi + isian alasan
- Aktifkan akun (jika sedang suspend)
- Hapus akun permanen — dialog konfirmasi destruktif (ketik ulang nomor HP)

---

### Pagination
Tampilkan 20 baris per halaman. Navigasi halaman di bawah tabel.

---

## Catatan
- Fitur impersonate hanya untuk Super Admin — tidak tampil di dropdown untuk Moderator
- Export CSV mengekspor data sesuai filter yang aktif saat ini, bukan semua data

---

---

# Blueprint 4.3 — Detail Pengguna
**Proyek:** KontraktorPro  
**Grup:** 4 — Admin Panel  
**Akses:** Login sebagai Admin  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Profil lengkap satu pengguna dari sudut pandang admin — semua data akun, aktivitas, proyek, dan riwayat pembayaran dalam satu halaman.

---

## Layout
Sidebar Admin + Topbar Admin. Konten: 2 kolom (info utama kiri 65%, panel aksi kanan 35%).

---

## Kolom Kiri — Info Pengguna

### Blok 1 — Identitas Akun
**Komponen:** Avatar besar, Badge paket, Badge status

- Avatar + nama kontraktor + nama usaha
- Badge paket + Badge status akun
- Info: nomor HP / kota / tanggal daftar / terakhir aktif
- Tombol kecil: link ke Profil Publik (1.3) di tab baru

---

### Blok 2 — Statistik Akun
**Komponen:** Grid 4 Card KPI kecil

- Total proyek (aktif + selesai)
- Total laporan harian dikirim
- Total foto diupload
- Jumlah portofolio dipublish

---

### Blok 3 — Daftar Proyek
**Komponen:** Tabel ringkas

Kolom: Nama Proyek / Status / Tanggal Buat / Progres  
Tampilkan 5 proyek terbaru + link "Lihat semua"

---

### Blok 4 — Portofolio yang Dipublish
**Komponen:** List item

Setiap item: nama proyek + Badge status moderasi + tanggal publish  
Tampilkan 5 terbaru + link "Lihat semua"

---

### Blok 5 — Log Aktivitas Pengguna
**Komponen:** Timeline vertikal

10 aktivitas terbaru pengguna ini. Tipe: login, buat proyek, kirim laporan, upgrade paket, submit portofolio.

---

## Kolom Kanan — Panel Aksi Admin

### Blok Paket & Billing
- Paket aktif + tanggal mulai + tanggal perpanjangan
- Riwayat pembayaran (3 terbaru) + link "Lihat semua"

---

### Blok Aksi Admin
**Komponen:** Button per aksi, masing-masing dengan konfirmasi

- Button `outline-primary` "Kirim Notifikasi" → modal isi pesan teks bebas
- Button `outline-primary` "Login sebagai Pengguna Ini" *(impersonate — hanya Super Admin)*
- Button `outline-danger` "Suspend Akun" → modal konfirmasi + isian alasan + durasi suspend (sementara / permanen)
- Button `outline-primary` "Aktifkan Akun" (hanya tampil jika akun sedang suspend)
- Button `danger` "Hapus Akun Permanen" → dialog konfirmasi destruktif

---

### Blok Catatan Internal Admin
**Komponen:** Textarea, Button

- Area teks catatan internal — hanya terlihat oleh admin, tidak oleh pengguna
- Button `outline-primary` "Simpan Catatan"
- Histori catatan sebelumnya (dengan nama admin yang menulis + waktu)

---

## Catatan
- Admin tidak bisa mengakses atau melihat konten proyek pengguna (foto, laporan detail) — privasi pengguna
- Fitur impersonate meninggalkan jejak di Log Aktivitas Admin secara otomatis
