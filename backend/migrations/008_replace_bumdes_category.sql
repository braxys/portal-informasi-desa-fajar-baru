-- Pindahkan tautan berkategori BUMDes ke kategori Umum.
UPDATE public.links
SET category = 'general',
    icon = 'link'
WHERE category = 'bumdes';
