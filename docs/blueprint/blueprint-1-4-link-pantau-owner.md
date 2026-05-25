# Blueprint 1.4 — Link Pantau Owner
**Proyek:** KontraktorPro  
**Grup:** 1 — Halaman Publik  
**Akses:** Via link unik dari kontraktor — tidak bisa dicari di mesin pencari  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Halaman read-only yang dikirim kontraktor ke owner via WhatsApp. Owner dapat memantau progres proyek tanpa perlu mendaftar atau login.

---

## Struktur Halaman
Halaman standalone — tidak ada sidebar atau navbar platform. Tampil bersih seperti halaman status profesional.

---

### Section 1 — Header Proyek
**Komponen:** Badge status proyek

**Isi:**
- Nama proyek (heading `h1`)
- Alamat / lokasi proyek (body, abu-abu)
- Badge status: `badge-success` "Sedang Berjalan" / `badge-neutral` "Selesai" / `badge-warning` "Ditunda"
- Nama kontraktor + nama usaha — dengan link ke Profil Publik (1.3)
- Teks mikro: *"Diperbarui [waktu relatif, contoh: 3 jam lalu]"*

---

### Section 2 — Progres Visual
**Komponen:** Progress bar besar, angka statistik `font-mono`

**Isi:**
- Angka progres besar di tengah (contoh: **67%**) dengan label *"Progres Keseluruhan"*
- Progress bar horizontal tebal di bawah angka
- 3 angka ringkasan sejajar: Selesai (hijau) / Dalam Pengerjaan (biru) / Belum Dimulai (abu) — dalam item pekerjaan

---

### Section 3 — Ringkasan Item Pekerjaan
**Komponen:** List item dengan progress bar mini per baris

**Isi:**
- Heading `h3`: *"Pekerjaan"*
- List item WBS yang dipilih kontraktor untuk ditampilkan — setiap baris berisi:
  - Nama item pekerjaan
  - Progress bar mini + persentase
  - Badge status item

**Catatan:** Kontraktor memilih item mana yang tampil di sini dari pengaturan proyek. Tidak semua item WBS wajib ditampilkan.

---

### Section 4 — Foto Terbaru
**Layout:** Grid 2–3 kolom  
**Komponen:** Thumbnail foto dengan watermark

**Isi:**
- Heading `h3`: *"Dokumentasi Terbaru"*
- 4–6 foto terbaru dari laporan harian — dengan watermark kontraktor terlihat
- Tap foto: buka lightbox full-screen
- Teks mikro di bawah grid: tanggal foto terakhir diupload

**Jika belum ada foto:** Section tidak ditampilkan.

---

### Section 5 — Update Terakhir
**Komponen:** Card, timeline item

**Isi:**
- Heading `h3`: *"Update Terakhir"*
- 3–5 entri aktivitas terbaru dari laporan harian — setiap entri berisi:
  - Tanggal
  - Item pekerjaan yang diupdate + progres baru
  - Catatan singkat jika ada

---

### Section 6 — Footer
**Isi:**
- Teks: *"Laporan ini dibuat oleh [nama kontraktor] menggunakan KontraktorPro"*
- Link: *"Apa itu KontraktorPro?"* — mengarah ke Landing Page (1.1)

---

## State Khusus

**Link dinonaktifkan kontraktor:** Tampilkan halaman kosong dengan pesan *"Link pantau ini tidak aktif. Hubungi kontraktor Anda untuk informasi lebih lanjut."*

**Proyek sudah selesai:** Header menampilkan Badge "Selesai" dan progress 100%. Konten tetap bisa dilihat sebagai arsip.

**Belum ada data sama sekali:** Tampilkan pesan *"Kontraktor belum menambahkan data proyek."*

---

## Catatan
- Halaman ini tidak punya navigasi ke bagian lain platform
- Owner tidak bisa komentar atau berinteraksi — murni read-only
- Nilai kontrak tidak pernah ditampilkan
- URL mengandung token unik acak — tidak bisa ditebak atau di-enumerate
