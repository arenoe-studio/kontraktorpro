# Blueprint 3.9 — Galeri Foto Proyek
**Proyek:** KontraktorPro  
**Grup:** 3 — Dashboard Kontraktor  
**Akses:** Login sebagai Kontraktor  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Tampilan semua foto dokumentasi satu proyek, terorganisir dan dapat difilter. Merupakan Tab 3 — Foto di dalam Detail Proyek (3.3).

---

## Konten Tab Foto

### Toolbar
**Komponen:** Button `outline-primary`, Button `ghost`, Filter bar

- Button `outline-primary` "Upload Foto Manual" — upload foto di luar laporan harian
- Button `ghost` "Pilih untuk Laporan PDF" — aktifkan mode seleksi
- Filter: Dropdown tanggal (by bulan) / Dropdown item pekerjaan / Dropdown mandor

---

### Grid Galeri
**Komponen:** Thumbnail grid, Lightbox

- Grid 3 kolom desktop, 2 kolom mobile
- Setiap thumbnail: watermark terlihat di pojok foto
- Hover desktop: overlay gelap tipis + tanggal + nama item pekerjaan + nama pengupload
- Tap/klik → lightbox full-screen dengan info lengkap dan navigasi antar foto (prev/next)

---

### Mode Seleksi (Pilih untuk Laporan PDF)
Setelah klik "Pilih untuk Laporan PDF":
- Setiap thumbnail mendapat checkbox di pojok kiri atas
- Toolbar berubah: tampilkan jumlah foto terpilih + Button `primary` "Tandai untuk PDF" + Button `ghost` "Batal"

---

### Empty State
Jika belum ada foto:
- Teks: *"Belum ada foto dokumentasi."*
- Button `outline-primary` "Upload Foto Pertama"

---

## Catatan
- Foto tidak bisa dihapus dari halaman ini — hanya bisa dari Detail Laporan terkait (dalam 24 jam)
- Watermark tidak bisa dilepas
- Foto diurutkan dari terbaru ke terlama secara default

---

---

# Blueprint 3.10 — Manajemen Tim
**Proyek:** KontraktorPro  
**Grup:** 3 — Dashboard Kontraktor  
**Akses:** Login sebagai Kontraktor  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Mengelola mandor dan pekerja yang terlibat dalam satu proyek. Merupakan Tab 4 — Tim di dalam Detail Proyek (3.3).

---

## Konten Tab Tim

### Toolbar
- Button `primary` "+ Tambah Anggota" → modal invite

---

### Daftar Anggota Tim
**Komponen:** Card per anggota

**Setiap card:**
- Avatar (inisial jika tidak ada foto) + nama
- Peran: Badge `neutral` — Mandor / Pekerja Harian / Spesialis
- Badge status: `badge-success` Aktif / `badge-neutral` Selesai
- Jumlah laporan harian yang pernah dikirim
- Button `ghost` "Lihat Aktivitas" — membuka modal histori aktivitas anggota di proyek ini
- Button `ghost` "Hapus dari Proyek" — konfirmasi sederhana sebelum eksekusi

**Modal Lihat Aktivitas:**
- Heading: nama anggota + peran
- Timeline vertikal aktivitas di proyek ini, dari terbaru ke terlama:
  - Setiap item: tanggal + deskripsi aktivitas (contoh: *"Mengirim laporan harian — 4 foto, 2 item diupdate"*)
  - Tipe aktivitas yang dicatat: kirim laporan, update progres item, upload foto manual
- Jika belum ada aktivitas: teks *"Belum ada aktivitas tercatat."*
- Footer modal: Button `ghost` "Tutup"

---

### Modal Tambah Anggota
**Komponen:** Modal, Input, Dropdown

**Field:**
1. Nomor HP — input number (untuk invite via WhatsApp)
2. Nama — input text
3. Peran — dropdown: Mandor / Pekerja Harian / Spesialis

**Alur:** Setelah submit, sistem kirim link akses ke nomor HP via WhatsApp. Anggota bisa langsung buka Form Laporan Harian via link tersebut tanpa perlu daftar akun penuh.

---

### Empty State
- Teks: *"Belum ada anggota tim di proyek ini."*
- Button `primary` "Tambah Anggota Pertama"

---

## Catatan
- Mandor yang diundang tidak punya akses ke dashboard kontraktor — hanya ke Form Laporan Harian
- Kontraktor bisa lihat semua laporan yang dikirim mandor
- Hapus anggota dari proyek tidak menghapus laporan yang sudah dikirim

---

---

# Blueprint 3.11 — Manajemen Material
**Proyek:** KontraktorPro  
**Grup:** 3 — Dashboard Kontraktor  
**Akses:** Login sebagai Kontraktor  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Pencatatan material masuk dan pemakaian per item pekerjaan. Merupakan Tab 5 — Material di dalam Detail Proyek (3.3).

---

## Konten Tab Material

### Sub-tab
2 sub-tab: **Material Masuk / Pemakaian per Item**

---

### Sub-tab 1 — Material Masuk

**Toolbar:**
- Button `primary` "+ Catat Material Masuk" → modal form

**Tabel Material Masuk — kolom:**
Tanggal / Nama Material / Jumlah / Satuan / Supplier / Dicatat oleh / Aksi (hapus)

**Modal Catat Material Masuk — field:**
1. Nama Material — input text, wajib
2. Jumlah — input number, wajib
3. Satuan — dropdown: sak / batang / m² / m³ / unit / lainnya
4. Supplier — input text, opsional
5. Tanggal masuk — date picker, default hari ini
6. Catatan — input text, opsional

---

### Sub-tab 2 — Pemakaian per Item

**Tabel Pemakaian — kolom:**
Item Pekerjaan / Nama Material / Jumlah Dipakai / Satuan / Tanggal / Catatan

**Toolbar:**
- Button `primary` "+ Catat Pemakaian"

---

### Empty State
- Teks: *"Belum ada catatan material."*
- Button `primary` "Catat Material Pertama"

---

## Catatan
- Harga material tidak dicatat di sini — privasi bisnis kontraktor
- Tidak ada kalkulasi stok otomatis di versi ini — hanya pencatatan sederhana
- Data material hanya terlihat oleh kontraktor, tidak terlihat owner
