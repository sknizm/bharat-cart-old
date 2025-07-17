// app/api/menu/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/queries/user";

export async function GET() {
  try {
    const userId = await getUserIdFromSession();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user's restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Get categories with their menu items
    const categoriesWithItems = await prisma.category.findMany({
      where: { restaurantId: restaurant.id },
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    return NextResponse.json(categoriesWithItems);
    
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}