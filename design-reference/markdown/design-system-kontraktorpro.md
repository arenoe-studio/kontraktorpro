# Design System — KontraktorPro
### Dokumen Referensi Desain (Format-Agnostic)

---

## Pendahuluan

Design system ini adalah **satu-satunya sumber kebenaran visual** untuk seluruh produk KontraktorPro. Setiap halaman, komponen, dan elemen UI yang dibangun harus merujuk ke dokumen ini agar produk terasa konsisten dari satu ujung ke ujung lainnya.

Dokumen ini terdiri dari lima lapisan:

1. **Foundation** — token desain dasar (warna, tipografi, spacing, shadow, radius)
2. **Komponen** — elemen UI yang dapat digunakan ulang (button, badge, card, form, dll.)
3. **Pola Layout** — struktur halaman yang konsisten (sidebar, topbar, grid)
4. **Panduan Penggunaan** — kapan dan bagaimana menggunakan setiap elemen
5. **Prinsip Desain** — filosofi yang mendasari setiap keputusan visual

---

## BAGIAN 1 — Foundation (Token Desain)

---

### 1.1 Warna

Semua warna didefinisikan sebagai token bernama. Gunakan nama token, bukan nilai hex langsung, agar mudah diubah secara global.

#### Palet Utama

| Token | Nilai Hex | Penggunaan |
|---|---|---|
| `color-primary-900` | `#0F2338` | Background section gelap, footer |
| `color-primary-800` | `#1B3A5C` | Warna primary utama — navbar, sidebar, heading dark |
| `color-primary-700` | `#1E4A73` | Hover state elemen primary |
| `color-primary-600` | `#245D8F` | Border atau outline elemen primary |
| `color-primary-100` | `#E8F0F8` | Background chip/tag berwarna biru muda |
| `color-primary-50`  | `#F0F6FC` | Background section dengan nuansa biru sangat tipis |

#### Palet Aksen (Safety Orange)

| Token | Nilai Hex | Penggunaan |
|---|---|---|
| `color-accent-600` | `#EA6A0A` | Hover state CTA utama |
| `color-accent-500` | `#F97316` | CTA utama, highlight paket populer, elemen kritis |
| `color-accent-400` | `#FB923C` | State active pada elemen aksen |
| `color-accent-100` | `#FEF0E6` | Background badge aksen, highlight row tabel |
| `color-accent-50`  | `#FFF7F0` | Background section dengan nuansa oranye sangat tipis |

#### Palet Netral

| Token | Nilai Hex | Penggunaan |
|---|---|---|
| `color-neutral-900` | `#111827` | Teks heading utama |
| `color-neutral-700` | `#374151` | Teks body reguler |
| `color-neutral-500` | `#6B7280` | Teks sekunder, placeholder, label form |
| `color-neutral-300` | `#D1D5DB` | Border, divider, outline elemen disabled |
| `color-neutral-200` | `#E5E7EB` | Background input disabled, border tipis |
| `color-neutral-100` | `#F4F5F6` | Background section abu-abu terang |
| `color-neutral-50`  | `#F9FAFB` | Background halaman default |
| `color-white`       | `#FFFFFF` | Background kartu, modal, surface utama |

#### Palet Semantik (Status)

| Token | Nilai Hex | Penggunaan |
|---|---|---|
| `color-success-700` | `#15803D` | Teks status sukses |
| `color-success-500` | `#16A34A` | Ikon, badge, indikator sukses |
| `color-success-100` | `#DCFCE7` | Background badge sukses |
| `color-warning-700` | `#B45309` | Teks status peringatan |
| `color-warning-500` | `#F59E0B` | Badge, border, ikon peringatan |
| `color-warning-100` | `#FEF3C7` | Background badge peringatan |
| `color-danger-700`  | `#B91C1C` | Teks status bahaya/error |
| `color-danger-500`  | `#EF4444` | Badge, border, ikon bahaya |
| `color-danger-100`  | `#FEE2E2` | Background badge bahaya |
| `color-info-700`    | `#1D4ED8` | Teks status informasi |
| `color-info-500`    | `#3B82F6` | Badge, ikon informasi |
| `color-info-100`    | `#DBEAFE` | Background badge informasi |

#### Aturan Penggunaan Warna

- Oranye (`color-accent-500`) **hanya** digunakan untuk CTA utama, badge "Paling Populer", dan elemen yang butuh perhatian segera. Tidak boleh tersebar sebagai dekorasi.
- Biru tua (`color-primary-800`) adalah warna identitas — gunakan untuk navbar, sidebar, heading di atas background gelap.
- Teks di atas background gelap (`color-primary-800` ke atas) **wajib** menggunakan `color-white` atau `color-neutral-50`.
- Jangan gunakan warna semantik (success, warning, danger) untuk tujuan dekoratif.

