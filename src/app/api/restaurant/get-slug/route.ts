// app/api/restaurants/get-slug/route.ts
import { NextResponse } from "next/server";
import { getRestaurantSlugByUserId } from "@/lib/queries/restaurant";
import { getUserIdFromSession } from "@/lib/queries/user";

export async function GET(req: Request) {
  try {
    // Get userId from session (more secure than passing in request)
    const userId = await getUserIdFromSession();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const slug = await getRestaurantSlugByUserId(userId);
    
    if (!slug) {
      return NextResponse.json(
        { error: "No restaurant found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { slug },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting restaurant slug:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}