import { type NextRequest } from "next/server";
import { logTrafficEvent } from "@/actions/analytics";
import { createClient } from "@/lib/supabase/server";
import { isLikelyBot, redirectTo, UUID_PATTERN } from "@/lib/qr-redirect";
import { parseHttpUrl } from "@/lib/validation";

/**
 * Rute pelacak LAMA: QR yang sudah tercetak sebelum migrasi 014 mengarah ke
 * /q/<id tautan>. Rute ini dipertahankan supaya stiker lama tetap berfungsi,
 * dan pindaiannya tetap masuk hitungan total di dashboard.
 *
 * QR baru dibuat lewat halaman QR Code dan memakai /qr/<id QR>.
 */

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

  const destination = parseHttpUrl(link.url);
  if (!destination) {
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

  return redirectTo(destination);
}
