// app/dashboard/layout.tsx
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
    <div className="flex min-h-screen bg-white">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64"> {/* Add left padding equal to sidebar width */}
        <DashboardHeader />
        
        {/* Main content with proper spacing */}
        <main className="flex-1 p-4 md:p-6 mt-16"> {/* Add top margin for header */}
          {children}
        </main>
      </div>
    </div>
  );
}