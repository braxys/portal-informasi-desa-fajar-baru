"use client";

import { useState } from "react";
import { LinksManager } from "@/components/admin/links-manager";
import { MarkersManager } from "@/components/admin/markers-manager";
import { QrCodeGenerator } from "@/components/admin/qr-code-generator";
import type { Link, Marker } from "@/types/database";

interface DashboardTabsProps {
  links: Link[];
  markers: Marker[];
}

export function DashboardTabs({ links, markers }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<"links" | "markers" | "qrcode">("links");

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("links")}
          className={`relative px-5 py-3 text-sm font-bold transition ${
            activeTab === "links"
              ? "text-fajar-700"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Kelola Link
          {activeTab === "links" && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-fajar-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("markers")}
          className={`relative px-5 py-3 text-sm font-bold transition ${
            activeTab === "markers"
              ? "text-fajar-700"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Titik Lokasi Peta
          {activeTab === "markers" && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-fajar-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("qrcode")}
          className={`relative px-5 py-3 text-sm font-bold transition ${
            activeTab === "qrcode"
              ? "text-fajar-700"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Buat QR Code
          {activeTab === "qrcode" && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 bg-fajar-600" />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === "links" ? (
        <LinksManager initialLinks={links} />
      ) : activeTab === "markers" ? (
        <MarkersManager initialMarkers={markers} />
      ) : (
        <QrCodeGenerator />
      )}
    </div>
  );
}
