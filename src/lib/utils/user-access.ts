// lib/access.ts
import { prisma } from '@/lib/prisma';

export async function isStoreOwner(userId: string, storeSlug: string) {
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    select: { ownerId: true },
  });

  return store?.ownerId === userId;
}

export async function isStoreCustomer(userId: string, storeSlug: string) {
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    include: { customers: { select: { id: true } } },
  });

  return store?.customers.some(c => c.id === userId) || false;
}
