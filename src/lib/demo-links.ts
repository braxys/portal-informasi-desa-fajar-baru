import type { AnalyticsSummary, Link } from "@/types/database";

const DEMO_CREATED_AT = "2026-01-01T00:00:00.000Z";

/**
 * Data contoh yang dipakai HANYA ketika environment Supabase belum diisi.
 * Tujuannya agar halaman publik & dashboard tetap bisa direview saat demo UI.
 */
export const DEMO_LINKS: Link[] = [
  {
    id: "demo-bumdes",
    title: "Pendaftaran Pengurus BUMDes Fajar Baru",
    description:
      "Formulir open recruitment pengurus Badan Usaha Milik Desa Fajar Baru.",
    url: "https://forms.google.com",
    category: "bumdes",
    icon: "users",
    is_active: true,
    is_featured: true,
    display_order: 1,
    click_count: 128,
    created_at: DEMO_CREATED_AT,
    updated_at: DEMO_CREATED_AT,
  },
  {
    id: "demo-website",
    title: "Website Resmi Desa Fajar Baru",
    description:
      "Portal resmi informasi pemerintahan dan profil Desa Fajar Baru, Jati Agung.",
    url: "https://fajarbaru.desa.id",
    category: "layanan",
    icon: "globe",
    is_active: true,
    is_featured: false,
    display_order: 2,
    click_count: 86,
    created_at: DEMO_CREATED_AT,
    updated_at: DEMO_CREATED_AT,
  },
  {
    id: "demo-instagram",
    title: "Instagram Resmi Desa Fajar Baru",
    description:
      "Kanal dokumentasi kegiatan dan kabar terbaru seputar desa.",
    url: "https://instagram.com",
    category: "medsos",
    icon: "instagram",
    is_active: true,
    is_featured: false,
    display_order: 3,
    click_count: 54,
    created_at: DEMO_CREATED_AT,
    updated_at: DEMO_CREATED_AT,
  },
  {
    id: "demo-survei",
    title: "Survei Kepuasan & Layanan Masyarakat",
    description:
      "Kuesioner evaluasi penyebaran informasi dan layanan publik desa.",
    url: "https://forms.google.com",
    category: "survei",
    icon: "clipboard-list",
    is_active: true,
    is_featured: false,
    display_order: 4,
    click_count: 32,
    created_at: DEMO_CREATED_AT,
    updated_at: DEMO_CREATED_AT,
  },
];

export const DEMO_ANALYTICS: AnalyticsSummary = {
  totalPageViews: 412,
  totalQrScans: 197,
  totalLinkClicks: 300,
  sourceBreakdown: {
    qr_balai_desa: 132,
    qr_poster: 65,
    web_direct: 215,
  },
  topLinks: DEMO_LINKS.map((link) => ({
    id: link.id,
    title: link.title,
    clicks: link.click_count,
  })),
};
