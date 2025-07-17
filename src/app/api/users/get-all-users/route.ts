import { prisma } from "@/lib/prisma";
import { getCurrentUserFromSession } from "@/lib/queries/user";
import { NextRequest, NextResponse } from "next/server";



export async function GET() {
  const user = await getCurrentUserFromSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const users = await prisma.user.findMany({
      include: {
        restaurant: {
          select: {
            name: true,
            whatsapp: true,
            logo: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// ✅ Update user by ID
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: body.id },
      data: {
        name: body.name,
        email: body.email,
        // Add other fields to update as needed
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}
