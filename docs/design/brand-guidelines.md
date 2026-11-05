# Brand Guidelines — Portal Informasi Desa Fajar Baru

Dokumen ini menetapkan identitas visual Fase 1: palet warna, tipografi, logo, dan aturan dasar penggunaannya. Semua nilai di sini menjadi acuan tunggal untuk wireframe, komponen frontend, stiker QR, dan materi sosialisasi desa.

## 1. Arah visual

**Kata kunci:** dekat, terbuka, tumbuh, dan melayani.

- **Hijau** mewakili pertanian, potensi desa, dan pertumbuhan.
- **Biru-teal** mewakili layanan publik, kepercayaan, dan keterbukaan informasi.
- **Permukaan terang** dipakai agar portal terasa ringan, bersih, dan cepat diakses dari HP.
- **Gradasi hijau-biru** hanya menjadi aksen. Sebagian besar halaman tetap memakai permukaan netral agar teks mudah dibaca.

Rasio penggunaan warna yang disarankan: **60% netral terang, 30% hijau-biru, 10% aksen**.

## 2. Palet warna inti

### Hijau desa

| Nama token | Hex | Penggunaan |
| --- | --- | --- |
| `fajar-50` | `#ECFDF5` | Latar lembut, badge, highlight |
| `fajar-100` | `#D1FAE5` | Chip, ikon container, selection |
| `fajar-200` | `#A7F3D0` | Border dekoratif, ring |
| `fajar-500` | `#10B981` | Aksen dekoratif, ilustrasi |
| `fajar-600` | `#059669` | Gradasi dekoratif |
| `fajar-700` | `#047857` | **Aksi utama, teks aksen, tombol** |
| `fajar-800` | `#065F46` | Hover/active state |
| `fajar-900` | `#064E3B` | Teks di atas latar mint |

### Biru layanan

| Nama token | Hex | Penggunaan |
| --- | --- | --- |
| `telaga-50` | `#ECFEFF` | Latar informasi |
| `telaga-100` | `#CFFAFE` | Chip informasi |
| `telaga-500` | `#06B6D4` | Aksen dekoratif |
| `telaga-600` | `#0891B2` | Gradasi teks besar |
| `telaga-700` | `#0E7490` | **Ujung gradasi aksi utama** |
| `telaga-800` | `#155E75` | Hover/active state |
| `telaga-900` | `#164E63` | Teks di atas latar cyan |

### Netral

| Nama token | Hex | Penggunaan |
| --- | --- | --- |
| `putih` | `#FFFFFF` | Kartu, permukaan utama |
| `kabut` | `#F7F9F7` | Latar halaman |
| `garis` | `#E7EEEA` | Border kartu dan pemisah |
| `slate-100` | `#F1F5F9` | Placeholder, latar sekunder |
| `slate-200` | `#E2E8F0` | Border input |
| `slate-300` | `#CBD5E1` | Garis wireframe |
| `slate-400` | `#94A3B8` | Placeholder teks |
| `slate-500` | `#64748B` | Teks sekunder di latar terang |
| `slate-600` | `#475569` | Body text |
| `slate-700` | `#334155` | Teks kuat sekunder |
| `slate-800` | `#1E293B` | Judul kecil |
| `slate-900` | `#0F172A` | Judul utama |
| `slate-950` | `#020617` | Footer dan panel gelap |

### Semantik

| Nama | Hex | Penggunaan |
| --- | --- | --- |
| `success` | `#047857` | Status aktif, berhasil |
| `warning` | `#B45309` | Peringatan, data belum lengkap |
| `danger` | `#B91C1C` | Hapus, error, tautan rusak |
| `info` | `#0E7490` | Informasi netral |
| `focus-ring` | `#0E7490` | Outline fokus keyboard |

## 3. Gradasi resmi

| Nama | Nilai | Pemakaian |
| --- | --- | --- |
| Aksi utama | `linear-gradient(110deg, #047857 0%, #0E7490 100%)` | Tombol utama dengan teks putih |
| Aksen dekoratif | `linear-gradient(135deg, #10B981 0%, #0E7490 100%)` | Logo, ilustrasi, garis aksen |
| Teks sorotan | `linear-gradient(105deg, #047857 10%, #0891B2 90%)` | Hanya untuk teks besar (≥ 24px bold) |
| Latar lembut | `radial-gradient(ellipse at top left, rgb(134 239 172 / 35%), transparent 48%), linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)` | Latar halaman publik |

> Catatan aksesibilitas: `#059669` dan `#0891B2` tidak memenuhi kontras 4.5:1 untuk teks kecil di atas putih. Gunakan `#047857` dan `#0E7490` untuk teks/tombol. Gradasi dekoratif tidak boleh menjadi satu-satunya pembawa makna.

## 4. Kontras yang sudah diverifikasi

