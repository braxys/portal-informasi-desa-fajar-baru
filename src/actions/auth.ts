"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface AuthActionResult {
  success: boolean;
  error?: string;
}

/**
 * Login admin menggunakan email dan password Supabase Auth
 */
export async function loginAction(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || "/admin/dashboard";

  if (!email || !password) {
    return { success: false, error: "Email dan kata sandi wajib diisi." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: error.message === "Invalid login credentials"
        ? "Email atau kata sandi salah. Silakan coba lagi."
        : error.message,
    };
  }

  revalidatePath("/admin", "layout");
  redirect(redirectTo);
}

/**
 * Logout admin dan hapus session cookies
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}

/**
 * Mendapatkan user admin yang sedang aktif di session
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
