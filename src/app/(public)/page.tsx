import { getPublicMarkers } from "@/actions/markers";
import { HeroSection } from "@/components/public/hero-section";
import { ProfileSection } from "@/components/public/profile-section";
import { ServicesSection } from "@/components/public/services-section";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { VillageMapSection } from "@/components/public/village-map-section";

export default async function HomePage() {
  const markers = await getPublicMarkers();

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f7f9f7] text-slate-900">
      <SiteHeader />
      <main>
        <HeroSection />
        <ProfileSection />
        <ServicesSection />
        <VillageMapSection markers={markers} />
      </main>
      <SiteFooter />
    </div>
  );
}
