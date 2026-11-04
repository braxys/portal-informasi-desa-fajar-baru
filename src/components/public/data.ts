<<<<<<< HEAD
// File ini sudah tidak digunakan untuk markers
// Data markers sekarang diambil dari database Supabase
// Lihat: src/actions/markers.ts
export {};
=======
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
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
