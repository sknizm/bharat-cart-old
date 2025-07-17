// app/api/menu/items/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/queries/user";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify menu item belongs to user's restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
      select: { id: true }
    });
    if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: params.id }
    });
    if (!menuItem || menuItem.restaurantId !== restaurant.id) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    await prisma.menuItem.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify menu item belongs to user's restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
      select: { id: true }
    });
    if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: params.id }
    });
    if (!menuItem || menuItem.restaurantId !== restaurant.id) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    const body = await req.json();
    const updatedItem = await prisma.menuItem.update({
      where: { id: params.id },
      data: body
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}