import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-leaflet v5 memanggil map.remove() saat StrictMode mensimulasikan
  // unmount di dev, lalu TileLayer gagal menambahkan pane ke peta yang sudah
  // dihapus. StrictMode tidak berjalan di produksi, jadi perilaku produksi
  // tetap sama.
  // Ref: https://github.com/PaulLeCam/react-leaflet/issues/1133
  reactStrictMode: false,
};

export default nextConfig;
