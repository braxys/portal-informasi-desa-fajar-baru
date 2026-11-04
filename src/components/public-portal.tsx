import { HeroSection } from "@/components/public/hero-section";
import { ServicesSection } from "@/components/public/services-section";
import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { ContactSection } from "@/components/public/contact-section";
import { VillageMapSection } from "@/components/public/village-map-section";

export function PublicPortal() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#f7f9f7] text-slate-900">
      <SiteHeader />
      <main>
        <HeroSection />
        <ServicesSection />
        <VillageMapSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
