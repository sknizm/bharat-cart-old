// app/admin/layout.tsx
import React from 'react';
import { redirect } from 'next/navigation';
import AppSidebar from '@/components/admin/appsidebar';
import { getCurrentUser } from '@/lib/queries/user';

export default async function AdminBoard({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await getCurrentUser();

  // Check if the user exists and is admin
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect('/signin');
  }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-50">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}