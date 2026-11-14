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
export type UpdateQrCode = Partial<NewQrCode>;

export type TrafficEventType = "qr_scan" | "page_view" | "link_click";

export interface TrafficLog {
  id: string;
  event_type: TrafficEventType;
  link_id: string | null;
  qr_code_id: string | null;
  source: string;
  user_agent: string | null;
  ip_hash: string | null;
  created_at: string;
}

export type NewTrafficLog = Omit<TrafficLog, "id" | "created_at">;

export type MarkerJenisInfo = "kantor" | "layanan" | "pendidikan";

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
export type UpdateMarker = Partial<NewMarker>;

export interface AnalyticsSummary {
  totalPageViews: number;
  totalQrScans: number;
  totalLinkClicks: number;
  sourceBreakdown: Record<string, number>;
  topLinks: { id: string; title: string; clicks: number }[];
}

export interface Database {
  public: {
    Tables: {
      links: {
        Row: Link;
        Insert: Omit<
          Link,
          "id" | "click_count" | "scan_count" | "created_at" | "updated_at"
        > & {
          id?: string;
          click_count?: number;
          scan_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Link, "id">>;
      };
      traffic_logs: {
        Row: TrafficLog;
        Insert: Omit<TrafficLog, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<TrafficLog, "id">>;
      };
      markers: {
        Row: Marker;
        Insert: Omit<Marker, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Marker, "id">>;
      };
      qr_codes: {
        Row: QrCode;
        Insert: Omit<
          QrCode,
          "id" | "scan_count" | "created_at" | "updated_at"
        > & {
          id?: string;
          scan_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<QrCode, "id">>;
      };
    };
    Functions: {
      increment_link_click: {
        Args: { target_link_id: string };
        Returns: void;
      };
      increment_qr_scan: {
        Args: { target_link_id: string };
        Returns: void;
      };
      increment_qr_code_scan: {
        Args: { target_qr_code_id: string };
        Returns: void;
      };
    };
  };
}
