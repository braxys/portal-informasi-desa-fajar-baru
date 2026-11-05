"use client";

import { useState, useTransition } from "react";
import type { Link, LinkCategory } from "@/types/database";
import {
  createLinkAction,
  updateLinkAction,
  deleteLinkAction,
  toggleLinkStatusAction,
} from "@/actions/links";

interface LinksManagerProps {
  initialLinks: Link[];
}

const CATEGORIES: { value: LinkCategory; label: string }[] = [
  { value: "bumdes", label: "BUMDes" },
  { value: "layanan", label: "Layanan" },
  { value: "medsos", label: "Media Sosial" },
  { value: "informasi", label: "Informasi" },
  { value: "survei", label: "Survei" },
  { value: "general", label: "Umum" },
];

const EMPTY_FORM = {
  title: "",
  url: "",
  description: "",
  category: "informasi" as LinkCategory,
  icon: "link",
  is_featured: false,
  is_active: true,
  display_order: 0,
};

export function LinksManager({ initialLinks }: LinksManagerProps) {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function openAdd() {
    setForm(EMPTY_FORM);
    setModal("add");
    setMessage(null);
  }

  function openEdit(link: Link) {
    setEditingLink(link);
    setForm({
      title: link.title,
      url: link.url,
      description: link.description || "",
      category: link.category,
      icon: link.icon || "link",
      is_featured: link.is_featured,
      is_active: link.is_active,
      display_order: link.display_order,
    });
    setModal("edit");
    setMessage(null);
  }

  function closeModal() {
    setModal(null);
    setEditingLink(null);
    setMessage(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    startTransition(async () => {
      const result =
        modal === "add"
          ? await createLinkAction(formData)
          : await updateLinkAction(editingLink!.id, formData);

      if (result.success) {
        setMessage({ type: "success", text: modal === "add" ? "Link berhasil ditambahkan!" : "Link berhasil diubah!" });
        // Refresh data
        const { getAllLinksAdmin } = await import("@/actions/links");
        const updated = await getAllLinksAdmin();
        setLinks(updated);
        setTimeout(closeModal, 800);
      } else {
        setMessage({ type: "error", text: result.error || "Terjadi kesalahan." });
      }
    });
  }

  function handleDelete(link: Link) {
    if (!confirm(`Hapus "${link.title}"?`)) return;

    startTransition(async () => {
      const result = await deleteLinkAction(link.id);
      if (result.success) {
        setLinks((prev) => prev.filter((l) => l.id !== link.id));
        setMessage({ type: "success", text: "Link berhasil dihapus!" });
      } else {
        setMessage({ type: "error", text: result.error || "Gagal menghapus." });
      }
    });
  }

  function handleToggle(link: Link) {
    startTransition(async () => {
      const result = await toggleLinkStatusAction(link.id, !link.is_active);
      if (result.success) {
        setLinks((prev) =>
          prev.map((l) => (l.id === link.id ? { ...l, is_active: !l.is_active } : l))
        );
      }
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kelola Link</h1>
          <p className="mt-1 text-sm text-slate-500">
            Total {links.length} link terdaftar
          </p>
        </div>
        <button
          onClick={openAdd}
          disabled={isPending}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-fajar-700 disabled:opacity-50"
        >
          + Tambah Link
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              <th className="px-5 py-4 font-bold text-slate-600">Judul</th>
              <th className="px-5 py-4 font-bold text-slate-600">Kategori</th>
              <th className="px-5 py-4 font-bold text-slate-600">Status</th>
              <th className="px-5 py-4 font-bold text-slate-600">Klik</th>
              <th className="px-5 py-4 text-right font-bold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                  Belum ada link. Klik &quot;+ Tambah Link&quot; untuk mulai.
                </td>
              </tr>
            ) : (
              links.map((link) => (
                <tr key={link.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{link.title}</p>
                    <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">{link.url}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
                      {link.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggle(link)}
                      disabled={isPending}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        link.is_active ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                      aria-label={link.is_active ? "Nonaktifkan" : "Aktifkan"}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                          link.is_active ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-700">
                    {link.click_count}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(link)}
                        disabled={isPending}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(link)}
                        disabled={isPending}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add/Edit */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={closeModal}>
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {modal === "add" ? "Tambah Link Baru" : "Edit Link"}
              </h2>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {message && (
              <div
                className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-fajar-500 focus:outline-none"
                  placeholder="Contoh: Website Resmi Desa"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  required
                  type="url"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-fajar-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-fajar-500 focus:outline-none"
                  placeholder="Deskripsi singkat..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Kategori</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-fajar-500 focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Urutan</label>
                  <input
                    name="display_order"
                    type="number"
                    value={form.display_order}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-fajar-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    name="is_active"
                    type="checkbox"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="h-4 w-4 rounded"
                  />
                  Aktif
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    name="is_featured"
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={handleChange}
                    className="h-4 w-4 rounded"
                  />
                  Featured
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-fajar-700 disabled:opacity-50"
                >
                  {isPending ? "Menyimpan..." : modal === "add" ? "Tambah Link" : "Simpan Perubahan"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isPending}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
