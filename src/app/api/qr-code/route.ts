import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const value = request.nextUrl.searchParams.get("data");
  if (!value || value.length > 2000) {
    return NextResponse.json({ error: "Invalid QR data" }, { status: 400 });
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return NextResponse.json({ error: "Invalid URL protocol" }, { status: 400 });
  }

  const qrUrl = new URL("https://api.qrserver.com/v1/create-qr-code/");
  qrUrl.searchParams.set("size", "600x600");
  qrUrl.searchParams.set("format", "png");
  qrUrl.searchParams.set("margin", "2");
  qrUrl.searchParams.set("data", value);

  try {
    const response = await fetch(qrUrl, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) return NextResponse.json({ error: "QR generation failed" }, { status: 502 });
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, max-age=300",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return NextResponse.json({ error: "QR generation failed" }, { status: 502 });
  }
}