---

### 1.2 Tipografi

#### Font Family

| Token | Nilai | Penggunaan |
|---|---|---|
| `font-heading` | `'Plus Jakarta Sans', sans-serif` | Semua heading (H1–H4) |
| `font-body` | `'Inter', sans-serif` | Body text, label, UI teks umum |
| `font-mono` | `'JetBrains Mono', monospace` | Angka statistik, kode, ID proyek |

Fallback stack jika font tidak tersedia: `system-ui, -apple-system, sans-serif`

#### Skala Tipografi

| Token | Ukuran | Line Height | Weight | Penggunaan |
|---|---|---|---|---|
| `text-display` | 48px / 3rem | 1.15 | 800 | Heading hero section |
| `text-h1` | 36px / 2.25rem | 1.2 | 700 | Heading utama halaman |
| `text-h2` | 28px / 1.75rem | 1.25 | 700 | Heading section |
| `text-h3` | 22px / 1.375rem | 1.3 | 600 | Sub-heading section |
| `text-h4` | 18px / 1.125rem | 1.35 | 600 | Heading kartu, grup form |
| `text-body-lg` | 16px / 1rem | 1.6 | 400 | Body teks utama |
| `text-body` | 14px / 0.875rem | 1.6 | 400 | Body teks standar UI |
| `text-body-sm` | 13px / 0.8125rem | 1.5 | 400 | Teks sekunder, caption |
| `text-label` | 12px / 0.75rem | 1.4 | 500 | Label form, badge teks, tag |
| `text-micro` | 11px / 0.6875rem | 1.4 | 400 | Timestamp, footer note |
| `text-stat` | 32px / 2rem | 1.1 | 700 | Angka statistik di kartu KPI |

#### Aturan Tipografi

- Heading selalu menggunakan `font-heading`. Body selalu menggunakan `font-body`.
- Ukuran minimum teks yang dapat dibaca adalah `text-label` (12px). Jangan gunakan ukuran di bawah ini di dalam konten.
- Di mobile, `text-display` turun ke 32px dan `text-h1` turun ke 28px.
- Angka penting (progres %, nilai rupiah, jumlah proyek) gunakan `font-mono` agar rapi saat berjajar.

---

### 1.3 Spacing

Semua spacing menggunakan skala 4px sebagai unit dasar.

| Token | Nilai | Penggunaan Umum |
|---|---|---|
| `space-1` | 4px | Gap antar ikon dan label, padding micro |
| `space-2` | 8px | Padding dalam badge, gap elemen inline |
| `space-3` | 12px | Gap antar elemen dalam satu grup |
| `space-4` | 16px | Padding internal komponen kecil (button, input) |
| `space-5` | 20px | Gap antar komponen berdampingan |
| `space-6` | 24px | Padding internal kartu, gap grid kompak |
| `space-8` | 32px | Padding section dalam halaman |
| `space-10` | 40px | Gap antar blok konten |
| `space-12` | 48px | Padding section besar |
| `space-16` | 64px | Jarak antar section di landing page |
| `space-20` | 80px | Padding section hero |
| `space-24` | 96px | Padding section terbesar |

#### Aturan Spacing

- Konsistensi > preferensi pribadi. Selalu gunakan token, bukan angka arbitrari (misal: jangan `padding: 13px`).
- Jarak antar section di landing page minimal `space-16` (64px).
- Jarak antar komponen di dalam satu kartu atau panel menggunakan `space-4` hingga `space-6`.

---

### 1.4 Border Radius

| Token | Nilai | Penggunaan |
|---|---|---|
| `radius-sm` | 4px | Input field, dropdown, tooltip |
| `radius-md` | 8px | Button, badge, chip |
| `radius-lg` | 12px | Kartu proyek, kartu statistik, panel |
| `radius-xl` | 16px | Modal, kartu hero besar |
| `radius-2xl` | 24px | Section card, featured card |
| `radius-full` | 9999px | Avatar, toggle switch, pill badge |

---

### 1.5 Shadow (Elevation)

