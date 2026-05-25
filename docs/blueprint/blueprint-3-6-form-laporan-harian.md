# Blueprint 3.6 — Form Laporan Harian
**Proyek:** KontraktorPro  
**Grup:** 3 — Dashboard Kontraktor  
**Akses:** Login sebagai Kontraktor atau Mandor (akses terbatas via link)  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Form pengisian laporan harian dari lapangan. Harus bisa diselesaikan dalam 2 menit dari HP.

---

## Dua Mode Akses

**Mode A — Mandor (via link WhatsApp):**  
Tampilan sederhana tanpa sidebar — hanya form dan topbar minimal dengan nama proyek.

**Mode B — Kontraktor (dari dalam dashboard):**  
Tampilan lengkap dengan sidebar. Bisa pilih proyek mana yang akan diisi. Bisa edit laporan yang sudah dikirim dalam 24 jam.

---

## Layout
Single column di semua breakpoint. Max-width 680px, terpusat di desktop. Tombol submit sticky di bawah layar.

---

## Struktur Form (Urutan Atas ke Bawah)

### Bagian 1 — Header Laporan
**Komponen:** Label read-only, Date picker, Pilihan visual cuaca

- Nama Proyek — label besar read-only (tidak bisa diedit)
- Lokasi proyek — teks kecil abu-abu di bawahnya
- **Tanggal Laporan** — date picker, default hari ini, tidak bisa pilih tanggal masa depan
- **Cuaca Hari Ini** — 4 pilihan visual dengan ikon tap langsung (tidak pakai dropdown): ☀️ Cerah / 🌤️ Berawan / 🌧️ Hujan Ringan / ⛈️ Hujan Lebat, wajib dipilih

---

### Bagian 2 — Item Pekerjaan
**Komponen:** List expandable per item WBS, Input number, Textarea

Penjelasan singkat di atas: *"Pilih item yang dikerjakan hari ini dan masukkan progres terbaru."*

Setiap item WBS ditampilkan sebagai baris yang bisa dicentang dan di-expand:
- Default: baris tertutup, tampilkan nama item + bobot + progres sebelumnya
- Setelah dicentang: baris expand → muncul input progres hari ini (%) + catatan opsional per item

**Validasi:**
- Progres hari ini tidak boleh lebih kecil dari progres sebelumnya
- Nilai antara 0–100
- Wajib pilih minimal 1 item

Teks di bawah list: *"Item baru harus ditambahkan dari halaman WBS oleh kontraktor."*

---

### Bagian 3 — Jumlah Pekerja
**Komponen:** Stepper (input number dengan tombol + dan -)

- **Total Pekerja Hadir** — stepper, default: jumlah pekerja hari sebelumnya, minimum 0
- **Catatan Kehadiran** — input text singkat, opsional, placeholder: *"Contoh: 2 tukang tidak hadir karena sakit"*

---

### Bagian 4 — Upload Foto
**Komponen:** 2 Button upload, Thumbnail grid, Modal preview watermark

Penjelasan singkat: *"Minimal 1 foto. Watermark ditambahkan otomatis saat disimpan."*

- Button `primary` "📷 Ambil Foto Sekarang" — buka kamera HP
- Button `outline-primary` "🖼️ Pilih dari Galeri"
- Area preview: grid 2 kolom (mobile) / 3 kolom (desktop) — setiap thumbnail ada tombol ✕ hapus
- Tap thumbnail → buka modal isi caption opsional
- Link kecil: "Lihat contoh watermark" → modal preview watermark

**Validasi:** Minimal 1 foto, maksimal 10 foto. Format: JPG, PNG, HEIC. Maks 10MB per foto (dikompres otomatis).

---

### Bagian 5 — Catatan & Kendala
**Komponen:** Textarea, Toggle switch, Checkbox group

- **Catatan Harian** — textarea, opsional, maks 1000 karakter dengan counter
- **Toggle "Ada kendala hari ini?"** — default: Tidak
  - Jika Ya: muncul checkbox group tipe kendala (Cuaca / Material / Pekerja / Peralatan / Instruksi owner / Lainnya) + textarea detail kendala

---

### Bagian 6 — Ringkasan Sebelum Submit
**Komponen:** Card ringkasan read-only

Card berisi: nama proyek / tanggal / cuaca / jumlah item diupdate / jumlah foto / status kendala.  
Field wajib yang belum diisi: ditandai border merah + pesan error spesifik.

---

### Tombol Submit (Sticky Bottom)
**Komponen:** Button `primary` full-width, sticky

- State normal: "Kirim Laporan" (oranye)
- State disabled: "Lengkapi form dulu" (abu) — jika ada field wajib kosong
- State loading: spinner + "Menyimpan laporan..."
- State sukses: hijau + centang + "Laporan Terkirim!" → redirect ke halaman konfirmasi

Teks mikro di bawah button: *"Laporan yang dikirim masih bisa diedit dalam 24 jam."*

---

## Halaman Konfirmasi Setelah Submit
**Layout:** Centered, single column  
**Komponen:** Ikon centang besar, 3 Button pilihan aksi

**Isi:**
- Ikon centang hijau besar
- Heading `h2`: *"Laporan Berhasil Dikirim!"*
- Sub-info: tanggal + nama proyek
- Teks: *"Foto dokumentasi sudah diberi watermark otomatis."*
- 3 pilihan: Button `primary` "Lihat Laporan" / Button `outline-primary` "Kembali ke Proyek" / Button `ghost` "Kembali ke Dashboard"

---

## State Khusus

**Laporan sudah ada hari ini:**  
Banner `warning` di atas form: *"Laporan untuk hari ini sudah dikirim. Anda sedang membuat laporan tambahan."*

**Proyek belum punya WBS:**  
Bagian item pekerjaan diganti pesan: *"WBS belum dibuat."* + Button `primary` "Buat WBS Sekarang" (hanya tampil di Mode B/kontraktor). Mandor hanya bisa upload foto dan catatan.

**Koneksi terputus:**  
Banner kecil di atas: *"Tidak ada koneksi. Laporan akan dikirim otomatis saat koneksi kembali."* Form tetap bisa diisi — disimpan sebagai draft lokal.

---

## Notifikasi Reminder Otomatis
| Trigger | Aksi |
|---|---|
| Pukul 17.00, belum ada laporan | Push notification ke mandor |
| Pukul 19.00, masih belum ada | Notifikasi ke kontraktor |
| 3 hari berturut tanpa laporan | Badge merah di kartu proyek di dashboard |

Reminder hanya aktif untuk proyek berstatus Aktif.

---

## Catatan
- Tidak ada field nilai upah atau biaya
- Tidak ada notifikasi otomatis ke owner saat laporan disubmit
- Tidak ada fitur komentar di laporan — komunikasi tetap via WhatsApp
- Touch target semua elemen di mobile: minimum 44px
