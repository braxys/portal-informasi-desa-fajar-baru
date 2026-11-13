import type { Metadata } from "next";
import "./globals.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://fajarbaru.desa.id").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Desa Fajar Baru | Portal Informasi & Layanan Masyarakat",
    template: "%s | Portal Desa Fajar Baru",
  },
  description:
    "Portal resmi informasi pemerintahan, peta wilayah, dan layanan publik digital Desa Fajar Baru, Kecamatan Jati Agung, Kabupaten Lampung Selatan.",
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
  authors: [{ name: "Pemerintah Desa Fajar Baru" }],
  creator: "Pemerintah Desa Fajar Baru",
  publisher: "Pemerintah Desa Fajar Baru",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Desa Fajar Baru",
    title: "Desa Fajar Baru | Portal Informasi & Layanan Masyarakat",
    description:
      "Portal resmi informasi pemerintahan, peta wilayah, dan layanan publik digital Desa Fajar Baru, Kecamatan Jati Agung, Kabupaten Lampung Selatan.",
    images: [
      {
        url: "/brand/logo-lampung-selatan.png",
        width: 800,
        height: 600,
        alt: "Logo Desa Fajar Baru, Lampung Selatan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Desa Fajar Baru | Portal Informasi & Layanan Masyarakat",
    description:
      "Pusat informasi dan layanan publik digital Desa Fajar Baru, Kecamatan Jati Agung, Kabupaten Lampung Selatan.",
    images: ["/brand/logo-lampung-selatan.png"],
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
  icons: {
    icon: [
      { url: "/brand/logo-lampung-selatan.png" },
      { url: "/brand/logo-lampung-selatan.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/brand/logo-lampung-selatan.png" },
    ],
    shortcut: ["/brand/logo-lampung-selatan.png"],
  },
  other: {
    "geo.region": "ID-LA",
    "geo.placename": "Desa Fajar Baru, Jati Agung, Lampung Selatan",
    "geo.position": "-5.343695;105.268021",
    ICBM: "-5.343695, 105.268021",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "GovernmentOrganization",
      "@id": `${siteUrl}/#organization`,
      name: "Pemerintah Desa Fajar Baru",
      alternateName: [
        "Desa Fajar Baru",
        "Pemdes Fajar Baru",
        "Pemerintahan Desa Fajar Baru Jati Agung",
      ],
      identifier: "18.01.13.2009",
      url: siteUrl,
      logo: `${siteUrl}/brand/logo-lampung-selatan.png`,
      image: `${siteUrl}/brand/logo-lampung-selatan.png`,
      description:
        "Portal resmi informasi pemerintahan, pemetaan wilayah, dan layanan publik digital Desa Fajar Baru, Kecamatan Jati Agung, Kabupaten Lampung Selatan.",
      telephone: "+6281234567890",
      email: "desafajarbaru@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Balai Desa Fajar Baru",
        addressLocality: "Jati Agung",
        addressRegion: "Lampung Selatan",
        postalCode: "35365",
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -5.3436945,
        longitude: 105.2680212,
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Desa Fajar Baru, Jati Agung, Lampung Selatan",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Portal Informasi Desa Fajar Baru",
      description:
        "Pusat informasi dan layanan publik digital Desa Fajar Baru, Kecamatan Jati Agung, Kabupaten Lampung Selatan.",
      inLanguage: "id-ID",
      publisher: {
        "@id": `${siteUrl}/#organization`,
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
    <html lang="id">
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
