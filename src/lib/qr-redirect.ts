import { NextResponse } from "next/server";

/**
 * Perkakas bersama untuk rute pindai QR: `/qr/[id]` (QR baru) dan `/q/[id]`
 * (stiker lama sebelum migrasi 014). Keduanya berperilaku sama, jadi aturan
 * bot, validasi UUID, dan kebijakan cache cukup ditulis sekali di sini.
 */

export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Pratinjau tautan (WhatsApp, Telegram, mesin pencari) tidak dihitung sebagai
// pindai warga, supaya angka tidak menggelembung. Browser dalam aplikasi
// (WhatsApp/Instagram) tetap dihitung karena bukan bot.
const BOT_PATTERN =
  /bot\b|crawler|spider|crawling|facebookexternalhit|embedly|pinterest|slackbot|discordbot|preview\b|google-?bot|bingbot|yandex|baidu/i;

export function isLikelyBot(userAgent: string) {
  if (BOT_PATTERN.test(userAgent)) return true;

  // Pratinjau tautan WhatsApp/Telegram memakai UA aplikasi tanpa token browser.
  // Browser dalam aplikasi tetap punya Mozilla/Chrome/Safari, jadi tetap dihitung.
  const isMessenger = /whatsapp|telegram/i.test(userAgent);
  const isBrowser = /mozilla|chrome|safari|webkit/i.test(userAgent);
  return isMessenger && !isBrowser;
}

export function redirectTo(destination: URL) {
  const response = NextResponse.redirect(destination, 302);
  // Jangan cache redirect: setiap pindai harus tetap tercatat.
  response.headers.set("Cache-Control", "no-store, max-age=0");
  return response;
}
