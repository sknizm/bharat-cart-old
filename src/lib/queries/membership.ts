// lib/queries/membership.ts
import prisma from "@/lib/prisma";
import { addDays } from "date-fns";

type MembershipStatus = "ACTIVE" | "CANCELED" | "EXPIRED" | "PAUSED";

interface CreateMembershipParams {
  restaurantId: string;
  planId: string;
  status?: MembershipStatus;
  startDate?: Date;
  endDate?: Date;
  renewsAt?: Date;
}
export function isActiveMembership(membership: {
  id: string;
  status: MembershipStatus;
  endDate: Date;
} | null): boolean {
  if (!membership) return false;
  return membership.status === 'ACTIVE' && new Date(membership.endDate) > new Date();
}

export async function createMembership({
  restaurantId,
  planId,
  status = "ACTIVE",
  startDate = new Date(),
  endDate = addDays(startDate, 1), // Default to 1-day trial
  renewsAt = endDate, // Default to renew at end date
}: CreateMembershipParams) {
  return await prisma.membership.create({
    data: {
      restaurantId,
      planId,
      status,
      startDate,
      endDate,
      renewsAt,
    },
  });
}

// Helper function to check if membership is active
export async function isMembershipActive(restaurantId: string): Promise<boolean> {
  const membership = await prisma.membership.findUnique({
    where: { restaurantId },
  });

  if (!membership) return false;

  return membership.status === "ACTIVE" && new Date(membership.endDate) > new Date();
}

// Helper function to get restaurant's membership
export async function getRestaurantMembership(restaurantId: string) {
  return await prisma.membership.findUnique({
    where: { restaurantId },
  });
}