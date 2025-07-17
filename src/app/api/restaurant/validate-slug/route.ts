// app/api/restaurant/validate-slug/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/queries/user";

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });

    // Check if slug is already taken by another restaurant
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: {
        slug,
        userId: { not: userId } // Exclude current user's restaurant
      }
    });

    return NextResponse.json({
      available: !existingRestaurant,
      message: existingRestaurant 
        ? "This URL is already taken" 
        : "This URL is available"
    });
  } catch (error) {
    console.error("Error validating slug:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}