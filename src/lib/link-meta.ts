import type { Link, LinkCategory } from "@/types/database";

interface CategoryMeta {
  label: string;
  icon: string;
  badgeClassName: string;
  accentClassName: string;
}

/**
 * Metadata tampilan untuk setiap kategori tautan.
 * Dipakai bersama oleh halaman publik dan dashboard admin.
 */
export const CATEGORY_META: Record<LinkCategory, CategoryMeta> = {
  bumdes: {
    label: "BUMDes",
    icon: "users",
    badgeClassName: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
    accentClassName: "from-emerald-500 to-teal-600",
  },
  layanan: {
    label: "Layanan",
    icon: "globe",
    badgeClassName: "bg-sky-100 text-sky-800 ring-sky-600/20",
    accentClassName: "from-sky-500 to-blue-600",
  },
  medsos: {
    label: "Media Sosial",
    icon: "instagram",
    badgeClassName: "bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-600/20",
    accentClassName: "from-fuchsia-500 to-pink-600",
  },
  informasi: {
    label: "Informasi",
    icon: "info",
    badgeClassName: "bg-amber-100 text-amber-800 ring-amber-600/20",
    accentClassName: "from-amber-500 to-orange-600",
  },
  survei: {
    label: "Survei",
    icon: "clipboard-list",
    badgeClassName: "bg-violet-100 text-violet-800 ring-violet-600/20",
    accentClassName: "from-violet-500 to-purple-600",
  },
  general: {
    label: "Umum",
    icon: "link",
    badgeClassName: "bg-slate-100 text-slate-700 ring-slate-600/20",
    accentClassName: "from-slate-500 to-slate-700",
  },
};

export const CATEGORY_OPTIONS = (
  Object.keys(CATEGORY_META) as LinkCategory[]
).map((value) => ({
  value,
  label: CATEGORY_META[value].label,
}));

export function getCategoryMeta(category: string): CategoryMeta {
  if (category in CATEGORY_META) {
    return CATEGORY_META[category as LinkCategory];
  }

  return CATEGORY_META.general;
}

export function getLinkIconName(link: Pick<Link, "icon" | "category">): string {
  const icon = link.icon?.trim();

  if (icon) {
    return icon;
  }

  return getCategoryMeta(link.category).icon;
}

export function getLinkHost(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
