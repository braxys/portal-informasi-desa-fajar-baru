export type LinkCategory = "bumdes" | "layanan" | "medsos" | "informasi" | "survei" | "general" | "wisata";

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
  created_at: string;
  updated_at: string;
}

export type NewLink = Omit<Link, "id" | "click_count" | "created_at" | "updated_at">;
export type UpdateLink = Partial<NewLink>;

export type TrafficEventType = "qr_scan" | "page_view" | "link_click";

export interface TrafficLog {
  id: string;
  event_type: TrafficEventType;
  link_id: string | null;
  source: string;
  user_agent: string | null;
  ip_hash: string | null;
  created_at: string;
}

export type NewTrafficLog = Omit<TrafficLog, "id" | "created_at">;

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
        Insert: Omit<Link, "id" | "created_at" | "updated_at"> & {
          id?: string;
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
    };
    Functions: {
      increment_link_click: {
        Args: { target_link_id: string };
        Returns: void;
      };
    };
  };
}
