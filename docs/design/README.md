# Desain — Portal Informasi Desa Fajar Baru

Folder ini berisi deliverable UI/UX **Fase 1** untuk Portal Informasi Desa Fajar Baru. Fokusnya adalah fondasi visual dan alur layar, bukan implementasi kode final.

## Status Fase 1

| Deliverable | Status | File |
| --- | --- | --- |
| Wireframe halaman publik (mobile) | Selesai | [`wireframes/public-mobile.svg`](./wireframes/public-mobile.svg) |
| Wireframe login admin (desktop) | Selesai | [`wireframes/admin-login-desktop.svg`](./wireframes/admin-login-desktop.svg) |
| Wireframe dashboard admin (desktop) | Selesai | [`wireframes/admin-dashboard-desktop.svg`](./wireframes/admin-dashboard-desktop.svg) |
| Palet warna hijau-biru (hex) | Selesai | [`brand-guidelines.md`](./brand-guidelines.md) |
| Token warna siap pakai | Selesai | [`color-tokens.css`](./color-tokens.css) |
| Aset logo resmi | Selesai | [`public/brand/logo-lampung-selatan.jpeg`](../../public/brand/logo-lampung-selatan.jpeg) |
| Set ikon tautan (SVG) | Selesai | [`public/icons/`](../../public/icons/) |
| Stiker QR siap cetak | Fase 4 | — |

> Logo yang dipakai adalah **Lambang Kabupaten Lampung Selatan** sesuai aset resmi yang diberikan. Nama Desa Fajar Baru tetap tampil sebagai teks di samping logo.

## Isi folder

```text
docs/design/
├── README.md                  # Halaman ini
├── brand-guidelines.md        # Palet, tipografi, logo, aturan visual
├── color-tokens.css           # Token CSS untuk handoff ke frontend
├── fase-1-handoff.md          # Pemetaan ke checklist Notion + catatan
└── wireframes/
    ├── README.md              # Alur, anotasi, dan state yang perlu dibuat
    ├── public-mobile.svg      # 3 layar publik: beranda, layanan, peta/kontak
    ├── admin-login-desktop.svg
    └── admin-dashboard-desktop.svg
```

## Cara melihat wireframe

Buka file `.svg` langsung di browser (Chrome/Edge/Firefox), atau preview dari VS Code. Semua file memakai viewBox tetap sehingga bisa di-zoom tanpa pecah.

## Prinsip desain

1. **Mobile-first untuk warga.** Halaman publik dioptimalkan untuk layar 360–430px, dengan target sentuh minimal 44px.
2. **Satu pintu, sedikit pilihan.** Pengunjung langsung melihat nilai portal dan tautan yang paling dibutuhkan.
3. **Admin desktop yang tenang.** Dashboard dibuat untuk pekerjaan berulang: tabel jelas, aksi dekat, konfirmasi sebelum menghapus.
4. **Cepat di jaringan lemah.** Hindari carousel berat, video autoplay, dan animasi yang tidak perlu.
5. **Aksesibel.** Kontras teks minimal 4.5:1, label input permanen, fokus keyboard terlihat, dan pesan error spesifik.

## Warna utama

| Peran | Hex |
| --- | --- |
| Aksi utama (awal gradasi) | `#047857` |
| Aksi utama (akhir gradasi) | `#0E7490` |
| Aksen dekoratif | `#10B981` |
| Latar halaman | `#F7F9F7` |
| Judul | `#0F172A` |
| Body | `#475569` |

Detail lengkap, kontras, dan aturan pemakaian ada di [`brand-guidelines.md`](./brand-guidelines.md).

## Catatan handoff ke frontend

- Gunakan token di [`color-tokens.css`](./color-tokens.css) sebagai sumber nilai warna, radius, bayangan, dan font.
- Wireframe adalah **lo-fi**: teks contoh boleh diganti, tetapi hierarki, ukuran target sentuh, dan urutan aksi dipertahankan.
- Komponen yang perlu dibuat mengikuti wireframe: `SiteHeader`, `HeroSection`, `ServiceCard`, `VillageMapSection`, `SiteFooter`, `LoginForm`, `DashboardShell`, `LinkTable`, `LinkDrawer`, `ConfirmDialog`.
- Halaman publik saat ini sudah memiliki fondasi di branch `development`; gunakan wireframe ini untuk merapikan konsistensi, bukan mengganti arah visual dari nol.
- Jangan menambahkan warna baru di luar palet tanpa memperbarui dokumen ini.

## Checklist review desain

- [ ] Semua teks contoh menggunakan bahasa Indonesia yang jelas.
- [ ] Tidak ada teks putih di atas `#10B981`, `#059669`, atau `#0891B2`.
- [ ] Target sentuh minimal 44×44px pada mobile.
- [ ] Fokus keyboard terlihat pada tombol, tautan, dan input.
- [ ] Ada state loading, kosong, error, dan sukses untuk form admin.
- [ ] Wireframe diuji pada lebar 360px, 390px, 430px, dan 1440px.
- [x] Logo resmi Lampung Selatan sudah dipasang di header, footer, dan aset merek.
