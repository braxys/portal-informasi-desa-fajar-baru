/**
 * Bentuk hasil Server Action yang dipakai seluruh form admin.
 *
 * Didefinisikan sekali agar panel admin dapat menangani `success`/`error`
 * dengan cara yang sama untuk tautan, titik peta, dan QR code.
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
