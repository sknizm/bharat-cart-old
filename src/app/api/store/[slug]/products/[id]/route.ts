import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserIdFromSession } from '@/lib/queries/user';
import { VariantInput } from '@/lib/types';

export async function GET(_req: NextRequest, { params }: { params: { slug: string; id: string } }) {
  try {
    const store = await prisma.store.findUnique({ where: { slug: params.slug } });
    if (!store) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        categories: { select: { id: true, name: true } },
        variants: true,
      },
    });

    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    console.error('GET_PRODUCT_ERROR', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string; id: string } }) {
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

    await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        salePrice,
        images,
        categories: {
          set: [],
          connect: categoryIds.map((id: string) => ({ id })),
        },
      },
    });

    // Delete old variants and insert new ones
    await prisma.productVariant.deleteMany({ where: { productId: params.id } });

    if (variants?.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map((variant: VariantInput) => ({
          productId: params.id,
          type: variant.name,
          value: variant.value,
          sku: variant.sku,
          price: variant.price,
          salePrice: variant.salePrice,
          stock: variant.stock,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('UPDATE_PRODUCT_ERROR', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function DELETE(
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
      include: { variants: true },
    });

    if (!product || product.storeId !== store.id)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    await prisma.product.delete({
      where: { id: params.productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE_PRODUCT_ERROR', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}