| Kombinasi | Rasio | Status |
| --- | --- | --- |
| Putih di atas `#047857` | 5.48:1 | Lolos AA teks normal |
| Putih di atas `#0E7490` | 5.36:1 | Lolos AA teks normal |
| `#0F172A` di atas `#F7F9F7` | 16.87:1 | Lolos AAA |
| `#475569` di atas `#F7F9F7` | 7.16:1 | Lolos AAA |
| `#64748B` di atas `#F7F9F7` | 4.50:1 | Batas minimum AA |
| `#FFFFFF` di atas `#10B981` | 2.54:1 | **Gagal** — jangan untuk teks kecil |
| `#FFFFFF` di atas `#059669` | 3.77:1 | **Gagal** untuk teks normal |
| `#FFFFFF` di atas `#0891B2` | 3.68:1 | **Gagal** untuk teks normal |

## 5. Tipografi

| Peran | Font | Weight | Ukuran |
| --- | --- | --- | --- |
| Judul utama | Manrope | 700–800 | 40–72px desktop, 32–44px mobile |
| Judul bagian | Manrope | 700 | 28–40px |
| Judul kartu | Manrope | 700 | 18–22px |
| Body | DM Sans | 400–500 | 14–18px, line-height 1.6–1.8 |
| Label/kicker | DM Sans | 700–800 | 10–12px, letter-spacing 0.12–0.18em |
| Tombol | DM Sans | 700 | 14–16px |

Fallback: `Manrope, "DM Sans", Arial, sans-serif` untuk judul dan `"DM Sans", Arial, sans-serif` untuk body.

Aturan:
- Maksimal dua keluarga font.
- Jangan memakai huruf kapital semua untuk paragraf.
- Teks body minimal 14px di mobile dan 16px di desktop.
- Lebar baris ideal 60–75 karakter.

## 6. Logo

Logo resmi yang digunakan pada antarmuka adalah **Lambang Kabupaten Lampung Selatan**. Lambang ini mewakili konteks administratif kabupaten, sedangkan nama **Desa Fajar Baru** tetap ditampilkan sebagai teks di samping logo.

### File aset

| File | Latar | Pemakaian |
| --- | --- | --- |
| `public/brand/logo-lampung-selatan.png` | Terang, latar putih | Header, footer, dokumen, materi sosialisasi |

### Aturan penggunaan

- Ruang kosong minimum di sekeliling logo: **½ tinggi logo**.
- Ukuran minimum di layar: **40px tinggi**; di cetak: **20mm tinggi**.
- Gunakan `object-fit: contain`; jangan memotong perisai, pita, atau teks di dalam lambang.
- Jangan mengubah warna, memutar, atau meregangkan lambang.
- Di atas latar gelap, tempatkan logo di dalam kontainer putih dengan radius 8px agar latar putih bawaan gambar menyatu.
- **Status aset:** file resmi berasal dari `Logo Lampung Selatan.jpeg` (1070×1470 px). Jika sudah tersedia versi SVG/AI resmi, ganti file di `public/brand/` dan perbarui dokumen ini.

## 7. Ikonografi

- Gaya: garis (outline), stroke 1.8px, sudut membulat, grid 24×24.
- Warna: `currentColor`; letakkan di dalam container putih/mint agar tetap kontras.
- Ukuran UI: 18–24px. Ukuran aksen: 32–40px.
- Set ikon Fase 1 belum final; ikon tautan (BUMDes, web, Instagram, survei) masuk deliverable Fase 2.

## 8. Bentuk, bayangan, dan gerak

| Token | Nilai |
| --- | --- |
| Radius kecil | `12px` |
| Radius sedang | `16px` |
| Radius kartu | `24–28px` |
| Radius pil | `999px` |
| Bayangan kartu | `0 28px 55px -35px rgb(15 67 58 / 0.45)` |
| Bayangan tombol | `0 14px 30px -12px rgb(5 150 105 / 0.65)` |
| Durasi transisi | `160–240ms` |
| Easing | `ease` / `ease-out` |

Hormati `prefers-reduced-motion`: matikan animasi transform dan scroll halus.

## 9. Do and Don't

**Do**
- Gunakan `#F7F9F7` sebagai latar utama dan putih untuk kartu.
- Gunakan gradasi aksi hanya pada satu tombol utama per layar.
- Beri label teks pada setiap ikon aksi penting.
- Uji tampilan pada lebar 360px, 390px, dan 430px.

**Don't**
- Jangan memakai gradasi pada paragraf panjang.
- Jangan menaruh teks putih di atas `#10B981` atau `#0891B2`.
- Jangan menambah warna aksen baru tanpa memperbarui dokumen ini.
- Jangan memakai logo resmi desa sebelum file resmi tersedia.

## 10. Token siap pakai

Salinan token CSS ada di [`color-tokens.css`](./color-tokens.css). Token tersebut dapat dipindahkan ke `src/app/globals.css` pada Fase 2.
