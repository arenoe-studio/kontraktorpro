# Blueprint 3.3 — Detail Proyek
**Proyek:** KontraktorPro  
**Grup:** 3 — Dashboard Kontraktor  
**Akses:** Login sebagai Kontraktor  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Pusat kendali untuk satu proyek spesifik. Semua informasi dan aksi terkait proyek tersedia di sini melalui struktur tab.

---

## Layout
Sidebar + Topbar + Header Proyek yang selalu tampil + area tab di bawahnya.

---

## Header Proyek (Selalu Tampil, Tidak Berubah Saat Ganti Tab)

**Baris 1:**
- Breadcrumb: Dashboard > Proyek Saya > [Nama Proyek]
- Kanan: Button `primary` "Generate Laporan PDF" + Button `ghost` ikon titik tiga "..."

**Baris 2:**
- Nama proyek (heading `h1`) + Badge status proyek
- Tipe proyek + lokasi (body-sm, abu-abu)

**Baris 3 — 4 Metrik Cepat sejajar:**
- Progress bar horizontal + persentase besar
- Deadline: *"Sisa 23 hari"* atau Badge `danger` *"Telat 3 hari"*
- Nilai kontrak: tersembunyi default, ikon mata untuk toggle tampil/sembunyikan
- Total laporan: *"47 laporan harian"*

**Dropdown "..." aksi tambahan:**
- Edit informasi proyek → Form Edit Proyek (3.4)
- Aktifkan / Nonaktifkan Link Pantau
- Tandai proyek sebagai Selesai (dengan konfirmasi)
- Publish ke portofolio publik
- Arsipkan proyek (dengan konfirmasi)
- Hapus proyek (dengan dialog konfirmasi destruktif)

---

## Tab Navigasi
6 tab: **WBS / Laporan / Foto / Tim / Material / Pengaturan**  
Di mobile: tab menjadi scrollable horizontal.

> **Catatan untuk agent:** Setiap tab memiliki blueprint detail tersendiri. Gunakan file berikut sebagai referensi utama saat membangun masing-masing tab:
> - Tab WBS → Blueprint 3.5
> - Tab Laporan → Blueprint 3.7
> - Tab Foto → Blueprint 3.9
> - Tab Tim → Blueprint 3.10
> - Tab Material → Blueprint 3.11
> - Tab Pengaturan → didokumentasikan di halaman ini (lihat bawah)

---

## Tab 1 — WBS

**Area atas:** Donut chart progres keseluruhan — angka % besar di tengah + 3 label: Selesai / Dalam Pengerjaan / Belum Dimulai.

**Tombol di atas tabel:**
- Button `primary` "+ Tambah Item"
- Button `outline-primary` "Gunakan Template"
- Button `ghost` "Atur Ulang Bobot"

**Tabel WBS — kolom:**
Nama Item / Bobot (%) / Volume & Satuan / Progress bar mini + % / Badge status / Update Terakhir / Aksi (edit + hapus)

**Perilaku tabel:**
- Baris bisa di-expand untuk sub-item (hierarki 2 level)
- Baris progres tertinggal: background `warning-100` tipis
- Baris progres 100%: background `success-100` tipis
- Total bobot ditampilkan di bawah tabel — validasi real-time, teks merah jika tidak = 100%

**Modal Tambah / Edit Item WBS:**  
Field: Nama item / Kategori (dropdown) / Volume + Satuan / Bobot % / Target selesai (opsional) / Assign mandor (opsional)

---

## Tab 2 — Laporan Harian
**Komponen:** Button `primary`, List laporan, Filter bar

**Tombol:** Button `primary` "+ Buat Laporan Hari Ini" → Form Laporan Harian (3.6)

**Filter:** By bulan / by pengisi / by ada kendala

**Setiap baris laporan:** Tanggal + ikon cuaca / jumlah item diupdate / jumlah foto / Badge `danger` kecil jika ada kendala / nama pengisi / Button `ghost` "Lihat Detail" → Detail Laporan (3.8)

---

## Tab 3 — Foto Dokumentasi
**Komponen:** Grid galeri, Filter bar, Button, Lightbox

**Tombol:** Button `outline-primary` "Upload Foto Manual" + Button `ghost` "Pilih untuk Laporan PDF"

