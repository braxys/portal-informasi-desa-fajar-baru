import { getPublicMarkers } from "@/actions/markers";
import { getServices, getSocials } from "@/actions/services";
import { HeroSection } from "@/components/public/hero-section";
import { ProfileSection } from "@/components/public/profile-section";
import { ServicesSection } from "@/components/public/services-section";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { VillageMapSection } from "@/components/public/village-map-section";
import { DEFAULT_MARKERS } from "@/lib/default-markers";

export default async function HomePage() {
  const [markers, services, socials] = await Promise.all([
    getPublicMarkers(),
    getServices(),
    getSocials(),
  ]);
  const markerCount = markers.length > 0 ? markers.length : DEFAULT_MARKERS.length;

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f7f9f7] text-slate-900">
      <SiteHeader />
      <main>
        <HeroSection serviceCount={services.length} markerCount={markerCount} />
        <ProfileSection />
        <ServicesSection services={services} socials={socials} />
        <VillageMapSection markers={markers} />
      </main>
      <SiteFooter />
    </div>
  );
}
