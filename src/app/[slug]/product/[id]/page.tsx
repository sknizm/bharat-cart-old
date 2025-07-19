// app/[slug]/product/[id]/page.tsx

import { getProductById } from "@/lib/queries/products";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string; id: string };
}) {
  const product = await getProductById(params.id);

  if (!product) return notFound();

  const images = product.images as string[]; // safely cast to string[]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Product Images */}
      <div className="flex flex-col gap-4">
        {images?.length ? (
          images.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`Product Image ${i}`}
              width={600}
              height={600}
              className="rounded-lg object-cover w-full max-h-[500px]"
            />
          ))
        ) : (
          <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
            No Images
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-muted-foreground">{product.description}</p>

        <div className="text-xl font-semibold text-primary">
          ₹{product.salePrice.toFixed(2)}{" "}
          {product.salePrice.toFixed(2) !== product.price.toFixed(2) && (
            <span className="line-through text-muted-foreground ml-2">
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Product Variants */}
        <div className="space-y-4 mt-4">
          {["Type", "Color", "Size"].map((variantType) => {
            const variants = product.variants.filter(
              (v) => v.type?.toLowerCase() === variantType.toLowerCase()
            );
            if (!variants.length) return null;

            return (
              <div key={variantType}>
                <h4 className="font-medium mb-1">{variantType}</h4>
                <div className="flex gap-2 flex-wrap">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      className="border rounded px-3 py-1 text-sm hover:bg-accent"
                    >
                      {v.value}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
