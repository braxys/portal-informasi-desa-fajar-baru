import type { Marker } from "@/types/database";

export const DEFAULT_MARKERS: Marker[] = [
  {
    id: "default-kantor",
    name: "Balai Desa Fajar Baru",
    latitude: -5.3436945,
    longitude: 105.2680212,
    keterangan: "Pusat pelayanan administrasi kependudukan, surat pengantar, perizinan, dan koordinasi pemerintahan Desa Fajar Baru.",
    jenis_info: "kantor",
    maps_url: "https://maps.app.goo.gl/Xc7RmVGfKvzirQsc7",
    is_active: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-pendidikan",
    name: "SDN 1 Fajar Baru",
    latitude: -5.3439045,
    longitude: 105.2682266,
    keterangan: "Fasilitas pendidikan dasar negeri formal untuk siswa-siswi dan masyarakat Desa Fajar Baru.",
    jenis_info: "pendidikan",
    maps_url: null,
    is_active: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
