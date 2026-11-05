# Portal Informasi Desa Fajar Baru

Kerangka awal aplikasi link aggregator untuk Desa Fajar Baru, Jati Agung, Lampung Selatan. Repo ini menyiapkan struktur dan tooling agar tim dapat melanjutkan implementasi sesuai dokumen kebutuhan; fitur produk belum selesai.

## Stack

- Next.js App Router dan React
- TypeScript dengan strict mode
- Tailwind CSS
- Supabase (`@supabase/ssr` dan `@supabase/supabase-js`)
- Target deployment: Vercel

## Persiapan lokal

Prasyarat: Node.js LTS (20.9 atau lebih baru) dan npm.

```bash
npm install
Copy-Item .env.example .env.local
```

Isi `.env.local` dengan URL project dan publishable/anon key Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-or-anon-key>
DATABASE_URL=<direct-postgres-connection-string>
```

`DATABASE_URL` hanya digunakan saat menjalankan migrasi dari lingkungan tepercaya. Jangan gunakan atau simpan URL database maupun service-role key sebagai variabel `NEXT_PUBLIC_*`.

Setelah membuat akun admin di Supabase Auth, tetapkan `app_metadata.role` menjadi `admin` menggunakan Supabase Auth Admin API dari lingkungan tepercaya. Jangan gunakan `user_metadata` untuk role karena dapat diubah oleh pemilik akun. Akun tanpa role admin tidak dapat mengakses dashboard atau mengelola data.

Jalankan migrasi database dengan:

```bash
npm run db:migrate
```

Migrasi seed aman dijalankan ulang dan proses berhenti jika suatu migrasi gagal. Tinjau perubahan SQL dan pastikan backup tersedia sebelum menjalankan pada database produksi.

Jika migrasi unique constraint berhenti karena tautan duplikat, periksa dulu baris yang akan dibersihkan:

```bash
npm run db:clean-duplicates
```

Perintah tersebut hanya menampilkan duplikat. Setelah meninjau hasil dan membuat backup, jalankan `npm run db:clean-duplicates -- --apply` untuk mempertahankan tautan tertua, memindahkan log terkait ke tautan yang dipertahankan, dan menghapus salinannya. Setelah itu jalankan kembali `npm run db:migrate`.

Jalankan server pengembangan:

```bash
npm run dev
```

Buka `http://localhost:3000`. Perintah validasi yang tersedia:

```bash
npm run lint
npm run typecheck
npm run build
```

Jangan commit `.env.local` atau mengirim kredensial melalui chat. Gunakan pengelola rahasia yang disepakati tim; nilai `NEXT_PUBLIC_*` tersedia di browser, sehingga database tetap wajib dilindungi dengan kebijakan Supabase Row Level Security (RLS).

## Struktur awal

```text
src/
  app/
    (public)/page.tsx       # Halaman publik awal (/)
    admin/login/page.tsx    # Kerangka halaman login
    admin/dashboard/page.tsx
  components/               # Komponen UI bersama
  lib/supabase/             # Klien Supabase browser dan server
docs/konteks/               # PRD, SKPL, arsitektur, dan panduan tim
docs/design/                # Wireframe, palet warna, token, dan handoff UI/UX
public/brand/               # Aset logo resmi (Lambang Lampung Selatan)
```

## Desain dan aset merek

Deliverable Fase 1 (wireframe halaman publik mobile, login/dashboard admin desktop, palet hijau-biru, dan logo) tersedia di [`docs/design/`](./docs/design/). Mulai dari [`docs/design/README.md`](./docs/design/README.md) dan [`docs/design/fase-1-handoff.md`](./docs/design/fase-1-handoff.md).

## Pekerjaan lanjutan

1. Tinjau dan finalkan wireframe, palet warna, serta konten bersama UI/UX.
2. Sepakati skema tabel, kebijakan RLS, dan akun admin sebelum menghubungkan Supabase.
3. Implementasikan daftar tautan publik, autentikasi, proteksi dashboard, serta CRUD.
4. Tambahkan pengujian dan verifikasi metrik performa sebelum deployment.

Lihat dokumen proyek di [`docs/konteks/`](./docs/konteks/), terutama PRD, SKPL, rencana arsitektur, panduan setup, dan Git SOP.
