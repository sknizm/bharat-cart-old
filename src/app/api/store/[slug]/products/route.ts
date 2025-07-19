import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromSession } from '@/lib/queries/user';
import { VariantInput } from '@/lib/types';

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const store = await prisma.store.findUnique({ where: { slug: params.slug } });
    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

    const body = await req.json();
    const {
      name,
      description,
      price,
      salePrice,
      images,
      categoryIds,
      variants,
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        salePrice,
        images,
        storeId: store.id,
        categories: {
          connect: categoryIds.map((id: string) => ({ id })),
        },
      },
    });

    if (variants?.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map((variant: VariantInput) => ({
          productId: product.id,
          type: variant.name,
          value: variant.value,
          sku: variant.sku,
          price: variant.price,
          salePrice: variant.salePrice,
          stock: variant.stock,
        })),
      });
    }

    return NextResponse.json({ id: product.id });
  } catch (error) {
    console.error('CREATE_PRODUCT_ERROR', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const store = await prisma.store.findUnique({ where: { slug: params.slug } });
    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

    const products = await prisma.product.findMany({
      where: { storeId: store.id },
      include: {
        categories: true,
        variants: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('FETCH_PRODUCTS_ERROR', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}