| Token | Nilai CSS | Penggunaan |
|---|---|---|
| `shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | Input focus, subtle elevation |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)` | Kartu default, badge |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)` | Kartu hover, dropdown |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)` | Modal, sidebar |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.04)` | Floating action button |
| `shadow-navbar` | `0 2px 8px rgba(27,58,92,0.12)` | Navbar saat scroll |

---

### 1.6 Breakpoint

| Token | Nilai | Target Device |
|---|---|---|
| `screen-sm` | 640px | HP kecil (landscape) |
| `screen-md` | 768px | Tablet portrait |
| `screen-lg` | 1024px | Tablet landscape, laptop kecil |
| `screen-xl` | 1280px | Laptop / desktop standar |
| `screen-2xl` | 1536px | Desktop lebar |

Pendekatan: **mobile-first**. Desain dimulai dari lebar minimum (~375px) lalu diperluas ke atas.

---

### 1.7 Z-Index

| Token | Nilai | Penggunaan |
|---|---|---|
| `z-base` | 0 | Elemen default |
| `z-raised` | 10 | Kartu hover, elemen terangkat |
| `z-dropdown` | 100 | Dropdown menu, tooltip |
| `z-sticky` | 200 | Sidebar, sticky header |
| `z-overlay` | 300 | Overlay gelap (backdrop modal) |
| `z-modal` | 400 | Modal dialog |
| `z-toast` | 500 | Toast notification |

---

## BAGIAN 2 — Komponen UI

---

### 2.1 Button

#### Varian

**Primary (Solid Oranye)**
Digunakan untuk aksi utama — CTA paling penting di halaman.

```
Background : color-accent-500
Teks       : color-white
Border     : none
Hover      : color-accent-600
Active     : color-accent-600 + shadow-xs inset
Disabled   : color-neutral-300, teks color-neutral-500, cursor not-allowed
```

**Secondary (Solid Biru)**
Digunakan untuk aksi sekunder yang tetap penting tapi bukan yang utama.

```
Background : color-primary-800
Teks       : color-white
Border     : none
Hover      : color-primary-700
Disabled   : sama seperti Primary Disabled
```

**Outline Primary**
Digunakan untuk aksi yang ada tapi tidak perlu menonjol.

```
Background : transparent
Teks       : color-primary-800
Border     : 1.5px solid color-primary-800
Hover      : Background color-primary-50
```

**Outline Danger**
Digunakan untuk aksi destruktif (hapus, tolak, suspend) yang perlu konfirmasi.

```
Background : transparent
Teks       : color-danger-700
Border     : 1.5px solid color-danger-500
Hover      : Background color-danger-100
```

**Ghost**
Digunakan untuk aksi tersier — link-like tapi berbentuk button.

```
Background : transparent
Teks       : color-primary-800
Border     : none
Hover      : Background color-neutral-100
```

#### Ukuran

| Ukuran | Padding | Font | Radius | Penggunaan |
|---|---|---|---|---|
| `btn-sm` | 6px 12px | text-label (12px) | radius-md | Aksi dalam tabel, kartu kompak |
| `btn-md` | 10px 20px | text-body (14px) | radius-md | Default — sebagian besar UI |
| `btn-lg` | 14px 28px | text-body-lg (16px) | radius-md | CTA di hero, section CTA |
| `btn-xl` | 16px 36px | 18px, weight 600 | radius-md | CTA final yang sangat dominan |

#### Aturan Button

- Setiap halaman hanya boleh punya **satu** button Primary yang visible sekaligus. Jika ada lebih dari satu CTA penting, gunakan hirarki Primary + Secondary/Outline.
- Button harus punya minimum touch target 44x44px di mobile — jika button secara visual lebih kecil, padding transparan harus memperluas area tap.
- Selalu sertakan state `disabled` yang jelas — jangan hanya opacity 50% tanpa `cursor: not-allowed`.
- Ikon di dalam button: ikon di sebelah kiri label, gap `space-2` (8px).

---

### 2.2 Badge & Tag

Badge digunakan untuk menampilkan status, kategori, atau label pendek (1–3 kata).

#### Varian Badge Status

| Varian | Background | Teks | Penggunaan |
|---|---|---|---|
| `badge-success` | color-success-100 | color-success-700 | Status Aktif, Selesai, Approved |
| `badge-warning` | color-warning-100 | color-warning-700 | Status Tertunda, Menunggu Review |
| `badge-danger` | color-danger-100 | color-danger-700 | Status Suspend, Ditolak, Telat |
| `badge-info` | color-info-100 | color-info-700 | Status Informasi, Baru |
| `badge-neutral` | color-neutral-200 | color-neutral-700 | Status Gratis, Tidak Aktif |
| `badge-primary` | color-primary-100 | color-primary-800 | Label Pro, kategori |
| `badge-accent` | color-accent-100 | color-accent-600 | Badge "Paling Populer", highlight |

#### Ukuran Badge

| Ukuran | Padding | Font | Radius |
|---|---|---|---|
| `badge-sm` | 2px 8px | text-micro (11px) | radius-full |
| `badge-md` | 4px 10px | text-label (12px) | radius-full |
| `badge-lg` | 6px 12px | text-body-sm (13px) | radius-full |

#### Badge dengan Titik Indikator

Untuk status yang butuh indikator visual cepat, tambahkan titik warna di kiri teks:

```
● Aktif       → titik color-success-500
● Tertunda    → titik color-warning-500
● Bermasalah  → titik color-danger-500
● Online      → titik color-success-500 dengan animasi pulse
```

#### Badge Angka (Notification Badge)

Digunakan di atas ikon notifikasi atau menu sidebar:

```
Background : color-danger-500
Teks       : color-white, text-micro, font-mono
Ukuran     : min 18px x 18px, radius-full
Posisi     : absolute, pojok kanan atas elemen parent
Jika > 99  : tampilkan "99+"
```

---

### 2.3 Card

#### Card Default

Digunakan untuk menampilkan satu unit informasi yang berdiri sendiri.

```
Background : color-white
Border     : 1px solid color-neutral-200
Radius     : radius-lg (12px)
Shadow     : shadow-sm
Padding    : space-6 (24px)
Hover      : shadow-md, border color-neutral-300 (jika card clickable)
```

#### Card Proyek (Project Card)

Card khusus untuk menampilkan ringkasan proyek di dashboard.

Struktur internal:
```
[Header]
  - Nama Proyek (text-h4, color-neutral-900)
  - Badge Status (badge-success / badge-warning / badge-danger)

