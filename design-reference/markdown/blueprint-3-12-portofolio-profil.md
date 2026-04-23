# Blueprint 3.12 — Portofolio & Profil Kontraktor
**Proyek:** KontraktorPro  
**Grup:** 3 — Dashboard Kontraktor  
**Akses:** Login sebagai Kontraktor  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Halaman bagi kontraktor untuk mengelola profil publik mereka dan memilih proyek selesai yang akan dipublish ke portofolio. Berbeda dari Profil Publik (1.3) — ini adalah sisi pengelolaan, bukan tampilan publik.

---

## Layout
Sidebar + Topbar. Konten dibagi 2 tab: **Profil Saya / Portofolio**.

---

## Tab 1 — Profil Saya

### Preview Profil Publik
**Komponen:** Card preview, Button `outline-primary`

- Card preview kecil yang menampilkan tampilan profil publik saat ini (thumbnail)
- Button `outline-primary` "Lihat Profil Publik" → buka Profil Publik (1.3) di tab baru
- Teks mikro: *"Ini tampilan profil yang dilihat calon klien."*

---

### Form Edit Profil
**Komponen:** Input, Textarea, Dropdown, Toggle, Upload avatar

**Field:**
1. Foto Profil / Logo Usaha — upload gambar, preview langsung
2. Nama Usaha — input text, wajib
3. Nama Pemilik — input text, wajib
4. Kota Operasional — dropdown, wajib
5. Tahun Berdiri / Pengalaman — input number
6. Deskripsi Usaha — textarea, maks 500 karakter dengan counter, opsional
7. Spesialisasi — multi-select chip: Rumah Tinggal / Renovasi / Ruko / Gedung / MEP / Lainnya
8. Area Kerja — multi-select kota (selain kota utama)
9. Nomor HP Publik — input, opsional, toggle: tampilkan di profil publik / sembunyikan
10. Toggle: Aktifkan profil publik (jika dimatikan, profil tidak bisa ditemukan di direktori)

**Tombol:** Button `primary` "Simpan Profil"

---

## Tab 2 — Portofolio

### Toolbar
- Button `primary` "+ Publish Proyek ke Portofolio" → modal pilih proyek selesai

---

### Daftar Portofolio yang Sudah Dipublish
**Komponen:** Card portofolio, Badge status moderasi

**Setiap card:**
- Foto cover (thumbnail pertama dari proyek)
- Nama proyek + tipe proyek
- Lokasi + durasi pengerjaan
- Badge status moderasi: `badge-warning` "Menunggu Review" / `badge-success` "Tampil Publik" / `badge-danger` "Ditolak"
- Jika ditolak: teks alasan penolakan dari admin
- Button `ghost` "Edit Tampilan" — buka modal edit konten portofolio
- Button `ghost` "Hapus dari Portofolio" — konfirmasi sederhana

---

### Modal Publish Proyek ke Portofolio
**Komponen:** Modal, Dropdown, Checkbox foto, Textarea

**Field:**
1. Pilih Proyek — dropdown (hanya proyek dengan status Selesai)
2. Pilih Foto Cover — grid foto dari proyek, tap untuk pilih 1 foto sebagai cover
3. Foto yang Ditampilkan — multi-select foto (maks 10 foto)
4. Deskripsi Proyek — textarea opsional untuk cerita singkat proyek
5. Toggle: Tampilkan rating owner (jika ada ulasan)

**Footer modal:** Button `primary` "Kirim untuk Review" + Button `ghost` "Batal"

Setelah submit: Badge status berubah jadi "Menunggu Review" sampai admin approve.

---

### Proyek Selesai yang Belum Dipublish
**Komponen:** List item sederhana

Di bawah daftar portofolio, tampilkan list proyek selesai yang belum dipublish:
- Nama proyek + tanggal selesai
- Button `outline-primary` kecil "Publish"

**Empty state (belum ada portofolio):**  
Teks: *"Belum ada portofolio. Tandai proyek sebagai Selesai untuk mulai membangun portofolio."*

---

## Catatan
- Nilai kontrak tidak pernah bisa dipublish ke portofolio
- Nama owner hanya tampil jika owner memberi izin via link ulasan
- Proses moderasi admin biasanya selesai dalam 1x24 jam
