export type LinkCategory = "layanan" | "medsos" | "informasi" | "survei" | "general";

export interface Link {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: LinkCategory;
  icon: string | null;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  click_count: number;
  scan_count: number;
  created_at: string;
  updated_at: string;
}

export type NewLink = Omit<
  Link,
  "id" | "click_count" | "scan_count" | "created_at" | "updated_at"
>;
export type UpdateLink = Partial<NewLink>;

export interface QrCode {
  id: string;
  title: string;
  target_url: string;
  is_active: boolean;
  scan_count: number;
  created_at: string;
  updated_at: string;
}

export type NewQrCode = Omit<
  QrCode,
  "id" | "scan_count" | "created_at" | "updated_at"
>;

export type TrafficEventType = "qr_scan" | "page_view" | "link_click";

export type MarkerJenisInfo =
  | "kantor"
  | "layanan"
  | "pendidikan"
  | "ibadah"
  | "minimarket";

export interface Marker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  keterangan: string | null;
  jenis_info: MarkerJenisInfo;
  maps_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type NewMarker = Omit<Marker, "id" | "created_at" | "updated_at">;

export interface AnalyticsSummary {
  totalPageViews: number;
  totalQrScans: number;
  totalLinkClicks: number;
  sourceBreakdown: Record<string, number>;
  topLinks: { id: string; title: string; clicks: number }[];
}

