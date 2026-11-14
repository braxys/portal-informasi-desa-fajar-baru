import { NextResponse, type NextRequest } from "next/server";
import { logTrafficEvent } from "@/actions/analytics";
import { createClient } from "@/lib/supabase/server";

/**
 * Rute pelacak LAMA: QR yang sudah tercetak sebelum migrasi 014 mengarah ke
 * /q/<id tautan>. Rute ini dipertahankan supaya stiker lama tetap berfungsi,
 * dan pindaiannya tetap masuk hitungan total di dashboard.
 *
 * QR baru dibuat lewat halaman QR Code dan memakai /qr/<id QR>.
 */

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Pratinjau tautan (WhatsApp, Telegram, mesin pencari) tidak dihitung sebagai
// pindai warga, supaya angka tidak menggelembung. Browser dalam aplikasi
// (WhatsApp/Instagram) tetap dihitung karena bukan bot.
const BOT_PATTERN =
  /bot\b|crawler|spider|crawling|facebookexternalhit|embedly|pinterest|slackbot|discordbot|preview\b|google-?bot|bingbot|yandex|baidu/i;

function isLikelyBot(userAgent: string) {
  if (BOT_PATTERN.test(userAgent)) return true;

  // Pratinjau tautan WhatsApp/Telegram memakai UA aplikasi tanpa token browser.
  // Browser dalam aplikasi tetap punya Mozilla/Chrome/Safari, jadi tetap dihitung.
  const isMessenger = /whatsapp|telegram/i.test(userAgent);
  const isBrowser = /mozilla|chrome|safari|webkit/i.test(userAgent);
  return isMessenger && !isBrowser;
}

function redirectTo(destination: URL) {
  const response = NextResponse.redirect(destination, 302);
  // Jangan cache redirect: setiap pindai harus tetap tercatat.
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return redirectTo(new URL("/", request.url));
  }

  const supabase = await createClient();
  const { data: link, error } = await supabase
    .from("links")
    .select("id, url, is_active")
    .eq("id", id)
    .maybeSingle();

  if (error || !link?.url || !link.is_active) {
    return redirectTo(new URL("/", request.url));
  }

  const userAgent = request.headers.get("user-agent") || "";
  if (!isLikelyBot(userAgent)) {
    await logTrafficEvent({
      eventType: "qr_scan",
      linkId: link.id,
      source: "qr_code_legacy",
    });
  }

  let destination: URL;
  try {
    destination = new URL(link.url);
  } catch {
    return redirectTo(new URL("/", request.url));
  }

  if (
    destination.protocol !== "http:" &&
    destination.protocol !== "https:"
  ) {
    return redirectTo(new URL("/", request.url));
  }

  return redirectTo(destination);
}
