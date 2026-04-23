# Blueprint 3.1 — Dashboard Utama
**Proyek:** KontraktorPro  
**Grup:** 3 — Dashboard Kontraktor  
**Akses:** Login sebagai Kontraktor  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Halaman utama setelah login. Kontraktor mendapat gambaran menyeluruh semua proyek aktif dan aksi yang perlu dilakukan hari ini — dalam satu pandangan, tanpa perlu scroll jauh.

---

## Layout
**Desktop:** Sidebar kiri (240px) + area konten kanan dengan Topbar sticky  
**Mobile:** Topbar + konten scroll vertikal + Bottom Navigation Bar

---

## Blok Konten (Urutan Atas ke Bawah)

### Blok A — Greeting
**Komponen:** Teks dinamis

**Isi:**
- Sapaan berdasarkan waktu: *"Selamat pagi, Pak [Nama] 👋"*
- Tanggal hari ini
- 1 kalimat ringkasan situasi: *"Anda punya 3 proyek aktif. 2 laporan belum masuk hari ini."*

---

### Blok B — Kartu Statistik
**Komponen:** 4 Card KPI sejajar (grid 2x2 di mobile)

**4 kartu:**
1. **Proyek Aktif** — angka besar, sub-info jika ada yang mendekati deadline (`warning`)
2. **Laporan Hari Ini** — format "2/3", sub-info merah jika ada proyek belum laporan
3. **Progres Rata-rata** — angka % + progress bar mini
4. **Selesai Bulan Ini** — angka, sub-info jika ada yang belum dipublish ke portofolio

Setiap kartu bisa diklik — mengarah ke halaman/filter yang relevan.

---

### Blok C — Notifikasi & Reminder
**Komponen:** List item dengan ikon status warna, Button `ghost` kecil per item

**Isi:** Maksimal 5 item, urutan prioritas:
- 🔴 Laporan harian belum masuk + tombol "Ingatkan Mandor"
- 🟡 Deadline proyek dekat + tombol "Lihat Proyek"
- 🟢 Proyek selesai belum dipublish ke portofolio + tombol "Publish Sekarang"
- 🔵 Laporan PDF siap dikirim ke owner + tombol "Kirim Sekarang"

Link di bawah list: "Lihat semua notifikasi" — jika lebih dari 5 item.

---

### Blok D — Daftar Proyek Aktif
**Komponen:** Card Proyek per item, Button `primary` "Buat Proyek Baru", Tab filter

**Header blok:** Judul "Proyek Aktif" + Button `primary` "Buat Proyek Baru" di kanan + tab filter: Semua / Aktif / Tertunda

**Setiap Card Proyek berisi:**
- Nama proyek + Badge status
- Tipe proyek + lokasi + nama owner
- Progress bar + persentase + sisa hari / label merah "Telat N hari"
- Ikon foto (jumlah) + ikon laporan (jumlah)
- Button `outline-primary` "Lihat Detail"

**Perilaku:** Kartu diurutkan berdasarkan urgensi (deadline dekat atau laporan terlambat muncul di atas). Klik kartu → Detail Proyek (3.3). Maksimal 5 kartu tampil + link "Lihat Semua Proyek".

---

### Blok E — Aktivitas Terbaru
**Komponen:** Timeline vertikal  
**Posisi:** Kolom kanan di desktop (berdampingan dengan Blok D), di bawah Blok D di mobile

**Isi:** 7–10 aktivitas terbaru lintas proyek — contoh: laporan masuk, progres diupdate, laporan PDF dikirim, material dicatat. Setiap item: titik warna + waktu relatif + deskripsi singkat.

Link di bawah: "Lihat semua aktivitas"

---

### Blok F — Shortcut Aksi Cepat
**Komponen:** Grid 4 ikon + label (desktop), Floating Action Button dengan 4 pilihan (mobile)

**4 shortcut:**
- Buat Laporan Harian
- Buat Proyek Baru
- Generate Laporan PDF
- Tambah Anggota Tim

---

## State Khusus

**Empty state (baru daftar, belum ada proyek):**  
Semua blok diganti satu onboarding card besar — ilustrasi + heading "Selamat datang!" + Button `primary` "Buat Proyek Pertama" + 3 langkah onboarding singkat.

**Paket Gratis, slot proyek penuh:**  
Banner `warning` di atas dashboard: *"Batas 1 proyek aktif tercapai."* + Button "Upgrade ke Pro". Tombol "Buat Proyek Baru" di-disable dengan tooltip penjelasan.

**Semua proyek selesai:**  
Blok D menampilkan empty state dengan tombol "Buat Proyek Baru".

---

## Catatan
- Tidak ada grafik atau chart kompleks di halaman ini
- Tidak ada informasi keuangan detail (nilai kontrak, RAB)
- Tidak ada data pekerja individual — itu ada di halaman Tim (3.10)
