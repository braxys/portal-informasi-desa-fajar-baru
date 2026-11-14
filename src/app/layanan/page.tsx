import { permanentRedirect } from "next/navigation";

/**
 * Redirect permanen (308) ke anchor beranda.
 *
 * Sebelumnya memakai `redirect()` yang menghasilkan 307 (temporarily). Untuk
 * URL yang tidak akan kembali, 308 memberi tahu Google agar melimpahkan
 * seluruh sinyal ke URL tujuan dan mengganti URL lama di indeks.
 */
export default function LayananPage() {
  permanentRedirect("/#layanan");
}
