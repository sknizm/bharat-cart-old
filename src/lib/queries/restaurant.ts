// lib/queries/restaurant.ts
import prisma from "@/lib/prisma";

export async function checkRestaurantIfAlreadyExist(slug: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug }
  });
  return !!restaurant;
}

export async function createRestaurant(data: {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  address?: string;
  phone?: string;
  whatsapp?: string;
  instagram?: string;
  userId: string;
}) {
  return await prisma.restaurant.create({
    data
  });
}



// New function to get restaurant slug by userId
export async function getRestaurantSlugByUserId(userId: string): Promise<string | null> {
  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: {
        userId: userId
      },
      select: {
        slug: true // Only fetch the slug field
      }
    });

    return restaurant?.slug || null;
  } catch (error) {
    console.error("Error fetching restaurant slug:", error);
    return null;
  }
}

export async function getUserRestaurant(userId: string) {
  return await prisma.restaurant.findUnique({
    where: { userId },
    select: {
      id: true,
      name: true,
      slug: true
    }
  });
}