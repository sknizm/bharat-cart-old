// app/api/menu/items/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/queries/user";

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description, price, categoryId, isAvailable = true } = await req.json();
    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify category belongs to user's restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
      select: { id: true }
    });
    if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });

    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    if (!category || category.restaurantId !== restaurant.id) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        isAvailable,
        categoryId,
        restaurantId: restaurant.id
      }
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error adding menu item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}