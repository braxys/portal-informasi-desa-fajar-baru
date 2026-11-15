# Portal Informasi Desa Fajar Baru

Portal informasi resmi Desa Fajar Baru, Kecamatan Jati Agung, Kabupaten Lampung Selatan. Berisi profil desa, tautan layanan warga, peta fasilitas, QR code berpelacakan, dan dashboard admin untuk mengelola seluruh konten.

## Fitur

**Halaman publik (`/`)**

- Hero, profil desa, dan jam layanan Balai Desa
- Daftar tautan layanan warga yang diurutkan dan dilacak kliknya
- Peta interaktif fasilitas desa (Leaflet) dengan filter kategori
- Halaman dipra-render dengan ISR 60 detik agar cepat di jaringan lemah

**Dashboard admin (`/admin/dashboard`)**

- Login Supabase Auth dengan proteksi `app_metadata.role = "admin"`
- CRUD tautan, titik peta, dan QR code
- Pengurutan ulang dengan drag/naik-turun
- Statistik kunjungan, klik, dan pindai QR secara realtime

**QR code**

- QR baru memakai `/qr/<id QR>`; stiker lama `/q/<id tautan>` tetap berfungsi
- Setiap pindai dicatat, dengan penyaringan bot agar angka tidak menggelembung

**SEO dan PWA**

- Metadata Open Graph/Twitter, JSON-LD `GovernmentOrganization` dengan NAP konsisten
- `robots.txt`, `sitemap.xml`, manifest PWA, dan ikon 192/512/maskable

## Stack

- Next.js 16 (App Router, React 19, Server Actions)
- TypeScript strict mode
- Tailwind CSS v4
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`, PostgreSQL + RLS)
- Leaflet + react-leaflet untuk peta
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
NEXT_PUBLIC_SITE_URL=<url-produksi-opsional>
```

`DATABASE_URL` hanya digunakan saat menjalankan migrasi dari lingkungan tepercaya. Jangan gunakan atau simpan URL database maupun service-role key sebagai variabel `NEXT_PUBLIC_*`.

`NEXT_PUBLIC_SITE_URL` bersifat opsional. Bila kosong, situs memakai URL Vercel bawaan; isi saat domain resmi sudah aktif agar URL kanonis, sitemap, dan JSON-LD konsisten.

Setelah membuat akun admin di Supabase Auth, tetapkan `app_metadata.role` menjadi `admin` menggunakan Supabase Auth Admin API dari lingkungan tepercaya. Jangan gunakan `user_metadata` untuk role karena dapat diubah oleh pemilik akun. Akun tanpa role admin tidak dapat mengakses dashboard atau mengelola data.

Jalankan migrasi database dengan:

```bash
npm run db:migrate
```

Migrasi seed aman dijalankan ulang dan proses berhenti jika suatu migrasi gagal. Tinjau perubahan SQL dan pastikan backup tersedia sebelum menjalankan pada database produksi.

Jika migrasi unique constraint berhenti karena tautan atau marker duplikat, periksa dulu baris yang akan dibersihkan:

```bash
npm run db:clean-duplicates
```

Perintah tersebut hanya menampilkan duplikat. Setelah meninjau hasil dan membuat backup, jalankan `npm run db:clean-duplicates -- --apply` untuk mempertahankan record tertua, memindahkan log terkait ke tautan yang dipertahankan, dan menghapus salinannya. Setelah itu jalankan kembali `npm run db:migrate`.

Jalankan server pengembangan:

```bash
npm run dev -- --webpack
```

Buka `http://localhost:3000`. Perintah validasi yang tersedia:

Untuk melihat marker masjid dan minimarket tanpa menulis ke Supabase, ubah
`LOCAL_MARKER_PREVIEW=false` menjadi `LOCAL_MARKER_PREVIEW=true` di `.env.local`,
lalu restart server. Preview ini hanya aktif di mode development; halaman publik
produksi tetap mengambil marker dari Supabase. Mode ini menonaktifkan pencatatan
event analytics, tetapi layanan dan media sosial tetap membaca data publik dari
Supabase.

```bash
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit (termasuk noUnusedLocals/noUnusedParameters)
npm run build      # build produksi
```

Jangan commit `.env.local` atau mengirim kredensial melalui chat. Gunakan pengelola rahasia yang disepakati tim; nilai `NEXT_PUBLIC_*` tersedia di browser, sehingga database tetap wajib dilindungi dengan kebijakan Supabase Row Level Security (RLS).

## Struktur proyek

```text
src/
  app/
    (public)/page.tsx         # Beranda publik (/)
    admin/login/page.tsx      # Login admin
    admin/dashboard/page.tsx  # Dashboard admin
    api/qr-code/              # Generator gambar QR
    api/track/                # Pencatat kunjungan dan klik
    q/[id]/qr/[id]/           # Redirect QR (lama dan baru)
    layanan/, peta/           # Redirect 308 ke anchor beranda
    robots.ts, sitemap.ts     # SEO
  actions/                    # Server Action (auth, links, markers, qr-codes, analytics)
  components/
    public/                   # Komponen halaman publik
    admin/                    # Komponen dashboard admin
    shared/                   # Ikon SVG dan komponen bersama
  lib/
    supabase/                 # Klien Supabase browser, server, dan anon
    validation.ts             # Validasi URL bersama
    qr-redirect.ts            # Aturan bot, UUID, dan redirect QR
    link-categories.ts        # Kategori tautan dan ikonnya
    site-config.ts            # Sumber tunggal NAP dan identitas situs
  types/                      # Tipe database dan hasil Server Action
backend/
  migrations/                 # Migrasi SQL berurutan (001–014)
  migrate.mjs                 # Runner migrasi
  clean-duplicates.mjs        # Pemeriksa duplikat sebelum unique constraint
public/
  brand/                      # Logo resmi dan gambar OG
  icons/                      # Ikon PWA (192/512/maskable)
docs/design/                  # Wireframe, palet warna, token, dan handoff UI/UX
```

## Desain dan aset merek

Deliverable Fase 1 (wireframe halaman publik mobile, login/dashboard admin desktop, palet hijau-biru, dan logo) tersedia di [`docs/design/`](./docs/design/). Mulai dari [`docs/design/README.md`](./docs/design/README.md) dan [`docs/design/fase-1-handoff.md`](./docs/design/fase-1-handoff.md).

Token warna di [`docs/design/color-tokens.css`](./docs/design/color-tokens.css) diimpor langsung oleh `src/app/portal.css`, sehingga kelas Tailwind seperti `bg-fajar-700` dan `text-telaga-700` tersedia di seluruh komponen. Tambahkan token baru di blok `@theme` bila memerlukan shade lain.
