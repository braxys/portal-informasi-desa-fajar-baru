/**
 * Validasi URL yang dipakai bersama oleh Server Action tautan, marker, QR, dan
 * rute pindai QR.
 *
 * Sebelumnya fungsi ini disalin di tiga berkas; satu salinan yang berbeda
 * perilakunya sudah cukup membuat validasi tidak konsisten antar form.
 */

/**
 * Mengurai `value` sebagai URL absolut http/https.
 * Mengembalikan `null` bila tidak bisa diurai atau protokolnya tidak aman
 * (mis. `javascript:` atau `data:`), sehingga hasilnya aman dipakai sebagai
 * tujuan redirect.
 */
export function parseHttpUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

export function isHttpUrl(value: string): boolean {
  return parseHttpUrl(value) !== null;
}
