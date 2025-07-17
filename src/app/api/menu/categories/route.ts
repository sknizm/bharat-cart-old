// app/api/menu/categories/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/queries/user";

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description } = await req.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    // Get user's restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { userId },
      select: { id: true }
    });
    if (!restaurant) return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });

    const category = await prisma.category.create({
      data: {
        name,
        description,
        restaurantId: restaurant.id
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}