"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Marker, MarkerJenisInfo, NewMarker } from "@/types/database";
import { DEFAULT_MARKERS } from "@/lib/default-markers";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

function isMarkerJenisInfo(value: string): value is MarkerJenisInfo {
  return value === "kantor" || value === "layanan" || value === "pendidikan";
}

function getMarkerPayload(
  formData: FormData,
): { error: string } | { payload: NewMarker } {
  const nameValue = formData.get("name");
  const latitudeValue = formData.get("latitude");
  const longitudeValue = formData.get("longitude");
  const jenisInfoValue = formData.get("jenis_info");
  const displayOrderValue = formData.get("display_order");

  const name = typeof nameValue === "string" ? nameValue.trim() : "";
  const latitudeText = typeof latitudeValue === "string" ? latitudeValue.trim() : "";
  const longitudeText = typeof longitudeValue === "string" ? longitudeValue.trim() : "";
  const jenisInfo =
    typeof jenisInfoValue === "string" ? jenisInfoValue : "layanan";
  const displayOrderText =
    typeof displayOrderValue === "string" ? displayOrderValue.trim() : "";

  if (!name || name.length > 255) {
    return { error: "Nama lokasi wajib diisi (maksimal 255 karakter)." };
  }

  if (!latitudeText || !longitudeText) {
    return { error: "Latitude dan longitude wajib diisi." };
  }

  const latitude = Number(latitudeText);
  const longitude = Number(longitudeText);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { error: "Latitude dan longitude harus berupa angka yang valid." };
  }
  if (latitude < -90 || latitude > 90) {
    return { error: "Latitude harus antara -90 dan 90." };
  }
  if (longitude < -180 || longitude > 180) {
    return { error: "Longitude harus antara -180 dan 180." };
  }
  if (!isMarkerJenisInfo(jenisInfo)) {
    return { error: "Jenis lokasi tidak valid." };
  }

  const displayOrder = displayOrderText ? Number(displayOrderText) : 0;
  if (!Number.isSafeInteger(displayOrder) || displayOrder < 0) {
    return { error: "Urutan harus berupa bilangan bulat nonnegatif." };
  }

  const keteranganValue = formData.get("keterangan");
  const keterangan =
    typeof keteranganValue === "string" ? keteranganValue.trim() || null : null;

  return {
    payload: {
      name,
      latitude,
      longitude,
      keterangan,
      jenis_info: jenisInfo,
      is_active:
        formData.get("is_active") === "true" ||
        formData.get("is_active") === "on",
      display_order: displayOrder,
    },
  };
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

  if (error || !data || data.length === 0) {
    if (error) console.error("Gagal mengambil markers:", error.message);
    return DEFAULT_MARKERS;
  }

  return data as Marker[];
}

/**
 * Mengambil semua marker (termasuk nonaktif) untuk admin
 * Jika database kosong atau belum memuat marker patokan (Balai Desa & SDN 1), otomatis diinisialisasi.
 */
export async function getAllMarkersAdmin(): Promise<Marker[]> {
  const supabase = await createClient();

  // Hapus data puskesdes lama jika ada
  try {
    await supabase.from("markers").delete().ilike("name", "%puskesdes%");
  } catch {
    // Abaikan jika tabel belum ada atau gagal delete
  }

  const { data, error } = await supabase
    .from("markers")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Gagal mengambil admin markers:", error.message);
    return DEFAULT_MARKERS;
  }

  // Jika tabel masih kosong, simpan marker default otomatis
  if (!data || data.length === 0) {
    try {
      const toInsert = DEFAULT_MARKERS.map((m) => ({
        name: m.name,
        latitude: m.latitude,
        longitude: m.longitude,
        keterangan: m.keterangan,
        jenis_info: m.jenis_info,
        is_active: m.is_active,
        display_order: m.display_order,
      }));
      const { data: inserted, error: insertError } = await supabase
        .from("markers")
        .insert(toInsert)
        .select();

      if (!insertError && inserted && inserted.length > 0) {
        return inserted as Marker[];
      }
    } catch {
      // Abaikan jika insert gagal
    }
    return DEFAULT_MARKERS;
  }

  // Pastikan kedua marker default selalu tersedia
  const existingNames = new Set(data.map((m) => m.name.toLowerCase()));
  const missingDefaults = DEFAULT_MARKERS.filter(
    (d) => !existingNames.has(d.name.toLowerCase())
  );

  if (missingDefaults.length > 0) {
    try {
      const toInsert = missingDefaults.map((m) => ({
        name: m.name,
        latitude: m.latitude,
        longitude: m.longitude,
        keterangan: m.keterangan,
        jenis_info: m.jenis_info,
        is_active: m.is_active,
        display_order: m.display_order,
      }));
      const { data: inserted } = await supabase
        .from("markers")
        .insert(toInsert)
        .select();

      if (inserted && inserted.length > 0) {
        return [...data, ...(inserted as Marker[])].sort((a, b) => a.display_order - b.display_order);
      }
    } catch {
      // Abaikan jika insert gagal
    }
    return [...data, ...missingDefaults].sort((a, b) => a.display_order - b.display_order);
  }

  return data as Marker[];
}

/**
 * Tambah marker baru
 */
export async function createMarkerAction(formData: FormData): Promise<ActionResult<Marker>> {
  const supabase = await createClient();
  const result = getMarkerPayload(formData);
  if ("error" in result) return { success: false, error: result.error };

  const { data, error } = await supabase
    .from("markers")
    .insert([result.payload])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
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
  const result = getMarkerPayload(formData);
  if ("error" in result) return { success: false, error: result.error };

  if (id.startsWith("default-")) {
    const { data, error } = await supabase
      .from("markers")
      .insert([result.payload])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true, data: data as Marker };
  }

  const { data, error } = await supabase
    .from("markers")
    .update(result.payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard");

  return { success: true, data: data as Marker };
}

/**
 * Hapus marker
 */
export async function deleteMarkerAction(id: string): Promise<ActionResult> {
  if (id.startsWith("default-")) {
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("markers").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
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
  if (id.startsWith("default-")) {
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("markers")
    .update({ is_active: nextStatus })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard");

  return { success: true };
}