[Body]
  - Tipe proyek + lokasi (text-body-sm, color-neutral-500)
  - Nama owner (text-body-sm, color-neutral-500)
  - Progress Bar (lihat komponen Progress Bar)
  - Label progres: "67% selesai"
  - Deadline: "Sisa 23 hari" atau merah "Telat 2 hari"

[Footer]
  - Ikon foto + jumlah
  - Ikon laporan + jumlah
  - Tombol "Lihat Detail" (btn-sm, outline primary)
```

#### Card Statistik (KPI Card)

Card untuk menampilkan satu angka metrik penting.

Struktur internal:
```
[Baris atas]
  - Label (text-label, color-neutral-500)
  - Ikon (24px, warna sesuai konteks)

[Angka utama]
  - Nilai (text-stat, font-mono, color-neutral-900)

[Baris bawah]
  - Tren / sub-info (text-body-sm)
  - Hijau jika positif, merah jika perlu perhatian
```

Warna border kiri kartu (4px, bisa digunakan untuk memberi identitas cepat):
```
Proyek aktif  → border-left: color-primary-800
Laporan       → border-left: color-accent-500
Progres       → border-left: color-success-500
Selesai       → border-left: color-success-500
```

#### Card Pricing

Card untuk menampilkan paket langganan.

```
[Header]
  - Nama paket (text-h3)
  - Badge paket (opsional — "Paling Populer" dengan badge-accent)

[Harga]
  - Nilai rupiah (text-display, font-mono)
  - "/bulan" (text-body, color-neutral-500)
  - "Selamanya Gratis" jika paket gratis

[Fitur List]
  - Setiap item: ikon centang hijau + teks (text-body)
  - Item tidak tersedia: ikon silang abu + teks abu

[CTA]
  - Button full-width sesuai level kartu
```

Kartu "Paling Populer" mendapat perlakuan khusus:
```
Border     : 2px solid color-accent-500
Shadow     : shadow-lg
Scale      : sedikit lebih besar (transform: scale(1.03)) di desktop
Background : color-white
```

---

### 2.4 Form Elements

#### Input Text

```
Height     : 44px (mobile-friendly)
Padding    : space-3 space-4 (12px 16px)
Font       : text-body (14px), color-neutral-900
Border     : 1px solid color-neutral-300
Radius     : radius-sm (4px)
Background : color-white
Placeholder: color-neutral-500

Focus      : border color-primary-800, shadow-xs (outline biru)
Error      : border color-danger-500, shadow tipis merah
Disabled   : background color-neutral-200, teks color-neutral-500
```

#### Input dengan Label

Setiap field form harus punya label di atas input:

```
Label      : text-label (12px), weight 500, color-neutral-700
Gap label ke input: space-2 (8px)
Helper text: text-micro (11px), color-neutral-500, di bawah input
Error text : text-micro (11px), color-danger-700, di bawah input
```

#### Textarea

```
Semua properti sama dengan Input Text
Min-height : 100px
Resize     : vertical saja
```

#### Select / Dropdown

```
Semua properti sama dengan Input Text
Tambahkan ikon chevron-down di kanan
Dropdown panel: shadow-md, radius-md, border color-neutral-200
Item hover   : background color-neutral-50
Item active  : background color-primary-50, teks color-primary-800
```

#### Checkbox & Radio

```
Ukuran     : 18px x 18px
Border     : 1.5px solid color-neutral-400
Radius     : radius-sm (checkbox), radius-full (radio)
Checked    : background color-primary-800, ikon centang putih
Focus ring : shadow tipis color-primary-800
```

#### Toggle Switch

```
Track OFF  : background color-neutral-300
Track ON   : background color-primary-800
Thumb      : color-white, shadow-sm
Lebar      : 44px, Tinggi: 24px
Radius     : radius-full
Transition : 0.2s ease
```

#### Form Group

Gunakan jarak `space-5` (20px) antar field dalam satu form. Gunakan `space-8` (32px) untuk memisahkan grup form yang berbeda topik. Setiap grup boleh diberi heading `text-h4` di atasnya.

---

### 2.5 Progress Bar

Digunakan untuk menampilkan progres pekerjaan.

#### Linear Progress Bar

```
Height     : 8px (default), 12px (besar/prominent)
Background : color-neutral-200
Fill       : warna sesuai persentase
Radius     : radius-full

