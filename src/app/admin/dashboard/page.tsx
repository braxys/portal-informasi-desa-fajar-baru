import { getAllLinksAdmin } from "@/actions/links";
<<<<<<< HEAD
import { getAllMarkersAdmin } from "@/actions/markers";
import { getCurrentUser, logoutAction } from "@/actions/auth";
import { DashboardTabs } from "@/components/admin/dashboard-tabs";
import { redirect } from "next/navigation";
=======
import { getCurrentUser, logoutAction } from "@/actions/auth";
import { LinksManager } from "@/components/admin/links-manager";
import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/supabase/auth";
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692

export const metadata = {
  title: "Dashboard Admin | Desa Fajar Baru",
};

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
<<<<<<< HEAD
  if (!user) redirect("/admin/login");

  const [links, markers] = await Promise.all([
    getAllLinksAdmin(),
    getAllMarkersAdmin(),
  ]);
=======
  if (!user || !isAdminUser(user)) redirect("/admin/login");

  const links = await getAllLinksAdmin();
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
              DF
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Dashboard Admin</p>
              <p className="text-xs text-slate-400">Desa Fajar Baru</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:block">
              {user.email}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-5 py-8">
<<<<<<< HEAD
        <DashboardTabs links={links} markers={markers} />
=======
        <LinksManager initialLinks={links} />
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
      </main>
    </div>
  );
}
