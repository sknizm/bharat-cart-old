import { prisma } from "@/lib/prisma";

export async function getStoreBySlug(slug: string) {
  return prisma.store.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      logo: true,
      banner: true,
    },
  });
}