Warna fill berdasarkan progres:
  0–30%    → color-danger-500 (merah — perlu perhatian)
  31–60%   → color-warning-500 (kuning — on track)
  61–90%   → color-primary-800 (biru — bagus)
  91–100%  → color-success-500 (hijau — hampir/sudah selesai)
```

Label progres selalu ditampilkan di kanan progress bar: `"67%"` dengan `text-label, font-mono`.

#### Progress Bar WBS (per Item Pekerjaan)

Progress bar yang lebih tebal (16px) digunakan di halaman Detail Proyek untuk menampilkan progres per item WBS. Dilengkapi label item di kiri dan persentase di kanan.

---

### 2.6 Navigasi

#### Navbar (Landing Page)

```
Height         : 64px
Background     : color-white (default), color-white + shadow-navbar (saat scroll)
Padding        : 0 space-8 (0 32px)
Position       : fixed, top 0, z-sticky

Logo           : kiri, tinggi 32px
Menu tengah    : text-body, color-neutral-700, hover color-primary-800
Tombol Masuk   : btn-md, outline primary
Tombol Daftar  : btn-md, primary (oranye)
Gap antar menu : space-8 (32px)

Mobile (<768px):
  - Menu tengah disembunyikan
  - Hamburger icon di kanan (menggantikan menu)
  - Tombol "Daftar Gratis" tetap tampil di sebelah hamburger
```

#### Sidebar (Dashboard Kontraktor)

```
Lebar          : 240px
Background     : color-primary-800
Teks default   : color-white, opacity 0.75
Teks active    : color-white, opacity 1
Position       : fixed, z-sticky
Height         : 100vh

Menu item:
  Padding      : 10px space-4 (10px 16px)
  Radius       : radius-md
  Gap ikon–label: space-3 (12px)
  Ikon         : 20px

  Default      : background transparent
  Hover        : background rgba(255,255,255,0.08)
  Active       : background rgba(255,255,255,0.15), border-left 3px solid color-accent-500

Divider antar grup menu:
  Height       : 1px
  Background   : rgba(255,255,255,0.10)
  Margin       : space-3 space-4

Bottom section (Status Paket):
  Background   : rgba(0,0,0,0.20)
  Padding      : space-4
  Radius       : radius-lg
  Margin       : space-4

Mobile (<768px):
  Sidebar hilang, diganti Bottom Navigation Bar
```

#### Sidebar Admin

```
Semua properti sama dengan Sidebar Kontraktor
Tambahan: badge "ADMIN" merah kecil di samping logo
Warna background bisa sedikit lebih gelap: color-primary-900
```

#### Bottom Navigation Bar (Mobile Dashboard)

```
Height     : 56px
Background : color-white
Border-top : 1px solid color-neutral-200
Shadow     : 0 -2px 8px rgba(0,0,0,0.06)
Position   : fixed, bottom 0, z-sticky

5 item maks:
  Ikon       : 24px
  Label      : text-micro (11px)
  Gap ikon–label: space-1 (4px)
  Active     : ikon + label color-primary-800
  Inactive   : ikon + label color-neutral-500
```

#### Topbar (Dashboard)

```
Height     : 60px
Background : color-white
Border-bottom: 1px solid color-neutral-200
Padding    : 0 space-6 (0 24px)
Position   : sticky, top 0, z-sticky

Konten: Judul halaman (kiri) | Search bar (tengah) | Notifikasi + Avatar (kanan)
```

---

### 2.7 Tabel

```
Background header : color-neutral-50
Teks header       : text-label (12px), weight 600, color-neutral-500, uppercase
Border bawah header: 2px solid color-neutral-200

Row default       : background color-white
Row hover         : background color-neutral-50
Row active/selected: background color-primary-50
Border antar row  : 1px solid color-neutral-100

