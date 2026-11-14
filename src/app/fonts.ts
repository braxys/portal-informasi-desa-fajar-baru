import localFont from "next/font/local";

/**
 * Font di-self-host lewat next/font/local supaya:
 * - tidak ada request ke fonts.googleapis.com / fonts.gstatic.com,
 * - file ikut di-preload dan di-hash (cache immutable),
 * - tidak ada layout shift karena metrik fallback disesuaikan otomatis.
 *
 * Keduanya variable font, jadi satu file sudah mencakup seluruh bobot yang
 * dipakai portal (DM Sans 400–700 untuk body, Manrope 600–800 untuk heading).
 */
export const dmSans = localFont({
  src: "./fonts/dm-sans-latin.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-dm-sans",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  weight: "600 800",
  style: "normal",
  display: "swap",
  variable: "--font-manrope",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});
