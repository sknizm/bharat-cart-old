
import { getCurrentUser } from '@/lib/queries/user';
import { isStoreOwner } from '@/lib/utils/user-access';
import { redirect } from 'next/navigation';

export default async function DashboardPage({ params }: { params: { slug: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/signin');

  const isOwner = await isStoreOwner(user.id, params.slug);
  if (!isOwner) redirect('/signin'); // or a 403 page

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Welcome, store owner!</h1>
      {/* owner content */}
    </div>
  );
}