Padding per cell  : space-3 space-4 (12px 16px)
Font isi          : text-body (14px), color-neutral-700
```

#### Kolom Aksi di Tabel

Kolom aksi selalu di paling kanan. Gunakan:
- `btn-sm outline primary` untuk aksi utama ("Lihat")
- Ikon titik tiga `...` dengan dropdown untuk aksi lainnya

---

### 2.8 Modal & Dialog

```
Overlay    : rgba(0,0,0,0.50), z-overlay
Panel      : background color-white, radius-xl, shadow-xl, z-modal
Lebar      : 480px (default), 640px (besar), 360px (kecil/konfirmasi)
Padding    : space-8 (32px)

Header modal:
  - Judul (text-h3)
  - Tombol X (kanan atas, ghost, 32x32px)
  - Border bawah: 1px solid color-neutral-200

Body modal:
  - Konten utama
  - Padding-top: space-6

Footer modal:
  - Border atas: 1px solid color-neutral-200
  - Padding-top: space-6
  - Layout: tombol di kanan, "Batal" di kiri tombol utama
  - Gap antar tombol: space-3 (12px)
```

#### Dialog Konfirmasi (Destructive)

Untuk aksi tidak bisa dibatalkan (hapus, suspend):

```
Ikon besar di atas: ikon peringatan, color-danger-500, 48px
Heading: text-h3, color-danger-700
Body teks: text-body, color-neutral-700 — jelaskan konsekuensi
Tombol: "Batal" (outline) di kiri, "Hapus Permanen" (btn-danger solid) di kanan
Opsional: field input "ketik nama untuk konfirmasi" untuk aksi paling kritis
```

---

### 2.9 Toast Notification

Notifikasi singkat yang muncul sementara di pojok layar.

```
Posisi     : pojok kanan bawah, z-toast
Lebar      : 320px
Padding    : space-4 space-5 (16px 20px)
Radius     : radius-lg
Shadow     : shadow-lg
Duration   : tampil 4 detik, fade out 0.3 detik

Varian:
  success  → border-left 4px color-success-500, ikon centang
  warning  → border-left 4px color-warning-500, ikon segitiga
  danger   → border-left 4px color-danger-500, ikon silang
  info     → border-left 4px color-info-500, ikon info

Tombol tutup (X) di kanan atas toast.
Maksimal 3 toast tampil bersamaan — yang lebih lama didorong ke atas.
```

---

### 2.10 Empty State

Digunakan saat suatu daftar atau area konten kosong.

```
Layout     : tengah secara vertikal dan horizontal
Ilustrasi  : SVG sederhana (line art), 120px
Heading    : text-h4, color-neutral-700
Subtext    : text-body, color-neutral-500, max-width 320px
CTA        : tombol Primary (jika ada aksi yang bisa dilakukan)
Padding    : space-16 atas-bawah
```

Contoh teks empty state per konteks:
- Belum ada proyek: *"Belum ada proyek aktif. Mulai dengan membuat proyek pertama Anda."*
- Belum ada laporan: *"Belum ada laporan masuk hari ini."*
- Antrian moderasi kosong: *"Semua konten sudah ditinjau. Tidak ada antrian."*

---

### 2.11 Ikon

Gunakan library ikon tunggal: **Lucide Icons** (open source, konsisten, tersedia di berbagai format).

```
Ukuran standar:
  Ikon dalam button  : 16px
  Ikon menu sidebar  : 20px
  Ikon standalone UI : 24px
  Ikon ilustrasi kecil: 32px
  Ikon empty state   : 48px

Stroke width: 1.5px (default Lucide)
Warna: mengikuti konteks — jangan hardcode warna ikon secara independen
```

---

### 2.12 Avatar

```
Ukuran     : 24px (micro), 32px (kecil), 40px (sedang), 48px (besar), 64px (profil)
Radius     : radius-full (lingkaran)
Border     : 2px solid color-white (saat avatar tampil di atas background gelap)

Fallback (jika tidak ada foto):
  Background: color-primary-100
  Teks       : inisial nama (1–2 karakter), text-label, weight 600, color-primary-800
```

---

## BAGIAN 3 — Pola Layout

---

### 3.1 Layout Halaman Publik (Landing Page)

```
Max-width konten : 1200px
Margin auto      : kiri dan kanan
Padding samping  : space-8 (32px) desktop, space-4 (16px) mobile

Section structure:
  Setiap section: padding atas-bawah space-16 (64px) desktop, space-12 (48px) mobile
  Section pertama setelah navbar: padding-top space-20 (80px) untuk compensate fixed navbar

