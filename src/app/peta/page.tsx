import { VillageMapSection } from "@/components/public/village-map-section";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

export default function PetaPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f9f7] text-slate-900">
      <SiteHeader />
      <main>
        <VillageMapSection />
      </main>
      <SiteFooter />
    </div>
  );
}
