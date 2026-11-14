import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Portal Informasi Desa Fajar Baru",
    short_name: "Desa Fajar Baru",
    description:
      "Pusat informasi dan layanan publik digital Desa Fajar Baru, Jati Agung, Lampung Selatan.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f9f7",
    theme_color: "#047857",
    lang: "id-ID",
    dir: "ltr",
    categories: ["government", "education", "utilities"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Layanan Warga",
        url: "/#layanan",
        description: "Kanal layanan publik Desa Fajar Baru",
      },
      {
        name: "Peta Desa",
        url: "/#peta",
        description: "Peta wilayah dan titik lokasi Desa Fajar Baru",
      },
    ],
  };
}
