import Image from "next/image";
import { getPublicLinks } from "@/actions/links";
import { Icon } from "@/components/shared/icons";

function getImageUrl(description: string | null): string | null {
  if (!description) return null;
  try {
    const details: unknown = JSON.parse(description);
    if (
      typeof details === "object" &&
      details !== null &&
      "imageUrl" in details &&
      typeof details.imageUrl === "string"
    ) {
      const imageUrl = new URL(details.imageUrl);
      return imageUrl.protocol === "http:" || imageUrl.protocol === "https:"
        ? imageUrl.toString()
        : null;
    }
  } catch {
    return null;
  }
  return null;
}

export async function TourismSection() {
  const links = await getPublicLinks();
  const spots = links
    .filter((link) => link.category === "wisata")
    .flatMap((link) => {
      const imageUrl = getImageUrl(link.description);
      return imageUrl
        ? [{ ...link, name: link.title, location: link.url, imageUrl }]
        : [];
    });

  return (
    <section
      id="wisata"
      className="scroll-mt-20 bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="section-kicker">Jelajahi Desa</p>
            <h2 className="section-title">Wisata Desa Fajar Baru.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-500 sm:text-base">
            Temukan tempat menarik dan lokasi wisata di Desa Fajar Baru.
          </p>
        </div>

        {spots.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-slate-300 px-6 py-14 text-center text-sm text-slate-500">
            Informasi wisata desa akan segera ditambahkan.
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spots.map((spot) => (
              <article
                key={spot.id}
                className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-[#f7f9f7] shadow-sm"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  <Image
                    src={spot.imageUrl}
                    alt={`Foto ${spot.name}`}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold tracking-tight text-slate-900">
                    {spot.name}
                  </h3>
                  <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-600">
                    <Icon name="pin" size={18} />
                    <span>{spot.location}</span>
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${spot.name}, ${spot.location}, Desa Fajar Baru`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-fajar-700 transition hover:text-fajar-800"
                  >
                    Lihat lokasi <Icon name="arrow" size={17} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
