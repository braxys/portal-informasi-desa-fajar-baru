export function ContactSection() {
  return (
    <section
      id="kontak"
      className="scroll-mt-20 bg-[#f7f9f7] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="section-kicker">Hubungi Kami</p>
          <h2 className="section-title mx-auto">Kontak Desa Fajar Baru.</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Kami siap membantu Anda. Jangan ragu untuk menghubungi kami
            melalui informasi di bawah ini.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-[1.75rem] bg-white p-8 shadow-[0_24px_70px_-30px_rgba(15,67,58,.3)] sm:p-10">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="footer-title !text-slate-900">Alamat</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Balai Desa Fajar Baru
                <br />
                Kec. Jati Agung, Lampung Selatan
              </p>
            </div>
            <div>
              <h3 className="footer-title !text-slate-900">Email</h3>
              <a
                href="mailto:desafajarbaru@gmail.com"
                className="mt-4 block text-sm text-slate-600 transition hover:text-fajar-700"
              >
                desafajarbaru@gmail.com
              </a>
            </div>
            <div>
              <h3 className="footer-title !text-slate-900">Telepon</h3>
              <a
                href="tel:+6281234567890"
                className="mt-4 block text-sm text-slate-600 transition hover:text-fajar-700"
              >
                +62 812 3456 7890
              </a>
            </div>
            <div>
              <h3 className="footer-title !text-slate-900">Jam Pelayanan</h3>
              <p className="mt-4 text-sm text-slate-600">
                Senin–Jumat, 08.00–15.00 WIB
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
