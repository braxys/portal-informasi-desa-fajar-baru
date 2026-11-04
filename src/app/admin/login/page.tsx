import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata = {
  title: "Login Admin | Desa Fajar Baru",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-[0_24px_70px_-30px_rgba(15,67,58,.3)]">
          {/* Logo & Title */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
              DF
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Dashboard Admin
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Masuk untuk mengelola portal Desa Fajar Baru
            </p>
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2025 Pemerintah Desa Fajar Baru
        </p>
      </div>
    </div>
  );
}
