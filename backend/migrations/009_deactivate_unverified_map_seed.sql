-- Unverified example coordinates must not appear as real public locations.
UPDATE public.markers
SET is_active = false
WHERE name IN ('Balai Desa Fajar Baru', 'Puskesdes', 'Posko Pelayanan')
  AND latitude BETWEEN -5.304 AND -5.301
  AND longitude BETWEEN 105.232 AND 105.238;
