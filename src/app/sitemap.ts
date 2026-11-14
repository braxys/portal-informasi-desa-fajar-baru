import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-config";

/**
 * Sitemap hanya berisi URL kanonis.
 *
 * `/layanan` dan `/peta` tidak didaftarkan karena keduanya redirect 308 ke
 * anchor beranda — mendaftarkannya akan memunculkan peringatan "Page with
 * redirect" di Google Search Console.
 *
 * `lastModified` sengaja tidak diisi. Sebelumnya nilainya `new Date()` sehingga
 * berubah setiap build; Google mendeteksi pola itu sebagai `lastmod` tidak
 * reliabel lalu mengabaikannya sepenuhnya. Lebih baik tidak ada daripada salah.
 * Isi kembali dengan tanggal konten nyata (mis. `max(updated_at)` dari
 * Supabase) ketika halaman sudah punya konten yang benar-benar diperbarui.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
