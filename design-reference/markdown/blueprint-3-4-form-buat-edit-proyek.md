# Blueprint 3.4 — Form Buat / Edit Proyek
**Proyek:** KontraktorPro  
**Grup:** 3 — Dashboard Kontraktor  
**Akses:** Login sebagai Kontraktor  
**Referensi:** Design System KontraktorPro

---

## Tujuan Halaman
Form input untuk membuat proyek baru atau mengedit informasi proyek yang sudah ada. Harus bisa diselesaikan dalam 3 menit.

---

## Layout
**Buat Proyek:** Halaman penuh dengan sidebar + topbar. Form terpusat max-width 640px.  
**Edit Proyek:** Modal overlay di atas halaman Detail Proyek (3.3), bukan halaman terpisah.

---

## Konten Form

### Header
- Breadcrumb (mode buat): Dashboard > Proyek Saya > Buat Proyek Baru
- Judul: "Buat Proyek Baru" atau "Edit Informasi Proyek"

---

### Grup 1 — Informasi Dasar
**Komponen:** Input text, Dropdown, Textarea

**Field:**
1. **Nama Proyek** — input text, wajib, placeholder: *"Contoh: Renovasi Rumah Pak Hasan"*
2. **Tipe Proyek** — dropdown: Rumah Tinggal Baru / Renovasi / Ruko / Gedung / Lainnya, wajib
3. **Nama Owner / Klien** — input text, wajib
4. **Lokasi / Alamat Proyek** — textarea singkat, wajib

---

### Grup 2 — Jadwal & Nilai
**Komponen:** Date picker, Input number

**Field:**
5. **Tanggal Mulai** — date picker, wajib
6. **Target Selesai** — date picker, wajib — validasi: tidak boleh sebelum tanggal mulai
7. **Nilai Kontrak** — input number format rupiah, opsional — label kecil: *"Hanya terlihat oleh Anda"*

---

### Grup 3 — Template WBS (Hanya Mode Buat Proyek)
**Komponen:** Radio card pilihan template

**Isi:**
- Label: "Pilih template WBS awal (bisa diubah nanti)"
- 4 opsi sebagai radio card: Rumah 1 Lantai / Renovasi / Ruko / Mulai dari Kosong
- Setiap card: nama template + deskripsi singkat item yang termasuk
- Default terpilih: sesuai Tipe Proyek yang dipilih di Grup 1

---

### Tombol Aksi
- Button `primary` full-width: "Buat Proyek" / "Simpan Perubahan"
- Button `ghost` di kiri: "Batal" → kembali ke halaman sebelumnya

---

## State Khusus

**Paket Gratis, slot proyek penuh:**  
Form tidak bisa diakses — redirect ke halaman Langganan (3.13) dengan pesan *"Upgrade paket untuk membuat lebih banyak proyek."*

---

## Alur Setelah Submit (Mode Buat)
1. Proyek berhasil dibuat
2. Jika pilih template WBS → WBS otomatis terisi sesuai template
3. Redirect ke Detail Proyek (3.3) tab WBS dengan toast success
4. Jika template kosong → muncul prompt: *"WBS belum ada. Tambahkan item pekerjaan sekarang?"* dengan Button "Tambah Sekarang" dan Button "Nanti Saja"

---

## Catatan
- Tidak ada field foto cover proyek di form ini — foto proyek berasal dari laporan harian
- Nomor HP owner tidak dikumpulkan di sini — owner tidak punya akun di platform
