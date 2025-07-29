"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Product } from "@/lib/types";

export function ProductCard({
  product,
  storeSlug,
}: {
  product: Product;
  storeSlug: string;
}) {
  const hasVariants = product.variants.length > 0;
  const image = product.images?.[0];

  const priceDisplay = product.salePrice > 0
    ? (
      <div className="flex items-center gap-2">
        <span className="line-through text-gray-500 text-sm">₹{product.price}</span>
        <span className="text-red-600 font-bold">₹{product.salePrice}</span>
      </div>
    )
    : <span className="text-black font-bold">₹{product.price}</span>;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <Link href={`/${storeSlug}/product/${product.id}`} className="block">
        <div className="aspect-square relative bg-gray-50">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-cover hover:opacity-90 transition-opacity"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={false}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 text-sm text-gray-500">
              No Image
            </div>
          )}
        </div>
      </Link>
      <div className="p-3 space-y-1.5">
        <Link href={`/${storeSlug}/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2 text-sm md:text-base">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1">{priceDisplay}</div>
        {hasVariants ? (
          <Link href={`/${storeSlug}/product/${product.id}`}>
            <Button variant="outline" size="sm" className="w-full mt-2 text-sm">
              View Options
            </Button>
          </Link>
        ) : (
          <Button size="sm" className="w-full mt-2 text-sm">
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
}