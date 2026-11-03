import { NextResponse, type NextRequest } from "next/server";
import { logTrafficEvent } from "@/actions/analytics";
import type { TrafficEventType } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, linkId, source } = body as {
      eventType?: TrafficEventType;
      linkId?: string;
      source?: string;
    };

    if (!eventType) {
      return NextResponse.json({ error: "eventType is required" }, { status: 400 });
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
