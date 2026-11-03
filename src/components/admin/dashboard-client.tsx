"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { logoutAction } from "@/actions/auth";
import { deleteLinkAction, toggleLinkStatusAction } from "@/actions/links";
import { LinkForm } from "@/components/admin/link-form";
import { Icon } from "@/components/ui/icon";
import {
  CATEGORY_OPTIONS,
  getCategoryMeta,
  getLinkHost,
  getLinkIconName,
} from "@/lib/link-meta";
import type {
  AnalyticsSummary,
  Link as VillageLink,
  LinkCategory,
} from "@/types/database";

interface DashboardClientProps {
  links: VillageLink[];
  summary: AnalyticsSummary;
  adminEmail: string;
  configured: boolean;
}

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; link: VillageLink }
  | null;

type ToastState = { type: "success" | "error"; message: string } | null;

function formatNumber(value: number): string {
  return value.toLocaleString("id-ID");
}

function formatSource(source: string): string {
  const labels: Record<string, string> = {
    web_direct: "Akses langsung",
    qr_balai_desa: "QR Balai Desa",
    qr_poster: "QR Poster",
    whatsapp: "WhatsApp",
  };

  return labels[source] ?? source.replaceAll("_", " ");
}

export function DashboardClient({
  links,
  summary,
  adminEmail,
  configured,
}: DashboardClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | LinkCategory>("all");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [modal, setModal] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<VillageLink | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setModal(null);
        setDeleteTarget(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const isModalOpen = Boolean(modal || deleteTarget);
    document.body.style.overflow = isModalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [modal, deleteTarget]);

  const filteredLinks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return links.filter((link) => {
      const matchesQuery =
        !normalizedQuery ||
        link.title.toLowerCase().includes(normalizedQuery) ||
        link.url.toLowerCase().includes(normalizedQuery) ||
        (link.description ?? "").toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        category === "all" || link.category === category;

      const matchesStatus =
        status === "all" ||
        (status === "active" ? link.is_active : !link.is_active);

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [links, query, category, status]);

  const activeCount = links.filter((link) => link.is_active).length;
  const inactiveCount = links.length - activeCount;
  const totalClicks = links.reduce(
    (total, link) => total + (link.click_count || 0),
    0,
  );

  const stats = [
    {
      label: "Total Tautan",
      value: links.length,
      hint: `${inactiveCount} nonaktif`,
      icon: "link",
      gradient: "from-sky-500 to-blue-600",
    },
    {
      label: "Tautan Aktif",
      value: activeCount,
      hint: "Tampil di portal warga",
      icon: "check",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      label: "Total Klik",
      value: totalClicks,
      hint: "Akumulasi seluruh tautan",
      icon: "mouse-pointer-click",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      label: "Pindai QR",
      value: summary.totalQrScans,
      hint: `${formatNumber(summary.totalPageViews)} kunjungan halaman`,
      icon: "qr-code",
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  const topLinks = summary.topLinks
    .slice()
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);
  const maxClicks = Math.max(...topLinks.map((item) => item.clicks), 1);

  const sourceEntries = Object.entries(summary.sourceBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
  const totalSources = sourceEntries.reduce((total, [, value]) => total + value, 0);

  function openCreateModal() {
    if (!configured) {
      setToast({
        type: "error",
        message: "Hubungkan Supabase terlebih dahulu untuk menambah tautan.",
      });
      return;
    }

    setModal({ mode: "create" });
  }

  async function handleToggle(link: VillageLink) {
    if (!configured) {
      setToast({
        type: "error",
        message: "Hubungkan Supabase terlebih dahulu untuk mengubah status.",
      });
      return;
    }

    setBusyId(link.id);

    try {
      const result = await toggleLinkStatusAction(link.id, !link.is_active);

      if (!result.success) {
        throw new Error(result.error ?? "Gagal mengubah status tautan.");
      }

      setToast({
        type: "success",
        message: `Tautan "${link.title}" ${
          link.is_active ? "dinonaktifkan" : "diaktifkan"
        }.`,
      });
      router.refresh();
    } catch (error) {
      setToast({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengubah status tautan.",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setDeleting(true);

    try {
      const result = await deleteLinkAction(deleteTarget.id);

      if (!result.success) {
        throw new Error(result.error ?? "Gagal menghapus tautan.");
      }

      setToast({
        type: "success",
        message: `Tautan "${deleteTarget.title}" berhasil dihapus.`,
      });
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      setToast({
        type: "error",
        message:
          error instanceof Error ? error.message : "Gagal menghapus tautan.",
      });
    } finally {
      setDeleting(false);
    }
  }

  function handleFormSuccess(message: string) {
    setModal(null);
    setToast({ type: "success", message });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-100/80">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
          <NextLink
            href="/"
            className="flex items-center gap-3 rounded-xl px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-600 text-sm font-black text-white shadow-md shadow-emerald-700/20">
              FB
            </span>
            <span>
              <span className="block text-sm font-bold tracking-tight text-slate-900">
                Portal Desa
              </span>
              <span className="block text-[11px] text-slate-500">
                Fajar Baru · Admin
              </span>
            </span>
          </NextLink>

          <nav className="mt-8 space-y-1">
            <span className="px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Menu
            </span>
            <NextLink
              href="/admin/dashboard"
              aria-current="page"
              className="flex items-center gap-2.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100"
            >
              <Icon name="layout-dashboard" size={17} />
              Dashboard
            </NextLink>
            <NextLink
              href="/"
              target="_blank"
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <Icon name="home" size={17} />
              Lihat Portal
              <Icon
                name="external-link"
                size={13}
                className="ml-auto text-slate-400"
              />
            </NextLink>
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-[11px] font-bold uppercase text-white">
                  {adminEmail.slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Masuk sebagai
                  </p>
                  <p className="truncate text-xs font-semibold text-slate-700">
                    {adminEmail}
                  </p>
                </div>
              </div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"
              >
                <Icon name="logout" size={15} />
                Keluar
              </button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-sky-600 text-xs font-black text-white shadow-sm">
                FB
              </span>
              <div>
                <p className="text-xs font-bold tracking-tight text-slate-900">
                  Portal Desa
                </p>
                <p className="text-[10px] text-slate-500">Dashboard Admin</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <NextLink
                href="/"
                target="_blank"
                aria-label="Lihat portal warga"
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:text-emerald-700"
              >
                <Icon name="external-link" size={16} />
              </NextLink>
              <form action={logoutAction}>
                <button
                  type="submit"
                  aria-label="Keluar dari dashboard"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
                >
                  <Icon name="logout" size={16} />
                </button>
              </form>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-6xl space-y-5">
              {!configured ? (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
                  <Icon
                    name="alert-triangle"
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />
                  <div>
                    <strong className="font-semibold">Mode demo.</strong> Data di
                    bawah adalah contoh. Isi <code>.env.local</code> dengan
                    kredensial Supabase agar tambah, ubah, dan hapus tautan
                    berfungsi.
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    Dashboard
                  </p>
                  <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[26px]">
                    Kelola Tautan Desa
                  </h1>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Halo,{" "}
                    <span className="font-medium text-slate-700">
                      {adminEmail}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <NextLink
                    href="/"
                    target="_blank"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-100"
                  >
                    <Icon name="external-link" size={15} />
                    Lihat Portal
                  </NextLink>
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 px-4 text-xs font-semibold text-white shadow-md shadow-emerald-700/20 transition hover:from-emerald-700 hover:to-sky-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
                  >
                    <Icon name="plus" size={16} />
                    Tambah Tautan
                  </button>
                </div>
              </div>

              <section
                aria-label="Ringkasan statistik"
                className="grid grid-cols-2 gap-3 lg:grid-cols-4"
              >
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-semibold text-slate-500">
                        {stat.label}
                      </span>
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-sm`}
                      >
                        <Icon name={stat.icon} size={16} />
                      </span>
                    </div>
                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                      {formatNumber(stat.value)}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {stat.hint}
                    </p>
                  </div>
                ))}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-bold tracking-tight text-slate-900">
                      Daftar Tautan
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Menampilkan {filteredLinks.length} dari {links.length} tautan
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 grid w-9 place-items-center text-slate-400">
                        <Icon name="search" size={15} />
                      </span>
                      <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Cari judul atau URL…"
                        aria-label="Cari tautan"
                        className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 sm:w-52"
                      />
                    </div>

                    <select
                      value={category}
                      onChange={(event) =>
                        setCategory(event.target.value as "all" | LinkCategory)
                      }
                      aria-label="Filter kategori"
                      className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="all">Semua kategori</option>
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(
                          event.target.value as "all" | "active" | "inactive",
                        )
                      }
                      aria-label="Filter status"
                      className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    >
                      <option value="all">Semua status</option>
                      <option value="active">Aktif</option>
                      <option value="inactive">Nonaktif</option>
                    </select>
                  </div>
                </div>

                {filteredLinks.length === 0 ? (
                  <div className="flex flex-col items-center px-6 py-12 text-center">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
                      <Icon name="search" size={22} />
                    </span>
                    <p className="mt-3 text-sm font-semibold text-slate-800">
                      Tidak ada tautan yang cocok
                    </p>
                    <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
                      Coba ubah kata kunci atau filter, atau tambahkan tautan baru
                      untuk portal desa.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setCategory("all");
                        setStatus("all");
                      }}
                      className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      <Icon name="refresh" size={14} />
                      Reset filter
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="hidden overflow-x-auto md:block">
                      <table className="w-full min-w-[720px] text-left">
                        <thead className="bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-500">
                          <tr>
                            <th scope="col" className="px-5 py-3 font-semibold">
                              Tautan
                            </th>
                            <th scope="col" className="px-4 py-3 font-semibold">
                              Kategori
                            </th>
                            <th scope="col" className="px-4 py-3 font-semibold">
                              Status
                            </th>
                            <th scope="col" className="px-4 py-3 text-right font-semibold">
                              Klik
                            </th>
                            <th scope="col" className="px-4 py-3 text-center font-semibold">
                              Urutan
                            </th>
                            <th scope="col" className="px-5 py-3 text-right font-semibold">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLinks.map((link) => {
                            const meta = getCategoryMeta(link.category);
                            const isBusy = busyId === link.id;

                            return (
                              <tr
                                key={link.id}
                                className="border-t border-slate-100 transition hover:bg-slate-50/60"
                              >
                                <td className="px-5 py-3.5">
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${meta.accentClassName} text-white shadow-sm`}
                                    >
                                      <Icon
                                        name={getLinkIconName(link)}
                                        size={18}
                                      />
                                    </span>
                                    <div className="min-w-0">
                                      <p className="flex items-center gap-1.5 truncate text-[13px] font-semibold text-slate-900">
                                        {link.title}
                                        {link.is_featured ? (
                                          <Icon
                                            name="sparkles"
                                            size={13}
                                            className="shrink-0 text-amber-500"
                                          />
                                        ) : null}
                                      </p>
                                      <p className="truncate text-[11px] text-slate-400">
                                        {getLinkHost(link.url)}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5">
                                  <span
                                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${meta.badgeClassName}`}
                                  >
                                    {meta.label}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5">
                                  <button
                                    type="button"
                                    onClick={() => handleToggle(link)}
                                    disabled={isBusy}
                                    aria-pressed={link.is_active}
                                    aria-label={`${link.is_active ? "Nonaktifkan" : "Aktifkan"} ${link.title}`}
                                    className="inline-flex items-center gap-2 rounded-lg px-1 py-1 text-[11px] font-medium text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:opacity-50"
                                  >
                                    <span
                                      className={`relative h-5 w-9 rounded-full transition ${
                                        link.is_active
                                          ? "bg-emerald-500"
                                          : "bg-slate-300"
                                      }`}
                                    >
                                      <span
                                        className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                          link.is_active
                                            ? "translate-x-4"
                                            : "translate-x-0"
                                        }`}
                                      />
                                    </span>
                                    {isBusy
                                      ? "Menyimpan…"
                                      : link.is_active
                                        ? "Aktif"
                                        : "Nonaktif"}
                                  </button>
                                </td>
                                <td className="px-4 py-3.5 text-right text-xs font-semibold text-slate-700">
                                  {formatNumber(link.click_count)}
                                </td>
                                <td className="px-4 py-3.5 text-center text-xs text-slate-500">
                                  {link.display_order}
                                </td>
                                <td className="px-5 py-3.5">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setModal({ mode: "edit", link })
                                      }
                                      aria-label={`Edit ${link.title}`}
                                      title="Edit tautan"
                                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                                    >
                                      <Icon name="pencil" size={15} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeleteTarget(link)}
                                      aria-label={`Hapus ${link.title}`}
                                      title="Hapus tautan"
                                      className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                                    >
                                      <Icon name="trash" size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <ul className="divide-y divide-slate-100 md:hidden">
                      {filteredLinks.map((link) => {
                        const meta = getCategoryMeta(link.category);
                        const isBusy = busyId === link.id;

                        return (
                          <li key={link.id} className="p-4">
                            <div className="flex items-start gap-3">
                              <span
                                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${meta.accentClassName} text-white shadow-sm`}
                              >
                                <Icon name={getLinkIconName(link)} size={18} />
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-900">
                                  <span className="truncate">{link.title}</span>
                                  {link.is_featured ? (
                                    <Icon
                                      name="sparkles"
                                      size={13}
                                      className="shrink-0 text-amber-500"
                                    />
                                  ) : null}
                                </p>
                                <p className="truncate text-[11px] text-slate-400">
                                  {getLinkHost(link.url)}
                                </p>
                                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                  <span
                                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${meta.badgeClassName}`}
                                  >
                                    {meta.label}
                                  </span>
                                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                                    <Icon
                                      name="mouse-pointer-click"
                                      size={10}
                                    />
                                    {formatNumber(link.click_count)} klik
                                  </span>
                                </div>
                              </div>
                            </div>

                            {link.description ? (
                              <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                                {link.description}
                              </p>
                            ) : null}

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggle(link)}
                                disabled={isBusy}
                                aria-pressed={link.is_active}
                                className="inline-flex items-center gap-2 rounded-lg py-1 pr-2 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                              >
                                <span
                                  className={`relative h-5 w-9 rounded-full transition ${
                                    link.is_active
                                      ? "bg-emerald-500"
                                      : "bg-slate-300"
                                  }`}
                                >
                                  <span
                                    className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                                      link.is_active
                                        ? "translate-x-4"
                                        : "translate-x-0"
                                    }`}
                                  />
                                </span>
                                {isBusy
                                  ? "Menyimpan…"
                                  : link.is_active
                                    ? "Aktif"
                                    : "Nonaktif"}
                              </button>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => setModal({ mode: "edit", link })}
                                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                  <Icon name="pencil" size={13} />
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(link)}
                                  aria-label={`Hapus ${link.title}`}
                                  className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:text-rose-600"
                                >
                                  <Icon name="trash" size={13} />
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </section>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold tracking-tight text-slate-900">
                      Tautan Terpopuler
                    </h2>
                    <Icon
                      name="bar-chart"
                      size={16}
                      className="text-slate-400"
                    />
                  </div>

                  {topLinks.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                      {topLinks.map((item, index) => (
                        <li key={item.id}>
                          <div className="flex items-center justify-between gap-3 text-[11px]">
                            <span className="truncate text-slate-600">
                              <span className="mr-1.5 font-semibold text-slate-400">
                                {index + 1}.
                              </span>
                              {item.title}
                            </span>
                            <span className="shrink-0 font-semibold text-slate-700">
                              {formatNumber(item.clicks)}
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500"
                              style={{
                                width: `${Math.round(
                                  (item.clicks / maxClicks) * 100,
                                )}%`,
                              }}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-xs text-slate-400">
                      Belum ada data klik tautan.
                    </p>
                  )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold tracking-tight text-slate-900">
                      Sumber Kunjungan
                    </h2>
                    <Icon name="activity" size={16} className="text-slate-400" />
                  </div>

                  {sourceEntries.length > 0 ? (
                    <ul className="mt-4 space-y-2.5">
                      {sourceEntries.map(([source, count]) => (
                        <li
                          key={source}
                          className="flex items-center justify-between gap-3 text-[11px]"
                        >
                          <span className="flex items-center gap-2 text-slate-600">
                            <span className="grid h-6 w-6 place-items-center rounded-md bg-slate-100 text-slate-500">
                              <Icon
                                name={
                                  source.startsWith("qr") ? "qr-code" : "globe"
                                }
                                size={12}
                              />
                            </span>
                            {formatSource(source)}
                          </span>
                          <span className="font-semibold text-slate-700">
                            {totalSources > 0
                              ? `${Math.round((count / totalSources) * 100)}%`
                              : "0%"}
                            <span className="ml-1.5 font-normal text-slate-400">
                              ({formatNumber(count)})
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-xs text-slate-400">
                      Belum ada data kunjungan.
                    </p>
                  )}
                </section>
              </div>

              <p className="pb-2 text-center text-[10px] text-slate-400">
                Portal Informasi Desa Fajar Baru · Kelompok 3 KSI ITERA 2026
              </p>
            </div>
          </main>
        </div>
      </div>

      {modal ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setModal(null);
            }
          }}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="link-modal-title"
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="link-modal-title"
                  className="text-base font-bold tracking-tight text-slate-900"
                >
                  {modal.mode === "create" ? "Tambah Tautan Baru" : "Edit Tautan"}
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {modal.mode === "create"
                    ? "Tautan akan langsung tampil di portal warga setelah disimpan."
                    : "Perubahan akan langsung terlihat di portal warga."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModal(null)}
                aria-label="Tutup dialog"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <Icon name="x" size={17} />
              </button>
            </div>

            <LinkForm
              key={modal.mode === "edit" ? modal.link.id : "new-link"}
              link={modal.mode === "edit" ? modal.link : undefined}
              onCancel={() => setModal(null)}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setDeleteTarget(null);
            }
          }}
          role="presentation"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-rose-50 text-rose-600">
              <Icon name="trash" size={20} />
            </span>
            <h2
              id="delete-modal-title"
              className="mt-3 text-base font-bold tracking-tight text-slate-900"
            >
              Hapus tautan ini?
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
              <span className="font-semibold text-slate-700">
                “{deleteTarget.title}”
              </span>{" "}
              akan dihapus permanen dari database. Tindakan ini tidak dapat
              dibatalkan.
            </p>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Icon name="refresh" size={14} className="animate-spin" />
                    Menghapus…
                  </>
                ) : (
                  <>
                    <Icon name="trash" size={14} />
                    Hapus Tautan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-4 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-start gap-2.5 rounded-xl border p-3 text-xs shadow-lg ${
            toast.type === "success"
              ? "border-emerald-200 bg-white text-emerald-800"
              : "border-rose-200 bg-white text-rose-800"
          }`}
        >
          <span
            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
              toast.type === "success"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            <Icon
              name={toast.type === "success" ? "check" : "alert-triangle"}
              size={12}
            />
          </span>
          <span className="flex-1 leading-relaxed">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Tutup notifikasi"
            className="text-slate-400 transition hover:text-slate-600"
          >
            <Icon name="x" size={14} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
