# Blueprint 3.2 — Daftar Proyek

**Proyek:** KontraktorPro  
**Grup:** 3 — Dashboard Kontraktor  
**Akses:** Login sebagai Kontraktor  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman

Tampilan lengkap semua proyek milik kontraktor — aktif, selesai, dan arsip — dengan kemampuan filter dan pencarian.

---

## Layout

Sidebar + Topbar (sama dengan Dashboard Utama 3.1).  
Area konten: full width, list vertikal.

---

## Konten Halaman

### Header Halaman

**Komponen:** Button `primary`, Tab filter, Search bar, Dropdown sort

**Isi baris atas:**

- Judul halaman: "Proyek Saya"
- Button `primary` di kanan: "Buat Proyek Baru" → Form Buat Proyek (3.4)

**Baris filter di bawahnya:**

- Tab status: **Semua / Aktif / Tertunda / Selesai / Arsip**
- Search bar: placeholder *"Cari nama proyek atau owner..."*
- Dropdown sort: Terbaru / Deadline Terdekat / Progres Terendah

---

### Daftar Proyek

**Komponen:** Card Proyek (sama dengan Blok D di Dashboard 3.1)

Setiap Card Proyek berisi:

- Nama proyek + Badge status
- Tipe proyek + lokasi + nama owner
- Progress bar + persentase + info deadline
- Ikon foto (jumlah) + ikon laporan (jumlah)
- Button `outline-primary` "Lihat Detail"

**Perilaku:** Klik card → Detail Proyek (3.3).

---

### Empty State

**Komponen:** Empty state (ikon + heading + teks + button)

Ditampilkan jika:

- Tab "Semua" kosong → Button `primary` "Buat Proyek Pertama"
- Tab lain kosong → teks *"Tidak ada proyek dengan status ini."* tanpa button

---

## Catatan

- Proyek yang diarsipkan tidak muncul di tab "Semua" — hanya di tab "Arsip"
- Tidak ada bulk action (hapus semua, dll.) di halaman ini
