import { prisma } from "@/lib/prisma";

export async function getStoreCategoriesWithProducts(storeId: string) {
  return prisma.category.findMany({
    where: { storeId },
    include: {
      products: {
        include: {
          variants: true,
        },
      },
    },
  });
}
