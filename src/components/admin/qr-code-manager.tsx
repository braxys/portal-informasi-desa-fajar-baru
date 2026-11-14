"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { Dispatch, SetStateAction } from "react";
import html2canvas from "html2canvas-pro";
import type { Link, QrCode } from "@/types/database";
import { Icon } from "@/components/shared/icons";
import { AdminDrawer } from "@/components/admin/admin-drawer";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  isLocalOrigin,
  useSiteOrigin,
} from "@/components/admin/use-site-origin";
import {
  createQrCodeAction,
  deleteQrCodeAction,
  toggleQrCodeStatusAction,
  updateQrCodeAction,
} from "@/actions/qr-codes";

interface QrCodeManagerProps {
  qrCodes: QrCode[];
  setQrCodes: Dispatch<SetStateAction<QrCode[]>>;
  /** Tautan terdaftar, dipakai untuk mengisi URL tujuan dengan cepat. */
  links: Link[];
  /** Dipanggil setelah QR terhapus, agar total pindai tidak ikut turun. */
  onQrDeleted?: (qrCode: QrCode) => void;
}

const EMPTY_FORM = {
  title: "",
  target_url: "",
  is_active: true,
  link_id: "",
};

const inputClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-fajar-700 focus:ring-2 focus:ring-fajar-700/15";
const labelClass = "mb-1.5 block text-xs font-bold text-slate-800";

function displayUrl(value: string) {
  try {
    const parsed = new URL(value);
    const path = parsed.pathname === "/" ? "" : parsed.pathname;
    return `${parsed.hostname.replace(/^www\./, "")}${path}`;
  } catch {
    return value;
  }
}

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "qr-code"
  );
}

function qrImageUrl(target: string) {
  return `/api/qr-code?data=${encodeURIComponent(target)}`;
}

function CopyLinkButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      aria-label={`Salin tautan pelacak ${label}`}
      title="Salin tautan pelacak"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
    >
      <Icon name={copied ? "check" : "clipboard"} size={15} />
    </button>
  );
}

