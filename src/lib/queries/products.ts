import { prisma } from "@/lib/prisma";

export const getProductById = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product by ID", error);
    return null;
  }
};
