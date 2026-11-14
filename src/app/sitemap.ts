import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://fajarbaru.desa.id").replace(/\/$/, "");

  // Hanya URL kanonis yang boleh masuk sitemap. /layanan dan /peta adalah
  // redirect 307 ke anchor di beranda, jadi tidak didaftarkan di sini.
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
