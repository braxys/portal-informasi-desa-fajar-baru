"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { NewQrCode, QrCode } from "@/types/database";

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

function parseQrCodeForm(
  formData: FormData,
): { error: string } | { payload: NewQrCode } {
  const titleValue = formData.get("title");
  const targetValue = formData.get("target_url");

  const title = typeof titleValue === "string" ? titleValue.trim() : "";
  const targetUrl = typeof targetValue === "string" ? targetValue.trim() : "";

  if (!title) {
    return { error: "Judul QR code wajib diisi." };
  }
  if (title.length > 255) {
    return { error: "Judul QR code maksimal 255 karakter." };
  }
  if (!targetUrl) {
    return { error: "URL tujuan wajib diisi." };
  }
  if (!isHttpUrl(targetUrl)) {
    return {
      error:
        "Format URL tidak valid. Pastikan menyertakan http:// atau https://",
    };
  }

  return {
    payload: {
      title,
      target_url: targetUrl,
      is_active:
        formData.get("is_active") === "true" ||
        formData.get("is_active") === "on",
    },
  };
}

/**
 * Mengambil seluruh QR code (aktif & nonaktif) untuk Dashboard Admin
 * Diurutkan dari yang terbaru.
 */
export async function getAllQrCodesAdmin(): Promise<QrCode[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("qr_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil admin QR codes:", error.message);
    return [];
  }

  return (data as QrCode[]) || [];
}

/**
 * Membuat QR code baru. Setiap QR punya id sendiri sehingga pindai bisa
 * dihitung per QR, terpisah dari tautan mana pun.
 */
export async function createQrCodeAction(
  formData: FormData,
): Promise<ActionResult<QrCode>> {
  const supabase = await createClient();
  const parsed = parseQrCodeForm(formData);
  if ("error" in parsed) return { success: false, error: parsed.error };

  const { data, error } = await supabase
    .from("qr_codes")
    .insert([parsed.payload])
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/dashboard");

  return { success: true, data: data as QrCode };
}

/**
 * Mengubah judul, URL tujuan, atau status aktif sebuah QR code.
 */
export async function updateQrCodeAction(
  id: string,
  formData: FormData,
): Promise<ActionResult<QrCode>> {
  const supabase = await createClient();
  const parsed = parseQrCodeForm(formData);
  if ("error" in parsed) return { success: false, error: parsed.error };

  const { data, error } = await supabase
    .from("qr_codes")
    .update(parsed.payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/dashboard");

  return { success: true, data: data as QrCode };
}

/**
 * Menghapus QR code. Riwayat pindai di traffic_logs tetap tersimpan
 * (qr_code_id menjadi NULL), jadi laporan total tidak ikut hilang.
 */
export async function deleteQrCodeAction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.from("qr_codes").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/dashboard");

  return { success: true };
}

/**
 * Toggle status aktif/nonaktif QR code secara instan.
 */
export async function toggleQrCodeStatusAction(
  id: string,
  nextStatus: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("qr_codes")
    .update({ is_active: nextStatus })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/dashboard");

  return { success: true };
}
