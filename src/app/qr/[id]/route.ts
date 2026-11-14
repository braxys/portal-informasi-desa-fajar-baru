import { type NextRequest } from "next/server";
import { logTrafficEvent } from "@/actions/analytics";
import { createClient } from "@/lib/supabase/server";
import { isLikelyBot, redirectTo, UUID_PATTERN } from "@/lib/qr-redirect";
import { parseHttpUrl } from "@/lib/validation";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!UUID_PATTERN.test(id)) {
    return redirectTo(new URL("/", request.url));
  }

  const supabase = await createClient();
  const { data: qrCode, error } = await supabase
    .from("qr_codes")
    .select("id, target_url, is_active")
    .eq("id", id)
    .maybeSingle();

  if (error || !qrCode?.target_url || !qrCode.is_active) {
    return redirectTo(new URL("/", request.url));
  }

  const destination = parseHttpUrl(qrCode.target_url);
  if (!destination) {
    return redirectTo(new URL("/", request.url));
  }

  const userAgent = request.headers.get("user-agent") || "";
  if (!isLikelyBot(userAgent)) {
    await logTrafficEvent({
      eventType: "qr_scan",
      qrCodeId: qrCode.id,
      source: "qr_code",
    });
  }

  return redirectTo(destination);
}
