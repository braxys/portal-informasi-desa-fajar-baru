import { ServicesSection } from "@/components/public/services-section";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

export default async function LayananPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f9f7] text-slate-900">
      <SiteHeader />
      <main>
        <ServicesSection />
      </main>
      <SiteFooter />
    </div>
  );
}
