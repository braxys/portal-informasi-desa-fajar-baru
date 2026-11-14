import type { Metadata, Viewport } from "next";
import { dmSans, manrope } from "./fonts";
import { siteConfig, siteUrl } from "@/lib/site-config";
import "./globals.css";

const siteDescription =
  "Portal resmi informasi pemerintahan, peta wilayah, dan layanan publik digital Desa Fajar Baru, Kecamatan Jati Agung, Kabupaten Lampung Selatan.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteConfig.name,
  title: {
    default: "Desa Fajar Baru | Portal Informasi & Layanan Masyarakat",
    template: "%s | Portal Desa Fajar Baru",
  },
  description: siteDescription,
  keywords: [
    "Fajar Baru",
    "Desa Fajar Baru",
    "Desa Fajar Baru Jati Agung",
    "Fajar Baru Lampung Selatan",
    "Portal Desa Fajar Baru",
    "Pemerintah Desa Fajar Baru",
    "Balai Desa Fajar Baru",
    "Peta Desa Fajar Baru",
    "Layanan Desa Fajar Baru",
    "Jati Agung",
    "Lampung Selatan",
  ],
  authors: [{ name: siteConfig.officialName, url: siteUrl }],
  creator: siteConfig.officialName,
  publisher: siteConfig.officialName,
  category: "government",
  // `alternates.canonical` sengaja TIDAK di sini. Metadata layout diwarisi
  // semua rute, sehingga halaman admin akan ikut mengklaim canonical beranda.
  // Canonical didefinisikan per halaman di masing-masing `page.tsx`.
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: siteConfig.name,
    title: "Desa Fajar Baru | Portal Informasi & Layanan Masyarakat",
    description: siteDescription,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Portal Informasi Desa Fajar Baru, Kecamatan Jati Agung, Lampung Selatan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Desa Fajar Baru | Portal Informasi & Layanan Masyarakat",
    description:
      "Pusat informasi dan layanan publik digital Desa Fajar Baru, Kecamatan Jati Agung, Lampung Selatan.",
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Dikosongkan bila token verifikasi belum diisi, sehingga tidak menghasilkan
  // tag kosong. Isi NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION di dashboard hosting.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  other: {
    "geo.region": "ID-LA",
    "geo.placename": "Desa Fajar Baru, Jati Agung, Lampung Selatan",
    "geo.position": `${siteConfig.geo.latitude};${siteConfig.geo.longitude}`,
    ICBM: `${siteConfig.geo.latitude}, ${siteConfig.geo.longitude}`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#047857" },
    { media: "(prefers-color-scheme: dark)", color: "#064e3b" },
  ],
  colorScheme: "light",
};

/**
 * Structured data untuk knowledge graph Google.
 *
 * `@graph` dipakai supaya tiap node punya `@id` stabil dan saling merujuk
 * lewat referensi `{"@id": ...}` — bukan objek bersarang yang diduplikasi.
 * Node yang dipakai:
 * - GovernmentOrganization: entitas instansi (NAP, geo, jam layanan, sameAs)
 * - WebSite: situs beserta penerbitnya
 * - WebPage: halaman beranda, menunjuk ke WebSite dan Organization
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "GovernmentOrganization",
      "@id": `${siteUrl}/#organization`,
      name: siteConfig.officialName,
      alternateName: [
        "Desa Fajar Baru",
        "Pemdes Fajar Baru",
        "Pemerintahan Desa Fajar Baru Jati Agung",
      ],
      identifier: siteConfig.identifier,
      url: siteUrl,
      logo: siteConfig.logo,
      image: siteConfig.ogImage,
      description: siteDescription,
      email: siteConfig.email,
      address: {
        "@type": "PostalAddress",
        ...siteConfig.address,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: siteConfig.geo.latitude,
        longitude: siteConfig.geo.longitude,
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Desa Fajar Baru, Jati Agung, Lampung Selatan",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [...siteConfig.openingHours.days],
          opens: siteConfig.openingHours.opens,
          closes: siteConfig.openingHours.closes,
        },
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: siteConfig.email,
          availableLanguage: ["id"],
          areaServed: "ID",
        },
      ],
      sameAs: [...siteConfig.sameAs],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Portal Informasi Desa Fajar Baru",
      description:
        "Pusat informasi dan layanan publik digital Desa Fajar Baru, Kecamatan Jati Agung, Lampung Selatan.",
      inLanguage: "id-ID",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: "Desa Fajar Baru | Portal Informasi & Layanan Masyarakat",
      description: siteDescription,
      isPartOf: {
        "@id": `${siteUrl}/#website`,
      },
      about: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "id-ID",
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${dmSans.variable} ${manrope.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
