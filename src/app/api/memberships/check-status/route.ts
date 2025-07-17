import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // Get all memberships that are active or about to expire
    const memberships = await prisma.membership.findMany({
      where: {
        status: {
          in: ['ACTIVE', 'PAUSED']
        }
      }
    });

    const today = new Date();
    let updatedCount = 0;

    // Update status based on end date
    for (const membership of memberships) {
      if (new Date(membership.endDate) < today) {
        await prisma.membership.update({
          where: { id: membership.id },
          data: { status: 'EXPIRED' }
        });
        updatedCount++;
      } else if (membership.status === 'EXPIRED' && new Date(membership.endDate) >= today) {
        await prisma.membership.update({
          where: { id: membership.id },
          data: { status: 'ACTIVE' }
        });
        updatedCount++;
      }
    }

    return NextResponse.json({
      message: `Updated ${updatedCount} membership(s)`,
      count: updatedCount
    });
  } catch (error) {
    console.error('Error checking membership status:', error);
    return NextResponse.json(
      { error: 'Failed to check membership status' },
      { status: 500 }
    );
  }
}