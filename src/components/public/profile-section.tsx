import { Icon } from "@/components/shared/icons";

export function ProfileSection() {
  return (
    <section
      id="profil"
      className="relative scroll-mt-20 border-t border-slate-200/60 bg-[#f7f9f7] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="section-kicker">Mengenal Desa</p>
            <h2 className="section-title">Profil & Wilayah Desa Fajar Baru.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-600 sm:text-base">
            Mengenal lebih dekat identitas administratif, letak geografis strategis, dan komitmen pelayanan terpadu bagi warga Desa Fajar Baru.
          </p>
        </div>

        {/* Paragraf Semantik untuk SEO */}
        <div className="mt-8 rounded-2xl border border-fajar-200/60 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg">
            <strong>Desa Fajar Baru</strong> merupakan salah satu desa di wilayah <strong>Kecamatan Jati Agung, Kabupaten Lampung Selatan, Provinsi Lampung</strong>. Terletak di lokasi strategis yang berbatasan langsung dengan pusat Kota Bandar Lampung dan koridor pendidikan tinggi, Desa Fajar Baru terus berkembang sebagai kawasan permukiman yang dinamis, mandiri, dan berdaya saing dengan tetap mengedepankan keterbukaan informasi publik serta pelayanan masyarakat yang ramah dan inklusif.
          </p>
        </div>

        {/* 4 Kartu Data Terstruktur */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Data Wilayah & Administrasi */}
          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-fajar-300 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fajar-100 text-fajar-700">
              <Icon name="shield" size={24} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Identitas Wilayah
            </h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-fajar-700">
              Administrasi Resmi
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">Kemendagri:</span>
                <span className="font-semibold text-slate-800">18.01.13.2009</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">Kode Pos:</span>
                <span className="font-semibold text-slate-800">35365</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">Kecamatan:</span>
                <span className="font-semibold text-slate-800">Jati Agung</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Kabupaten:</span>
                <span className="font-semibold text-slate-800">Lampung Selatan</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Batas Wilayah */}
          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-fajar-300 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-telaga-100 text-telaga-700">
              <Icon name="map" size={24} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Batas Wilayah
            </h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-telaga-700">
              Geografis Desa
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">Utara:</span>
                <span className="font-semibold text-slate-800 text-right">Desa Karang Anyar</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">Selatan:</span>
                <span className="font-semibold text-slate-800 text-right">Kota Bandar Lampung</span>
              </li>
              <li className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">Timur:</span>
                <span className="font-semibold text-slate-800 text-right">Desa Jatimulyo</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-400">Barat:</span>
                <span className="font-semibold text-slate-800 text-right">Kec. Rajabasa</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Pusat Layanan Balai Desa */}
          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-fajar-300 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Icon name="building" size={24} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Balai Desa
            </h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Pusat Pelayanan
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Pusat pelayanan administrasi kependudukan (KTP/KK), surat pengantar, perizinan, dan musyawarah pembangunan warga Desa Fajar Baru.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
              Buka: Senin – Jumat (Jam Kerja)
            </div>
          </div>

          {/* Card 4: Potensi & Kehidupan Warga */}
          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-fajar-300 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
              <Icon name="users" size={24} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Masyarakat & Potensi
            </h3>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
              Sosial & Ekonomi
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Masyarakat yang guyub rukun dengan potensi perekonomian di bidang usaha mikro, perdagangan, jasa, dan pemukiman mahasiswa kampus sekitar.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-500">
              Didukung Kelembagaan RT & RW
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
