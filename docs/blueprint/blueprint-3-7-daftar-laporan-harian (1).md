# Blueprint 3.7 — Daftar Laporan Harian
**Proyek:** KontraktorPro  
**Grup:** 3 — Dashboard Kontraktor  
**Akses:** Login sebagai Kontraktor  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Menampilkan semua laporan harian yang sudah dikirim untuk satu proyek, dengan kemampuan filter dan akses ke detail tiap laporan.

---

## Catatan Arsitektur
Halaman ini adalah Tab 2 — Laporan di dalam Detail Proyek (3.3). Tidak ada URL terpisah. Blueprint ini mendokumentasikan konten tab tersebut secara lengkap.

---

## Konten Tab Laporan

### Toolbar
**Komponen:** Button `primary`, Filter bar

- Button `primary` "+ Buat Laporan Hari Ini" → Form Laporan Harian (3.6)
- Filter: Dropdown bulan / Dropdown pengisi (Semua / Kontraktor / per nama Mandor) / Toggle "Hanya yang ada kendala"

---

### List Laporan
**Komponen:** List item per baris, Badge, Button `ghost`

Diurutkan dari terbaru ke terlama.

**Setiap baris laporan:**
- Tanggal laporan + ikon cuaca
- Jumlah item pekerjaan yang diupdate
- Jumlah foto
- Badge `danger` kecil jika ada kendala tercatat
- Nama pengisi (kontraktor / nama mandor)
- Button `ghost` "Lihat Detail" → Detail Laporan (3.8)

---

### Empty State
Jika belum ada laporan untuk proyek ini:
- Teks: *"Belum ada laporan harian."*
- Button `primary` "Buat Laporan Pertama"

---

## Catatan
- Kontraktor bisa melihat semua laporan termasuk yang diisi mandor
- Tidak ada fitur hapus laporan dari halaman ini — hanya bisa dari halaman Detail Laporan
- Jika laporan sudah lebih dari 30 baris, gunakan pagination (30 per halaman) atau infinite scroll — jangan load semua sekaligus
