import { HeroSection } from "@/components/public/hero-section";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f9f7] text-slate-900">
      <SiteHeader />
      <main>
        <HeroSection />
      </main>
      <SiteFooter />
    </div>
  );
}
