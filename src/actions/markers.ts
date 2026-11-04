"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Marker, MarkerJenisInfo, NewMarker, UpdateMarker } from "@/types/database";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Mengambil semua marker aktif untuk peta publik
 */
export async function getPublicMarkers(): Promise<Marker[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("markers")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Gagal mengambil markers:", error.message);
    return [];
  }

  return (data as Marker[]) || [];
}

/**
 * Mengambil semua marker (termasuk nonaktif) untuk admin
 */
export async function getAllMarkersAdmin(): Promise<Marker[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("markers")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Gagal mengambil admin markers:", error.message);
    return [];
  }

  return (data as Marker[]) || [];
}

/**
 * Tambah marker baru
 */
export async function createMarkerAction(formData: FormData): Promise<ActionResult<Marker>> {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);
  const keterangan = (formData.get("keterangan") as string)?.trim() || null;
  const jenis_info = ((formData.get("jenis_info") as string) || "fasilitas") as MarkerJenisInfo;
  const is_active = formData.get("is_active") === "true" || formData.get("is_active") === "on";
  const display_order = Number(formData.get("display_order")) || 0;

  if (!name) {
    return { success: false, error: "Nama lokasi wajib diisi." };
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return { success: false, error: "Latitude dan longitude harus angka." };
  }

  if (latitude < -90 || latitude > 90) {
    return { success: false, error: "Latitude harus antara -90 dan 90." };
  }

  if (longitude < -180 || longitude > 180) {
    return { success: false, error: "Longitude harus antara -180 dan 180." };
  }

  const payload: NewMarker = {
    name,
    latitude,
    longitude,
    keterangan,
    jenis_info,
    is_active,
    display_order,
  };

  const { data, error } = await supabase
    .from("markers")
    .insert([payload])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/peta");
  revalidatePath("/admin/dashboard");

  return { success: true, data: data as Marker };
}

/**
 * Update marker
 */
export async function updateMarkerAction(
  id: string,
  formData: FormData
): Promise<ActionResult<Marker>> {
  const supabase = await createClient();

  const name = (formData.get("name") as string)?.trim();
  const latitude = parseFloat(formData.get("latitude") as string);
  const longitude = parseFloat(formData.get("longitude") as string);
  const keterangan = (formData.get("keterangan") as string)?.trim() || null;
  const jenis_info = ((formData.get("jenis_info") as string) || "fasilitas") as MarkerJenisInfo;
  const is_active = formData.get("is_active") === "true" || formData.get("is_active") === "on";
  const display_order = Number(formData.get("display_order")) || 0;

  if (!name) {
    return { success: false, error: "Nama lokasi wajib diisi." };
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return { success: false, error: "Latitude dan longitude harus angka." };
  }

  const payload: UpdateMarker = {
    name,
    latitude,
    longitude,
    keterangan,
    jenis_info,
    is_active,
    display_order,
  };

  const { data, error } = await supabase
    .from("markers")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/peta");
  revalidatePath("/admin/dashboard");

  return { success: true, data: data as Marker };
}

/**
 * Hapus marker
 */
export async function deleteMarkerAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("markers").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/peta");
  revalidatePath("/admin/dashboard");

  return { success: true };
}

/**
 * Toggle status aktif marker
 */
export async function toggleMarkerStatusAction(
  id: string,
  nextStatus: boolean
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("markers")
    .update({ is_active: nextStatus })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/peta");
  revalidatePath("/admin/dashboard");

  return { success: true };
}
