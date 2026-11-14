import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-leaflet v5 memanggil map.remove() saat StrictMode mensimulasikan
  // unmount di dev, lalu TileLayer gagal menambahkan pane ke peta yang sudah
  // dihapus. StrictMode tidak berjalan di produksi, jadi perilaku produksi
  // tetap sama.
  // Ref: https://github.com/PaulLeCam/react-leaflet/issues/1133
  reactStrictMode: false,

  images: {
    // AVIF diprioritaskan (25–50% lebih kecil dari WebP pada foto), dengan WebP
    // sebagai fallback untuk browser lama. Berdampak langsung ke LCP hero.
    formats: ["image/avif", "image/webp"],
    // Ukuran layar umum pengunjung desa (mayoritas mobile). Membatasi daftar
    // ini memangkas jumlah varian yang di-generate saat build.
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [32, 48, 64, 96, 128, 180, 192, 256, 384],
    // Cache optimal satu tahun untuk aset yang sudah di-hash Next.
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
