import { VillageMapSection } from "@/components/public/village-map-section";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { getPublicMarkers } from "@/actions/markers";

export default async function PetaPage() {
  const markers = await getPublicMarkers();

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f9f7] text-slate-900">
      <SiteHeader />
      <main>
        <VillageMapSection markers={markers} />
      </main>
      <SiteFooter />
    </div>
  );
}
