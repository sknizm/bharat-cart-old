// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        categories: { select: { id: true, name: true } },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Transform images if they exist
    const images = product.images ? JSON.parse(JSON.stringify(product.images)) : [];

    return NextResponse.json({
      ...product,
      images,
      price: Number(product.price),
      salePrice: Number(product.salePrice),
      variants: product.variants.map(v => ({
        ...v,
        price: Number(v.price),
        salePrice: Number(v.salePrice),
      })),
    });
  } catch (error) {
    if(error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}