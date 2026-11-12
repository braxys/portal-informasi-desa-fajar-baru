"use client";

import { useState } from "react";
import html2canvas from "html2canvas-pro";

export function QrCodeGenerator() {
  const [url, setUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const validUrl = (() => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  })();
  const qrUrl = validUrl ? `/api/qr-code?data=${encodeURIComponent(url)}` : "";

  async function downloadImage(framed: boolean) {
    if (downloading) return;
    setDownloading(true);
    try {
      if (!framed) {
        const response = await fetch(qrUrl);
        const objectUrl = URL.createObjectURL(await response.blob());
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = "qrcode.png";
        link.click();
        URL.revokeObjectURL(objectUrl);
        return;
      }

      const source = document.querySelector<HTMLElement>("[data-qr-frame]");
      if (!source) return;

      const canvas = await html2canvas(source, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "qrcode-dengan-frame.png";
      link.click();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Buat QR Code</h1>
      <p className="mt-1 text-sm text-slate-500">Masukkan link untuk membuat QR Code.</p>
      <label htmlFor="qr-url" className="mt-5 block text-sm font-semibold text-slate-700">Link</label>
      <input id="qr-url" type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://contoh.com" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-fajar-600" />
      {url && !validUrl && <p className="mt-2 text-sm text-red-600">Masukkan URL yang diawali http:// atau https://.</p>}
      {validUrl && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-start gap-3">
            <h2 className="font-bold text-slate-800">QR Code</h2>
            <img data-qr-plain src={qrUrl} alt={`QR Code untuk ${url}`} width={240} height={240} />
            <button onClick={() => void downloadImage(false)} disabled={downloading} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-fajar-700 disabled:opacity-50">{downloading ? "Mengunduh…" : "Unduh QR Code"}</button>
          </div>
          <div className="flex flex-col items-start gap-3">
            <h2 className="font-bold text-slate-800">QR Code dengan Frame</h2>
            <div data-qr-frame className="w-60 overflow-hidden border border-slate-200 bg-[#fdfdfc] text-center shadow-sm">
              <div className="mx-2 mt-1 flex h-12 items-center gap-2 rounded-[18px] bg-[#08b7ad] px-2 text-left text-[6px] font-extrabold leading-tight text-[#10272a]">
                <img src="/brand/logo-lampung-selatan.png" alt="" className="h-9 w-9 object-contain" />
                <span>PEMERINTAHAN KABUPATEN LAMPUNG SELATAN<br />KECAMATAN JATI AGUNG<br />DESA FAJAR BARU</span>
              </div>
              <div className="relative overflow-hidden" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='7'%3E%3Ccircle cx='3.5' cy='3.5' r='1' fill='%23e5e8e6'/%3E%3C/svg%3E")`, backgroundSize: "7px 7px" }}>
                <p className="relative z-10 py-4 text-2xl font-black tracking-[0.18em] text-[#111111]">SCAN HERE</p>
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[#08b7ad]" />
                <div className="relative z-10 mx-5 rounded-xl bg-white p-2"><img src={qrUrl} alt={`QR Code berbingkai untuk ${url}`} className="w-full" /></div>
                <div className="relative z-10 mx-5 mt-4 rounded-full bg-white px-3 py-2 text-[7px] tracking-[0.12em] text-[#202124]">SCAN UNTUK MEMBUKA TAUTAN</div>
                <p className="relative z-10 break-all bg-[#08b7ad] px-3 pb-4 pt-3 text-[7px] font-bold text-[#10272a]">{url}</p>
              </div>
            </div>
            <button onClick={() => void downloadImage(true)} disabled={downloading} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-fajar-700 disabled:opacity-50">{downloading ? "Mengunduh…" : "Unduh QR dengan Frame"}</button>
          </div>
        </div>
      )}
    </section>
  );
}
