import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminUser } from "@/lib/supabase/auth";

/**
 * Nama cookie session Supabase: `sb-<project-ref>-auth-token`, dan bisa
 * dipecah menjadi beberapa chunk (`...auth-token.0`, `.1`, dst).
 *
 * Dipakai untuk short-circuit: pengunjung anonim tidak punya cookie ini,
 * jadi tidak perlu round-trip `auth.getUser()` ke Supabase.
 */
const AUTH_COOKIE_PATTERN = /^sb-.*-auth-token(\.\d+)?$/;

function hasAuthCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some((cookie) => AUTH_COOKIE_PATTERN.test(cookie.name));
}

/** Hapus seluruh cookie session yang ada di request dari response apa pun. */
function clearAuthCookies(request: NextRequest, response: NextResponse) {
  request.cookies
    .getAll()
    .filter((cookie) => AUTH_COOKIE_PATTERN.test(cookie.name))
    .forEach(({ name }) => response.cookies.delete(name));
  return response;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Jika env belum diisi, izinkan request lewat agar tidak crash saat build/dev awal
  if (!url || !anonKey) {
    return supabaseResponse;
  }

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");

  // Optimasi: pengunjung anonim (tanpa cookie session) tidak mungkin lolos
  // sebagai admin. Lewati panggilan jaringan `getUser()` yang memakan
  // ~200-600 ms per request, lalu langsung tangani redirect admin di sini.
  if (!hasAuthCookie(request)) {
    if (isAdminRoute && !isLoginPage) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/admin/login";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Ambil user saat ini untuk verifikasi session yang aman.
  //
  // `getUser()` bisa melempar error (bukan sekadar mengembalikan `error`) bila
  // cookie session rusak — misalnya cookie `base64-...` yang isinya bukan
  // UTF-8 valid. Tanpa penanganan, request berakhir 500. Di sini kegagalan
  // diperlakukan sebagai anonim (fail-closed: tidak pernah memberi akses lebih)
  // dan cookie rusaknya dihapus agar pengunjung bisa login ulang dengan bersih.
  let user: User | null = null;
  let sessionInvalid = false;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    sessionInvalid = true;
  }

  const isAdmin = isAdminUser(user);

  if (isAdminRoute && !isLoginPage && !isAdmin) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(redirectUrl);
    return sessionInvalid ? clearAuthCookies(request, response) : response;
  }

  if (isLoginPage && isAdmin) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return sessionInvalid ? clearAuthCookies(request, supabaseResponse) : supabaseResponse;
}
