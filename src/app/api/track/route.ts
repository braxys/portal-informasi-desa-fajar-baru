import { NextResponse, type NextRequest } from "next/server";
import { logTrafficEvent } from "@/actions/analytics";
import type { TrafficEventType } from "@/types/database";

// Pindai QR sengaja tidak diterima dari klien: hanya rute /qr/[id] dan /q/[id]
// yang boleh mencatat pindai, supaya angka tidak bisa digelembungkan.
const EVENT_TYPES: TrafficEventType[] = ["page_view", "link_click"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, linkId, source } = body as {
      eventType?: TrafficEventType;
      linkId?: string;
      source?: string;
    };

    if (!eventType || !EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(
        { error: "Unsupported eventType" },
        { status: 400 },
      );
    }

    await logTrafficEvent({
      eventType,
      linkId,
      source: source || "direct",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to process tracking" }, { status: 500 });
  }
}
