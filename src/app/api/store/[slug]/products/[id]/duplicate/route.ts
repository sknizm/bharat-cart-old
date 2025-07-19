import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromSession } from '@/lib/queries/user';



export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string; productId: string } }
) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const store = await prisma.store.findUnique({ where: { slug: params.slug } });
    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

    const product = await prisma.product.findUnique({
      where: { id: params.productId },
      include: {
        categories: true,
        variants: true,
      },
    });

    if (!product || product.storeId !== store.id)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const duplicated = await prisma.product.create({
      data: {
        name: `${product.name} (Copy)`,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        images: product.images ?? undefined,
        storeId: store.id,
        categories: {
          connect: product.categories.map(c => ({ id: c.id })),
        },
      },
    });

    if (product.variants.length > 0) {
      await prisma.productVariant.createMany({
        data: product.variants.map(v => ({
          productId: duplicated.id,
          type: v.type,
          value: v.value,
          sku: null, // SKU must be unique
          price: v.price,
          salePrice: v.salePrice,
          stock: v.stock,
        })),
      });
    }

    const result = await prisma.product.findUnique({
      where: { id: duplicated.id },
      include: {
        categories: true,
        variants: true,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('DUPLICATE_PRODUCT_ERROR', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}