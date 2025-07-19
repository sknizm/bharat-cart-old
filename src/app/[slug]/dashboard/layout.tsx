import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { getCurrentUser } from "@/lib/queries/user";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/signin');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Sidebar for md+ screens */}
      <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white border-r z-99">
        <Sidebar />
      </div>

      {/* Main content area with left margin to accommodate fixed sidebar */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6 mt-2 scroll-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
