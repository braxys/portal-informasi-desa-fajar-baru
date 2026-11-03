import type { IconName } from "@/components/shared/icons";

export const services = [
  {
    title: "Pendaftaran BUMDes",
    label: "Open Recruitment",
    description: "Bergabung dan tumbuh bersama membangun potensi ekonomi desa.",
    icon: "briefcase" as IconName,
    href: "#kontak",
    accent: "emerald",
  },
  {
    title: "Website Resmi Desa",
    label: "Informasi Publik",
    description:
      "Akses berita, profil, transparansi, dan agenda Desa Fajar Baru.",
    icon: "building" as IconName,
    href: "#informasi",
    accent: "blue",
  },
  {
    title: "Kuisioner Anti Korupsi",
    label: "Partisipasi Warga",
    description:
      "Bantu kami mewujudkan pelayanan publik yang jujur dan transparan.",
    icon: "shield" as IconName,
    href: "#kontak",
    accent: "teal",
  },
  {
    title: "Kuisioner Perilaku Masyarakat",
    label: "Survei Desa",
    description:
      "Sampaikan pandangan Anda untuk pelayanan desa yang lebih baik.",
    icon: "clipboard" as IconName,
    href: "#kontak",
    accent: "sky",
  },
]

export const socials = [
  {
    label: "Instagram",
    icon: "instagram" as IconName,
    href: "https://www.instagram.com/",
  },
  {
    label: "TikTok",
    icon: "tiktok" as IconName,
    href: "https://www.tiktok.com/",
  },
  {
    label: "YouTube",
    icon: "youtube" as IconName,
    href: "https://www.youtube.com/",
  },
]

export type MarkerType = "kantor" | "fasilitas" | "layanan"
export const markers: {
  id: number
  name: string
  type: MarkerType
  x: number
  y: number
  detail: string
}[] = [
  {
    id: 1,
    name: "Balai Desa Fajar Baru",
    type: "kantor",
    x: 48,
    y: 43,
    detail: "Pusat pelayanan administrasi masyarakat",
  },
  {
    id: 2,
    name: "Puskesdes",
    type: "fasilitas",
    x: 65,
    y: 28,
    detail: "Fasilitas kesehatan tingkat desa",
  },
  {
    id: 3,
    name: "Posko Pelayanan",
    type: "layanan",
    x: 31,
    y: 64,
    detail: "Titik informasi dan layanan warga",
  },
]
