// app/_sites/[slug]/layout.tsx
import { prisma } from '@/lib/prisma';
import { ReactNode } from 'react';
import NotFound from './not-found';
import { StoreProvider } from './store-context';

export default async function StoreLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const store = await prisma.store.findUnique({
    where: { slug: params.slug },
  });

  if (!store) return <NotFound />;

  return (
    <main className="min-h-screen">
      <StoreProvider store={store}>
        {children}
      </StoreProvider>
    </main>
  );
}
