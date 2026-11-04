"use server";

import { createClient } from "@/lib/supabase/server";
import type { Link, LinkCategory } from "@/types/database";

export interface ServiceItem {
  id: string;
  title: string;
  label: string;
  description: string;
  icon: string;
  href: string;
  accent: string;
}

const ACCENT_MAP: Record<LinkCategory, string> = {
  bumdes: "emerald",
  layanan: "blue",
  medsos: "teal",
  informasi: "sky",
  survei: "teal",
  general: "sky",
  wisata: "sky",
};

const ICON_MAP: Record<string, string> = {
  users: "briefcase",
  globe: "building",
  shield: "shield",
  "clipboard-list": "clipboard",
  link: "link",
  instagram: "instagram",
  tiktok: "tiktok",
  youtube: "youtube",
};

/**
 * Mengambil data layanan dari database untuk ditampilkan di halaman publik
 */
export async function getServices(): Promise<ServiceItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("is_active", true)
    .in("category", ["bumdes", "layanan", "survei", "informasi"])
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Gagal mengambil services:", error.message);
    return [];
  }

  return ((data as Link[]) || []).map((link) => ({
    id: link.id,
    title: link.title,
    label: link.category.toUpperCase(),
    description: link.description || "",
    icon: ICON_MAP[link.icon || "link"] || "link",
    href: link.url,
    accent: ACCENT_MAP[link.category] || "sky",
  }));
}

/**
 * Mengambil link media sosial dari database
 */
export async function getSocials(): Promise<{ id: string; label: string; icon: string; href: string }[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("is_active", true)
    .eq("category", "medsos")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Gagal mengambil socials:", error.message);
    return [];
  }

  return ((data as Link[]) || []).map((link) => ({
    id: link.id,
    label: link.title,
    icon: ICON_MAP[link.icon || "link"] || "link",
    href: link.url,
  }));
}
