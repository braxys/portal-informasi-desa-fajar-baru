import { VillageMapSection } from "@/components/public/village-map-section";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
<<<<<<< HEAD
import { getPublicMarkers } from "@/actions/markers";
import type { Marker } from "@/types/database";

export default async function PetaPage() {
  const markers = await getPublicMarkers();

=======

export default function PetaPage() {
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f9f7] text-slate-900">
      <SiteHeader />
      <main>
<<<<<<< HEAD
        <VillageMapSection markers={markers} />
=======
        <VillageMapSection />
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
      </main>
      <SiteFooter />
    </div>
  );
}
