import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Portal Informasi Desa Fajar Baru",
    template: "%s | Portal Desa Fajar Baru",
  },
  description:
    "Pusat tautan informasi dan layanan digital Desa Fajar Baru, Jati Agung, Lampung Selatan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
