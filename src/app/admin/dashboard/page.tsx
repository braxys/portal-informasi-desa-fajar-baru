import { getAllLinksAdmin } from "@/actions/links";
import { getAllMarkersAdmin } from "@/actions/markers";
import { getAllQrCodesAdmin } from "@/actions/qr-codes";
import { getAnalyticsSummary } from "@/actions/analytics";
import { getCurrentUser } from "@/actions/auth";
import { DashboardTabs } from "@/components/admin/dashboard-tabs";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/supabase/auth";

export const metadata = {
  title: "Dashboard Admin | Desa Fajar Baru",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || !isAdminUser(user)) redirect("/admin/login");

  const [links, markers, qrCodes, analytics] = await Promise.all([
    getAllLinksAdmin(),
    getAllMarkersAdmin(),
    getAllQrCodesAdmin(),
    getAnalyticsSummary(),
  ]);

  return (
    <DashboardTabs
      links={links}
      markers={markers}
      qrCodes={qrCodes}
      userEmail={user.email ?? "Administrator"}
      stats={{
        pageViews: analytics.totalPageViews,
        qrScans: analytics.totalQrScans,
      }}
    />
  );
}
