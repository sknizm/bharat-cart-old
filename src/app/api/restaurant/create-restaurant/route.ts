import { checkRestaurantIfAlreadyExist, createRestaurant } from "@/lib/queries/restaurant";
import { NextResponse } from "next/server";
import { addDays } from "date-fns";
import { createMembership } from "@/lib/queries/membership";

export async function POST(req: Request) {
  
  try {
    const { title, slug, whatsapp, userId } = await req.json();

    // Validate required input
    if (!title || !slug || !whatsapp) {
      return NextResponse.json(
        { error: "All Fields are required" }, 
        { status: 400 }
      );
    }
    if(!userId){
      return NextResponse.json(
        { error: "Please Login or SignUp" }, 
        { status: 400 }
      );
    }
    // Check if restaurant with this slug already exists
    const restaurantExists = await checkRestaurantIfAlreadyExist(slug);
    if (restaurantExists) {
      return NextResponse.json(
        { error: "Restaurant with this url already exists, please use different URL " }, 
        { status: 400 }
      );
    }

    // Create restaurant with minimal data
    const restaurant = await createRestaurant({
      name: title,
      slug,
      whatsapp,
      // Empty fields
      description: "",
      logo: "",
      address: "",
      phone: "",
      instagram: "",
      // You'll need to get userId from session or token
      userId: userId // Replace with actual user ID from auth
    });

    // Create 1-day trial membership
    const startDate = new Date();
    const endDate = addDays(startDate, 1); // 1 day trial
    const renewsAt = endDate; // Will renew at end date if payment made
    
    await createMembership({
      restaurantId: restaurant.id,
      planId: "trial-plan", // You should have this in your database
      status: "ACTIVE",
      startDate,
      endDate,
      renewsAt
    });
    
    return NextResponse.json(
      { 
        message: "Restaurant created successfully with 1-day trial",
        restaurantId: restaurant.id 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Restaurant creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}