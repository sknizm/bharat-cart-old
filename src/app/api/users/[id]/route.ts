import prisma from "@/lib/prisma";
import { getCurrentUserFromSession } from "@/lib/queries/user";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  
  const auser = await getCurrentUserFromSession();

  if (!auser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (auser.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  try {

    // Verify if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { restaurant: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    

    // If user owns a restaurant, prevent deletion
    if (user.restaurant) {
      return NextResponse.json(
        { 
          error: 'Cannot delete user with active restaurant',
          restaurantId: user.restaurant.id
        },
        { status: 400 }
      )
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      success: true,
      message: 'User deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}