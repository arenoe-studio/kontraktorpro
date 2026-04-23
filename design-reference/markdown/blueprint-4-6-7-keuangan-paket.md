# Blueprint 4.6 — Keuangan & MRR
**Proyek:** KontraktorPro  
**Grup:** 4 — Admin Panel  
**Akses:** Login sebagai Super Admin saja  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Data keuangan platform secara lengkap — MRR, ARR, transaksi, dan analisis churn. Tidak dapat diakses oleh Moderator.

---

## Layout
Sidebar Admin + Topbar Admin. Area konten: full width.

---

## Konten Halaman

### Blok 1 — Ringkasan Keuangan Bulan Ini
**Komponen:** Grid 4 Card KPI

1. **MRR Saat Ini** — nilai rupiah besar + tren % vs bulan lalu
2. **ARR Proyeksi** — nilai rupiah (MRR x 12) + label *"proyeksi"*
3. **Pendapatan Bulan Ini** — total transaksi berhasil bulan ini
4. **Transaksi Gagal** — jumlah + persentase dari total transaksi

---

### Blok 2 — Grafik MRR 12 Bulan
**Komponen:** Line chart + Bar chart overlay

- Line chart MRR per bulan (12 bulan terakhir)
- Breakdown bar: kontribusi paket Pro (biru) vs Bisnis (emas)
- Garis horizontal: target MRR bulan ini
- Toggle: tampilkan dalam rupiah / dalam jumlah pelanggan

---

### Blok 3 — Tabel Transaksi Terbaru
**Komponen:** Tabel, Filter bar, Button export

**Filter:** Dropdown status (Semua / Berhasil / Gagal / Refund) + Dropdown bulan + Dropdown paket

**Kolom tabel:** Tanggal / Nama Pengguna / Paket / Periode / Jumlah / Status (Badge) / Aksi

**Kolom Aksi:** Link "Lihat Detail" + Link "Unduh Invoice"

Button `outline-primary` "Export CSV" di atas tabel.

Tampilkan 20 baris per halaman + pagination.

---

### Blok 4 — Analisis Churn
**Komponen:** Line chart, List

- Line chart churn rate per bulan (12 bulan terakhir)
- Di bawah chart: list 10 pengguna terakhir yang cancel — nama + paket sebelumnya + alasan cancel (jika diisi) + tanggal cancel
- Link "Lihat profil" per baris → Detail Pengguna (4.3)

---

## Catatan
- Halaman ini tidak tampil sama sekali di sidebar untuk akun Moderator
- Semua nilai dalam Rupiah (IDR)
- Data diperbarui setiap hari (bukan real-time)

---

---

# Blueprint 4.7 — Paket & Harga
**Proyek:** KontraktorPro  
**Grup:** 4 — Admin Panel  
**Akses:** Login sebagai Super Admin saja  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Mengelola konfigurasi paket langganan, harga, dan kode promo yang aktif di platform.

---

## Layout
Sidebar Admin + Topbar Admin. Konten single column, max-width 800px.

---

## Konten Halaman

### Blok 1 — Kartu Paket Aktif
**Komponen:** 3 Card paket sejajar (Gratis / Pro / Bisnis)

**Setiap card menampilkan:**
- Nama paket + harga saat ini
- Jumlah pelanggan aktif di paket ini
- Daftar fitur singkat (read-only)
- Button `outline-primary` "Edit Paket" → buka modal edit

**Modal Edit Paket — field:**
1. Harga bulanan — input number rupiah
2. Harga tahunan — input number rupiah
3. Batas proyek aktif — input number (0 = tidak terbatas)
4. Batas akun mandor — input number (0 = tidak terbatas)
5. Daftar fitur — textarea (satu fitur per baris)
6. Toggle: aktifkan trial 14 hari untuk paket ini

**Footer modal:** Button `primary` "Simpan Perubahan" + Button `ghost` "Batal"  
Perubahan harga hanya berlaku untuk pelanggan baru — pelanggan lama tidak terdampak sampai perpanjangan berikutnya. Tampilkan peringatan ini di dalam modal.

---

### Blok 2 — Promo & Diskon Aktif
**Komponen:** Tabel, Button `primary`

Button `primary` "+ Buat Promo Baru" di atas tabel.

**Kolom tabel:** Kode Promo / Diskon / Berlaku Untuk / Batas Penggunaan / Terpakai / Berlaku Sampai / Status (Badge) / Aksi (Edit + Nonaktifkan)

**Modal Buat / Edit Promo — field:**
1. Kode promo — input text (huruf kapital, tanpa spasi), wajib
2. Tipe diskon — radio: Persentase (%) / Nominal (Rp)
3. Nilai diskon — input number
4. Berlaku untuk paket — checkbox: Pro / Bisnis / Keduanya
5. Batas penggunaan total — input number (0 = tidak terbatas)
6. Batas per pengguna — input number (default: 1)
7. Tanggal berakhir — date picker, opsional

---

## Catatan
- Perubahan harga tidak bisa dibatalkan setelah disimpan — konfirmasi sebelum simpan
- Promo yang sudah digunakan tidak bisa dihapus — hanya bisa dinonaktifkan
