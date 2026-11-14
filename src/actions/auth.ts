"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/supabase/auth";

const DEFAULT_ADMIN_REDIRECT = "/admin/dashboard";

function getSafeAdminRedirect(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") {
    return DEFAULT_ADMIN_REDIRECT;
  }

  try {
    const destination = new URL(value, "http://localhost");
    if (
      destination.origin !== "http://localhost" ||
      !destination.pathname.startsWith("/admin/") ||
      destination.pathname === "/admin/login"
    ) {
      return DEFAULT_ADMIN_REDIRECT;
    }

    return `${destination.pathname}${destination.search}${destination.hash}`;
  } catch {
    return DEFAULT_ADMIN_REDIRECT;
  }
}

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
  const redirectTo = getSafeAdminRedirect(formData.get("redirect"));

  if (!email || !password) {
    return { success: false, error: "Email dan kata sandi wajib diisi." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !isAdminUser(data.user)) {
    if (!error) {
      await supabase.auth.signOut();
    }

    return {
      success: false,
      error: error?.message === "Invalid login credentials" || !error
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