**Filter:** By tanggal / by item pekerjaan / by mandor

**Grid:** 3 kolom desktop, 2 kolom mobile. Setiap thumbnail: watermark terlihat + hover menampilkan tanggal + nama item + pengupload. Klik → lightbox full-screen.

---

## Tab 4 — Tim
**Komponen:** Card anggota tim, Button `primary`

**Tombol:** Button `primary` "+ Tambah Anggota" → modal invite via nomor HP

**Setiap card:** Avatar + nama + peran (Mandor/Pekerja/Spesialis) + Badge status + jumlah laporan dikirim + Button `ghost` "Lihat Aktivitas" + Button `ghost` "Hapus dari Proyek"

---

## Tab 5 — Material
**Komponen:** Tabel, Button `primary`, Sub-tab

**Sub-tab:** Material Masuk / Pemakaian per Item

**Tabel Material Masuk — kolom:** Tanggal / Nama Material / Jumlah / Satuan / Supplier / Dicatat oleh

**Tombol:** Button `primary` "+ Catat Material Masuk" → modal form

---

## Tab 6 — Pengaturan Proyek
**Komponen:** Form edit, Toggle switch, Danger zone

**Konten:**
- Form edit info proyek: nama, lokasi, nilai kontrak, tanggal mulai, target selesai
- Toggle: Aktifkan Link Pantau + preview URL link pantau + Button `ghost` "Salin Link"
- Toggle: Izinkan owner memberi ulasan setelah proyek selesai
- Danger zone (border `danger-500`, background `danger-50`):
  - Button `outline-danger` "Arsipkan Proyek"
  - Button `outline-danger` "Hapus Proyek" — memicu dialog konfirmasi destruktif

---

## Sub-halaman — Generate Laporan PDF
**Akses:** Button "Generate Laporan PDF" di header proyek  
**Tampilan:** Modal overlay lebar (max-width 720px), bukan halaman terpisah

### Langkah 1 — Pilih Konten Laporan
**Komponen:** Checkbox group, Date range picker, Grid foto seleksi

**Isi modal:**
- Heading `h3`: *"Buat Laporan PDF"*
- Nama proyek + Badge status (read-only di atas)

**Pilih Periode:**
- Date range picker: Dari tanggal / Sampai tanggal
- Shortcut cepat: Minggu ini / Minggu lalu / Bulan ini / Kustom

**Pilih Laporan Harian yang Dimasukkan:**
- List checkbox laporan harian dalam periode yang dipilih
- Setiap baris: tanggal + ikon cuaca + jumlah foto + nama pengisi
- Default: semua laporan dalam periode tercentang
- Toggle "Pilih Semua / Batalkan Semua"

**Pilih Foto yang Dimasukkan:**
- Tombol toggle: "Semua foto dari laporan terpilih" (default) / "Pilih foto manual"
- Jika pilih manual: grid thumbnail foto dengan checkbox, maks 20 foto

**Opsi Tambahan:**
- Toggle: Sertakan ringkasan WBS (progres per item)
- Toggle: Sertakan daftar anggota tim
- Toggle: Tampilkan nilai kontrak di laporan *(default: OFF)*

**Footer modal:** Button `primary` "Lanjut ke Preview" + Button `ghost` "Batal"

---

### Langkah 2 — Preview & Kirim
**Komponen:** Preview PDF embed, Button

**Isi:**
- Preview halaman pertama laporan PDF (render sederhana, bukan PDF asli)
- Informasi: jumlah halaman estimasi, jumlah foto yang dimasukkan
- Button `primary` "Unduh PDF" — generate dan download file PDF
- Button `outline-primary` "Salin Link" — generate link laporan yang bisa dikirim ke owner tanpa download
- Button `ghost` "Kembali" — kembali ke Langkah 1

**Setelah unduh/salin link:** Toast success + modal bisa ditutup.

---

## Catatan
- Header proyek selalu terlihat saat scroll dalam tab — hanya area konten tab yang bergulir
- Di mobile, tab WBS menampilkan tabel dalam layout yang disederhanakan (beberapa kolom disembunyikan)
- Generate Laporan PDF hanya tersedia untuk paket Pro dan Bisnis — jika paket Gratis, Button "Generate Laporan PDF" tetap tampil tapi saat diklik muncul modal upgrade paket
