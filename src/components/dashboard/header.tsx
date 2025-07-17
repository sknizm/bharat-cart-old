// components/dashboard/header.tsx
'use client';
import { MobileSidebar } from './mobile-sidear';

export function DashboardHeader() {

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b  px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu button (optional) */}
      
        <MobileSidebar />
        
        {/* Logo with better spacing */}
        <div className="flex items-center gap-2 bg-white rounded-lg border-2 border-white/20">
          Dashboard
          <span className="text-lg font-semibold text-white  hidden sm:block">MenuLink</span>
        </div>
      </div>


    </header>
  );
}