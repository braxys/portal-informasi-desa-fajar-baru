import type { Marker } from "@/types/database";

type PreviewMarker = Omit<Marker, "id" | "created_at" | "updated_at">;

const previewMarkers: PreviewMarker[] = [
  {
    name: "Indomaret RA Basyid Fajar Baru",
    latitude: -5.3391882,
    longitude: 105.2747185,
    keterangan:
      "Jl. R.A. Basyid, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.",
    jenis_info: "minimarket",
    maps_url: null,
    is_active: true,
    display_order: 3,
  },
  {
    name: "Indomaret Rest Area KM 87 B",
    latitude: -5.3182311,
    longitude: 105.2662025,
    keterangan:
      "Rest Area KM 87 B, Tol Bakauheni-Kayu Agung, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.",
    jenis_info: "minimarket",
    maps_url: null,
    is_active: true,
    display_order: 4,
  },
  {
    name: "Indomaret Rest Area KM 87 A",
    latitude: -5.3194354,
    longitude: 105.2650817,
    keterangan:
      "Rest Area KM 87 A, Tol Bakauheni-Kayu Agung, area Fajar Baru/Jati Agung, Kab. Lampung Selatan.",
    jenis_info: "minimarket",
    maps_url: null,
    is_active: true,
    display_order: 5,
  },
  {
    name: "Indomaret Permata Asri TDC5",
    latitude: -5.3206612,
    longitude: 105.2891868,
    keterangan:
      "Jl. P. Senopati, Perumahan Permata Asri Blok P No. 2, Karang Sari, Kec. Jati Agung.",
    jenis_info: "minimarket",
    maps_url: null,
    is_active: true,
    display_order: 6,
  },
  {
    name: "Masjid Al-Ikhlas Fajar Baru",
    latitude: -5.3415517,
    longitude: 105.2712147,
    keterangan:
      "Jl. R.A. Basyid No. 6, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.",
    jenis_info: "ibadah",
    maps_url: null,
    is_active: true,
    display_order: 7,
  },
  {
    name: "Masjid Al-Bayinah",
    latitude: -5.3396035,
    longitude: 105.2749443,
    keterangan:
      "Jl. R.A. Basyid No. 43, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.",
    jenis_info: "ibadah",
    maps_url: null,
    is_active: true,
    display_order: 8,
  },
  {
    name: "Masjid Falahul Abbas",
    latitude: -5.33724,
    longitude: 105.2722514,
    keterangan:
      "Jl. Puspa Raya, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.",
    jenis_info: "ibadah",
    maps_url: null,
    is_active: true,
    display_order: 9,
  },
  {
    name: "Masjid Ar-Raudah",
    latitude: -5.3399886,
    longitude: 105.26765,
    keterangan: "Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.",
    jenis_info: "ibadah",
    maps_url: null,
    is_active: true,
    display_order: 10,
  },
  {
    name: "Masjid Nurul Iman (Dusun 4 Tanjung Laut)",
    latitude: -5.3207428,
    longitude: 105.2599463,
    keterangan:
      "Dusun 4 Tanjung Laut, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.",
    jenis_info: "ibadah",
    maps_url: null,
    is_active: true,
    display_order: 11,
  },
  {
    name: "Masjid Nurul Iman",
    latitude: -5.3475529,
    longitude: 105.2686271,
    keterangan: "Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.",
    jenis_info: "ibadah",
    maps_url: null,
    is_active: true,
    display_order: 12,
  },
  {
    name: "Musholla Nur Mardhatillah",
    latitude: -5.3313664,
    longitude: 105.2690089,
    keterangan: "Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.",
    jenis_info: "ibadah",
    maps_url: null,
    is_active: true,
    display_order: 13,
  },
  {
    name: "Musholla Nurhasanah",
    latitude: -5.3450768,
    longitude: 105.272706,
    keterangan:
      "Gg. Murni.AS, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.",
    jenis_info: "ibadah",
    maps_url: null,
    is_active: true,
    display_order: 14,
  },
  {
    name: "Mushola Baitul Jannah",
    latitude: -5.3341332,
    longitude: 105.2654235,
    keterangan:
      "Jl. Walet Raya, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.",
    jenis_info: "ibadah",
    maps_url: null,
    is_active: true,
    display_order: 15,
  },
  {
    name: "Mushola Al Ikhlas",
    latitude: -5.3128395,
    longitude: 105.2607603,
    keterangan: "Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.",
    jenis_info: "ibadah",
    maps_url: null,
    is_active: true,
    display_order: 16,
  },
];

const previewTimestamp = "2026-11-15T00:00:00.000Z";

export const LOCAL_MARKER_PREVIEW: Marker[] = previewMarkers.map(
  (marker, index) => ({
    ...marker,
    id: `preview-${marker.jenis_info}-${index + 1}`,
    created_at: previewTimestamp,
    updated_at: previewTimestamp,
  }),
);
