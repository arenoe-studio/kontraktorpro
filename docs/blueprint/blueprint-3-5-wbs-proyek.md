# Blueprint 3.5 — WBS Proyek
**Proyek:** KontraktorPro  
**Grup:** 3 — Dashboard Kontraktor  
**Akses:** Login sebagai Kontraktor  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Halaman khusus manajemen Work Breakdown Structure (WBS) — menambah, mengedit, dan mengatur bobot item pekerjaan. Dapat diakses dari Tab WBS di Detail Proyek (3.3) atau dari prompt setelah buat proyek.

---

## Catatan Arsitektur
Secara visual, WBS adalah Tab 1 di dalam halaman Detail Proyek (3.3). Blueprint ini mendokumentasikan konten tab tersebut secara lebih detail karena kompleksitasnya. Tidak ada URL terpisah — tetap bagian dari halaman Detail Proyek dengan anchor tab WBS.

---

## Layout
Mengikuti layout Detail Proyek (3.3) — Sidebar + Topbar + Header Proyek + area Tab.

---

## Konten Tab WBS

### Area Ringkasan Progres
**Komponen:** Donut chart, 3 angka statistik sejajar

**Isi:**
- Donut chart: proporsi item Selesai (hijau) / Dalam Pengerjaan (biru) / Belum Dimulai (abu)
- Angka % besar di tengah donut: progres keseluruhan proyek
- 3 angka di bawah: jumlah item per status

---

### Toolbar Tabel
**Komponen:** Button `primary`, Button `outline-primary`, Button `ghost`

- Button `primary` "+ Tambah Item"
- Button `outline-primary` "Gunakan Template" — buka modal pilih template, replace atau merge dengan WBS yang sudah ada
- Button `ghost` "Atur Ulang Bobot" — buka modal helper distribusi bobot otomatis

---

### Tabel WBS
**Komponen:** Tabel dengan baris expandable, Progress bar mini, Badge status, Inline edit

**Kolom tabel:**
| Kolom | Keterangan |
|---|---|
| Nama Item | Teks item, bisa di-expand untuk sub-item |
| Kategori | Label kecil abu-abu |
| Bobot (%) | Angka, `font-mono` |
| Volume & Satuan | Angka + satuan |
| Progres | Progress bar mini + angka % |
| Status | Badge: Selesai / Dalam Pengerjaan / Belum Dimulai / Tertunda |
| Update Terakhir | Tanggal relatif |
| Aksi | Ikon edit (buka modal) + ikon hapus (konfirmasi) |

**Perilaku baris:**
- Baris induk bisa di-expand → tampilkan sub-item dengan indentasi
- Baris progres tertinggal jadwal: background `warning-100` tipis
- Baris progres 100%: background `success-100` tipis

**Footer tabel:**
- Baris total: "Total Bobot: [angka]%" — teks merah + ikon peringatan jika tidak = 100%
- Teks helper: *"Total bobot semua item harus = 100%"*

---

### Modal Tambah / Edit Item WBS
**Komponen:** Modal, Input, Dropdown, Date picker

**Field:**
1. Nama item pekerjaan — input text, wajib
2. Kategori — dropdown: Persiapan / Pondasi / Struktur / Dinding / Atap / MEP / Finishing / Lainnya
3. Volume — input number
4. Satuan — dropdown: m² / m³ / unit / titik / set / ls
5. Bobot % — input number, validasi real-time: sistem tampilkan sisa bobot yang tersedia
6. Target selesai — date picker, opsional
7. Assign ke mandor — dropdown pengguna tim, opsional
8. Parent item — dropdown (jika ini sub-item dari item lain), opsional

**Footer modal:** Button `primary` "Simpan" + Button `ghost` "Batal"

---

### Modal Atur Ulang Bobot
**Komponen:** Modal, Radio pilihan, Preview

**Isi:**
- Pilihan distribusi: Rata (semua item mendapat bobot sama) / Manual (isi sendiri tiap item)
- Jika pilih Rata: preview tabel dengan bobot yang sudah dihitung otomatis
- Button `primary` "Terapkan" + Button `ghost` "Batal"

---

## State Khusus

**WBS kosong (belum ada item):**  
Tabel diganti empty state — ilustrasi + *"Belum ada item pekerjaan."* + Button `primary` "Tambah Item Pertama" + Button `outline-primary` "Gunakan Template"

**Template dipilih saat WBS sudah ada:**  
Muncul konfirmasi: *"Menggunakan template akan mengganti WBS yang sudah ada. Lanjutkan?"* — Button "Ganti Semua" + Button "Batal"

---

## Catatan
- Mandor tidak bisa mengakses halaman ini — hanya kontraktor
- Perubahan bobot langsung mempengaruhi kalkulasi progres keseluruhan proyek secara real-time
- Hapus item yang sudah punya laporan harian terkait memunculkan peringatan — data laporan tidak ikut terhapus
