import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
<<<<<<< HEAD
=======
import { isAdminUser } from "@/lib/supabase/auth";
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692

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

  // Ambil user saat ini untuk verifikasi session yang aman
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === "/admin/login";
  const isAdminRoute = pathname.startsWith("/admin");
<<<<<<< HEAD

  // 1. Proteksi Admin: Jika belum login dan mengakses area admin selain login
  if (isAdminRoute && !isLoginPage && !user) {
=======
  const isAdmin = isAdminUser(user);

  if (isAdminRoute && !isLoginPage && !isAdmin) {
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

<<<<<<< HEAD
  // 2. Jika sudah login dan membuka halaman login, arahkan ke dashboard
  if (isLoginPage && user) {
=======
  if (isLoginPage && isAdmin) {
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
