"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getLinkCategoryIcon, isLinkCategory } from "@/lib/link-categories";
import type { Link, LinkCategory, NewLink, UpdateLink } from "@/types/database";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

function isHttpUrl(value: string): boolean {
  try {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Mengambil seluruh tautan aktif untuk halaman publik
 * Diurutkan berdasarkan display_order ASC
 */
export async function getPublicLinks(): Promise<Link[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Gagal mengambil public links:", error.message);
    return [];
  }

  return (data as Link[]) || [];
}

/**
 * Mengambil seluruh tautan (aktif & nonaktif) untuk Dashboard Admin
 */
export async function getAllLinksAdmin(): Promise<Link[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("links")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil admin links:", error.message);
    return [];
  }

  return (data as Link[]) || [];
}

/**
 * Menambahkan tautan baru ke database
 */
export async function createLinkAction(formData: FormData): Promise<ActionResult<Link>> {
  const supabase = await createClient();

  const title = (formData.get("title") as string)?.trim();
  const url = (formData.get("url") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const categoryValue = (formData.get("category") as string) || "informasi";
  if (!isLinkCategory(categoryValue)) {
    return { success: false, error: "Kategori link tidak valid." };
  }
  const category: LinkCategory = categoryValue;
  const icon = getLinkCategoryIcon(category);
  const is_featured = formData.get("is_featured") === "true" || formData.get("is_featured") === "on";
  const is_active = formData.get("is_active") === "true" || formData.get("is_active") === "on";
  const display_order = Number(formData.get("display_order")) || 0;

  if (!title || !url) {
    return { success: false, error: "Judul dan URL tautan wajib diisi." };
  }

  if (!isHttpUrl(url)) {
    return { success: false, error: "Format URL tidak valid. Pastikan menyertakan http:// atau https://" };
  }

  const payload: NewLink = {
    title,
    url,
    description,
    category,
    icon,
    is_active,
    is_featured,
    display_order,
  };

  const { data, error } = await supabase
    .from("links")
    .insert([payload])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard");

  return { success: true, data: data as Link };
}

/**
 * Mengubah data tautan yang sudah ada
 */
export async function updateLinkAction(
  id: string,
  formData: FormData
): Promise<ActionResult<Link>> {
  const supabase = await createClient();

  const title = (formData.get("title") as string)?.trim();
  const url = (formData.get("url") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const categoryValue = (formData.get("category") as string) || "informasi";
  if (!isLinkCategory(categoryValue)) {
    return { success: false, error: "Kategori link tidak valid." };
  }
  const category: LinkCategory = categoryValue;
  const icon = getLinkCategoryIcon(category);
  const is_featured = formData.get("is_featured") === "true" || formData.get("is_featured") === "on";
  const is_active = formData.get("is_active") === "true" || formData.get("is_active") === "on";
  const display_order = Number(formData.get("display_order")) || 0;

  if (!title || !url) {
    return { success: false, error: "Judul dan URL tautan tidak boleh kosong." };
  }

  if (!isHttpUrl(url)) {
    return { success: false, error: "Format URL tidak valid. Pastikan menyertakan http:// atau https://" };
  }

  const payload: UpdateLink = {
    title,
    url,
    description,
    category,
    icon,
    is_active,
    is_featured,
    display_order,
  };

  const { data, error } = await supabase
    .from("links")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard");

  return { success: true, data: data as Link };
}

/**
 * Menghapus tautan
 */
export async function deleteLinkAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("links").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard");

  return { success: true };
}

/**
 * Toggle status aktif/nonaktif tautan secara instan
 */
export async function toggleLinkStatusAction(
  id: string,
  nextStatus: boolean
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("links")
    .update({ is_active: nextStatus })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard");

  return { success: true };
}

/**
 * Menyimpan urutan baru seluruh link setelah di-drag/reorder
 */
export async function reorderLinksAction(
  orderedIds: string[]
): Promise<ActionResult> {
  const supabase = await createClient();

  // Update urutan secara batch
  const updates = orderedIds.map((id, index) =>
    supabase.from("links").update({ display_order: index + 1 }).eq("id", id)
  );

  const results = await Promise.all(updates);
  const hasError = results.some((res) => res.error);

  if (hasError) {
    return { success: false, error: "Gagal memperbarui beberapa urutan tautan." };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard");

  return { success: true };
}