Grid system:
  Desktop : 12 kolom, gap space-6 (24px)
  Tablet  : 8 kolom, gap space-5 (20px)
  Mobile  : 4 kolom, gap space-4 (16px)
```

### 3.2 Layout Dashboard (App Layout)

```
Sidebar kiri : 240px, fixed
Area konten  : flex-1, overflow-y scroll
Topbar       : sticky, height 60px

Padding area konten: space-6 (24px) desktop, space-4 (16px) tablet/mobile

Grid kartu statistik:
  Desktop : 4 kolom
  Tablet  : 2 kolom
  Mobile  : 2 kolom (kartu lebih kompak)

Grid daftar proyek:
  Desktop : list vertikal penuh lebar (kartu horizontal)
  Mobile  : list vertikal, kartu vertikal yang lebih kompak
```

### 3.3 Layout Dua Kolom (Konten + Sidebar Kanan)

Digunakan di halaman detail dan dashboard section yang butuh split info:

```
Kolom kiri (konten utama) : 65%
Kolom kanan (sidebar info): 35%
Gap                       : space-6 (24px)

Mobile: keduanya menjadi 1 kolom penuh, sidebar kanan pindah ke bawah konten utama
```

### 3.4 Layout Form

```
Lebar form max  : 640px (form halaman penuh), 480px (form dalam modal)
Label di atas input (bukan inline)
Satu kolom untuk mobile, bisa 2 kolom untuk desktop jika field pendek

Tombol submit:
  Selalu di bawah, posisi kanan
  "Batal" di kiri tombol submit
  Gap space-3 (12px)