function QrStatusToggle({
  qrCode,
  pending,
  onToggle,
}: {
  qrCode: QrCode;
  pending: boolean;
  onToggle: (qrCode: QrCode) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={qrCode.is_active}
      aria-label={`${qrCode.is_active ? "Nonaktifkan" : "Aktifkan"} ${qrCode.title}`}
      onClick={() => onToggle(qrCode)}
      disabled={pending}
      className="inline-flex items-center gap-2 text-xs font-semibold disabled:cursor-wait disabled:opacity-60"
    >
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
          qrCode.is_active ? "bg-fajar-700" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition ${
            qrCode.is_active ? "translate-x-[18px]" : "translate-x-1"
          }`}
        />
      </span>
      <span
        className={qrCode.is_active ? "text-fajar-800" : "text-slate-500"}
      >
        {qrCode.is_active ? "Aktif" : "Nonaktif"}
      </span>
    </button>
  );
}

function QrActions({
  qrCode,
  pending,
  onShowQr,
  onEdit,
  onDelete,
}: {
  qrCode: QrCode;
  pending: boolean;
  onShowQr: (qrCode: QrCode) => void;
  onEdit: (qrCode: QrCode) => void;
  onDelete: (qrCode: QrCode) => void;
}) {
  return (
    <div className="flex justify-end gap-1">
      <button
        type="button"
        onClick={() => onShowQr(qrCode)}
        aria-label={`Lihat QR code ${qrCode.title}`}
        title="Lihat & unduh QR"
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <Icon name="qrcode" size={15} />
      </button>
      <button
        type="button"
        onClick={() => onEdit(qrCode)}
        disabled={pending}
        aria-label={`Edit ${qrCode.title}`}
        title="Edit QR code"
        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
      >
        <Icon name="edit" size={15} />
      </button>
      <button
        type="button"
        onClick={() => onDelete(qrCode)}
        disabled={pending}
        aria-label={`Hapus ${qrCode.title}`}
        title="Hapus QR code"
        className="flex h-8 w-8 items-center justify-center rounded-md text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
      >
        <Icon name="trash" size={15} />
      </button>
    </div>
  );
}

function QrPreview({
  qrCode,
  trackedUrl,
  origin,
  onClose,
}: {
  qrCode: QrCode | null;
  trackedUrl: string;
  origin: string;
  onClose: () => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState<"plain" | "frame" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  async function downloadImage(framed: boolean) {
    if (!qrCode || downloading || !trackedUrl) return;
    setDownloading(framed ? "frame" : "plain");
    setError(null);

    const fileName = slugify(qrCode.title);

    try {
      if (!framed) {
        const response = await fetch(qrImageUrl(trackedUrl));
        if (!response.ok) throw new Error("QR Code gagal dibuat.");

        const objectUrl = URL.createObjectURL(await response.blob());
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = `qr-${fileName}.png`;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        return;
      }

      if (!frameRef.current) return;

      const canvas = await html2canvas(frameRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `qr-${fileName}-dengan-bingkai.png`;
      link.click();
    } catch {
      setError("Gambar gagal diunduh. Coba lagi.");
    } finally {
      setDownloading(null);
    }
  }

  const qrUrl = trackedUrl ? qrImageUrl(trackedUrl) : "";

  return (
    <AdminDrawer
      open={qrCode !== null}
      title="QR code"
      description={
        qrCode
          ? `Pindai QR ini untuk membuka ${displayUrl(qrCode.target_url)}.`
          : undefined
      }
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void downloadImage(false)}
            disabled={downloading !== null || !qrUrl}
            className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
          >
            {downloading === "plain" ? "Mengunduh..." : "Unduh QR"}
          </button>
          <button
            type="button"
            onClick={() => void downloadImage(true)}
            disabled={downloading !== null || !qrUrl}
            className="h-10 flex-1 rounded-lg bg-fajar-700 px-4 text-sm font-bold text-white transition hover:bg-fajar-800 disabled:cursor-wait disabled:opacity-60"
          >
            {downloading === "frame" ? "Mengunduh..." : "Unduh berbingkai"}
          </button>
        </div>
      }
    >
      {qrCode && (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-bold text-slate-900">{qrCode.title}</p>
            <p className="mt-1 break-all text-xs leading-5 text-slate-500">
              Tujuan: {qrCode.target_url}
            </p>
          </div>

          <div className="rounded-lg border border-[#e7eeea] bg-slate-50/70 p-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              Tautan pelacak
            </p>
            <div className="mt-1 flex items-start gap-2">
              <p className="min-w-0 flex-1 break-all font-mono text-[11px] leading-4 text-slate-700">
                {trackedUrl || "Menyiapkan alamat..."}
              </p>
              {trackedUrl && (
                <CopyLinkButton value={trackedUrl} label={qrCode.title} />
              )}
            </div>
            {origin && isLocalOrigin(origin) && (
              <p className="mt-2 text-[11px] font-semibold leading-4 text-amber-700">
                Alamat masih lokal. Buka dashboard dari domain resmi agar QR
                bisa dipindai warga.
              </p>
            )}
            <p className="mt-2 text-[11px] leading-4 text-slate-500">
              Setiap pindai dicatat untuk QR ini, lalu pengunjung diarahkan ke
              URL tujuan. Sudah dipindai{" "}
              <span className="font-bold text-slate-700 tabular-nums">
                {qrCode.scan_count.toLocaleString("id-ID")}
              </span>{" "}
              kali.
            </p>
            {!qrCode.is_active && (
              <p className="mt-2 text-[11px] font-semibold leading-4 text-amber-700">
                QR ini nonaktif. Pemindai akan diarahkan ke beranda sampai QR
                diaktifkan.
              </p>
            )}
          </div>

          {error && (
            <p role="alert" className="text-xs font-medium text-red-700">
              {error}
            </p>
          )}

          <div className="flex justify-center rounded-lg border border-[#e7eeea] bg-slate-50/60 p-4">
            {qrUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={qrUrl}
                alt={`QR code ${qrCode.title}`}
                width={240}
                height={240}
                className="h-56 w-56"
              />
            ) : (
              <p className="py-20 text-xs text-slate-500">
                Menyiapkan alamat QR...
              </p>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-bold text-slate-800">
              Pratinjau dengan bingkai
            </p>
            <div className="flex justify-center overflow-x-auto rounded-lg border border-[#e7eeea] bg-slate-50/60 p-4">
              <div
                ref={frameRef}
                className="w-[280px] shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white text-center"
              >
                <div className="flex items-center gap-2.5 bg-fajar-900 px-3 py-3 text-left text-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/logo-lampung-selatan.png"
                    alt=""
                    className="h-9 w-9 rounded bg-white object-contain p-0.5"
                  />
                  <div>
                    <p className="text-[9px] font-bold uppercase leading-3 tracking-[0.08em]">
                      Pemerintah Kabupaten Lampung Selatan
                    </p>
                    <p className="mt-0.5 text-[8px] leading-3 text-emerald-100/80">
                      Kecamatan Jati Agung · Desa Fajar Baru
                    </p>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-2">
                    {qrUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={qrUrl}
                        alt={`QR code berbingkai ${qrCode.title}`}
                        className="w-full"
                      />
                    ) : (
                      <div className="flex aspect-square items-center justify-center text-[10px] text-slate-400">
                        Menyiapkan QR...
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-sm font-bold text-slate-900">
                    Pindai untuk membuka
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-700">
                    {qrCode.title}
                  </p>
                  <p className="mt-1 break-all text-[10px] leading-4 text-slate-500">
                    {displayUrl(qrCode.target_url)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminDrawer>
  );
}

export function QrCodeManager({
  qrCodes,
  setQrCodes,
  links,
  onQrDeleted,
}: QrCodeManagerProps) {
  const origin = useSiteOrigin();
  const [isPending, startTransition] = useTransition();
  const [drawer, setDrawer] = useState<"add" | "edit" | null>(null);
  const [editingQr, setEditingQr] = useState<QrCode | null>(null);
  const [previewQr, setPreviewQr] = useState<QrCode | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<QrCode | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all",
  );

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredQrCodes = qrCodes.filter((qrCode) => {
    const matchesQuery =
      !normalizedQuery ||
      qrCode.title.toLowerCase().includes(normalizedQuery) ||
      qrCode.target_url.toLowerCase().includes(normalizedQuery);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? qrCode.is_active : !qrCode.is_active);

    return matchesQuery && matchesStatus;
  });
  const hasActiveFilters =
    normalizedQuery !== "" || statusFilter !== "all";
  const totalScans = qrCodes.reduce(
    (total, qrCode) => total + (qrCode.scan_count || 0),
    0,
  );

  function trackedUrlFor(qrCode: QrCode) {
    return origin ? `${origin}/qr/${qrCode.id}` : "";
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setEditingQr(null);
    setDrawer("add");
  }

  function openEdit(qrCode: QrCode) {
    setEditingQr(qrCode);
    setForm({
      title: qrCode.title,
      target_url: qrCode.target_url,
      is_active: qrCode.is_active,
      link_id: "",
    });
    setFormError(null);
    setDrawer("edit");
  }

  function closeDrawer() {
    if (isPending) return;
    setDrawer(null);
    setEditingQr(null);
    setFormError(null);
  }

  function resetFilters() {
    setQuery("");
    setStatusFilter("all");
  }

  function handlePickLink(linkId: string) {
    const link = links.find((item) => item.id === linkId);
    setForm((current) => ({
      ...current,
      link_id: linkId,
      target_url: link ? link.url : current.target_url,
      title: link && !current.title.trim() ? link.title : current.title,
    }));
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
    formData.append("title", form.title);
    formData.append("target_url", form.target_url);
    formData.append("is_active", String(form.is_active));

    startTransition(async () => {
      const result =
        drawer === "add"
          ? await createQrCodeAction(formData)
          : await updateQrCodeAction(editingQr!.id, formData);

      if (!result.success || !result.data) {
        setFormError(result.error || "QR code gagal disimpan. Coba lagi.");
        return;
      }

      const savedQr = result.data;
      setQrCodes((current) =>
        drawer === "add"
          ? [savedQr, ...current]
          : current.map((item) =>
              item.id === savedQr.id ? savedQr : item,
            ),
      );
      setDrawer(null);
      setEditingQr(null);
      // Langsung tampilkan QR yang baru dibuat supaya bisa segera diunduh.
      if (drawer === "add") setPreviewQr(savedQr);
      setNotice({
        type: "success",
        text:
          drawer === "add"
            ? "QR code berhasil dibuat."
            : "Perubahan QR code berhasil disimpan.",
      });
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;

    startTransition(async () => {
      const result = await deleteQrCodeAction(deleteTarget.id);
      if (!result.success) {
        setNotice({
          type: "error",
          text: result.error || "QR code gagal dihapus.",
        });
        setDeleteTarget(null);
        return;
      }

      setQrCodes((current) =>
        current.filter((item) => item.id !== deleteTarget.id),
      );
      onQrDeleted?.(deleteTarget);
      setDeleteTarget(null);
      setNotice({ type: "success", text: "QR code berhasil dihapus." });
    });
  }

  function handleToggle(qrCode: QrCode) {
    startTransition(async () => {
      const nextStatus = !qrCode.is_active;
      const result = await toggleQrCodeStatusAction(qrCode.id, nextStatus);

      if (!result.success) {
        setNotice({
          type: "error",
          text: result.error || "Status QR code gagal diubah.",
        });
        return;
      }

      setQrCodes((current) =>
        current.map((item) =>
          item.id === qrCode.id ? { ...item, is_active: nextStatus } : item,
        ),
      );
    });
  }

  const emptyState = (
    <>
      <p className="text-sm font-semibold text-slate-700">
        {qrCodes.length === 0
          ? "Belum ada QR code"
          : "Tidak ada QR code yang cocok"}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        {qrCodes.length === 0
          ? "Buat QR code pertama, lalu unduh gambarnya untuk dicetak."
          : "Ubah kata kunci atau reset filter untuk melihat semua QR code."}
      </p>
      <button
        type="button"
        onClick={qrCodes.length === 0 ? openAdd : resetFilters}
        className="mt-4 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        {qrCodes.length === 0 ? (
          <>
            <Icon name="plus" size={14} />
            Buat QR code
          </>
        ) : (
          "Reset filter"
        )}
      </button>
    </>
  );

  return (
    <section aria-label="Daftar QR code">
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
              aria-label="Cari QR code"
              placeholder="Cari judul atau URL tujuan"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-fajar-700 focus:ring-2 focus:ring-fajar-700/15"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as "all" | "active" | "inactive",
                )
              }
              aria-label="Filter status QR code"
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
            Buat QR code
          </button>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50/70 text-[11px] uppercase tracking-[0.08em] text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold">
                  QR code
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Tautan pelacak
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right font-bold">
                  Pindai
                </th>
                <th scope="col" className="px-4 py-3 text-right font-bold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredQrCodes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-14 text-center">
                    {emptyState}
                  </td>
                </tr>
              ) : (
                filteredQrCodes.map((qrCode) => {
                  const trackedUrl = trackedUrlFor(qrCode);
                  return (
                    <tr
                      key={qrCode.id}
                      className="border-t border-[#e7eeea] align-middle"
                    >
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">
                          {qrCode.title}
                        </p>
                        <p
                          className="mt-0.5 max-w-[320px] truncate text-xs text-slate-400"
                          title={qrCode.target_url}
                        >
                          {displayUrl(qrCode.target_url)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <p
                            className="max-w-[240px] truncate font-mono text-[11px] text-slate-600"
                            title={trackedUrl}
                          >
                            {trackedUrl
                              ? trackedUrl.replace(/^https?:\/\//, "")
                              : "Menyiapkan alamat..."}
                          </p>
                          {trackedUrl && (
                            <CopyLinkButton
                              value={trackedUrl}
                              label={qrCode.title}
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <QrStatusToggle
                          qrCode={qrCode}
                          pending={isPending}
                          onToggle={handleToggle}
                        />
                      </td>
                      <td className="px-4 py-3 text-right text-xs font-semibold text-slate-800 tabular-nums">
                        {(qrCode.scan_count || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3">
                        <QrActions
                          qrCode={qrCode}
                          pending={isPending}
                          onShowQr={setPreviewQr}
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
          {filteredQrCodes.length === 0 ? (
            <div className="px-4 py-14 text-center">{emptyState}</div>
          ) : (
            <ul className="divide-y divide-[#e7eeea]">
              {filteredQrCodes.map((qrCode) => {
                const trackedUrl = trackedUrlFor(qrCode);
                return (
                  <li key={qrCode.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">
                          {qrCode.title}
                        </p>
                        <p
                          className="mt-0.5 truncate text-xs text-slate-400"
                          title={qrCode.target_url}
                        >
                          {displayUrl(qrCode.target_url)}
                        </p>
                      </div>
                      <QrActions
                        qrCode={qrCode}
                        pending={isPending}
                        onShowQr={setPreviewQr}
                        onEdit={openEdit}
                        onDelete={setDeleteTarget}
                      />
                    </div>

                    <div className="mt-2 flex items-center gap-1">
                      <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-slate-600">
                        {trackedUrl
                          ? trackedUrl.replace(/^https?:\/\//, "")
                          : "Menyiapkan alamat..."}
                      </p>
                      {trackedUrl && (
                        <CopyLinkButton
                          value={trackedUrl}
                          label={qrCode.title}
                        />
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <QrStatusToggle
                        qrCode={qrCode}
                        pending={isPending}
                        onToggle={handleToggle}
                      />
                      <span className="text-xs font-semibold text-slate-500 tabular-nums">
                        {(qrCode.scan_count || 0).toLocaleString("id-ID")}{" "}
                        pindai
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-[#e7eeea] px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Menampilkan {filteredQrCodes.length} dari {qrCodes.length} QR code
          </p>
          <p>
            {totalScans.toLocaleString("id-ID")} pindai ·{" "}
            {qrCodes.filter((qrCode) => qrCode.is_active).length} aktif
          </p>
        </div>
      </div>

      <AdminDrawer
        open={drawer !== null}
        title={drawer === "add" ? "Buat QR code" : "Edit QR code"}
        description={
          drawer === "add"
            ? "Setiap QR code punya tautan pelacak sendiri, jadi jumlah pindainya bisa dipantau terpisah."
            : "Perubahan berlaku pada QR setelah disimpan. Gambar QR yang sudah dicetak tetap mengarah ke tautan yang sama."
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
              form="qr-form"
              disabled={isPending}
              className="h-10 flex-1 rounded-lg bg-fajar-700 px-4 text-sm font-bold text-white transition hover:bg-fajar-800 disabled:cursor-wait disabled:opacity-60"
            >
              {isPending
                ? "Menyimpan..."
                : drawer === "add"
                  ? "Buat QR code"
                  : "Simpan perubahan"}
            </button>
          </div>
        }
      >
        <form id="qr-form" onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-5 text-red-800"
            >
              {formError}
            </div>
          )}

          <div>
            <label htmlFor="qr-title" className={labelClass}>
              Judul QR <span className="text-red-600">*</span>
            </label>
            <input
              id="qr-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={255}
              className={inputClass}
              placeholder="Contoh: Stiker QR Balai Desa"
            />
            <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
              Nama ini membantu membedakan QR yang satu dengan yang lain.
            </p>
          </div>

          {links.length > 0 && (
            <div>
              <label htmlFor="qr-link" className={labelClass}>
                Isi dari tautan terdaftar
              </label>
              <select
                id="qr-link"
                value={form.link_id}
                onChange={(event) => handlePickLink(event.target.value)}
                className={inputClass}
              >
                <option value="">Gunakan URL manual</option>
                {links.map((link) => (
                  <option key={link.id} value={link.id}>
                    {link.title}
                    {link.is_active ? "" : " (nonaktif)"}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
                Hanya mengisi kolom di bawah. Pindai tetap dihitung untuk QR
                ini, bukan untuk tautannya.
              </p>
            </div>
          )}

          <div>
            <label htmlFor="qr-target-url" className={labelClass}>
              URL tujuan <span className="text-red-600">*</span>
            </label>
            <input
              id="qr-target-url"
              name="target_url"
              type="url"
              value={form.target_url}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="https://fajarbaru.desa.id"
            />
            <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
              Warga akan diarahkan ke alamat ini setelah memindai QR.
            </p>
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
                  QR meneruskan pemindai ke URL tujuan. Jika nonaktif, pemindai
                  diarahkan ke beranda.
                </span>
              </span>
            </label>
          </div>

          {drawer === "edit" && editingQr && (
            <div className="rounded-lg border border-[#e7eeea] bg-white p-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                Tautan pelacak
              </p>
              <p className="mt-1 break-all font-mono text-[11px] leading-4 text-slate-700">
                {trackedUrlFor(editingQr) || "Menyiapkan alamat..."}
              </p>
              <p className="mt-2 text-[11px] leading-4 text-slate-500">
                Tautan ini tetap sama walaupun URL tujuan diubah, sehingga
                jumlah pindai tetap terhitung.
              </p>
            </div>
          )}
        </form>
      </AdminDrawer>

      <QrPreview
        qrCode={previewQr}
        trackedUrl={previewQr ? trackedUrlFor(previewQr) : ""}
        origin={origin}
        onClose={() => setPreviewQr(null)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Hapus QR code?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" akan dihapus permanen. QR yang sudah dicetak tidak akan berfungsi lagi dan jumlah pindainya tidak tampil di daftar.`
            : ""
        }
        pending={isPending}
        onConfirm={handleDelete}
        onCancel={() => !isPending && setDeleteTarget(null)}
      />
    </section>
  );
}
