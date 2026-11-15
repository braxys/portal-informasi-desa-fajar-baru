-- Lokasi sekitar Desa Fajar Baru dari daftar koordinat yang diberikan pengguna.
-- Koordinat dan alamat perlu diverifikasi kembali sebelum publikasi.
INSERT INTO public.markers (
    name,
    latitude,
    longitude,
    keterangan,
    jenis_info,
    is_active,
    display_order
)
VALUES
    (
        'Indomaret RA Basyid Fajar Baru',
        -5.3391882,
        105.2747185,
        'Jl. R.A. Basyid, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.',
        'minimarket',
        true,
        3
    ),
    (
        'Indomaret Rest Area KM 87 B',
        -5.3182311,
        105.2662025,
        'Rest Area KM 87 B, Tol Bakauheni-Kayu Agung, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.',
        'minimarket',
        true,
        4
    ),
    (
        'Indomaret Rest Area KM 87 A',
        -5.3194354,
        105.2650817,
        'Rest Area KM 87 A, Tol Bakauheni-Kayu Agung, area Fajar Baru/Jati Agung, Kab. Lampung Selatan.',
        'minimarket',
        true,
        5
    ),
    (
        'Indomaret Permata Asri TDC5',
        -5.3206612,
        105.2891868,
        'Jl. P. Senopati, Perumahan Permata Asri Blok P No. 2, Karang Sari, Kec. Jati Agung.',
        'minimarket',
        true,
        6
    ),
    (
        'Masjid Al-Ikhlas Fajar Baru',
        -5.3415517,
        105.2712147,
        'Jl. R.A. Basyid No. 6, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.',
        'ibadah',
        true,
        7
    ),
    (
        'Masjid Al-Bayinah',
        -5.3396035,
        105.2749443,
        'Jl. R.A. Basyid No. 43, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.',
        'ibadah',
        true,
        8
    ),
    (
        'Masjid Falahul Abbas',
        -5.3372400,
        105.2722514,
        'Jl. Puspa Raya, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.',
        'ibadah',
        true,
        9
    ),
    (
        'Masjid Ar-Raudah',
        -5.3399886,
        105.2676500,
        'Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.',
        'ibadah',
        true,
        10
    ),
    (
        'Masjid Nurul Iman (Dusun 4 Tanjung Laut)',
        -5.3207428,
        105.2599463,
        'Dusun 4 Tanjung Laut, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.',
        'ibadah',
        true,
        11
    ),
    (
        'Masjid Nurul Iman',
        -5.3475529,
        105.2686271,
        'Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.',
        'ibadah',
        true,
        12
    ),
    (
        'Musholla Nur Mardhatillah',
        -5.3313664,
        105.2690089,
        'Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.',
        'ibadah',
        true,
        13
    ),
    (
        'Musholla Nurhasanah',
        -5.3450768,
        105.2727060,
        'Gg. Murni.AS, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.',
        'ibadah',
        true,
        14
    ),
    (
        'Mushola Baitul Jannah',
        -5.3341332,
        105.2654235,
        'Jl. Walet Raya, Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.',
        'ibadah',
        true,
        15
    ),
    (
        'Mushola Al Ikhlas',
        -5.3128395,
        105.2607603,
        'Fajar Baru, Kec. Jati Agung, Kab. Lampung Selatan.',
        'ibadah',
        true,
        16
    )
ON CONFLICT ON CONSTRAINT uq_markers_name_coords DO NOTHING;
