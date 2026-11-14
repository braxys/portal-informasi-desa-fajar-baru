/**
 * Sumber tunggal data identitas situs (NAP, geografis, jam layanan, dan
 * sosial media resmi).
 *
 * Aturan proyek: JANGAN menulis ulang nama, alamat, email, koordinat, atau
 * tautan sosial media secara literal di komponen lain. Impor dari sini supaya
 * data yang tampil di halaman, footer, dan JSON-LD selalu identik. Google
 * memakai konsistensi NAP sebagai sinyal utama Local SEO — satu nilai yang
 * berbeda antar halaman sudah cukup melemahkan entitas.
 *
 * Catatan: nomor telepon sengaja tidak dipakai. Nomor yang beredar sebelumnya
 * adalah placeholder, dan NAP yang salah lebih merugikan daripada NAP kosong.
 */

const FALLBACK_SITE_URL = "https://portal-informasi-desa-fajar-baru.vercel.app";

/**
 * URL kanonis situs. Ubah lewat env `NEXT_PUBLIC_SITE_URL` saat domain resmi
 * (mis. `https://fajarbaru.desa.id`) sudah aktif — tanpa perlu menyentuh kode.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL
).replace(/\/$/, "");

export const siteConfig = {
  url: siteUrl,

  /** Nama pendek untuk judul, footer, dan `og:site_name`. */
  name: "Desa Fajar Baru",

  /** Nama resmi instansi untuk JSON-LD dan atribusi. */
  officialName: "Pemerintah Desa Fajar Baru",

  /** Kode wilayah Kemendagri (BPS). */
  identifier: "18.01.13.2009",

  email: "fajarbaru.lamsel@gmail.com",

  address: {
    streetAddress: "Balai Desa Fajar Baru",
    addressLocality: "Jati Agung",
    addressRegion: "Lampung Selatan",
    postalCode: "35365",
    addressCountry: "ID",
  },

  /** Alamat tampilan (bukan untuk JSON-LD). */
  addressLines: [
    "Balai Desa Fajar Baru",
    "Kec. Jati Agung, Lampung Selatan",
    "Lampung 35365",
  ],

  geo: {
    latitude: -5.3436945,
    longitude: 105.2680212,
  },

  /** Jam layanan Balai Desa. `dayOfWeek` memakai format schema.org. */
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "15:00",
    /** Teks yang tampil ke pengunjung. */
    label: "Senin – Jumat, 08.00 – 15.00 WIB",
  },

  /**
   * Profil resmi di platform lain. Dipakai sebagai `sameAs` di JSON-LD untuk
   * menggabungkan entitas desa di knowledge graph Google.
   * Parameter pelacakan (`?dlrf=`, `?_r=`) dibuang agar URL stabil.
   */
  sameAs: [
    "https://www.instagram.com/desa.fajarbaru",
    "https://www.tiktok.com/@desa.fajar.baru.j",
  ],

  /** Aset brand. */
  logo: `${siteUrl}/icon.png`,
  ogImage: `${siteUrl}/brand/og-image.png`,
} as const;
