"use client";

import { useState, type FormEvent } from "react";
import { createLinkAction, updateLinkAction } from "@/actions/links";
import { Icon } from "@/components/ui/icon";
import {
  CATEGORY_META,
  CATEGORY_OPTIONS,
} from "@/lib/link-meta";
import type { Link, LinkCategory } from "@/types/database";

interface LinkFormProps {
  link?: Link;
  onCancel: () => void;
  onSuccess: (message: string) => void;
}

const ICON_OPTIONS = [
  { value: "link", label: "Tautan umum" },
  { value: "users", label: "Pengguna / orang" },
  { value: "globe", label: "Website / globe" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "clipboard-list", label: "Formulir / survei" },
  { value: "file-text", label: "Dokumen" },
  { value: "megaphone", label: "Pengumuman" },
  { value: "calendar", label: "Agenda / acara" },
  { value: "map-pin", label: "Lokasi" },
  { value: "phone", label: "Telepon" },
  { value: "mail", label: "Email" },
  { value: "shopping-bag", label: "Usaha / BUMDes" },
  { value: "info", label: "Informasi" },
];

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

export function LinkForm({ link, onCancel, onSuccess }: LinkFormProps) {
  const initialCategory: LinkCategory = link?.category ?? "informasi";
  const [category, setCategory] = useState<LinkCategory>(initialCategory);
  const [icon, setIcon] = useState(
    link?.icon?.trim() || CATEGORY_META[initialCategory].icon,
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isEditing = Boolean(link);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = link
        ? await updateLinkAction(link.id, formData)
        : await createLinkAction(formData);

      if (!result.success) {
        setError(result.error ?? "Gagal menyimpan tautan.");
        return;
      }

      onSuccess(
        link
          ? "Tautan berhasil diperbarui."
          : "Tautan baru berhasil ditambahkan.",
      );
    } catch {
      setError(
        "Tidak dapat terhubung ke server. Pastikan Supabase sudah dikonfigurasi.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-4">
      <div>
        <label
          htmlFor="link-title"
          className="mb-1.5 block text-xs font-semibold text-slate-700"
        >
          Judul Tautan <span className="text-rose-500">*</span>
        </label>
        <input
          id="link-title"
          name="title"
          type="text"
          required
          maxLength={255}
          defaultValue={link?.title ?? ""}
          placeholder="Contoh: Pendaftaran Pengurus BUMDes"
          className={inputClassName}
        />
      </div>

      <div>
        <label
          htmlFor="link-url"
          className="mb-1.5 block text-xs font-semibold text-slate-700"
        >
          URL Tujuan <span className="text-rose-500">*</span>
        </label>
        <input
          id="link-url"
          name="url"
          type="url"
          required
          defaultValue={link?.url ?? ""}
          placeholder="https://forms.gle/..."
          className={inputClassName}
        />
        <p className="mt-1 text-[11px] text-slate-400">
          Wajib diawali <code>https://</code> atau <code>http://</code>.
        </p>
      </div>

      <div>
        <label
          htmlFor="link-description"
          className="mb-1.5 block text-xs font-semibold text-slate-700"
        >
          Deskripsi Singkat
        </label>
        <textarea
          id="link-description"
          name="description"
          rows={3}
          maxLength={280}
          defaultValue={link?.description ?? ""}
          placeholder="Jelaskan isi tautan dalam satu atau dua kalimat."
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="link-category"
            className="mb-1.5 block text-xs font-semibold text-slate-700"
          >
            Kategori
          </label>
          <select
            id="link-category"
            name="category"
            value={category}
            onChange={(event) => {
              const nextCategory = event.target.value as LinkCategory;
              setCategory(nextCategory);
              setIcon(CATEGORY_META[nextCategory].icon);
            }}
            className={inputClassName}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="link-icon"
            className="mb-1.5 block text-xs font-semibold text-slate-700"
          >
            Ikon
          </label>
          <div className="flex items-center gap-2">
            <span
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${CATEGORY_META[category].accentClassName} text-white`}
            >
              <Icon name={icon} size={20} />
            </span>
            <select
              id="link-icon"
              name="icon"
              value={icon}
              onChange={(event) => setIcon(event.target.value)}
              className={inputClassName}
            >
              {ICON_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="link-order"
          className="mb-1.5 block text-xs font-semibold text-slate-700"
        >
          Urutan Tampil
        </label>
        <input
          id="link-order"
          name="display_order"
          type="number"
          min={0}
          defaultValue={link?.display_order ?? 0}
          className={inputClassName}
        />
        <p className="mt-1 text-[11px] text-slate-400">
          Angka lebih kecil tampil lebih atas di portal warga.
        </p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3 transition hover:border-emerald-200">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={link?.is_active ?? true}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 accent-emerald-600"
          />
          <span>
            <span className="block text-xs font-semibold text-slate-800">
              Tampilkan di portal
            </span>
            <span className="block text-[11px] text-slate-500">
              Warga dapat melihat tautan ini.
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3 transition hover:border-emerald-200">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={link?.is_featured ?? false}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 accent-emerald-600"
          />
          <span>
            <span className="block text-xs font-semibold text-slate-800">
              Jadikan sorotan
            </span>
            <span className="block text-[11px] text-slate-500">
              Tampil sebagai kartu utama di atas.
            </span>
          </span>
        </label>
      </div>

      {error ? (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-relaxed text-rose-800"
        >
          <Icon
            name="alert-triangle"
            size={16}
            className="mt-0.5 shrink-0 text-rose-500"
          />
          {error}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-100"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:from-emerald-700 hover:to-sky-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Icon name="refresh" size={14} className="animate-spin" />
              Menyimpan…
            </>
          ) : (
            <>
              <Icon name={isEditing ? "check" : "plus"} size={14} />
              {isEditing ? "Simpan Perubahan" : "Tambah Tautan"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
