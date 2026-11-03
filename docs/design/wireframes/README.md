# Wireframe — Alur & Anotasi

Wireframe ini adalah **low-fidelity** untuk menyepakati struktur, hierarki, dan interaksi sebelum implementasi. Warna dipakai terbatas untuk menunjukkan aksi dan status, bukan sebagai UI final.

## 1. Halaman publik (mobile)

File: [`public-mobile.svg`](./public-mobile.svg)

Tiga layar mewakili satu halaman panjang yang digulir:

```text
Scan QR / buka URL
        │
        ▼
01 Beranda  ──►  02 Daftar layanan  ──►  03 Peta & kontak
   hero          4 kartu layanan          map + alamat + kontak
   2 CTA         pencarian                 footer ringkas
   statistik     media sosial
```

### Alur utama warga

1. Warga memindai QR di balai desa atau stiker.
2. Halaman publik langsung menampilkan identitas desa dan dua aksi utama: **Jelajahi layanan** dan **Lihat peta desa**.
3. Warga memilih layanan; setiap kartu membuka tautan eksternal di tab baru.
4. Warga dapat melihat lokasi fasilitas dan kontak resmi tanpa login.

### Anotasi

| No | Area | Keputusan desain |
| --- | --- | --- |
| 1 | Header | Logo 34px, nama desa, menu. Header tidak memakan lebih dari 64px. |
| 2 | Hero | Menjawab “ini portal apa?” dalam satu layar; dua CTA dengan kontras berbeda. |
| 3 | Statistik | Tiga metrik ringkas (jumlah layanan, akses 24/7, status aktif) untuk membangun kepercayaan. |
| 4 | Kartu layanan | Target sentuh minimal 44px; judul, deskripsi 2 baris, dan label aksi yang jelas. |
| 5 | Peta | Titik penting saja; detail muncul saat marker diketuk. Peta tidak boleh menahan render awal. |
| 6 | Footer | Kontak, jam layanan, dan tautan resmi tetap terlihat di mobile. |

### State yang perlu dibuat

- **Loading:** skeleton kartu layanan, bukan spinner penuh halaman.
- **Kosong:** “Belum ada layanan yang dipublikasikan” + tautan ke kontak desa.
- **Error:** “Layanan sedang tidak dapat dimuat” + tombol coba lagi.
- **Tautan rusak:** validasi URL di admin; di publik tampilkan fallback ke halaman kontak.
- **Gambar gagal:** gunakan latar gradasi hijau-biru, jangan biarkan area kosong.

## 2. Login admin (desktop)

File: [`admin-login-desktop.svg`](./admin-login-desktop.svg)

```text
/admin/login
     │
     ├── email + password valid ──► /admin/dashboard
     └── gagal ──► pesan error generik, tetap di halaman
```

### Anotasi

| No | Area | Keputusan desain |
| --- | --- | --- |
| 1 | Panel merek | Menjaga konteks desa dan mengurangi kesan sistem asing. Tidak memuat informasi sensitif. |
| 2 | Form | Label permanen, input 46px, autocomplete email/password, tombol tampil sandi. |
| 3 | Aksi utama | Satu tombol selebar kartu; tampilkan loading dan cegah klik ganda. |
| 4 | Error | Pesan generik “Email atau kata sandi salah” agar tidak membocorkan akun terdaftar. |

### State yang perlu dibuat

- **Loading:** tombol berubah menjadi “Memproses…” dan disabled.
- **Error kredensial:** pesan merah di bawah form, fokus kembali ke input email.
- **Error jaringan:** pesan “Tidak dapat terhubung. Periksa koneksi lalu coba lagi.”
- **Sesi kedaluwarsa:** redirect ke login dengan pesan “Sesi berakhir, silakan masuk kembali.”
- **Lupa sandi:** arahkan ke kontak Sekretariat Desa (belum ada alur reset mandiri di Fase 1).

## 3. Dashboard admin (desktop)

File: [`admin-dashboard-desktop.svg`](./admin-dashboard-desktop.svg)

```text
/admin/dashboard
     │
     ├── ringkasan statistik
     ├── tabel tautan ──► edit ──► drawer
     │                ├── hapus ──► dialog konfirmasi
     │                └── toggle aktif/nonaktif
     └── + Tambah Link ──► drawer
```

### Anotasi

| No | Area | Keputusan desain |
| --- | --- | --- |
| 1 | Sidebar | Lima menu inti; item aktif jelas; logout dipisah di bawah. |
| 2 | Drawer | Overlay gelap, fokus terperangkap, tombol tutup, Esc untuk menutup. |
| 3 | Aksi utama | Hanya satu tombol “Tambah Link” di kanan atas tabel. |
| 4 | Tabel | Kolom: judul/URL, kategori, status, urutan, klik, aksi. URL dipotong agar rapi. |
| 5 | Hapus | Selalu lewat dialog konfirmasi yang menyebut judul tautan. |

### State yang perlu dibuat

- **Kosong:** ilustrasi ringan + “Belum ada tautan” + tombol tambah.
- **Loading tabel:** 5 baris skeleton.
- **Validasi form:** judul wajib, URL harus `http://` atau `https://`, urutan berupa angka.
- **Sukses:** toast “Tautan berhasil disimpan” dan tabel diperbarui.
- **Gagal simpan:** pesan di dalam drawer, data form tidak hilang.
- **Hapus:** dialog konfirmasi, lalu toast “Tautan dihapus”.
- **Nonaktif:** status pill berubah tanpa menghapus data.

## 4. Breakpoint dan ukuran

| Perangkat | Lebar | Perilaku |
| --- | --- | --- |
| Mobile kecil | 360px | Satu kolom, gutter 20px, tombol selebar layar. |
| Mobile umum | 390–430px | Satu kolom, hero 2–3 baris, kartu bertumpuk. |
| Tablet | 768px | Grid 2 kolom untuk kartu; sidebar admin belum muncul. |
| Desktop | 1024–1280px | Grid 2–3 kolom; sidebar admin 236px. |
| Desktop besar | 1440px | Konten maksimal 1280px, gutter 40px. |

## 5. Yang belum diputuskan

- File logo resmi desa dan versi lambang resmi (jika ada).
- Foto asli Desa Fajar Baru untuk hero.
- Daftar kategori final: `bumdes`, `layanan`, `medsos`, `informasi`, `survei`.
- Nama akun admin dan alur reset kata sandi.
- Apakah peta memakai gambar statis atau Leaflet pada Fase 5.
- URL QR final yang akan dicetak di stiker.

## 6. Acceptance checklist Fase 1

- [x] Wireframe mobile publik mencakup hero, layanan, peta, dan kontak.
- [x] Wireframe admin mencakup login dan dashboard CRUD.
- [x] Alur sukses, error, kosong, dan loading dicatat.
- [x] Ukuran target sentuh dan breakpoint ditentukan.
- [x] Palet dan logo tersedia untuk frontend.
- [ ] Review bersama PM dan frontend.
- [ ] Ganti aset logo kerja dengan logo resmi desa.
