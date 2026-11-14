import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // `/layanan` dan `/peta` sengaja TIDAK diblokir: keduanya redirect 308
        // ke anchor beranda, dan bot perlu merayapi redirect itu untuk
        // melimpahkan sinyal ke URL tujuan. Hanya rute internal yang diblokir.
        disallow: ["/admin/", "/api/", "/q/", "/qr/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
