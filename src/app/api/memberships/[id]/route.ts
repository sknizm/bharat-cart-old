import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { endDate } = await request.json();

    if (!endDate) {
      return NextResponse.json(
        { error: 'End date is required' },
        { status: 400 }
      );
    }

    const updatedMembership = await prisma.membership.update({
      where: { id: params.id },
      data: {
        endDate: new Date(endDate),
        // If the new end date is in the future and status was expired, make it active
        status: new Date(endDate) > new Date() ? 'ACTIVE' : undefined
      }
    });

    return NextResponse.json(updatedMembership);
  } catch (error) {
    console.error('Error updating membership:', error);
    return NextResponse.json(
      { error: 'Failed to update membership' },
      { status: 500 }
    );
  }
}