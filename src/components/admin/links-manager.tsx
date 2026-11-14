"use client";

import { useEffect, useState, useTransition } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Link, LinkCategory } from "@/types/database";
import { Icon } from "@/components/shared/icons";
import { AdminDrawer } from "@/components/admin/admin-drawer";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { OrderControls } from "@/components/admin/order-controls";
import {
  getLinkCategoryIcon,
  getLinkCategoryLabel,
  LINK_CATEGORIES,
  normalizeLinkCategory,
} from "@/lib/link-categories";
import {
  createLinkAction,
  updateLinkAction,
  deleteLinkAction,
  toggleLinkStatusAction,
  reorderLinksAction,
} from "@/actions/links";

interface LinksManagerProps {
  links: Link[];
  setLinks: Dispatch<SetStateAction<Link[]>>;
}

const EMPTY_FORM = {
  title: "",
  url: "",
  description: "",
  category: "informasi" as LinkCategory,
  is_featured: false,
  is_active: true,
  display_order: 0,
};

const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-fajar-700 focus:ring-2 focus:ring-fajar-700/15";
const labelClass = "mb-1.5 block text-xs font-bold text-slate-800";

function sortLinks(items: Link[]) {
  return [...items].sort(
    (a, b) =>
      a.display_order - b.display_order ||
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

function displayUrl(value: string) {
  try {
    const parsed = new URL(value);
    const path = parsed.pathname === "/" ? "" : parsed.pathname;
    return `${parsed.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return value;
  }
}

function LinkCategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
      <Icon name={getLinkCategoryIcon(category)} size={13} />
      {getLinkCategoryLabel(category)}
    </span>
  );
}

function LinkStatusToggle({
  link,
  pending,
  onToggle,
}: {
  link: Link;
  pending: boolean;
  onToggle: (link: Link) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={link.is_active}
      aria-label={`${link.is_active ? "Nonaktifkan" : "Aktifkan"} ${link.title}`}
      onClick={() => onToggle(link)}
      disabled={pending}
      className="inline-flex items-center gap-2 text-xs font-semibold disabled:cursor-wait disabled:opacity-60"
    >
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
          link.is_active ? "bg-fajar-700" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition ${
            link.is_active ? "translate-x-[18px]" : "translate-x-1"
          }`}
        />
      </span>
      <span
        className={link.is_active ? "text-fajar-800" : "text-slate-500"}
      >
        {link.is_active ? "Aktif" : "Nonaktif"}
      </span>
    </button>
  );
}

function LinkActions({
  link,
  pending,
  onEdit,
  onDelete,
}: {
  link: Link;
  pending: boolean;
  onEdit: (link: Link) => void;
  onDelete: (link: Link) => void;
}) {
  return (
    <div className="flex justify-end gap-1">
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Buka ${link.title} di tab baru`}
        title="Buka tautan"
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <Icon name="external" size={15} />
      </a>
      <button
        type="button"
        onClick={() => onEdit(link)}
        disabled={pending}
        aria-label={`Edit ${link.title}`}
        title="Edit tautan"
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
      >
        <Icon name="edit" size={15} />
      </button>
      <button
        type="button"
        onClick={() => onDelete(link)}
        disabled={pending}
        aria-label={`Hapus ${link.title}`}
        title="Hapus tautan"
        className="flex h-8 w-8 items-center justify-center rounded-md text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
      >
        <Icon name="trash" size={15} />
      </button>
    </div>
  );
}

export function LinksManager({ links, setLinks }: LinksManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [drawer, setDrawer] = useState<"add" | "edit" | null>(null);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Link | null>(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | LinkCategory>(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all",
  );

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const normalizedQuery = query.trim().toLowerCase();
  const orderedLinks = sortLinks(links);
  const filteredLinks = orderedLinks.filter((link) => {
    const matchesQuery =
      !normalizedQuery ||
      link.title.toLowerCase().includes(normalizedQuery) ||
      link.url.toLowerCase().includes(normalizedQuery) ||
      (link.description?.toLowerCase().includes(normalizedQuery) ?? false);
    const matchesCategory =
      categoryFilter === "all" ||
      normalizeLinkCategory(link.category) === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? link.is_active : !link.is_active);

    return matchesQuery && matchesCategory && matchesStatus;
  });
  const hasActiveFilters =
    normalizedQuery !== "" ||
    categoryFilter !== "all" ||
    statusFilter !== "all";

  function openAdd() {
    const nextOrder =
      links.reduce((max, link) => Math.max(max, link.display_order), 0) + 1;
    setForm({ ...EMPTY_FORM, display_order: nextOrder });
    setFormError(null);
    setEditingLink(null);
    setDrawer("add");
  }

  function openEdit(link: Link) {
    setEditingLink(link);
    setForm({
      title: link.title,
      url: link.url,
      description: link.description || "",
      category: normalizeLinkCategory(link.category),
      is_featured: link.is_featured,
      is_active: link.is_active,
      display_order: link.display_order,
    });
    setFormError(null);
    setDrawer("edit");
  }

  function closeDrawer() {
    if (isPending) return;
    setDrawer(null);
    setEditingLink(null);
    setFormError(null);
  }

  function resetFilters() {
    setQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
  }

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      setForm((current) => ({
        ...current,
        [name]: (event.target as HTMLInputElement).checked,
      }));
      return;
    }

    if (name === "category") {
      setForm((current) => ({
        ...current,
        category: normalizeLinkCategory(value),
      }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    startTransition(async () => {
      const result =
        drawer === "add"
          ? await createLinkAction(formData)
          : await updateLinkAction(editingLink!.id, formData);

      if (!result.success || !result.data) {
        setFormError(result.error || "Tautan gagal disimpan. Coba lagi.");
        return;
      }

      const savedLink = result.data;
      setLinks((current) =>
        sortLinks(
          drawer === "add"
            ? [...current, savedLink]
            : current.map((link) =>
                link.id === savedLink.id ? savedLink : link,
              ),
        ),
      );
      setDrawer(null);
      setEditingLink(null);
      setNotice({
        type: "success",
        text:
          drawer === "add"
            ? "Tautan berhasil ditambahkan."
            : "Perubahan tautan berhasil disimpan.",
      });
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;

    startTransition(async () => {
      const result = await deleteLinkAction(deleteTarget.id);
      if (!result.success) {
        setNotice({
          type: "error",
          text: result.error || "Tautan gagal dihapus.",
        });
        setDeleteTarget(null);
        return;
      }

      setLinks((current) =>
        current.filter((link) => link.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
      setNotice({ type: "success", text: "Tautan berhasil dihapus." });
    });
  }

  function handleToggle(link: Link) {
    startTransition(async () => {
      const nextStatus = !link.is_active;
      const result = await toggleLinkStatusAction(link.id, nextStatus);

      if (!result.success) {
        setNotice({
          type: "error",
          text: result.error || "Status tautan gagal diubah.",
        });
        return;
      }

      setLinks((current) =>
        current.map((item) =>
          item.id === link.id ? { ...item, is_active: nextStatus } : item,
        ),
      );
    });
  }

  function handleMove(link: Link, direction: -1 | 1) {
    const visibleIndex = filteredLinks.findIndex((item) => item.id === link.id);
    const neighbor = filteredLinks[visibleIndex + direction];
    if (!neighbor) return;

    const ordered = sortLinks(links);
    const currentIndex = ordered.findIndex((item) => item.id === link.id);
    const neighborIndex = ordered.findIndex((item) => item.id === neighbor.id);
    if (currentIndex < 0 || neighborIndex < 0) return;

    const nextLinks = [...ordered];
    [nextLinks[currentIndex], nextLinks[neighborIndex]] = [
      nextLinks[neighborIndex],
      nextLinks[currentIndex],
    ];
    const renumbered = nextLinks.map((item, index) => ({
      ...item,
      display_order: index + 1,
    }));
    const previousOrders = new Map(
      links.map((item) => [item.id, item.display_order]),
    );

    setLinks(renumbered);

    startTransition(async () => {
      const result = await reorderLinksAction(
        renumbered.map((item) => item.id),
      );

      if (result.success) return;

      setLinks((current) =>
        current.map((item) => ({
          ...item,
          display_order: previousOrders.get(item.id) ?? item.display_order,
        })),
      );
      setNotice({
        type: "error",
        text: result.error || "Urutan tautan gagal disimpan.",
      });
    });
  }

  const emptyState = (
    <>
      <p className="text-sm font-semibold text-slate-700">
        {links.length === 0
          ? "Belum ada tautan"
          : "Tidak ada tautan yang cocok"}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        {links.length === 0
          ? "Tambahkan tautan pertama untuk ditampilkan di portal publik."
          : "Ubah kata kunci atau reset filter untuk melihat semua tautan."}
      </p>
      <button
        type="button"
        onClick={links.length === 0 ? openAdd : resetFilters}
        className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        {links.length === 0 ? (
          <>
            <Icon name="plus" size={14} />
            Tambah tautan
          </>
        ) : (
          "Reset filter"
        )}
      </button>
    </>
  );

  return (
    <section aria-label="Daftar tautan">
      {notice && (
        <div
          role={notice.type === "error" ? "alert" : "status"}
          className={`mb-4 rounded-lg border px-4 py-3 text-sm font-medium ${
            notice.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="rounded-xl border border-[#e7eeea] bg-white">
        <div className="flex flex-col gap-3 border-b border-[#e7eeea] p-3 lg:flex-row lg:items-center">
          <div className="relative w-full lg:max-w-xs">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon name="search" size={16} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Cari tautan"
              placeholder="Cari judul atau URL"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-fajar-700 focus:ring-2 focus:ring-fajar-700/15"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value as "all" | LinkCategory)
              }
              aria-label="Filter kategori"
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-fajar-700 focus:ring-2 focus:ring-fajar-700/15"
            >
              <option value="all">Semua kategori</option>
              {LINK_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "all" | "active" | "inactive",
                )
              }
              aria-label="Filter status"
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-fajar-700 focus:ring-2 focus:ring-fajar-700/15"
            >
              <option value="all">Semua status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="h-10 px-2 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
              >
                Reset
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-fajar-700 px-4 text-sm font-bold text-white transition hover:bg-fajar-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-telaga-700 sm:self-auto lg:ml-auto"
          >
            <Icon name="plus" size={16} />
            Tambah tautan
          </button>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50/70 text-[11px] uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold">
                  Tautan
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Kategori
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-center font-bold">
                  Urutan
                </th>
                <th scope="col" className="px-4 py-3 text-right font-bold">
                  Klik
                </th>
                <th scope="col" className="px-4 py-3 text-right font-bold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center">
                    {emptyState}
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link, index) => (
                  <tr
                    key={link.id}
                    className="border-t border-[#e7eeea] align-middle"
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {link.title}
                        </span>
                        {link.is_featured && (
                          <span className="rounded bg-fajar-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fajar-800">
                            Unggulan
                          </span>
                        )}
                      </div>
                      <p
                        className="mt-0.5 max-w-[320px] truncate text-xs text-slate-400"
                        title={link.url}
                      >
                        {displayUrl(link.url)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <LinkCategoryBadge category={link.category} />
                    </td>
                    <td className="px-4 py-3">
                      <LinkStatusToggle
                        link={link}
                        pending={isPending}
                        onToggle={handleToggle}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <OrderControls
                        label={link.title}
                        canMoveUp={index > 0}
                        canMoveDown={index < filteredLinks.length - 1}
                        pending={isPending}
                        locked={hasActiveFilters}
                        onMoveUp={() => handleMove(link, -1)}
                        onMoveDown={() => handleMove(link, 1)}
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-semibold text-slate-800 tabular-nums">
                      {link.click_count.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <LinkActions
                        link={link}
                        pending={isPending}
                        onEdit={openEdit}
                        onDelete={setDeleteTarget}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          {filteredLinks.length === 0 ? (
            <div className="px-4 py-14 text-center">{emptyState}</div>
          ) : (
            <ul className="divide-y divide-[#e7eeea]">
              {filteredLinks.map((link, index) => (
                <li key={link.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {link.title}
                        </p>
                        {link.is_featured && (
                          <span className="rounded bg-fajar-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fajar-800">
                            Unggulan
                          </span>
                        )}
                      </div>
                      <p
                        className="mt-0.5 truncate text-xs text-slate-400"
                        title={link.url}
                      >
                        {displayUrl(link.url)}
                      </p>
                    </div>
                    <LinkActions
                      link={link}
                      pending={isPending}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <LinkCategoryBadge category={link.category} />
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-slate-500">
                        Urutan
                      </span>
                      <OrderControls
                        label={link.title}
                        canMoveUp={index > 0}
                        canMoveDown={index < filteredLinks.length - 1}
                        pending={isPending}
                        locked={hasActiveFilters}
                        onMoveUp={() => handleMove(link, -1)}
                        onMoveDown={() => handleMove(link, 1)}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 tabular-nums">
                      {link.click_count.toLocaleString("id-ID")} klik
                    </span>
                  </div>

                  <div className="mt-3">
                    <LinkStatusToggle
                      link={link}
                      pending={isPending}
                      onToggle={handleToggle}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-[#e7eeea] px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Menampilkan {filteredLinks.length} dari {links.length} tautan
          </p>
          <p>
            {links.filter((link) => link.is_active).length} aktif,{" "}
            {links.filter((link) => !link.is_active).length} nonaktif
          </p>
        </div>
      </div>

      <AdminDrawer
        open={drawer !== null}
        title={drawer === "add" ? "Tambah tautan" : "Edit tautan"}
        description={
          drawer === "add"
            ? "Tautan baru langsung tersedia di portal publik setelah disimpan."
            : "Perubahan berlaku pada portal publik setelah disimpan."
        }
        onClose={closeDrawer}
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={closeDrawer}
              disabled={isPending}
              className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              form="link-form"
              disabled={isPending}
              className="h-10 flex-1 rounded-lg bg-fajar-700 px-4 text-sm font-bold text-white transition hover:bg-fajar-800 disabled:cursor-wait disabled:opacity-60"
            >
              {isPending
                ? "Menyimpan..."
                : drawer === "add"
                  ? "Tambah tautan"
                  : "Simpan perubahan"}
            </button>
          </div>
        }
      >
        <form id="link-form" onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-5 text-red-800"
            >
              {formError}
            </div>
          )}

          <div>
            <label htmlFor="link-title" className={labelClass}>
              Judul <span className="text-red-600">*</span>
            </label>
            <input
              id="link-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={255}
              className={inputClass}
              placeholder="Contoh: Pendaftaran Pengurus BUMDes"
            />
          </div>

          <div>
            <label htmlFor="link-url" className={labelClass}>
              URL <span className="text-red-600">*</span>
            </label>
            <input
              id="link-url"
              name="url"
              type="url"
              value={form.url}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="https://"
            />
            <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
              Gunakan alamat lengkap yang diawali https://.
            </p>
          </div>

          <div>
            <label htmlFor="link-description" className={labelClass}>
              Deskripsi
            </label>
            <textarea
              id="link-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-fajar-700 focus:ring-2 focus:ring-fajar-700/15"
              placeholder="Ringkasan singkat isi tautan."
            />
          </div>

          <div>
            <label htmlFor="link-category" className={labelClass}>
              Kategori
            </label>
            <select
              id="link-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
            >
              {LINK_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 rounded-lg border border-[#e7eeea] bg-slate-50/60 p-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                name="is_active"
                type="checkbox"
                checked={form.is_active}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-fajar-700"
              />
              <span>
                <span className="block text-xs font-bold text-slate-800">
                  Aktif
                </span>
                <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">
                  Tampilkan tautan di portal publik.
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                name="is_featured"
                type="checkbox"
                checked={form.is_featured}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-fajar-700"
              />
              <span>
                <span className="block text-xs font-bold text-slate-800">
                  Unggulan
                </span>
                <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">
                  Tandai sebagai tautan utama pada daftar.
                </span>
              </span>
            </label>
          </div>
        </form>
      </AdminDrawer>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Hapus tautan?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" akan dihapus permanen dari portal. Tindakan ini tidak dapat dibatalkan.`
            : ""
        }
        pending={isPending}
        onConfirm={handleDelete}
        onCancel={() => !isPending && setDeleteTarget(null)}
      />
    </section>
  );
}
