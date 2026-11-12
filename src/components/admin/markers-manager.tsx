"use client";

import { useState, useTransition } from "react";
import type { Marker, MarkerJenisInfo } from "@/types/database";
import {
  createMarkerAction,
  updateMarkerAction,
  deleteMarkerAction,
  toggleMarkerStatusAction,
} from "@/actions/markers";

interface MarkersManagerProps {
  initialMarkers: Marker[];
}

const JENIS_OPTIONS: { value: MarkerJenisInfo; label: string }[] = [
  { value: "kantor", label: "Kantor" },
  { value: "layanan", label: "Layanan" },
  { value: "pendidikan", label: "Pendidikan" },
];

const EMPTY_FORM = {
  name: "",
  latitude: "",
  longitude: "",
  keterangan: "",
  jenis_info: "layanan" as MarkerJenisInfo,
  maps_url: "",
  is_active: true,
  display_order: 0,
};

export function MarkersManager({ initialMarkers }: MarkersManagerProps) {
  const [markers, setMarkers] = useState<Marker[]>(initialMarkers || []);
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editingMarker, setEditingMarker] = useState<Marker | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function openAdd() {
    setForm(EMPTY_FORM);
    setModal("add");
    setMessage(null);
  }

  function openEdit(marker: Marker) {
    setEditingMarker(marker);
    setForm({
      name: marker.name,
      latitude: String(marker.latitude),
      longitude: String(marker.longitude),
      keterangan: marker.keterangan || "",
      jenis_info: marker.jenis_info,
      maps_url: marker.maps_url || "",
      is_active: marker.is_active,
      display_order: marker.display_order,
    });
    setModal("edit");
    setMessage(null);
  }

  function closeModal() {
    setModal(null);
    setEditingMarker(null);
    setMessage(null);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
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
          ? await createMarkerAction(formData)
          : await updateMarkerAction(editingMarker!.id, formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: modal === "add" ? "Titik lokasi berhasil ditambahkan!" : "Titik lokasi berhasil diubah!",
        });
        const { getAllMarkersAdmin } = await import("@/actions/markers");
        const updated = await getAllMarkersAdmin();
        setMarkers(updated);
        setTimeout(closeModal, 800);
      } else {
        setMessage({ type: "error", text: result.error || "Terjadi kesalahan." });
      }
    });
  }

  function handleDelete(marker: Marker) {
    if (!confirm(`Hapus "${marker.name}"?`)) return;

    startTransition(async () => {
      const result = await deleteMarkerAction(marker.id);
      if (result.success) {
        setMarkers((prev) => prev.filter((m) => m.id !== marker.id));
        setMessage({ type: "success", text: "Titik lokasi berhasil dihapus!" });
      } else {
        setMessage({ type: "error", text: result.error || "Gagal menghapus." });
      }
    });
  }

  function handleToggle(marker: Marker) {
    startTransition(async () => {
      const result = await toggleMarkerStatusAction(marker.id, !marker.is_active);
      if (result.success) {
        setMarkers((prev) =>
          prev.map((m) => (m.id === marker.id ? { ...m, is_active: !m.is_active } : m))
        );
      } else {
        setMessage({ type: "error", text: result.error || "Gagal mengubah status." });
      }
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kelola Titik Lokasi Peta</h2>
          <p className="mt-1 text-sm text-slate-500">
            Total {markers.length} titik lokasi terdaftar
          </p>
        </div>
        <button
          onClick={openAdd}
          disabled={isPending}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-fajar-700 disabled:opacity-50"
        >
          + Tambah Lokasi
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
              <th className="px-5 py-4 font-bold text-slate-600">Nama</th>
              <th className="px-5 py-4 font-bold text-slate-600">Koordinat</th>
              <th className="px-5 py-4 font-bold text-slate-600">Jenis</th>
              <th className="px-5 py-4 font-bold text-slate-600">Status</th>
              <th className="px-5 py-4 text-right font-bold text-slate-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {markers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                  Belum ada titik lokasi. Klik &quot;+ Tambah Lokasi&quot; untuk mulai.
                </td>
              </tr>
            ) : (
              markers.map((marker) => (
                <tr key={marker.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">{marker.name}</p>
                    <p className="mt-0.5 max-w-xs truncate text-xs text-slate-400">
                      {marker.keterangan || "-"}
                    </p>
                    {marker.maps_url && (
                      <a
                        href={marker.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-teal-600 hover:text-teal-700 hover:underline"
                      >
                        <span>Link Rute Maps</span>
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M10 14L21 3" />
                        </svg>
                      </a>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {marker.latitude.toFixed(6)}, {marker.longitude.toFixed(6)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
                      {marker.jenis_info}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggle(marker)}
                      disabled={isPending}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        marker.is_active ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                      aria-label={marker.is_active ? "Nonaktifkan" : "Aktifkan"}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                          marker.is_active ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(marker)}
                        disabled={isPending}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(marker)}
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
              <h3 className="text-lg font-bold text-slate-900">
                {modal === "add" ? "Tambah Titik Lokasi" : "Edit Titik Lokasi"}
              </h3>
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
                  Nama Lokasi <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-fajar-500 focus:outline-none"
                  placeholder="Contoh: Balai Desa"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    required
                    type="number"
                    step="any"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-fajar-500 focus:outline-none"
                    placeholder="-5.3025"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    required
                    type="number"
                    step="any"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-fajar-500 focus:outline-none"
                    placeholder="105.2347"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Keterangan
                </label>
                <textarea
                  name="keterangan"
                  value={form.keterangan}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-fajar-500 focus:outline-none"
                  placeholder="Deskripsi singkat lokasi..."
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Link Google Maps <span className="text-xs font-normal text-slate-400">(Opsional)</span>
                </label>
                <input
                  name="maps_url"
                  type="url"
                  value={form.maps_url}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-fajar-500 focus:outline-none"
                  placeholder="https://maps.app.goo.gl/... atau https://goo.gl/maps/..."
                />
                <p className="mt-1 text-xs text-slate-400">
                  Jika diisi, tombol &quot;Buka Rute&quot; pada peta akan langsung mengarahkan ke link ini.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-slate-700">Jenis Info</label>
                  <select
                    name="jenis_info"
                    value={form.jenis_info}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-fajar-500 focus:outline-none"
                  >
                    {JENIS_OPTIONS.map((j) => (
                      <option key={j.value} value={j.value}>
                        {j.label}
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

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-fajar-700 disabled:opacity-50"
                >
                  {isPending ? "Menyimpan..." : modal === "add" ? "Tambah Lokasi" : "Simpan Perubahan"}
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
