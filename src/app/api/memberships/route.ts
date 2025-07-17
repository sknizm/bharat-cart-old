import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const memberships = await prisma.membership.findMany({
      include: {
        restaurant: {
          select: {
            slug: true,
            name: true
          }
        }
      },
      orderBy: {
        endDate: 'asc'
      }
    });

    return NextResponse.json(memberships);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch memberships' },
      { status: 500 }
    );
  }
}