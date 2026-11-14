import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/env";

/**
 * Client Supabase khusus pembacaan publik (anon key, tanpa cookie/session).
 *
 * Berbeda dengan `createClient()` di `./server`, client ini TIDAK memanggil
 * `cookies()`. Itu penting karena `cookies()` menandai route sebagai dinamis
 * sehingga halaman publik tidak bisa di-prerender/ISR.
 *
 * Aman dipakai karena:
 * - hanya memakai anon key, sehingga tetap tunduk pada kebijakan RLS
 *   ("Public can view active links" / "Public can view active markers"),
 * - tidak pernah mengirim maupun menyimpan session pengguna,
 * - hanya untuk query SELECT data publik (bukan data admin).
 */
export function createPublicClient() {
  const { url, anonKey } = getSupabaseEnv();

  return createSupabaseClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
