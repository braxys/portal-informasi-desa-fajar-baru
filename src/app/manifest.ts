import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Portal Informasi Desa Fajar Baru",
    short_name: "Desa Fajar Baru",
    description: "Pusat informasi dan layanan publik digital Desa Fajar Baru, Jati Agung, Lampung Selatan.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f9f7",
    theme_color: "#047857",
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
  };
}
