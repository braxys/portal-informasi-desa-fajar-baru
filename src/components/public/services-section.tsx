import { Icon } from "@/components/shared/icons";
import { services, socials } from "@/components/public/data";

export function ServicesSection() {
  return (
    <section id="layanan" className="relative bg-white py-20 sm:py-28">
      <div id="informasi" className="absolute -top-20" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="section-kicker">Akses Cepat</p>
            <h2 className="section-title">Layanan dalam satu genggaman.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-500 sm:text-base">
            Temukan kanal resmi dan layanan publik yang paling sering
            dibutuhkan masyarakat.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <a
              key={service.title}
              href={service.href}
              className={`service-card service-${service.accent} group ${
                index === 0 ? "md:row-span-1" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-5">
                <div className="service-icon">
                  <Icon name={service.icon} size={25} />
                </div>
                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  {service.label}
                </span>
              </div>
              <div className="mt-10">
                <h3 className="text-xl font-bold tracking-[-0.02em] text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                  {service.description}
                </p>
                <div className="mt-7 flex items-center gap-2 text-sm font-bold text-slate-800">
                  Buka layanan
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <Icon name="arrow" size={18} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-5 flex flex-col justify-between gap-6 rounded-[1.75rem] bg-slate-950 p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-fajar-500">
              Media Sosial Resmi
            </p>
            <h3 className="mt-2 text-xl font-bold tracking-tight">
              Ikuti kabar terbaru Desa Fajar Baru
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:border-fajar-500 hover:bg-fajar-500/20"
              >
                <Icon name={social.icon} size={18} /> {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
