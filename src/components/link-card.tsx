import type { ReactNode } from "react";

type LinkCardProps = {
  title: string;
  description: string;
  href: string;
  tag: string;
  icon: ReactNode;
};

export function LinkCard({
  title,
  description,
  href,
  tag,
  icon,
}: LinkCardProps) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="group flex h-full flex-col rounded-[1.5rem] border border-fajar-100 bg-white p-4 text-left shadow-[0_18px_40px_-22px_rgba(15,118,110,0.45)] transition duration-200 hover:-translate-y-1 hover:border-fajar-200 hover:shadow-[0_26px_50px_-20px_rgba(15,118,110,0.45)]"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fajar-500 to-telaga-500 text-lg text-white shadow-sm">
          {icon}
        </div>
        <span className="rounded-full border border-fajar-100 bg-fajar-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-fajar-700">
          {tag}
        </span>
      </div>

      <h3 className="text-lg font-bold tracking-[-0.025em] text-slate-900">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>

      <div className="mt-5 flex items-center gap-2 text-sm font-bold text-fajar-700">
        Buka tautan
        <span className="transition-transform duration-200 group-hover:translate-x-1">
          →
        </span>
      </div>
    </a>
  );
}