```

---

## BAGIAN 4 — Panduan Penggunaan

---

### 4.1 Hierarki CTA per Halaman

Setiap halaman hanya boleh punya **satu** aksi utama (Primary button oranye). Aturan:

| Level | Warna | Jumlah per Halaman |
|---|---|---|
| Primary | Oranye solid | Maks. 1 yang visible sekaligus |
| Secondary | Biru solid | Maks. 2 |
| Outline | Biru/abu outline | Tidak dibatasi, tapi jangan berlebihan |
| Ghost/Teks | Tanpa border | Untuk aksi minor |

### 4.2 Penggunaan Warna Status

Jangan gunakan warna hanya karena terlihat menarik. Setiap warna semantik punya makna yang harus konsisten:

- **Hijau** = selesai, berhasil, aktif, disetujui
- **Kuning/Oranye** = peringatan, menunggu, hampir habis, perlu perhatian
- **Merah** = error, gagal, berbahaya, terlambat, perlu segera ditindak
- **Biru** = informasi netral, progres normal, navigasi

### 4.3 Teks pada Background Gelap

Saat menempatkan teks di atas `color-primary-800` atau lebih gelap:
- Heading: `color-white`
- Body/subtext: `rgba(255,255,255,0.75)`
- Label/caption: `rgba(255,255,255,0.55)`

Jangan gunakan `color-neutral-700` atau teks gelap apapun di atas background biru tua.

### 4.4 Responsivitas — Prioritas Mobile

Semua halaman yang diakses kontraktor dan mandor harus didesain mobile-first. Urutan prioritas:

1. Mobile (<768px) — desain di sini dulu
2. Tablet (768–1024px) — sesuaikan
3. Desktop (>1024px) — tambah layout yang memanfaatkan ruang

Pengecualian: Admin Dashboard hanya perlu desktop (>1024px). Jika diakses dari mobile, tampilkan banner rekomendasi buka di layar lebih besar.

### 4.5 Loading & Skeleton State

Saat data sedang di-load, jangan tampilkan halaman kosong. Gunakan skeleton loading:

```
Skeleton bar      : background color-neutral-200, animasi shimmer (kiri ke kanan)
Warna shimmer     : gradasi color-neutral-200 → color-neutral-100 → color-neutral-200
Radius skeleton   : sama seperti elemen aslinya (kartu pakai radius-lg, teks pakai radius-sm)
Durasi animasi    : 1.5 detik, loop
```

Skeleton ditampilkan di posisi dan ukuran yang sama persis dengan konten aslinya agar tidak ada lompatan layout saat data tiba.

### 4.6 Feedback Interaksi

Setiap aksi yang dilakukan pengguna harus mendapat respons visual yang jelas:

| Aksi | Feedback |
|---|---|
| Klik button | Perubahan warna (hover/active state), duration 150ms |
| Submit form berhasil | Toast success + redirect atau reset form |
| Submit form gagal | Error message merah di bawah field yang bermasalah |
| Hapus data | Dialog konfirmasi dulu, baru eksekusi, lalu toast success |
| Upload file | Progress indicator, lalu preview thumbnail |
| Load data | Skeleton state, lalu content muncul dengan fade-in tipis |

### 4.7 Tipografi dalam Konteks

| Konteks | Token yang Digunakan |
|---|---|
| Heading halaman | text-h1, font-heading |
| Heading section | text-h2, font-heading |
| Nama proyek di kartu | text-h4, font-heading |
| Angka statistik KPI | text-stat, font-mono |
| Nilai rupiah | font-mono, weight 600 |
| Persentase progres | font-mono |
| Label form | text-label, weight 500 |
| Teks isi tabel | text-body |
| Timestamp / info minor | text-micro, color-neutral-500 |

---

## BAGIAN 5 — Prinsip Desain

---

### 5.1 Profesional Lapangan, Bukan Startup Generik

KontraktorPro bukan aplikasi SaaS teknologi biasa. Tampilan produk harus terasa seperti **alat kerja yang dibangun oleh orang yang mengerti lapangan** — bukan template startup yang diisi ulang. Ini berarti:

- Gunakan bahasa konstruksi di semua teks UI — bukan "task" tapi "item pekerjaan", bukan "team member" tapi "mandor"
- Hindari ilustrasi atau ikon yang terlalu playful atau kekanak-kanakan
- Warna biru tua dan oranye adalah identitas — bukan sekadar pilihan estetika

### 5.2 Kejelasan di Atas Segalanya

Kontraktor membuka aplikasi ini di lapangan — di tengah terik matahari, layar kecil, satu tangan memegang HP. Kejelasan informasi lebih penting dari keindahan visual:

- Kontras warna teks terhadap background minimal WCAG AA (4.5:1 untuk teks normal)
- Font tidak boleh terlalu kecil — minimum `text-label` (12px) untuk teks yang bisa dibaca
- Informasi yang paling penting harus terlihat tanpa perlu scroll

### 5.3 Kontraktor Memegang Kendali

Tidak ada satu pun elemen UI yang terasa seperti "mengawasi" kontraktor. Semua kontrol ada di tangan mereka. Secara visual ini berarti:

- Fitur berbagi ke owner selalu ditampilkan sebagai pilihan, bukan kewajiban
- Konfirmasi sebelum aksi apapun yang mengirimkan data ke pihak luar
- Pengaturan privasi mudah ditemukan dan jelas cara kerjanya

### 5.4 Konsistensi Lebih Penting dari Inovasi

Setiap komponen yang sudah didefinisikan di design system ini harus digunakan persis seperti spesifikasinya. Jangan membuat variasi baru hanya karena terasa lebih bagus untuk satu halaman tertentu — konsistensi adalah yang membuat produk terasa profesional dan terpercaya.

Jika ada kebutuhan komponen baru yang belum ada di sistem ini, tambahkan ke design system terlebih dahulu sebelum menggunakannya.

### 5.5 Mobile Bukan Afterthought

Mobile bukan versi "diperkecil" dari desktop — ini adalah pengalaman utama untuk mandor dan kontraktor di lapangan. Setiap keputusan desain harus melewati pertanyaan: *"Apakah ini masih nyaman digunakan dengan satu ibu jari di layar 6 inci?"*

---

## Lampiran — Checklist Konsistensi

Sebelum halaman baru dianggap selesai, verifikasi semua poin berikut:

**Foundation**
- [ ] Semua warna menggunakan token, bukan nilai hex langsung
- [ ] Semua ukuran teks menggunakan token tipografi
- [ ] Semua jarak menggunakan token spacing
- [ ] Tidak ada nilai arbitrari yang tidak ada di sistem (misal: padding 13px, radius 5px)

**Komponen**
- [ ] Tombol CTA utama hanya ada satu per halaman
- [ ] Semua badge menggunakan varian yang sesuai konteks (bukan sekadar pilihan warna)
- [ ] Semua form field punya label, placeholder, dan error state
- [ ] Semua kartu clickable punya hover state yang jelas

**Layout**
- [ ] Halaman ditest di lebar 375px (iPhone SE) dan 1280px (laptop)
- [ ] Tidak ada elemen yang terpotong atau overflow di mobile
- [ ] Touch target minimal 44x44px di semua elemen interaktif

**Aksesibilitas**
- [ ] Kontras teks minimum 4.5:1 terhadap background
- [ ] Semua gambar dan ikon punya teks alternatif
- [ ] Tidak ada informasi yang hanya disampaikan lewat warna (selalu ada label teks)

---

*Dokumen ini adalah sumber kebenaran tunggal untuk desain visual KontraktorPro. Versi terakhir diperbarui sesuai tanggal dokumen. Setiap penambahan komponen atau perubahan token harus diperbarui di sini terlebih dahulu sebelum diimplementasi.*
