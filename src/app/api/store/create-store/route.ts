// File: app/api/store/create-store/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromSession } from '@/lib/queries/user';

import { addDays } from 'date-fns'; // Add this if you're not already using it

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ error: 'Store name and slug are required' }, { status: 400 });
    }

    const normalizedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

    const existing = await prisma.store.findUnique({ where: { slug: normalizedSlug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug already taken' }, { status: 409 });
    }

    const store = await prisma.store.create({
      data: {
        name,
        slug: normalizedSlug,
        ownerId: userId,
      },
    });

    // Create membership for the store with TRIALING status, ends in 3 days
    await prisma.membership.create({
      data: {
        storeId: store.id,
        userId: userId,
        status: 'TRIALING',
        planName: 'Trial', // or whatever you want to name it
        startedAt: new Date(),
        endsAt: addDays(new Date(), 3),
      },
    });

    return NextResponse.json({ store });
  } catch (error) {
    console.error('CREATE_STORE_ERROR', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
