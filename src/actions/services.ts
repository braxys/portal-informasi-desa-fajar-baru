"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getLinkCategoryIcon,
  getLinkCategoryLabel,
  normalizeLinkCategory,
} from "@/lib/link-categories";
import type { IconName } from "@/components/shared/icons";
import type { Link, LinkCategory } from "@/types/database";

export interface ServiceItem {
  id: string;
  title: string;
  label: string;
  description: string;
  icon: IconName;
  href: string;
  accent: string;
}

const ACCENT_MAP: Record<LinkCategory, string> = {
  layanan: "blue",
  medsos: "teal",
  informasi: "sky",
  survei: "teal",
  general: "sky",
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
    .in("category", ["bumdes", "layanan", "survei", "informasi", "general"])
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Gagal mengambil services:", error.message);
    return [];
  }

  return ((data as Link[]) || []).map((link) => ({
    id: link.id,
    title: link.title,
    label: getLinkCategoryLabel(link.category),
    description: link.description || "",
    icon: getLinkCategoryIcon(link.category),
    href: link.url,
    accent: ACCENT_MAP[normalizeLinkCategory(link.category)],
  }));
}

/**
 * Mengambil link media sosial dari database
 */
export async function getSocials(): Promise<{ id: string; label: string; icon: IconName; href: string }[]> {
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
    icon: getLinkCategoryIcon(link.category),
    href: link.url,
  }));
}
