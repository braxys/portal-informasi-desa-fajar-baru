import type { IconName } from "@/components/shared/icons";
import type { LinkCategory } from "@/types/database";

export const LINK_CATEGORIES: { value: LinkCategory; label: string }[] = [
  { value: "layanan", label: "Layanan" },
  { value: "medsos", label: "Media Sosial" },
  { value: "informasi", label: "Informasi" },
  { value: "survei", label: "Survei" },
  { value: "general", label: "Umum" },
];

const CATEGORY_ICONS: Record<LinkCategory, IconName> = {
  layanan: "building",
  medsos: "share",
  informasi: "clipboard",
  survei: "shield",
  general: "link",
};

export function isLinkCategory(value: string): value is LinkCategory {
  return LINK_CATEGORIES.some((category) => category.value === value);
}

export function normalizeLinkCategory(value: string): LinkCategory {
  if (value === "bumdes" || !isLinkCategory(value)) return "general";
  return value;
}

export function getLinkCategoryIcon(category: string): IconName {
  return CATEGORY_ICONS[normalizeLinkCategory(category)];
}

export function getLinkCategoryLabel(category: string): string {
  return LINK_CATEGORIES.find(
    (option) => option.value === normalizeLinkCategory(category),
  )?.label ?? "Umum";
}
