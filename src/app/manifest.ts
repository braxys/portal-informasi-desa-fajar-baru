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
        src: "/brand/logo-lampung-selatan.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
