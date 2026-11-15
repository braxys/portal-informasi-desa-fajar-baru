"use client";

import { useEffect, useState, useTransition } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Marker, MarkerJenisInfo } from "@/types/database";
import { Icon, type IconName } from "@/components/shared/icons";
import { AdminDrawer } from "@/components/admin/admin-drawer";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { OrderControls } from "@/components/admin/order-controls";
import {
  createMarkerAction,
  updateMarkerAction,
  deleteMarkerAction,
  toggleMarkerStatusAction,
  reorderMarkersAction,
} from "@/actions/markers";

interface MarkersManagerProps {
  markers: Marker[];
  setMarkers: Dispatch<SetStateAction<Marker[]>>;
}

const JENIS_OPTIONS: {
  value: MarkerJenisInfo;
  label: string;
  icon: IconName;
}[] = [
  { value: "kantor", label: "Kantor", icon: "building" },
  { value: "layanan", label: "Layanan", icon: "briefcase" },
  { value: "pendidikan", label: "Pendidikan", icon: "graduation" },
  { value: "ibadah", label: "Tempat Ibadah", icon: "mosque" },
  { value: "minimarket", label: "Minimarket", icon: "store" },
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

const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-fajar-700 focus:ring-2 focus:ring-fajar-700/15";
const labelClass = "mb-1.5 block text-xs font-bold text-slate-800";

function sortMarkers(items: Marker[]) {
  return [...items].sort(
    (a, b) =>
      a.display_order - b.display_order ||
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
}

function mapsHref(marker: Marker) {
  return (
    marker.maps_url ||
    `https://www.google.com/maps?q=${marker.latitude},${marker.longitude}`
  );
}

function MarkerStatusToggle({
  marker,
  pending,
  onToggle,
}: {
  marker: Marker;
  pending: boolean;
  onToggle: (marker: Marker) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={marker.is_active}
      aria-label={`${marker.is_active ? "Nonaktifkan" : "Aktifkan"} ${marker.name}`}
      onClick={() => onToggle(marker)}
      disabled={pending}
      className="inline-flex items-center gap-2 text-xs font-semibold disabled:cursor-wait disabled:opacity-60"
    >
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
          marker.is_active ? "bg-fajar-700" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition ${
            marker.is_active ? "translate-x-[18px]" : "translate-x-1"
          }`}
        />
      </span>
      <span
        className={marker.is_active ? "text-fajar-800" : "text-slate-500"}
      >
        {marker.is_active ? "Aktif" : "Nonaktif"}
      </span>
    </button>
  );
}

function MarkerActions({
  marker,
  pending,
  onEdit,
  onDelete,
}: {
  marker: Marker;
  pending: boolean;
  onEdit: (marker: Marker) => void;
  onDelete: (marker: Marker) => void;
}) {
  return (
    <div className="flex justify-end gap-1">
      <a
        href={mapsHref(marker)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Lihat ${marker.name} di Google Maps`}
        title="Lihat di Google Maps"
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <Icon name="external" size={15} />
      </a>
      <button
        type="button"
        onClick={() => onEdit(marker)}
        disabled={pending}
        aria-label={`Edit ${marker.name}`}
        title="Edit lokasi"
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
      >
        <Icon name="edit" size={15} />
      </button>
      <button
        type="button"
        onClick={() => onDelete(marker)}
        disabled={pending}
        aria-label={`Hapus ${marker.name}`}
        title="Hapus lokasi"
        className="flex h-8 w-8 items-center justify-center rounded-md text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
      >
        <Icon name="trash" size={15} />
      </button>
    </div>
  );
}

export function MarkersManager({ markers, setMarkers }: MarkersManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [drawer, setDrawer] = useState<"add" | "edit" | null>(null);
  const [editingMarker, setEditingMarker] = useState<Marker | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Marker | null>(null);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | MarkerJenisInfo>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all",
  );

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const normalizedQuery = query.trim().toLowerCase();
  const orderedMarkers = sortMarkers(markers);
  const filteredMarkers = orderedMarkers.filter((marker) => {
    const matchesQuery =
      !normalizedQuery ||
      marker.name.toLowerCase().includes(normalizedQuery) ||
      (marker.keterangan?.toLowerCase().includes(normalizedQuery) ?? false);
    const matchesType =
      typeFilter === "all" || marker.jenis_info === typeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? marker.is_active : !marker.is_active);

    return matchesQuery && matchesType && matchesStatus;
  });
  const hasActiveFilters =
    normalizedQuery !== "" ||
    typeFilter !== "all" ||
    statusFilter !== "all";

  function openAdd() {
    const nextOrder =
      markers.reduce(
        (max, marker) => Math.max(max, marker.display_order),
        0,
      ) + 1;
    setForm({ ...EMPTY_FORM, display_order: nextOrder });
    setFormError(null);
    setEditingMarker(null);
    setDrawer("add");
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
    setFormError(null);
    setDrawer("edit");
  }

  function closeDrawer() {
    if (isPending) return;
    setDrawer(null);
    setEditingMarker(null);
    setFormError(null);
  }

  function resetFilters() {
    setQuery("");
    setTypeFilter("all");
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
          ? await createMarkerAction(formData)
          : await updateMarkerAction(editingMarker!.id, formData);

      if (!result.success || !result.data) {
        setFormError(result.error || "Titik lokasi gagal disimpan. Coba lagi.");
        return;
      }

      const savedMarker = result.data;
      setMarkers((current) =>
        sortMarkers(
          drawer === "add"
            ? [...current, savedMarker]
            : current.map((marker) =>
                marker.id === savedMarker.id ? savedMarker : marker,
              ),
        ),
      );
      setDrawer(null);
      setEditingMarker(null);
      setNotice({
        type: "success",
        text:
          drawer === "add"
            ? "Titik lokasi berhasil ditambahkan."
            : "Perubahan titik lokasi berhasil disimpan.",
      });
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;

    startTransition(async () => {
      const result = await deleteMarkerAction(deleteTarget.id);
      if (!result.success) {
        setNotice({
          type: "error",
          text: result.error || "Titik lokasi gagal dihapus.",
        });
        setDeleteTarget(null);
        return;
      }

      setMarkers((current) =>
        current.filter((marker) => marker.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
      setNotice({
        type: "success",
        text: "Titik lokasi berhasil dihapus.",
      });
    });
  }

  function handleToggle(marker: Marker) {
    startTransition(async () => {
      const nextStatus = !marker.is_active;
      const result = await toggleMarkerStatusAction(marker.id, nextStatus);

      if (!result.success) {
        setNotice({
          type: "error",
          text: result.error || "Status titik lokasi gagal diubah.",
        });
        return;
      }

      setMarkers((current) =>
        current.map((item) =>
          item.id === marker.id ? { ...item, is_active: nextStatus } : item,
        ),
      );
    });
  }

  function handleMove(marker: Marker, direction: -1 | 1) {
    const visibleIndex = filteredMarkers.findIndex(
      (item) => item.id === marker.id,
    );
    const neighbor = filteredMarkers[visibleIndex + direction];
    if (!neighbor) return;

    const ordered = sortMarkers(markers);
    const currentIndex = ordered.findIndex((item) => item.id === marker.id);
    const neighborIndex = ordered.findIndex((item) => item.id === neighbor.id);
    if (currentIndex < 0 || neighborIndex < 0) return;

    const nextMarkers = [...ordered];
    [nextMarkers[currentIndex], nextMarkers[neighborIndex]] = [
      nextMarkers[neighborIndex],
      nextMarkers[currentIndex],
    ];
    const renumbered = nextMarkers.map((item, index) => ({
      ...item,
      display_order: index + 1,
    }));
    const previousOrders = new Map(
      markers.map((item) => [item.id, item.display_order]),
    );

    setMarkers(renumbered);

    startTransition(async () => {
      const result = await reorderMarkersAction(
        renumbered.map((item) => item.id),
      );

      if (result.success) return;

      setMarkers((current) =>
        current.map((item) => ({
          ...item,
          display_order: previousOrders.get(item.id) ?? item.display_order,
        })),
      );
      setNotice({
        type: "error",
        text: result.error || "Urutan titik lokasi gagal disimpan.",
      });
    });
  }

  const emptyState = (
    <>
      <p className="text-sm font-semibold text-slate-700">
        {markers.length === 0
          ? "Belum ada titik lokasi"
          : "Tidak ada lokasi yang cocok"}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        {markers.length === 0
          ? "Tambahkan fasilitas desa agar tampil pada peta publik."
          : "Ubah kata kunci atau reset filter untuk melihat semua lokasi."}
      </p>
      <button
        type="button"
        onClick={markers.length === 0 ? openAdd : resetFilters}
        className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        {markers.length === 0 ? (
          <>
            <Icon name="plus" size={14} />
            Tambah lokasi
          </>
        ) : (
          "Reset filter"
        )}
      </button>
    </>
  );

  return (
    <section aria-label="Daftar titik lokasi peta">
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
              aria-label="Cari titik lokasi"
              placeholder="Cari nama atau keterangan"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-fajar-700 focus:ring-2 focus:ring-fajar-700/15"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value as "all" | MarkerJenisInfo)
              }
              aria-label="Filter jenis lokasi"
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-fajar-700 focus:ring-2 focus:ring-fajar-700/15"
            >
              <option value="all">Semua jenis</option>
              {JENIS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
            Tambah lokasi
          </button>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50/70 text-[11px] uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold">
                  Lokasi
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Koordinat
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Jenis
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-center font-bold">
                  Urutan
                </th>
                <th scope="col" className="px-4 py-3 text-right font-bold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMarkers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center">
                    {emptyState}
                  </td>
                </tr>
              ) : (
                filteredMarkers.map((marker, index) => {
                  const jenis =
                    JENIS_OPTIONS.find(
                      (option) => option.value === marker.jenis_info,
                    ) ?? JENIS_OPTIONS[1];

                  return (
                    <tr
                      key={marker.id}
                      className="border-t border-[#e7eeea] align-middle"
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">
                          {marker.name}
                        </p>
                        <p className="mt-0.5 max-w-[300px] truncate text-xs text-slate-400">
                          {marker.keterangan || "Tanpa keterangan"}
                        </p>
                        <a
                          href={mapsHref(marker)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 hover:text-teal-900 hover:underline"
                        >
                          Lihat di Maps
                          <Icon name="external" size={11} />
                        </a>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] leading-5 text-slate-600 tabular-nums">
                        <p>{marker.latitude.toFixed(6)}</p>
                        <p>{marker.longitude.toFixed(6)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                          <Icon name={jenis.icon} size={13} />
                          {jenis.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <MarkerStatusToggle
                          marker={marker}
                          pending={isPending}
                          onToggle={handleToggle}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <OrderControls
                          label={marker.name}
                          canMoveUp={index > 0}
                          canMoveDown={index < filteredMarkers.length - 1}
                          pending={isPending}
                          locked={hasActiveFilters}
                          onMoveUp={() => handleMove(marker, -1)}
                          onMoveDown={() => handleMove(marker, 1)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <MarkerActions
                          marker={marker}
                          pending={isPending}
                          onEdit={openEdit}
                          onDelete={setDeleteTarget}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden">
          {filteredMarkers.length === 0 ? (
            <div className="px-4 py-14 text-center">{emptyState}</div>
          ) : (
            <ul className="divide-y divide-[#e7eeea]">
              {filteredMarkers.map((marker, index) => {
                const jenis =
                  JENIS_OPTIONS.find(
                    (option) => option.value === marker.jenis_info,
                  ) ?? JENIS_OPTIONS[1];

                return (
                  <li key={marker.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {marker.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {marker.keterangan || "Tanpa keterangan"}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-slate-500 tabular-nums">
                          {marker.latitude.toFixed(6)},{" "}
                          {marker.longitude.toFixed(6)}
                        </p>
                      </div>
                      <MarkerActions
                        marker={marker}
                        pending={isPending}
                        onEdit={openEdit}
                        onDelete={setDeleteTarget}
                      />
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">
                        <Icon name={jenis.icon} size={13} />
                        {jenis.label}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-slate-500">
                          Urutan
                        </span>
                        <OrderControls
                          label={marker.name}
                          canMoveUp={index > 0}
                          canMoveDown={index < filteredMarkers.length - 1}
                          pending={isPending}
                          locked={hasActiveFilters}
                          onMoveUp={() => handleMove(marker, -1)}
                          onMoveDown={() => handleMove(marker, 1)}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <MarkerStatusToggle
                        marker={marker}
                        pending={isPending}
                        onToggle={handleToggle}
                      />
                      <a
                        href={mapsHref(marker)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 hover:text-teal-900 hover:underline"
                      >
                        Lihat di Maps
                        <Icon name="external" size={11} />
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-[#e7eeea] px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Menampilkan {filteredMarkers.length} dari {markers.length} titik
            lokasi
          </p>
          <p>
            {markers.filter((marker) => marker.is_active).length} aktif,{" "}
            {markers.filter((marker) => !marker.is_active).length} nonaktif
          </p>
        </div>
      </div>

      <AdminDrawer
        open={drawer !== null}
        title={drawer === "add" ? "Tambah titik lokasi" : "Edit titik lokasi"}
        description={
          drawer === "add"
            ? "Titik baru langsung tampil pada peta publik setelah disimpan."
            : "Perubahan berlaku pada peta publik setelah disimpan."
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
              form="marker-form"
              disabled={isPending}
              className="h-10 flex-1 rounded-lg bg-fajar-700 px-4 text-sm font-bold text-white transition hover:bg-fajar-800 disabled:cursor-wait disabled:opacity-60"
            >
              {isPending
                ? "Menyimpan..."
                : drawer === "add"
                  ? "Tambah lokasi"
                  : "Simpan perubahan"}
            </button>
          </div>
        }
      >
        <form id="marker-form" onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-5 text-red-800"
            >
              {formError}
            </div>
          )}

          <div>
            <label htmlFor="marker-name" className={labelClass}>
              Nama lokasi <span className="text-red-600">*</span>
            </label>
            <input
              id="marker-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={255}
              className={inputClass}
              placeholder="Contoh: Balai Desa"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="marker-latitude" className={labelClass}>
                Latitude <span className="text-red-600">*</span>
              </label>
              <input
                id="marker-latitude"
                name="latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="-5.343695"
              />
            </div>
            <div>
              <label htmlFor="marker-longitude" className={labelClass}>
                Longitude <span className="text-red-600">*</span>
              </label>
              <input
                id="marker-longitude"
                name="longitude"
                type="number"
                step="any"
                value={form.longitude}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="105.268021"
              />
            </div>
          </div>
          <p className="-mt-2 text-[11px] leading-4 text-slate-500">
            Gunakan format koordinat desimal. Latitude antara -90 dan 90,
            longitude antara -180 dan 180.
          </p>

          <div>
            <label htmlFor="marker-keterangan" className={labelClass}>
              Keterangan
            </label>
            <textarea
              id="marker-keterangan"
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-fajar-700 focus:ring-2 focus:ring-fajar-700/15"
              placeholder="Fungsi atau informasi singkat lokasi."
            />
          </div>

          <div>
            <label htmlFor="marker-maps" className={labelClass}>
              Link Google Maps
            </label>
            <input
              id="marker-maps"
              name="maps_url"
              type="url"
              value={form.maps_url}
              onChange={handleChange}
              className={inputClass}
              placeholder="https://maps.app.goo.gl/..."
            />
            <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
              Opsional. Jika kosong, tombol rute memakai koordinat di atas.
            </p>
          </div>

          <div>
            <label htmlFor="marker-jenis" className={labelClass}>
              Jenis
            </label>
            <select
              id="marker-jenis"
              name="jenis_info"
              value={form.jenis_info}
              onChange={handleChange}
              className={inputClass}
            >
              {JENIS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#e7eeea] bg-slate-50/60 p-3">
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
                Tampilkan titik lokasi pada peta publik.
              </span>
            </span>
          </label>
        </form>
      </AdminDrawer>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Hapus titik lokasi?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" akan dihapus permanen dari peta. Tindakan ini tidak dapat dibatalkan.`
            : ""
        }
        pending={isPending}
        onConfirm={handleDelete}
        onCancel={() => !isPending && setDeleteTarget(null)}
      />
    </section>
  );
}
