"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/actions/auth";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin/dashboard";
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("redirect", redirect);

    startTransition(async () => {
      const result = await loginAction(formData);
      if (result.success === false && result.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm focus:border-fajar-500 focus:outline-none"
          placeholder="admin@desa.id"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-slate-700">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm focus:border-fajar-500 focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white transition hover:bg-fajar-700 disabled:opacity-50"
      >
        {isPending ? "Masuk..." : "Masuk ke Dashboard"}
      </button>
    </form>
  );
}
