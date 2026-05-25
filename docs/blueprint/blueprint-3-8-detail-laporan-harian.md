# Blueprint 3.8 — Detail Laporan Harian
**Proyek:** KontraktorPro  
**Grup:** 3 — Dashboard Kontraktor  
**Akses:** Login sebagai Kontraktor  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Tampilan read-only laporan harian yang sudah dikirim. Dapat diedit dalam 24 jam setelah submit.

---

## Layout
Sidebar + Topbar. Konten single column, max-width 720px, terpusat.

---

## Konten Halaman

### Header
**Komponen:** Breadcrumb, Badge, Button

- Breadcrumb: Dashboard > Proyek Saya > [Nama Proyek] > Laporan Harian > [Tanggal]
- Kanan: Button `outline-primary` "Edit Laporan" — hanya aktif jika dalam 24 jam setelah submit. Jika sudah lewat: button di-disable + tooltip *"Laporan hanya bisa diedit dalam 24 jam setelah dikirim."*
- Button `ghost` "Masukkan ke Laporan PDF" — toggle untuk menandai laporan ini masuk ke laporan mingguan PDF

---

### Blok Info Dasar
**Komponen:** Grid 4 item info sejajar (2x2 di mobile)

- Tanggal laporan
- Cuaca: ikon + teks
- Diisi oleh: nama kontraktor / nama mandor
- Jumlah pekerja hadir

---

### Blok Item Pekerjaan
**Komponen:** List item dengan progress bar mini per baris

- Heading `h3`: "Item Pekerjaan yang Diupdate"
- Setiap baris: nama item + progres sebelumnya → progres hari ini + catatan item (jika ada)
- Progress bar mini menunjukkan progres terbaru

---

### Blok Foto Dokumentasi
**Komponen:** Grid galeri, Lightbox

- Heading `h3`: "Foto Dokumentasi"
- Grid 3 kolom (desktop), 2 kolom (mobile) — thumbnail dengan watermark terlihat
- Tap foto → lightbox full-screen dengan caption (jika ada)

---

### Blok Catatan & Kendala
**Komponen:** Card

- Heading `h3`: "Catatan Harian"
- Teks catatan (jika ada) — jika kosong: teks abu *"Tidak ada catatan."*
- Jika ada kendala: Card terpisah dengan heading "Kendala" + Badge `danger` tipe kendala + detail teks

---

### Blok Catatan Kehadiran
Tampil hanya jika catatan kehadiran diisi saat laporan dibuat.

---

## State Khusus

**Laporan dalam mode edit (dalam 24 jam):**  
Semua field berubah menjadi editable inline — form muncul di tempat yang sama, bukan halaman terpisah. Button "Edit" berubah jadi "Simpan Perubahan" dan "Batal".

---

## Catatan
- Foto tidak bisa dihapus dari halaman ini setelah laporan dikirim
- Watermark tidak bisa dihapus atau dinonaktifkan oleh siapapun
- Laporan yang sudah dimasukkan ke Laporan PDF tidak bisa dihapus
