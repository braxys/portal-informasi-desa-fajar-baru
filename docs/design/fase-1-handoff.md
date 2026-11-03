# Fase 1 — Handoff UI/UX

Dokumen ini memetakan pekerjaan Fase 1 pada checklist Notion ke deliverable di repository. Fokus: **desain dan aset**, belum implementasi CRUD atau integrasi Supabase.

## 1. Pemetaan checklist Notion

| Checklist Notion | PIC | Status | Bukti |
| --- | --- | --- | --- |
| Buat wireframe kasar halaman Publik (HP) | Arief (UI/UX) | Selesai | [`wireframes/public-mobile.svg`](./wireframes/public-mobile.svg) |
| Buat wireframe kasar halaman Admin (Desktop) | Arief (UI/UX) | Selesai | [`wireframes/admin-login-desktop.svg`](./wireframes/admin-login-desktop.svg), [`wireframes/admin-dashboard-desktop.svg`](./wireframes/admin-dashboard-desktop.svg) |
| Tentukan palet warna pasti (hex) gradasi hijau-biru | Arief (UI/UX) | Selesai | [`brand-guidelines.md`](./brand-guidelines.md) |
| Sediakan aset logo desa | Arief (UI/UX) | Selesai (Lambang Lampung Selatan) | [`public/brand/logo-lampung-selatan.jpeg`](../../public/brand/logo-lampung-selatan.jpeg) |

Di luar cakupan Fase 1:

- Set ikon SVG untuk tombol tautan → Fase 2.
- Desain stiker QR fisik siap cetak → Fase 4.
- Implementasi komponen React, autentikasi, dan CRUD → Fase 2–3.
- Setup project dan tabel Supabase → sudah dikerjakan backend di branch `main`.

## 2. Keputusan desain yang sudah dikunci

1. **Arah warna:** hijau desa `#047857` dan biru layanan `#0E7490` sebagai gradasi aksi utama. Hijau terang `#10B981` hanya untuk dekorasi. Warna logo mengikuti Lambang Lampung Selatan dan tidak diubah.
2. **Tipografi:** Manrope untuk judul, DM Sans untuk body. Keduanya sudah dipakai fondasi UI di branch `development`.
3. **Nuansa halaman:** terang, lapang, dan tenang. Latar `#F7F9F7`, kartu putih, border `#E7EEEA`.
4. **Mobile-first:** gutter 20px, target sentuh minimal 44px, tombol utama selebar layar pada mobile.
5. **Admin desktop:** sidebar 236px, topbar 70px, tabel sebagai pusat pekerjaan, drawer untuk tambah/edit.
6. **Keamanan UX:** pesan login generik, tidak membocorkan apakah email terdaftar.
7. **Aksesibilitas:** teks putih hanya di atas `#047857`/`#0E7490`, bukan di atas `#10B981`/`#0891B2`.

## 3. Yang perlu dilakukan berikutnya

### Frontend (Fase 2)

- Pindahkan token [`color-tokens.css`](./color-tokens.css) ke `src/app/globals.css` atau `portal.css`.
- Ganti warna inline di komponen dengan token.
- Buat komponen `ServiceCard` yang memakai ikon SVG dari set Fase 2.
- Sambungkan halaman publik ke data Supabase dengan fallback data demo saat `.env.local` belum tersedia.
- Pastikan ukuran target sentuh, fokus keyboard, dan state loading/error sesuai wireframe.

### UI/UX (lanjutan)

- Review wireframe bersama PM dan frontend.
- Logo resmi Lampung Selatan sudah dipasang; jika ada versi SVG/AI resmi, ganti aset JPEG agar lebih tajam.
- Buat set ikon tautan (BUMDes, website, Instagram, TikTok, YouTube, survei) pada Fase 2.
- Buat desain stiker QR dan materi sosialisasi pada Fase 4.

### Backend

- Pastikan data seed `links` memiliki kategori dan ikon yang sesuai.
- Sediakan akun admin uji coba untuk validasi alur login.
- Konfirmasi apakah `is_featured` dan `display_order` dipakai di UI publik.

## 4. Pertanyaan terbuka

1. Apakah tersedia versi SVG/AI resmi Lambang Lampung Selatan agar logo lebih tajam di semua ukuran?
2. Apakah ada foto asli desa yang boleh dipakai untuk hero?
3. Siapa pemilik akun admin dan bagaimana prosedur reset kata sandi?
4. Apakah peta pada Fase 1 hanya placeholder, atau sudah perlu menampilkan titik fasilitas nyata?
5. URL final Vercel untuk QR code sudah tersedia?

## 5. Catatan Git

Pekerjaan ini ditempatkan di branch `development` sesuai Git SOP. Branch `main` tidak diubah. Sebelum merge, minta review PM atau anggota tim lain.
